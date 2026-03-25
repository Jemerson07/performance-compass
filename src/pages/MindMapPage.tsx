import { mockEmployees } from '@/data/mockData';
import SkillsRadar from '@/components/charts/SkillsRadar';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  communication: 'Comunicação',
  analysis: 'Análise',
  execution: 'Execução',
  autonomy: 'Autonomia',
  leadership: 'Liderança',
  technical: 'Técnico',
};

export default function MindMapPage() {
  const { selectedEmployeeId, setSelectedEmployeeId, role } = useApp();
  const employees = role === 'manager' ? mockEmployees : mockEmployees.filter((e) => e.id === selectedEmployeeId);
  const selected = mockEmployees.find((e) => e.id === selectedEmployeeId) || mockEmployees[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Mapa de Competências</h2>
        <p className="text-sm text-muted-foreground">Visualize habilidades, forças e áreas de desenvolvimento</p>
      </div>

      {role === 'manager' && (
        <div className="flex flex-wrap gap-2">
          {mockEmployees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelectedEmployeeId(emp.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all',
                selectedEmployeeId === emp.id ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <span>{emp.avatar}</span>
              <span>{emp.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsRadar skills={selected.skills} />

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Detalhamento de Competências</h3>
          <div className="space-y-4">
            {selected.skills.map((skill, i) => (
              <motion.div key={skill.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={cn(
                      'h-full rounded-full',
                      skill.level >= 90 ? 'bg-primary' : skill.level >= 70 ? 'bg-info' : skill.level >= 50 ? 'bg-warning' : 'bg-destructive'
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Development */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">💪 Pontos Fortes</h3>
          <div className="space-y-2">
            {selected.skills
              .filter((s) => s.level >= 85)
              .sort((a, b) => b.level - a.level)
              .map((s) => (
                <div key={s.name} className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <span className="text-sm text-primary font-bold">{s.level}</span>
                  <span className="text-sm text-foreground">{s.name}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">🎯 Áreas para Desenvolvimento</h3>
          <div className="space-y-2">
            {selected.skills
              .filter((s) => s.level < 75)
              .sort((a, b) => a.level - b.level)
              .map((s) => (
                <div key={s.name} className="flex items-center gap-3 p-2 rounded-lg bg-warning/5 border border-warning/10">
                  <span className="text-sm text-warning font-bold">{s.level}</span>
                  <span className="text-sm text-foreground">{s.name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
