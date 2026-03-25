/*
  # Criar Bucket de Storage para Currículos
  
  1. Bucket
    - Nome: curriculums
    - Público: false (acesso controlado)
    - Tipos permitidos: application/pdf
    
  2. Políticas de Storage
    - Gestores podem upload
    - Gestores podem visualizar todos
    - Colaboradores podem visualizar próprios
    
  3. Segurança
    - Validação de tipo de arquivo
    - Limite de tamanho
*/

-- Inserir bucket se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'curriculums',
  'curriculums',
  false,
  10485760,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para upload (apenas gestores)
CREATE POLICY "Managers can upload curriculum files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'curriculums' AND
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

-- Políticas de storage para visualização (gestores veem tudo)
CREATE POLICY "Managers can view all curriculum files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'curriculums' AND
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

-- Políticas de storage para deleção (apenas gestores)
CREATE POLICY "Managers can delete curriculum files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'curriculums' AND
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'manager')
);

-- Política para colaboradores verem próprios currículos
CREATE POLICY "Employees can view own curriculum files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'curriculums' AND
  name LIKE 'curriculum_' || (SELECT id FROM employees WHERE user_id = auth.uid())::text || '%'
);
