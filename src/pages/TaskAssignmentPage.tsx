import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users, TriangleAlert as AlertTriangle, Save, X, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EmployeeWithProfile {
  id: string;
  user_id: string;
  current_load: number | null;
  tasks_completed: number | null;
  tasks_pending: number | null;
  profile: {
    name: string;
    job_title: string | null;
    avatar: string | null;
  };
}

interface TaskRow {
  id: string;
  title: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  due_date: string | null;
  origin: string | null;
  estimated_time: number | null;
}

export default function TaskAssignmentPage() {
  const { role } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<EmployeeWithProfile[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    due_date: '',
    origin: 'manual',
    estimated_time: '60',
  });

  useEffect(() => {
    if (role === 'manager') {
      loadEmployees();
    }
  }, [role]);

  useEffect(() => {
    if (selectedEmployee) {
      loadEmployeeTasks(selectedEmployee);
    }
  }, [selectedEmployee]);

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, user_id, current_load, tasks_completed, tasks_pending');

      if (error) throw error;

      const { data: profiles, error: profError } = await supabase.from('profiles').select('user_id, name, job_title, avatar');
      if (profError) throw profError;

      const profileMap = new Map((profiles ?? []).map(p => [p.user_id, p]));

      setEmployees((data ?? []).map((emp) => {
        const prof = profileMap.get(emp.user_id);
        return {
          ...emp,
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
      setLoading(false);
    }
  };

  const loadEmployeeTasks = async (employeeId: string) => {
    try {
      const emp = employees.find(e => e.id === employeeId);
      if (!emp) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, status, priority, assigned_to, due_date, origin, estimated_time')
        .eq('assigned_to', emp.user_id);

      if (error) throw error;
      setTasks(data ?? []);
    } catch (error: any) {
      toast({ title: 'Erro ao carregar tarefas', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddTask = async () => {
    if (!selectedEmployee || !newTask.title) {
      toast({ title: 'Preencha o título da tarefa', variant: 'destructive' });
      return;
    }

    const emp = employees.find(e => e.id === selectedEmployee);
    if (!emp) return;

    const currentUser = (await supabase.auth.getUser()).data.user;

    try {
      const { error } = await supabase.from('tasks').insert({
        title: newTask.title,
        priority: newTask.priority,
        due_date: newTask.due_date || null,
        origin: newTask.origin,
        estimated_time: parseInt(newTask.estimated_time) || 60,
        assigned_to: emp.user_id,
        created_by: currentUser?.id,
        status: 'pending',
      });

      if (error) throw error;

      toast({ title: 'Tarefa atribuída com sucesso!' });
      setShowAddTask(false);
      setNewTask({ title: '', priority: 'medium', due_date: '', origin: 'manual', estimated_time: '60' });
      loadEmployeeTasks(selectedEmployee);
    } catch (error: any) {
      toast({ title: 'Erro ao atribuir tarefa', description: error.message, variant: 'destructive' });
    }
  };

  const handleReassignTask = async (taskId: string, newEmployeeId: string) => {
    const newEmp = employees.find(e => e.id === newEmployeeId);
    if (!newEmp) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ assigned_to: newEmp.user_id })
        .eq('id', taskId);

      if (error) throw error;

      toast({ title: 'Tarefa reatribuída!' });
      if (selectedEmployee) loadEmployeeTasks(selectedEmployee);
    } catch (error: any) {
      toast({ title: 'Erro ao reatribuir', description: error.message, variant: 'destructive' });
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.profile.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const priorityColors: Record<string, string> = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-accent/20 text-accent-foreground',
    high: 'bg-warning/20 text-warning',
    critical: 'bg-destructive/20 text-destructive',
  };

  if (role !== 'manager') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Acesso Restrito</h2>
          <p className="text-sm text-muted-foreground">Esta página é exclusiva para gestores.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Atribuição de Tarefas</h2>
        <p className="text-sm text-muted-foreground">Atribua e reatribua tarefas entre colaboradores</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee list */}
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
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 animate-pulse h-16" />
              ))
            ) : filteredEmployees.map((emp) => (
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
                    <p className="text-xs text-muted-foreground truncate">{emp.profile.job_title || 'Sem cargo'}</p>
                  </div>
                  {(emp.current_load ?? 0) > 100 && (
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                  )}
                </div>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span>Carga: {emp.current_load ?? 0}%</span>
                  <span>Concl: {emp.tasks_completed ?? 0}</span>
                  <span>Pend: {emp.tasks_pending ?? 0}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tasks for selected employee */}
        {selectedEmployee ? (
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Tarefas ({tasks.length})
              </h3>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
              >
                <Plus className="w-3 h-3" /> Nova Tarefa
              </button>
            </div>

            {showAddTask && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-lg bg-muted/50 border border-border space-y-3"
              >
                <input
                  placeholder="Título da tarefa"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                  <select
                    value={newTask.origin}
                    onChange={(e) => setNewTask({ ...newTask, origin: e.target.value })}
                    className="bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="manual">Manual</option>
                    <option value="excel">Excel</option>
                    <option value="bi">BI</option>
                    <option value="email">E-mail</option>
                  </select>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Tempo estimado (min)"
                    value={newTask.estimated_time}
                    onChange={(e) => setNewTask({ ...newTask, estimated_time: e.target.value })}
                    className="bg-background rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddTask} className="flex-1 py-2 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" /> Atribuir
                  </button>
                  <button onClick={() => setShowAddTask(false)} className="flex-1 py-2 rounded bg-muted text-foreground text-xs font-medium hover:bg-muted/80 flex items-center justify-center gap-1">
                    <X className="w-3 h-3" /> Cancelar
                  </button>
                </div>
              </motion.div>
            )}

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma tarefa atribuída.</p>
              ) : tasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full', priorityColors[task.priority] || 'bg-muted')}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {task.status}
                        </span>
                        {task.origin && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {task.origin}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Reassign dropdown */}
                    <select
                      className="text-xs bg-background border border-border rounded px-2 py-1 text-foreground"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) handleReassignTask(task.id, e.target.value);
                        e.target.value = '';
                      }}
                    >
                      <option value="" disabled>Reatribuir →</option>
                      {employees.filter(e => e.id !== selectedEmployee).map(e => (
                        <option key={e.id} value={e.id}>{e.profile.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    {task.due_date && <span>Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>}
                    {task.estimated_time && <span>~{task.estimated_time}min</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 glass-card p-12 flex items-center justify-center">
            <div className="text-center">
              <ArrowRight className="w-8 h-8 text-muted-foreground mx-auto mb-2 rotate-180 lg:rotate-0" />
              <p className="text-sm text-muted-foreground">Selecione um colaborador para ver e gerenciar suas tarefas</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
