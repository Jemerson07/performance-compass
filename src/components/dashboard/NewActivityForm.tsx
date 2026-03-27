import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Send, Users, Calendar, Clock, Tag, FileText, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  user_id: string;
  profile: { name: string; avatar: string | null };
}

export default function NewActivityForm() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    origin: 'manual',
    due_date: '',
    estimated_time: '60',
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const { data: empData } = await supabase.from('employees').select('id, user_id');
      const { data: profiles } = await supabase.from('profiles').select('user_id, name, avatar');
      const profileMap = new Map((profiles ?? []).map(p => [p.user_id, p]));
      setEmployees((empData ?? []).map(e => ({
        id: e.id,
        user_id: e.user_id,
        profile: {
          name: profileMap.get(e.user_id)?.name ?? 'Sem nome',
          avatar: profileMap.get(e.user_id)?.avatar ?? '👤',
        },
      })));
    } catch { /* silent */ }
  };

  const toggleEmployee = (userId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const selectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e.user_id));
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast({ title: 'Informe o título da atividade', variant: 'destructive' });
      return;
    }
    if (selectedEmployees.length === 0) {
      toast({ title: 'Selecione pelo menos um colaborador', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const currentUser = (await supabase.auth.getUser()).data.user;

      const tasks = selectedEmployees.map(userId => ({
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        origin: form.origin,
        due_date: form.due_date || null,
        estimated_time: parseInt(form.estimated_time) || 60,
        assigned_to: userId,
        created_by: currentUser?.id,
        status: 'pending',
      }));

      const { error } = await supabase.from('tasks').insert(tasks);
      if (error) throw error;

      toast({
        title: `✅ ${tasks.length} atividade(s) criada(s)`,
        description: `Atribuída(s) a ${selectedEmployees.length} colaborador(es)`,
      });

      setForm({ title: '', description: '', priority: 'medium', origin: 'manual', due_date: '', estimated_time: '60' });
      setSelectedEmployees([]);
      setOpen(false);
    } catch (error: any) {
      toast({ title: 'Erro ao criar atividades', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Baixa', color: 'bg-muted text-muted-foreground' },
    { value: 'medium', label: 'Média', color: 'bg-accent/20 text-accent-foreground' },
    { value: 'high', label: 'Alta', color: 'bg-warning/20 text-warning' },
    { value: 'critical', label: 'Crítica', color: 'bg-destructive/20 text-destructive' },
  ];

  const originOptions = [
    { value: 'manual', label: '📝 Manual' },
    { value: 'excel', label: '📊 Excel' },
    { value: 'bi', label: '📈 BI' },
    { value: 'email', label: '📧 E-mail' },
  ];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="glass-card p-5 w-full text-left hover:border-primary/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Nova Atividade</h3>
            <p className="text-xs text-muted-foreground">Atribuir tarefas individuais ou em lote</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Nova Atividade</h3>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-muted">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Title + Description */}
      <div className="space-y-3">
        <div className="relative">
          <FileText className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Título da atividade *"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <textarea
          placeholder="Descrição (opcional)"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      {/* Priority + Origin */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Prioridade
          </label>
          <div className="flex flex-wrap gap-1">
            {priorityOptions.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setForm({ ...form, priority: p.value })}
                className={cn(
                  'px-2.5 py-1 rounded text-[11px] font-medium transition-all border',
                  form.priority === p.value
                    ? `${p.color} border-current`
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/30'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Origem</label>
          <div className="flex flex-wrap gap-1">
            {originOptions.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => setForm({ ...form, origin: o.value })}
                className={cn(
                  'px-2.5 py-1 rounded text-[11px] font-medium transition-all border',
                  form.origin === o.value
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/30'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Prazo
          </label>
          <input
            type="date"
            value={form.due_date}
            onChange={e => setForm({ ...form, due_date: e.target.value })}
            className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Tempo estimado (min)
          </label>
          <input
            type="number"
            value={form.estimated_time}
            onChange={e => setForm({ ...form, estimated_time: e.target.value })}
            min="1"
            className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Employee selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" /> Atribuir a ({selectedEmployees.length})
          </label>
          <button
            type="button"
            onClick={selectAll}
            className="text-[10px] text-primary hover:underline"
          >
            {selectedEmployees.length === employees.length ? 'Desmarcar todos' : 'Selecionar todos'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {employees.map(emp => (
            <button
              key={emp.user_id}
              type="button"
              onClick={() => toggleEmployee(emp.user_id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs border transition-all flex items-center gap-1.5',
                selectedEmployees.includes(emp.user_id)
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/30'
              )}
            >
              <span>{emp.profile.avatar}</span>
              {emp.profile.name}
            </button>
          ))}
          {employees.length === 0 && (
            <p className="text-xs text-muted-foreground">Nenhum colaborador cadastrado.</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Criando...' : `Atribuir a ${selectedEmployees.length} colaborador(es)`}
      </button>
    </motion.div>
  );
}
