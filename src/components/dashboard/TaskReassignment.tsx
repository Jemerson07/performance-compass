import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { mockEmployees, mockTasks } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Reassignment {
  taskId: string;
  fromId: string;
  toId: string;
}

export default function TaskReassignment() {
  const [reassignments, setReassignments] = useState<Reassignment[]>([]);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const { toast } = useToast();

  const overloaded = mockEmployees.filter((e) => e.currentLoad > 80);
  const available = mockEmployees.filter((e) => e.currentLoad < 70);

  const fromEmployee = mockEmployees.find((e) => e.id === selectedFrom);
  const tasksForFrom = mockTasks.filter((t) => t.assignedTo === selectedFrom && t.status !== 'completed');

  const handleReassign = () => {
    if (!selectedTask || !selectedTo) return;
    setReassignments((prev) => [...prev, { taskId: selectedTask, fromId: selectedFrom, toId: selectedTo }]);
    toast({
      title: '✅ Tarefa reatribuída',
      description: `Tarefa movida para ${mockEmployees.find((e) => e.id === selectedTo)?.name}`,
    });
    setSelectedTask('');
    setSelectedTo('');
  };

  return (
    <div className="glass-card p-5 space-y-5">
      <div className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Redistribuição de Tarefas</h3>
      </div>

      {/* Overloaded alerts */}
      {overloaded.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">⚠️ Colaboradores sobrecarregados:</p>
          <div className="flex flex-wrap gap-2">
            {overloaded.map((emp) => (
              <button
                key={emp.id}
                onClick={() => { setSelectedFrom(emp.id); setSelectedTask(''); setSelectedTo(''); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs border transition-all',
                  selectedFrom === emp.id
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'border-border bg-muted/30 text-foreground/80 hover:border-destructive/50'
                )}
              >
                <span className="mr-1">{emp.avatar}</span>
                {emp.name} ({emp.currentLoad}%)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tasks to reassign */}
      {selectedFrom && tasksForFrom.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">
            Tarefas de {fromEmployee?.name}:
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {tasksForFrom.map((task) => (
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

      {/* Assign to */}
      {selectedTask && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> Transferir para:
          </p>
          <div className="flex flex-wrap gap-2">
            {available.filter((e) => e.id !== selectedFrom).map((emp) => (
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
                {emp.name} ({emp.currentLoad}%)
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

      {/* History */}
      {reassignments.length > 0 && (
        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium">Redistribuições realizadas:</p>
          {reassignments.map((r, i) => {
            const task = mockTasks.find((t) => t.id === r.taskId);
            const from = mockEmployees.find((e) => e.id === r.fromId);
            const to = mockEmployees.find((e) => e.id === r.toId);
            return (
              <div key={i} className="text-[11px] text-foreground/70 flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                <span className="font-medium">{task?.title}</span>: {from?.name} → {to?.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
