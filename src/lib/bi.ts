import { mockEmployees, weeklyData } from '@/data/mockData';

export interface AnalyticsRow {
  colaborador: string;
  carga: number;
  precisao: number;
  tarefasConcluidas: number;
}

export interface WeeklyRow {
  dia: string;
  tarefas: number;
  emails: number;
  concluidas: number;
}

export function buildAnalyticsRows(): AnalyticsRow[] {
  return mockEmployees.map((employee) => ({
    colaborador: employee.name,
    carga: employee.currentLoad,
    precisao: employee.accuracyRate,
    tarefasConcluidas: employee.tasksCompleted,
  }));
}

/**
 * Constrói linhas semanais usando o shape correto de `weeklyData`
 * (que possui `day`, `tarefas`, `emails`, `concluidas`).
 */
export function buildWeeklyRows(): WeeklyRow[] {
  return weeklyData.map((week) => ({
    dia: week.day,
    tarefas: week.tarefas,
    emails: week.emails,
    concluidas: week.concluidas,
  }));
}

export function toCsv(rows: Array<Record<string, string | number>>) {
  if (!rows.length) return '';

  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const lines = rows.map((row) =>
    headers
      .map((key) => {
        const value = String(row[key] ?? '');
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(','),
  );

  return [headers.join(','), ...lines].join('\n');
}

export function buildBiChecks() {
  const rows = buildAnalyticsRows();
  const averageLoad = rows.reduce((acc, row) => acc + row.carga, 0) / rows.length;
  const overloaded = rows.filter((row) => row.carga >= 120).length;
  const lowAccuracy = rows.filter((row) => row.precisao < 90).length;

  return {
    averageLoad: Number(averageLoad.toFixed(1)),
    overloaded,
    lowAccuracy,
    totalEmployees: rows.length,
  };
}
