import { motion } from 'framer-motion';
import { Employee } from '@/types';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface TeamTableProps {
  employees: Employee[];
  onSelect: (id: string) => void;
  selectedId: string;
}

export default function TeamTable({ employees, onSelect, selectedId }: TeamTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-5 pb-3">
        <h3 className="text-sm font-semibold text-foreground">Visão da Equipe</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Colaborador', 'Cargo', 'Carga', 'Concluídas', 'Precisão', 'E-mails', 'Status'].map((h) => (
                <th key={h} className="text-[11px] font-medium text-muted-foreground px-5 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelect(emp.id)}
                className={cn(
                  'border-b border-border/50 cursor-pointer transition-colors',
                  selectedId === emp.id ? 'bg-primary/5' : 'hover:bg-muted/30'
                )}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{emp.avatar}</span>
                    <span className="text-sm text-foreground font-medium">{emp.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{emp.role}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', emp.currentLoad > 100 ? 'bg-destructive' : emp.currentLoad > 80 ? 'bg-warning' : 'bg-primary')}
                        style={{ width: `${Math.min(emp.currentLoad, 100)}%` }}
                      />
                    </div>
                    <span className={cn('text-xs font-medium', emp.currentLoad > 100 ? 'text-destructive' : 'text-muted-foreground')}>
                      {emp.currentLoad}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-foreground font-medium">{emp.tasksCompleted}</td>
                <td className="px-5 py-3 text-sm text-foreground">{emp.accuracyRate}%</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{emp.emailsResponded}/{emp.emailsReceived}</td>
                <td className="px-5 py-3">
                  {emp.currentLoad > 100 ? (
                    <span className="flex items-center gap-1 text-[10px] text-destructive font-medium">
                      <AlertTriangle className="w-3 h-3" /> Sobrecarregado
                    </span>
                  ) : emp.currentLoad < 50 ? (
                    <span className="text-[10px] text-success font-medium">Disponível</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Normal</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
