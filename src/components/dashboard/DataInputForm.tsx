import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileSpreadsheet, BarChart3, Clock, Target, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaskEntry {
  title: string;
  origin: 'excel' | 'bi' | 'email' | 'manual';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number;
  actualTime: number;
  status: 'completed' | 'pending' | 'in_progress';
  dueDate: string;
}

export default function DataInputForm() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TaskEntry[]>([]);
  const [form, setForm] = useState<TaskEntry>({
    title: '',
    origin: 'manual',
    priority: 'medium',
    estimatedTime: 60,
    actualTime: 0,
    status: 'pending',
    dueDate: new Date().toISOString().split('T')[0],
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    setEntries((prev) => [...prev, form]);
    setForm({ ...form, title: '', actualTime: 0 });
    toast({ title: '✅ Atividade registrada', description: form.title });
  };

  const origins = [
    { value: 'excel', label: 'Planilha', icon: FileSpreadsheet },
    { value: 'bi', label: 'Power BI', icon: BarChart3 },
    { value: 'email', label: 'E-mail', icon: Target },
    { value: 'manual', label: 'Manual', icon: Plus },
  ] as const;

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Registrar Atividade</h3>
      </div>

      <div className="space-y-3">
        {/* Title */}
        <input
          type="text"
          placeholder="Descrição da atividade..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {/* Origin */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Origem</label>
          <div className="flex gap-1.5">
            {origins.map((o) => (
              <button
                key={o.value}
                onClick={() => setForm({ ...form, origin: o.value })}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] border transition-all ${
                  form.origin === o.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/30'
                }`}
              >
                <o.icon className="w-3 h-3" />
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Prioridade</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskEntry['priority'] })}
              className="w-full bg-muted rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskEntry['status'] })}
              className="w-full bg-muted rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Concluída</option>
            </select>
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
              <Clock className="w-3 h-3" /> Estimado (min)
            </label>
            <input
              type="number"
              value={form.estimatedTime}
              onChange={(e) => setForm({ ...form, estimatedTime: +e.target.value })}
              className="w-full bg-muted rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Real (min)</label>
            <input
              type="number"
              value={form.actualTime}
              onChange={(e) => setForm({ ...form, actualTime: +e.target.value })}
              className="w-full bg-muted rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Prazo</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full bg-muted rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!form.title.trim()}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          Salvar Atividade
        </button>
      </div>

      {/* Recent entries */}
      {entries.length > 0 && (
        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium">Registradas hoje ({entries.length}):</p>
          {entries.slice(-5).map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] text-foreground/70 flex items-center justify-between bg-muted/20 rounded-lg px-3 py-1.5"
            >
              <span>{entry.title}</span>
              <span className="text-muted-foreground">{entry.origin} • {entry.actualTime || entry.estimatedTime}min</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
