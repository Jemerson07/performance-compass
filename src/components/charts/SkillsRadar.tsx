import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Skill } from '@/types';

interface SkillsRadarProps {
  skills: Skill[];
}

export default function SkillsRadar({ skills }: SkillsRadarProps) {
  const data = skills.map((s) => ({ subject: s.name, value: s.level, fullMark: 100 }));

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Radar de Competências</h3>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(220 14% 18%)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(215 12% 55%)', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Competências" dataKey="value" stroke="hsl(165 80% 45%)" fill="hsl(165 80% 45%)" fillOpacity={0.2} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
