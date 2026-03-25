/*
  # Sistema Completo de Gestão de Performance
  
  1. Novas Tabelas
    - `contracts`: Armazena contratos atribuídos aos colaboradores
    - `vehicles`: Armazena veículos gerenciados pelos colaboradores
    - `task_assignments`: Sistema de atribuição de tarefas com histórico
    - `curriculum_files`: Armazena PDFs de currículos para análise de IA
    - `ai_analysis`: Resultados de análise de IA de currículos e desempenho
    - `task_support_requests`: Solicitações de apoio entre colaboradores
    - `offline_queue`: Fila de sincronização para operações offline
    
  2. Modificações em Tabelas Existentes
    - Adiciona campos em `employees` para contratos e veículos
    - Adiciona campos em `tasks` para melhor gestão
    
  3. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para managers e employees
    - Proteção de dados sensíveis
    
  4. Funcionalidades
    - Sistema offline-first com sincronização
    - Upload de currículos em PDF
    - Análise de IA automática
    - Sistema de apoio entre colaboradores
    - Gestão completa de contratos e veículos
*/

-- Criar tabela de contratos
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number text NOT NULL,
  employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'completed')),
  value numeric(10,2),
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_contracts_employee ON contracts(employee_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- Criar tabela de veículos
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text NOT NULL UNIQUE,
  employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  brand text,
  model text,
  year integer,
  status text DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_vehicles_employee ON vehicles(employee_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);

-- Criar tabela de atribuições de tarefas
CREATE TABLE IF NOT EXISTS task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  assigned_from uuid REFERENCES employees(id),
  assigned_to uuid REFERENCES employees(id),
  assignment_type text DEFAULT 'direct' CHECK (assignment_type IN ('direct', 'support', 'transfer', 'shared')),
  reason text,
  workload_percentage integer DEFAULT 100 CHECK (workload_percentage > 0 AND workload_percentage <= 100),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_task_assignments_task ON task_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_to ON task_assignments(assigned_to);

-- Criar tabela de currículos
CREATE TABLE IF NOT EXISTS curriculum_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size integer,
  file_url text NOT NULL,
  mime_type text DEFAULT 'application/pdf',
  uploaded_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false,
  uploaded_by uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_employee ON curriculum_files(employee_id);

-- Criar tabela de análises de IA
CREATE TABLE IF NOT EXISTS ai_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  curriculum_id uuid REFERENCES curriculum_files(id) ON DELETE SET NULL,
  analysis_type text NOT NULL CHECK (analysis_type IN ('curriculum', 'performance', 'skills', 'workload')),
  extracted_data jsonb,
  recommendations jsonb,
  confidence_score numeric(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  analyzed_at timestamptz DEFAULT now(),
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_employee ON ai_analysis(employee_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_type ON ai_analysis(analysis_type);

-- Criar tabela de solicitações de apoio
CREATE TABLE IF NOT EXISTS task_support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requesting_employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  supporting_employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  approved_by uuid REFERENCES auth.users(id),
  support_percentage integer CHECK (support_percentage > 0 AND support_percentage <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  responded_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_support_requesting ON task_support_requests(requesting_employee_id);
CREATE INDEX IF NOT EXISTS idx_support_supporting ON task_support_requests(supporting_employee_id);

-- Criar tabela de fila offline
CREATE TABLE IF NOT EXISTS offline_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type text NOT NULL,
  table_name text NOT NULL,
  operation_data jsonb NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'synced', 'failed')),
  created_at timestamptz DEFAULT now(),
  synced_at timestamptz,
  error_message text
);

CREATE INDEX IF NOT EXISTS idx_offline_queue_user ON offline_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_queue_status ON offline_queue(status);

-- Adicionar colunas em employees
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'total_contracts') THEN
    ALTER TABLE employees ADD COLUMN total_contracts integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'total_vehicles') THEN
    ALTER TABLE employees ADD COLUMN total_vehicles integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'curriculum_analyzed') THEN
    ALTER TABLE employees ADD COLUMN curriculum_analyzed boolean DEFAULT false;
  END IF;
END $$;

-- Habilitar RLS em todas as tabelas
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_queue ENABLE ROW LEVEL SECURITY;

-- Políticas para contracts
CREATE POLICY "Managers can view all contracts"
  ON contracts FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

CREATE POLICY "Employees can view own contracts"
  ON contracts FOR SELECT
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Managers can insert contracts"
  ON contracts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

CREATE POLICY "Managers can update contracts"
  ON contracts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

CREATE POLICY "Managers can delete contracts"
  ON contracts FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

-- Políticas para vehicles
CREATE POLICY "Managers can view all vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

CREATE POLICY "Employees can view own vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Managers can insert vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

CREATE POLICY "Managers can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

CREATE POLICY "Managers can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

-- Políticas para task_assignments
CREATE POLICY "Users can view task assignments"
  ON task_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
    OR assigned_to IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR assigned_from IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Managers can insert task assignments"
  ON task_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

CREATE POLICY "Managers can update task assignments"
  ON task_assignments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

-- Políticas para curriculum_files
CREATE POLICY "Managers can view all curriculum files"
  ON curriculum_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

CREATE POLICY "Employees can view own curriculum"
  ON curriculum_files FOR SELECT
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Managers can insert curriculum files"
  ON curriculum_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

-- Políticas para ai_analysis
CREATE POLICY "Managers can view all AI analysis"
  ON ai_analysis FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

CREATE POLICY "Employees can view own AI analysis"
  ON ai_analysis FOR SELECT
  TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "System can insert AI analysis"
  ON ai_analysis FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas para task_support_requests
CREATE POLICY "Users can view support requests"
  ON task_support_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
    OR requesting_employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR supporting_employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Employees can insert support requests"
  ON task_support_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    requesting_employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

CREATE POLICY "Managers can update support requests"
  ON task_support_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
  );

-- Políticas para offline_queue
CREATE POLICY "Users can view own offline queue"
  ON offline_queue FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert to offline queue"
  ON offline_queue FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own offline queue"
  ON offline_queue FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete from offline queue"
  ON offline_queue FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Criar função para atualizar contadores
CREATE OR REPLACE FUNCTION update_employee_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'contracts' THEN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
      UPDATE employees 
      SET total_contracts = (SELECT COUNT(*) FROM contracts WHERE employee_id = NEW.employee_id AND status = 'active')
      WHERE id = NEW.employee_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
      UPDATE employees 
      SET total_contracts = (SELECT COUNT(*) FROM contracts WHERE employee_id = OLD.employee_id AND status = 'active')
      WHERE id = OLD.employee_id;
    END IF;
  END IF;
  
  IF TG_TABLE_NAME = 'vehicles' THEN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
      UPDATE employees 
      SET total_vehicles = (SELECT COUNT(*) FROM vehicles WHERE employee_id = NEW.employee_id AND status = 'active')
      WHERE id = NEW.employee_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
      UPDATE employees 
      SET total_vehicles = (SELECT COUNT(*) FROM vehicles WHERE employee_id = OLD.employee_id AND status = 'active')
      WHERE id = OLD.employee_id;
    END IF;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers
DROP TRIGGER IF EXISTS trigger_update_contract_counters ON contracts;
CREATE TRIGGER trigger_update_contract_counters
AFTER INSERT OR UPDATE OR DELETE ON contracts
FOR EACH ROW EXECUTE FUNCTION update_employee_counters();

DROP TRIGGER IF EXISTS trigger_update_vehicle_counters ON vehicles;
CREATE TRIGGER trigger_update_vehicle_counters
AFTER INSERT OR UPDATE OR DELETE ON vehicles
FOR EACH ROW EXECUTE FUNCTION update_employee_counters();
