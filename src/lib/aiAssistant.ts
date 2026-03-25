import { mockEmployees } from '@/data/mockData';

export function buildAssistantReply(input: string): string {
  const text = input.toLowerCase();

  if (text.includes('sobrecar') || text.includes('carga')) {
    const mostLoaded = [...mockEmployees].sort((a, b) => b.currentLoad - a.currentLoad)[0];
    const leastLoaded = [...mockEmployees].sort((a, b) => a.currentLoad - b.currentLoad)[0];

    return `⚠️ **Análise de carga em tempo real**\n\n- Mais sobrecarregado: **${mostLoaded.name} (${mostLoaded.currentLoad}%)**\n- Maior disponibilidade: **${leastLoaded.name} (${leastLoaded.currentLoad}%)**\n\nSugestão: mover tarefas repetitivas para quem está abaixo de 70% e preservar tarefas críticas com quem possui maior precisão.`;
  }

  if (text.includes('produt') || text.includes('meta')) {
    const topPerformer = [...mockEmployees].sort((a, b) => b.tasksCompleted - a.tasksCompleted)[0];

    return `🚀 **Plano rápido de produtividade**\n\n1. Priorizar blocos de foco de 50 minutos\n2. Revisar tarefas com SLA alto primeiro\n3. Usar redistribuição semanal com base em carga\n\nDestaque atual: **${topPerformer.name}** com **${topPerformer.tasksCompleted} tarefas** concluídas.`;
  }

  if (text.includes('bi') || text.includes('planilha') || text.includes('excel')) {
    return '📊 Você pode usar a aba **Análises** para exportar CSV e salvar snapshots offline para BI. Isso facilita auditoria e integração com planilhas.';
  }

  return '🤖 Entendi. Posso ajudar com carga de trabalho, produtividade, exportação para planilhas/BI e recomendações de redistribuição.';
}
