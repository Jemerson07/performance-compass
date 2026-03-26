import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Mail, User, Briefcase, Upload, FileText, Trash2, Save, X, AlertCircle } from 'lucide-react';
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
  profile: EmployeeProfile;
  curriculum_analyzed: boolean | null;
  total_contracts: number | null;
  total_vehicles: number | null;
}

export default function EmployeeManagementPage() {
  const { role } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [curriculumFile, setCurriculumFile] = useState<File | null>(null);

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
      const { data, error } = await supabase
        .from('employees')
        .select('id, user_id, curriculum_analyzed, total_contracts, total_vehicles, profiles!inner(name, job_title, avatar)');

      if (error) throw error;

      setEmployees((data ?? []).map((emp: any) => ({
        id: emp.id,
        user_id: emp.user_id,
        curriculum_analyzed: emp.curriculum_analyzed,
        total_contracts: emp.total_contracts,
        total_vehicles: emp.total_vehicles,
        profile: {
          name: emp.profiles?.name ?? 'Sem nome',
          job_title: emp.profiles?.job_title ?? null,
          avatar: emp.profiles?.avatar ?? '👤',
        },
      })));
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
      // A trigger `handle_new_user` no banco de dados cria automaticamente os registros
      // em `profiles`, `employees` e `user_roles` usando os metadados fornecidos.
      // NÃO é necessário fazer inserts manuais nessas tabelas.
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

      // Aguarda um momento para a trigger do banco executar
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Atualiza o perfil com avatar e cargo se necessário
      // (a trigger já deve ter criado, mas garantimos os dados extras)
      if (newEmployee.job_title || newEmployee.avatar !== '👤') {
        await supabase
          .from('profiles')
          .update({
            job_title: newEmployee.job_title.trim() || null,
            avatar: newEmployee.avatar,
          })
          .eq('user_id', signUpData.user.id);
      }

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

  const handleUploadCurriculum = async () => {
    if (!selectedEmployee || !curriculumFile) {
      toast({ title: 'Selecione um colaborador e um arquivo PDF', variant: 'destructive' });
      return;
    }

    if (curriculumFile.type !== 'application/pdf') {
      toast({ title: 'Apenas arquivos PDF são aceitos', variant: 'destructive' });
      return;
    }

    if (curriculumFile.size > 10 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande', description: 'O arquivo deve ter no máximo 10 MB.', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const fileName = `curriculum_${selectedEmployee}_${Date.now()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('curriculums')
        .upload(fileName, curriculumFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('curriculums')
        .getPublicUrl(fileName);

      const currentUser = (await supabase.auth.getUser()).data.user;

      const { error: dbError } = await supabase.from('curriculum_files').insert({
        employee_id: selectedEmployee,
        file_name: curriculumFile.name,
        file_size: curriculumFile.size,
        file_url: urlData.publicUrl,
        uploaded_by: currentUser?.id,
      });

      if (dbError) throw dbError;

      // Análise simulada de currículo (em produção, seria uma chamada a uma IA real)
      const analysisData = {
        skills: ['Comunicação', 'Liderança', 'Análise de Dados'],
        experience_years: 5,
        education: 'Superior Completo',
        certifications: [],
      };

      const { error: analysisError } = await supabase.from('ai_analysis').insert({
        employee_id: selectedEmployee,
        analysis_type: 'curriculum',
        extracted_data: analysisData,
        recommendations: {
          suggested_role: 'Analista Sênior',
          skills_to_develop: ['Técnico', 'Execução', 'Gestão de Projetos'],
        },
        confidence_score: 0.85,
        status: 'completed',
      });

      if (analysisError) throw analysisError;

      await supabase
        .from('employees')
        .update({ curriculum_analyzed: true })
        .eq('id', selectedEmployee);

      toast({ title: 'Currículo enviado e analisado com sucesso!' });
      setCurriculumFile(null);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (error: any) {
      toast({ title: 'Erro ao enviar currículo', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string, employeeName: string) => {
    if (!confirm(`Deseja realmente excluir o colaborador "${employeeName}"? Esta ação não pode ser desfeita.`)) return;

    try {
      // Remove apenas o registro de employee — profiles e auth.users são mantidos
      // Para exclusão completa, seria necessário acesso admin ao Supabase
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
          <p className="text-sm text-muted-foreground">Crie, edite e gerencie colaboradores da equipe</p>
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

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 rounded bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">Contratos</p>
                  <p className="text-sm font-bold text-foreground">{emp.total_contracts ?? 0}</p>
                </div>
                <div className="p-2 rounded bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">Veículos</p>
                  <p className="text-sm font-bold text-foreground">{emp.total_vehicles ?? 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor={`curriculum-${emp.id}`}
                  className="flex-1 py-2 rounded bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  {emp.curriculum_analyzed ? 'Atualizar CV' : 'Enviar CV'}
                </label>
                <input
                  id={`curriculum-${emp.id}`}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setSelectedEmployee(emp.id);
                      setCurriculumFile(e.target.files[0]);
                    }
                  }}
                />
                {emp.curriculum_analyzed && (
                  <div className="px-2 py-1.5 rounded bg-primary/10 text-primary" title="Currículo analisado">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {curriculumFile && selectedEmployee && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Arquivo Selecionado</h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-foreground">{curriculumFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(curriculumFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurriculumFile(null);
                setSelectedEmployee(null);
              }}
              className="p-1 rounded hover:bg-destructive/10 text-destructive"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleUploadCurriculum}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando e Analisando...' : 'Enviar e Analisar com IA'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
