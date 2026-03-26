import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Mail, User, Briefcase, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmployeeProfile {
  name: string;
  job_title: string | null;
  avatar: string | null;
}

interface Employee {
  id: string;
  user_id: string;
  current_load: number | null;
  tasks_completed: number | null;
  tasks_pending: number | null;
  profile: EmployeeProfile;
}

export default function EmployeeManagementPage() {
  const { role } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const [newEmployee, setNewEmployee] = useState({
    email: '',
    password: '',
    name: '',
    job_title: '',
    avatar: '👤',
  });

  const avatarOptions = ['👤', '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧', '👨‍🏫', '👩‍🏫', '🧑‍💼', '🧑‍🔧'];

  useEffect(() => {
    if (role === 'manager') {
      loadEmployees();
    }
  }, [role]);

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const { data: empData, error: empError } = await supabase
        .from('employees')
        .select('id, user_id, current_load, tasks_completed, tasks_pending');

      if (empError) throw empError;

      const { data: profiles, error: profError } = await supabase.from('profiles').select('user_id, name, job_title, avatar');
      if (profError) throw profError;

      const profileMap = new Map((profiles ?? []).map(p => [p.user_id, p]));

      setEmployees((empData ?? []).map((emp) => {
        const prof = profileMap.get(emp.user_id);
        return {
          id: emp.id,
          user_id: emp.user_id,
          current_load: emp.current_load,
          tasks_completed: emp.tasks_completed,
          tasks_pending: emp.tasks_pending,
          profile: {
            name: prof?.name ?? 'Sem nome',
            job_title: prof?.job_title ?? null,
            avatar: prof?.avatar ?? '👤',
          },
        };
      }));
    } catch (error: any) {
      toast({ title: 'Erro ao carregar colaboradores', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleCreateEmployee = async () => {
    if (!newEmployee.email || !newEmployee.password || !newEmployee.name) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }

    if (newEmployee.password.length < 6) {
      toast({ title: 'Senha muito curta', description: 'A senha deve ter pelo menos 6 caracteres.', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      // Save current manager session before creating new user
      const { data: { session: managerSession } } = await supabase.auth.getSession();

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newEmployee.email.trim().toLowerCase(),
        password: newEmployee.password,
        options: {
          data: {
            name: newEmployee.name.trim(),
            role: 'employee',
            job_title: newEmployee.job_title.trim() || null,
            avatar: newEmployee.avatar,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!signUpData.user) {
        throw new Error('Usuário não foi criado. Verifique se o e-mail já está em uso.');
      }

      // Restore manager session immediately to prevent auto-login as new user
      if (managerSession) {
        await supabase.auth.setSession({
          access_token: managerSession.access_token,
          refresh_token: managerSession.refresh_token,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Colaborador criado com sucesso!',
        description: `${newEmployee.name} receberá um e-mail de confirmação.`,
      });

      setShowCreateForm(false);
      setNewEmployee({ email: '', password: '', name: '', job_title: '', avatar: '👤' });
      loadEmployees();
    } catch (error: any) {
      let errorMessage = error.message;
      if (errorMessage.includes('already registered') || errorMessage.includes('already been registered')) {
        errorMessage = 'Este e-mail já está cadastrado no sistema.';
      }
      toast({ title: 'Erro ao criar colaborador', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string, employeeName: string) => {
    if (!confirm(`Deseja realmente excluir o colaborador "${employeeName}"? Esta ação não pode ser desfeita.`)) return;

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;

      toast({ title: 'Colaborador removido da equipe' });
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Erro ao excluir colaborador', description: error.message, variant: 'destructive' });
    }
  };

  if (role !== 'manager') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Acesso restrito a gestores.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestão de Colaboradores</h2>
          <p className="text-sm text-muted-foreground">Crie e gerencie colaboradores da equipe</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Colaborador
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Criar Novo Colaborador</h3>
            <button onClick={() => setShowCreateForm(false)} className="p-1 rounded hover:bg-muted">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                <Mail className="w-3 h-3" /> E-mail *
              </label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="colaborador@empresa.com"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Senha Inicial *</label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                <User className="w-3 h-3" /> Nome Completo *
              </label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="João da Silva"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Cargo
              </label>
              <input
                type="text"
                value={newEmployee.job_title}
                onChange={(e) => setNewEmployee({ ...newEmployee, job_title: e.target.value })}
                className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Analista, Desenvolvedor, etc."
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1.5 block">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setNewEmployee({ ...newEmployee, avatar })}
                    className={`text-2xl p-2 rounded-lg border transition-all ${
                      newEmployee.avatar === avatar
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreateEmployee}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Criando...' : 'Criar Colaborador'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      )}

      {loadingEmployees ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-2 w-16 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum colaborador cadastrado ainda.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
          >
            Criar primeiro colaborador
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10">
                    {emp.profile.avatar ?? '👤'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{emp.profile.name}</h4>
                    <p className="text-xs text-muted-foreground">{emp.profile.job_title || 'Sem cargo'}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEmployee(emp.id, emp.profile.name)}
                  className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Remover colaborador"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">Carga</p>
                  <p className="text-sm font-bold text-foreground">{emp.current_load ?? 0}%</p>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">Concluídas</p>
                  <p className="text-sm font-bold text-foreground">{emp.tasks_completed ?? 0}</p>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">Pendentes</p>
                  <p className="text-sm font-bold text-foreground">{emp.tasks_pending ?? 0}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
