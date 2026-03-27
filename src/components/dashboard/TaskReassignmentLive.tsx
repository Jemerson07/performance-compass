import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EmployeeInfo {
  id: string;
  user_id: string;
  current_load: number;
  name: string;
  avatar: string;
}

interface TaskInfo {
  id: string;
  title: string;
  priority: string;
  status: string;
}

interface ReassignmentLog {
  taskTitle: string;
  fromName: string;
  toName: string;
}

export default function TaskReassignmentLive() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<EmployeeInfo[]>([]);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [log, setLog] = useState<ReassignmentLog[]>([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedFrom) {
      const emp = employees.find(e => e.id === selectedFrom);
      if (emp) loadTasks(emp.user_id);
    }
  }, [selectedFrom]);

  const loadEmployees = async () => {
    try {
      const { data: empData } = await supabase.from('employees').select('id, user_id, current_load');
      const { data: profiles } = await supabase.from('profiles').select('user_id, name, avatar');
      const profileMap = new Map((profiles ?? []).map(p => [p.user_id, p]));
      setEmployees((empData ?? []).map(e => ({
        id: e.id,
        user_id: e.user_id,
        current_load: e.current_load ?? 0,
        name: profileMap.get(e.user_id)?.name ?? 'Sem nome',
        avatar: profileMap.get(e.user_id)?.avatar ?? '👤',
      })));
    } catch { /* silent */ }
  };

  const loadTasks = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('tasks')
        .select('id, title, priority, status')
        .eq('assigned_to', userId)
        .neq('status', 'completed');
      setTasks(data ?? []);
    } catch { /* silent */ }
  };

  const overloaded = employees.filter(e => e.current_load > 80);
  const available = employees.filter(e => e.current_load < 70);

  const handleReassign = async () => {
    if (!selectedTask || !selectedTo || !selectedFrom) return;
    const toEmp = employees.find(e => e.id === selectedTo);
    const fromEmp = employees.find(e => e.id === selectedFrom);
    const task = tasks.find(t => t.id === selectedTask);
    if (!toEmp || !fromEmp || !task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ assigned_to: toEmp.user_id })
        .eq('id', selectedTask);

      if (error) throw error;

      setLog(prev => [...prev, { taskTitle: task.title, fromName: fromEmp.name, toName: toEmp.name }]);
      toast({ title: '✅ Tarefa reatribuída', description: `${task.title} → ${toEmp.name}` });
      setSelectedTask(null);
      setSelectedTo(null);
      loadTasks(fromEmp.user_id);
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Redistribuição de Tarefas</h3>
      </div>

      {employees.length === 0 && (
        <p className="text-xs text-muted-foreground">Cadastre colaboradores para redistribuir tarefas.</p>
      )}

      {overloaded.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">⚠️ Sobrecarregados:</p>
          <div className="flex flex-wrap gap-2">
            {overloaded.map(emp => (
              <button
                key={emp.id}
                onClick={() => { setSelectedFrom(emp.id); setSelectedTask(null); setSelectedTo(null); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs border transition-all',
                  selectedFrom === emp.id
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'border-border bg-muted/30 text-foreground/80 hover:border-destructive/50'
                )}
              >
                <span className="mr-1">{emp.avatar}</span>
                {emp.name} ({emp.current_load}%)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All employees if none overloaded */}
      {overloaded.length === 0 && employees.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Selecione de quem transferir:</p>
          <div className="flex flex-wrap gap-2">
            {employees.map(emp => (
              <button
                key={emp.id}
                onClick={() => { setSelectedFrom(emp.id); setSelectedTask(null); setSelectedTo(null); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs border transition-all',
                  selectedFrom === emp.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-foreground/80 hover:border-primary/30'
                )}
              >
                <span className="mr-1">{emp.avatar}</span>
                {emp.name} ({emp.current_load}%)
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedFrom && tasks.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Tarefas pendentes:</p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {tasks.map(task => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-xs border transition-all',
                  selectedTask === task.id
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-muted/20 text-foreground/70 hover:border-primary/30'
                )}
              >
                <span className={cn(
                  'inline-block w-1.5 h-1.5 rounded-full mr-2',
                  task.priority === 'critical' ? 'bg-destructive' :
                  task.priority === 'high' ? 'bg-warning' : 'bg-muted-foreground'
                )} />
                {task.title}
                <span className="ml-2 text-muted-foreground">({task.status})</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {selectedFrom && tasks.length === 0 && (
        <p className="text-xs text-muted-foreground">Sem tarefas pendentes para este colaborador.</p>
      )}

      {selectedTask && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> Transferir para:
          </p>
          <div className="flex flex-wrap gap-2">
            {employees.filter(e => e.id !== selectedFrom).map(emp => (
              <button
                key={emp.id}
                onClick={() => setSelectedTo(emp.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs border transition-all',
                  selectedTo === emp.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-foreground/80 hover:border-primary/30'
                )}
              >
                <span className="mr-1">{emp.avatar}</span>
                {emp.name} ({emp.current_load}%)
              </button>
            ))}
          </div>

          {selectedTo && (
            <button
              onClick={handleReassign}
              className="w-full mt-2 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              Confirmar Redistribuição
            </button>
          )}
        </motion.div>
      )}

      {log.length > 0 && (
        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium">Redistribuições realizadas:</p>
          {log.map((r, i) => (
            <div key={i} className="text-[11px] text-foreground/70 flex items-center gap-1">
              <Check className="w-3 h-3 text-primary" />
              <span className="font-medium">{r.taskTitle}</span>: {r.fromName} → {r.toName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
