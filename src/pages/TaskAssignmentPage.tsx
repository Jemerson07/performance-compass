import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Users, FileText, Car, TriangleAlert as AlertTriangle, Save, X, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  user_id: string;
  total_contracts: number;
  total_vehicles: number;
  current_load: number;
  tasks_completed: number;
}

interface Profile {
  id: string;
  name: string;
  job_title: string;
  avatar: string;
}

interface Contract {
  id: string;
  contract_number: string;
  employee_id: string;
  client_name: string;
  status: string;
  value: number;
}

interface Vehicle {
  id: string;
  plate: string;
  employee_id: string;
  brand: string;
  model: string;
  status: string;
}

export default function TaskAssignmentPage() {
  const { role } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<(Employee & { profile: Profile })[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddContract, setShowAddContract] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newContract, setNewContract] = useState({
    contract_number: '',
    client_name: '',
    value: '',
    start_date: '',
    end_date: '',
  });

  const [newVehicle, setNewVehicle] = useState({
    plate: '',
    brand: '',
    model: '',
    year: '',
  });

  useEffect(() => {
    if (role === 'manager') {
      loadEmployees();
    }
  }, [role]);

  useEffect(() => {
    if (selectedEmployee) {
      loadEmployeeData(selectedEmployee);
    }
  }, [selectedEmployee]);

  const loadEmployees = async () => {
    try {
      const { data: employeesData, error: empError } = await supabase
        .from('employees')
        .select('*, profiles!inner(id, name, job_title, avatar)');

      if (empError) throw empError;

      setEmployees((employeesData ?? []).map((emp: any) => ({
        ...emp,
        profile: emp.profiles
      })));
    } catch (error: any) {
      toast({ title: 'Erro ao carregar colaboradores', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeData = async (employeeId: string) => {
    try {
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('status', 'active');

      if (contractsError) throw contractsError;
      setContracts(contractsData || []);

      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('status', 'active');

      if (vehiclesError) throw vehiclesError;
      setVehicles(vehiclesData || []);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar dados', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddContract = async () => {
    if (!selectedEmployee || !newContract.contract_number || !newContract.client_name) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('contracts').insert({
        employee_id: selectedEmployee,
        contract_number: newContract.contract_number,
        client_name: newContract.client_name,
        value: newContract.value ? parseFloat(newContract.value) : null,
        start_date: newContract.start_date || null,
        end_date: newContract.end_date || null,
        status: 'active',
      });

      if (error) throw error;

      toast({ title: 'Contrato adicionado com sucesso!' });
      setShowAddContract(false);
      setNewContract({ contract_number: '', client_name: '', value: '', start_date: '', end_date: '' });
      loadEmployeeData(selectedEmployee);
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Erro ao adicionar contrato', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddVehicle = async () => {
    if (!selectedEmployee || !newVehicle.plate) {
      toast({ title: 'Preencha a placa do veículo', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('vehicles').insert({
        employee_id: selectedEmployee,
        plate: newVehicle.plate.toUpperCase(),
        brand: newVehicle.brand || null,
        model: newVehicle.model || null,
        year: newVehicle.year ? parseInt(newVehicle.year) : null,
        status: 'active',
      });

      if (error) throw error;

      toast({ title: 'Veículo adicionado com sucesso!' });
      setShowAddVehicle(false);
      setNewVehicle({ plate: '', brand: '', model: '', year: '' });
      loadEmployeeData(selectedEmployee);
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Erro ao adicionar veículo', description: error.message, variant: 'destructive' });
    }
  };

  const handleRemoveContract = async (contractId: string) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ status: 'inactive' })
        .eq('id', contractId);

      if (error) throw error;

      toast({ title: 'Contrato removido' });
      loadEmployeeData(selectedEmployee!);
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Erro ao remover contrato', description: error.message, variant: 'destructive' });
    }
  };

  const handleRemoveVehicle = async (vehicleId: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status: 'inactive' })
        .eq('id', vehicleId);

      if (error) throw error;

      toast({ title: 'Veículo removido' });
      loadEmployeeData(selectedEmployee!);
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Erro ao remover veículo', description: error.message, variant: 'destructive' });
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.profile.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEmpData = employees.find(e => e.id === selectedEmployee);

  if (role !== 'manager') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Acesso Restrito</h2>
          <p className="text-sm text-muted-foreground">Esta página é exclusiva para gestores.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Atribuição de Tarefas e Cargas</h2>
        <p className="text-sm text-muted-foreground">Gerencie contratos, veículos e atribuições dos colaboradores</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Colaboradores</h3>
            <Users className="w-4 h-4 text-primary" />
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredEmployees.map((emp) => (
              <motion.button
                key={emp.id}
                onClick={() => setSelectedEmployee(emp.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg border transition-all',
                  selectedEmployee === emp.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{emp.profile.avatar || '👤'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{emp.profile.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{emp.profile.job_title}</p>
                  </div>
                  {emp.current_load > 100 && (
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                  )}
                </div>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {emp.total_contracts || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    {emp.total_vehicles || 0}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {selectedEmployee ? (
          <>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Contratos ({contracts.length})
                </h3>
                <button
                  onClick={() => setShowAddContract(true)}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showAddContract && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-muted/50 border border-border space-y-2"
                >
                  <input
                    placeholder="Número do Contrato"
                    value={newContract.contract_number}
                    onChange={(e) => setNewContract({ ...newContract, contract_number: e.target.value })}
                    className="w-full bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    placeholder="Nome do Cliente"
                    value={newContract.client_name}
                    onChange={(e) => setNewContract({ ...newContract, client_name: e.target.value })}
                    className="w-full bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Valor"
                    value={newContract.value}
                    onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
                    className="w-full bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddContract}
                      className="flex-1 py-2 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 flex items-center justify-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Adicionar
                    </button>
                    <button
                      onClick={() => setShowAddContract(false)}
                      className="flex-1 py-2 rounded bg-muted text-foreground text-xs font-medium hover:bg-muted/80 flex items-center justify-center gap-1"
                    >
                      <X className="w-3 h-3" /> Cancelar
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {contracts.map((contract) => (
                  <div key={contract.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{contract.contract_number}</p>
                        <p className="text-xs text-muted-foreground">{contract.client_name}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveContract(contract.id)}
                        className="p-1 rounded hover:bg-destructive/10 text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    {contract.value && (
                      <p className="text-xs text-foreground">
                        R$ {contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Veículos ({vehicles.length})
                </h3>
                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showAddVehicle && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-muted/50 border border-border space-y-2"
                >
                  <input
                    placeholder="Placa (ABC-1234)"
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                    className="w-full bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    placeholder="Marca"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="w-full bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    placeholder="Modelo"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Ano"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    className="w-full bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddVehicle}
                      className="flex-1 py-2 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 flex items-center justify-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Adicionar
                    </button>
                    <button
                      onClick={() => setShowAddVehicle(false)}
                      className="flex-1 py-2 rounded bg-muted text-foreground text-xs font-medium hover:bg-muted/80 flex items-center justify-center gap-1"
                    >
                      <X className="w-3 h-3" /> Cancelar
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground font-mono">{vehicle.plate}</p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.brand} {vehicle.model}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveVehicle(vehicle.id)}
                        className="p-1 rounded hover:bg-destructive/10 text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-2 glass-card p-8 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Selecione um colaborador para gerenciar suas atribuições
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedEmpData && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Resumo de Carga</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Total de Contratos</p>
              <p className="text-2xl font-bold text-foreground">{selectedEmpData.total_contracts || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Total de Veículos</p>
              <p className="text-2xl font-bold text-foreground">{selectedEmpData.total_vehicles || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Carga Atual</p>
              <p className={cn(
                'text-2xl font-bold',
                selectedEmpData.current_load > 100 ? 'text-destructive' : 'text-foreground'
              )}>
                {selectedEmpData.current_load}%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Tarefas Concluídas</p>
              <p className="text-2xl font-bold text-foreground">{selectedEmpData.tasks_completed || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
