import { describe, expect, it } from 'vitest';
import { buildAnalyticsRows, buildBiChecks, toCsv } from '@/lib/bi';

describe('bi helpers', () => {
  it('builds analytics rows', () => {
    const rows = buildAnalyticsRows();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveProperty('colaborador');
  });

  it('exports csv', () => {
    const csv = toCsv([{ colaborador: 'Ana', carga: 80 }]);
    expect(csv).toContain('colaborador,carga');
    expect(csv).toContain('"Ana"');
  });

  it('exports csv with mixed headers', () => {
    const csv = toCsv([{ colaborador: 'Ana', carga: 80 }, { semana: '2026-W12', tarefas: 120 }]);
    expect(csv).toContain('semana');
    expect(csv).toContain('"2026-W12"');
  });

  it('builds BI checks summary', () => {
    const checks = buildBiChecks();
    expect(checks.totalEmployees).toBeGreaterThan(0);
  });
});
