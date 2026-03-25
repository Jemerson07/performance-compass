import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { buildAnalyticsRows, buildBiChecks, buildWeeklyRows, toCsv } from '@/lib/bi';
import { storeAnalyticsSnapshot, readAnalyticsSnapshots } from '@/lib/offlineDatabase';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['hsl(165 80% 45%)', 'hsl(250 70% 60%)', 'hsl(38 92% 50%)', 'hsl(340 75% 55%)', 'hsl(210 80% 55%)'];

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [snapshotCount, setSnapshotCount] = useState(readAnalyticsSnapshots().length);

  const loadData = useMemo(() => buildAnalyticsRows().map((e) => ({ name: e.colaborador.split(' ')[0], carga: e.carga, precisao: e.precisao })), []);
  const taskOrigins = [
    { name: 'Excel', value: 35 },
    { name: 'E-mail', value: 28 },
    { name: 'BI', value: 20 },
    { name: 'Manual', value: 17 },
  ];

  const predictions = [
    { day: 'Seg', previsto: 34, real: 32 },
    { day: 'Ter', previsto: 30, real: 28 },
    { day: 'Qua', previsto: 37, real: 35 },
    { day: 'Qui', previsto: 32, real: 30 },
    { day: 'Sex', previsto: 24, real: 22 },
  ];

  const checks = useMemo(() => buildBiChecks(), []);

  const downloadCsv = () => {
    const csv = toCsv([...buildAnalyticsRows(), ...buildWeeklyRows()]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `performance-bi-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast({ title: 'CSV exportado', description: 'Arquivo pronto para planilhas e Power BI.' });
  };

  const saveSnapshot = () => {
    storeAnalyticsSnapshot(buildAnalyticsRows());
    const count = readAnalyticsSnapshots().length;
    setSnapshotCount(count);
    toast({ title: 'Snapshot salvo offline', description: `Total de snapshots locais: ${count}.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Análises Avançadas</h2>
          <p className="text-sm text-muted-foreground">Padrões, previsões e insights baseados em dados</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={downloadCsv} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Exportar CSV (Planilhas/BI)</button>
          <button onClick={saveSnapshot} className="px-3 py-2 rounded-lg bg-muted text-foreground text-xs font-medium">Salvar Snapshot Offline</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card p-3 text-sm"><p className="text-muted-foreground text-xs">Carga média</p><p className="font-semibold">{checks.averageLoad}%</p></div>
        <div className="glass-card p-3 text-sm"><p className="text-muted-foreground text-xs">Sobrecarregados</p><p className="font-semibold">{checks.overloaded}</p></div>
        <div className="glass-card p-3 text-sm"><p className="text-muted-foreground text-xs">Baixa precisão</p><p className="font-semibold">{checks.lowAccuracy}</p></div>
        <div className="glass-card p-3 text-sm"><p className="text-muted-foreground text-xs">Snapshots offline</p><p className="font-semibold">{snapshotCount}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Carga por Colaborador</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={loadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(215 12% 55%)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(215 12% 55%)', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="carga" fill="hsl(165 80% 45%)" name="Carga %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="precisao" fill="hsl(250 70% 60%)" name="Precisão %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Origem das Demandas</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={taskOrigins} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} strokeWidth={2} stroke="hsl(220 20% 7%)">
                {taskOrigins.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Previsão de Demanda (ML)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(215 12% 55%)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(215 12% 55%)', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="previsto" fill="hsl(38 92% 50%)" name="Previsto" radius={[4, 4, 0, 0]} opacity={0.6} />
              <Bar dataKey="real" fill="hsl(165 80% 45%)" name="Real" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="pulse-dot" />
          Insights Automáticos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: '📊', text: 'Validação BI: exportação CSV pronta para planilhas, Looker Studio e Power BI.' },
            { icon: '🧮', text: `Carga média atual da equipe em ${checks.averageLoad}%, com ${checks.overloaded} pessoas sobrecarregadas.` },
            { icon: '💾', text: `Snapshots offline salvos localmente: ${snapshotCount}.` },
            { icon: '📈', text: 'Tempo médio de resposta caiu 8% esta semana — equipe mais ágil.' },
          ].map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-3 rounded-lg bg-muted/30 border border-border/50 text-sm text-foreground/85"
            >
              <span className="mr-2">{insight.icon}</span>
              {insight.text}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
