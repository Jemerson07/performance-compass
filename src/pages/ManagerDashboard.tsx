import { Users, TrendingUp, Clock, Target, AlertTriangle, ArrowRight } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import TeamTable from '@/components/dashboard/TeamTable';
import SkillsRadar from '@/components/charts/SkillsRadar';
import TipsCarousel from '@/components/dashboard/TipsCarousel';
import { WeeklyChart } from '@/components/charts/WeeklyCharts';
import { mockEmployees, mockTeamMetrics, mockTips } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';

export default function ManagerDashboard() {
  const { selectedEmployeeId, setSelectedEmployeeId } = useApp();
  const selectedEmp = mockEmployees.find((e) => e.id === selectedEmployeeId);
  const overloaded = mockEmployees.filter((e) => e.currentLoad > 100);
  const available = mockEmployees.filter((e) => e.currentLoad < 50);

  const recommendations = [
    { icon: '🔄', text: 'Redistribuir 3 tickets de Pedro Lima para Juliana Ferreira', priority: 'high' as const },
    { icon: '📈', text: 'Carlos Santos pode assumir tarefas de deploy — perfil técnico forte', priority: 'medium' as const },
    { icon: '⭐', text: 'Maria Costa indicada para liderar projeto novo — maior score de liderança', priority: 'medium' as const },
    { icon: '⚠️', text: 'Agendar 1:1 com Pedro Lima — sobrecarga pode impactar qualidade', priority: 'high' as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Painel do Gestor</h2>
        <p className="text-sm text-muted-foreground">Visão geral da equipe e recomendações inteligentes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Equipe" value={mockEmployees.length} icon={Users} color="primary" />
        <StatCard label="Tarefas/Semana" value={mockTeamMetrics[0].value} change={mockTeamMetrics[0].change} icon={TrendingUp} color="accent" />
        <StatCard label="Tempo Médio" value={mockTeamMetrics[1].value} unit="min" change={mockTeamMetrics[1].change} icon={Clock} color="info" />
        <StatCard label="Precisão Média" value={`${mockTeamMetrics[2].value}%`} change={mockTeamMetrics[2].change} icon={Target} color="primary" />
      </div>

      {/* Alerts */}
      {overloaded.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 border-destructive/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-semibold text-destructive">Alerta de Sobrecarga</h3>
          </div>
          {overloaded.map((emp) => (
            <p key={emp.id} className="text-sm text-foreground/80">
              <span className="font-medium">{emp.name}</span> está com {emp.currentLoad}% de carga — sugerir redistribuição.
            </p>
          ))}
        </motion.div>
      )}

      {/* Team Table */}
      <TeamTable employees={mockEmployees} onSelect={setSelectedEmployeeId} selectedId={selectedEmployeeId} />

      {/* Bottom: Recommendations + Selected Employee + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="pulse-dot" />
            Recomendações IA
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border text-sm ${rec.priority === 'high' ? 'border-warning/30 bg-warning/5' : 'border-border bg-muted/20'}`}
              >
                <span className="mr-2">{rec.icon}</span>
                <span className="text-foreground/90">{rec.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected employee radar */}
        {selectedEmp && <SkillsRadar skills={selectedEmp.skills} />}

        {/* Tips */}
        <TipsCarousel tips={mockTips.slice(0, 3)} />
      </div>

      <WeeklyChart />
    </div>
  );
}
