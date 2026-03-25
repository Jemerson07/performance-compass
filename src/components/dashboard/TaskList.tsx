import { motion } from 'framer-motion';
import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

const statusConfig = {
  completed: { icon: CheckCircle2, label: 'Concluída', class: 'text-success' },
  in_progress: { icon: ArrowRight, label: 'Em andamento', class: 'text-info' },
  pending: { icon: Circle, label: 'Pendente', class: 'text-muted-foreground' },
  overdue: { icon: AlertTriangle, label: 'Atrasada', class: 'text-destructive' },
};

const priorityClass = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-info/10 text-info',
  high: 'bg-warning/10 text-warning',
  critical: 'bg-destructive/10 text-destructive',
};

export default function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Tarefas Recentes</h3>
      <div className="space-y-2">
        {tasks.map((task, i) => {
          const status = statusConfig[task.status];
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <StatusIcon className={cn('w-4 h-4 flex-shrink-0', status.class)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', priorityClass[task.priority])}>
                    {task.priority}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.estimatedTime}min
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{task.origin}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
