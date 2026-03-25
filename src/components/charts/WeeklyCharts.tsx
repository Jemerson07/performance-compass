import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { weeklyData } from '@/data/mockData';

export function WeeklyChart() {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Desempenho Semanal</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
          <XAxis dataKey="day" tick={{ fill: 'hsl(215 12% 55%)', fontSize: 11 }} />
          <YAxis tick={{ fill: 'hsl(215 12% 55%)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'hsl(210 20% 92%)' }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="tarefas" fill="hsl(165 80% 45%)" name="Recebidas" radius={[4, 4, 0, 0]} />
          <Bar dataKey="concluidas" fill="hsl(250 70% 60%)" name="Concluídas" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EmailChart() {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Volume de E-mails</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
          <XAxis dataKey="day" tick={{ fill: 'hsl(215 12% 55%)', fontSize: 11 }} />
          <YAxis tick={{ fill: 'hsl(215 12% 55%)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }}
          />
          <Area type="monotone" dataKey="emails" stroke="hsl(210 80% 55%)" fill="hsl(210 80% 55%)" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
