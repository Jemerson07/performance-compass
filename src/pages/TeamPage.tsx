import TeamTable from '@/components/dashboard/TeamTable';
import { mockEmployees } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import SkillsRadar from '@/components/charts/SkillsRadar';
import GamificationPanel from '@/components/dashboard/GamificationPanel';
import TaskList from '@/components/dashboard/TaskList';
import { mockTasks } from '@/data/mockData';

export default function TeamPage() {
  const { selectedEmployeeId, setSelectedEmployeeId } = useApp();
  const selected = mockEmployees.find((e) => e.id === selectedEmployeeId) || mockEmployees[0];
  const empTasks = mockTasks.filter((t) => t.assignedTo === selected.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Gestão da Equipe</h2>
        <p className="text-sm text-muted-foreground">Selecione um colaborador para ver detalhes completos</p>
      </div>

      <TeamTable employees={mockEmployees} onSelect={setSelectedEmployeeId} selectedId={selectedEmployeeId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskList tasks={empTasks} />
        <SkillsRadar skills={selected.skills} />
        <GamificationPanel employee={selected} />
      </div>
    </div>
  );
}
