import { CheckCircle2, Clock, Mail, Target } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import SkillsRadar from '@/components/charts/SkillsRadar';
import TipsCarousel from '@/components/dashboard/TipsCarousel';
import TaskList from '@/components/dashboard/TaskList';
import GamificationPanel from '@/components/dashboard/GamificationPanel';
import DataInputForm from '@/components/dashboard/DataInputForm';
import { WeeklyChart, EmailChart } from '@/components/charts/WeeklyCharts';
import { mockEmployees, mockTasks, mockTips } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';

export default function EmployeeDashboard() {
  const { selectedEmployeeId } = useApp();
  const emp = mockEmployees.find((e) => e.id === selectedEmployeeId) || mockEmployees[0];
  const empTasks = mockTasks.filter((t) => t.assignedTo === emp.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl">
          {emp.avatar}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{emp.name}</h2>
          <p className="text-sm text-muted-foreground">{emp.role} • Nível {emp.level}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tarefas Concluídas" value={emp.tasksCompleted} change={12} icon={CheckCircle2} color="primary" />
        <StatCard label="Pendentes" value={emp.tasksPending} icon={Clock} color="warning" />
        <StatCard label="Taxa de Acerto" value={`${emp.accuracyRate}%`} change={3} icon={Target} color="accent" />
        <StatCard label="E-mails Respondidos" value={`${emp.emailsResponded}/${emp.emailsReceived}`} icon={Mail} color="info" />
      </div>

      {/* Data Input + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataInputForm />
        <TipsCarousel tips={mockTips} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskList tasks={empTasks} />
        <SkillsRadar skills={emp.skills} />
        <GamificationPanel employee={emp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart />
        <EmailChart />
      </div>
    </div>
  );
}
