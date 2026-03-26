import { mockEmployees, mockTasks } from '@/data/mockData';

/**
 * Constrói uma resposta contextual do assistente IA baseada no input do usuário.
 * Utiliza dados da equipe para fornecer insights relevantes.
 */
export function buildAssistantReply(input: string): string {
  const text = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Análise de carga e sobrecarga
  if (text.includes('sobrecar') || text.includes('carga') || text.includes('capacidade')) {
    const sorted = [...mockEmployees].sort((a, b) => b.currentLoad - a.currentLoad);
    const mostLoaded = sorted[0];
    const leastLoaded = sorted[sorted.length - 1];
    const overloaded = sorted.filter((e) => e.currentLoad > 100);

    let response = `⚠️ **Análise de Carga da Equipe**\n\n`;
    response += `- **Mais sobrecarregado:** ${mostLoaded.name} (${mostLoaded.currentLoad}%)\n`;
    response += `- **Maior disponibilidade:** ${leastLoaded.name} (${leastLoaded.currentLoad}%)\n\n`;

    if (overloaded.length > 0) {
      response += `🚨 **Alerta:** ${overloaded.length} colaborador(es) acima de 100% de capacidade:\n`;
      overloaded.forEach((e) => {
        response += `  - ${e.name}: ${e.currentLoad}%\n`;
      });
      response += '\n';
    }

    response += `💡 **Recomendação:** Redistribuir tarefas de quem está acima de 90% para quem está abaixo de 70%. Priorize preservar tarefas críticas com quem possui maior taxa de precisão.`;
    return response;
  }

  // Produtividade e metas
  if (text.includes('produt') || text.includes('meta') || text.includes('desempenho') || text.includes('performance')) {
    const topPerformer = [...mockEmployees].sort((a, b) => b.tasksCompleted - a.tasksCompleted)[0];
    const avgAccuracy = Math.round(mockEmployees.reduce((acc, e) => acc + e.accuracyRate, 0) / mockEmployees.length);

    return `🚀 **Plano de Produtividade**\n\n**Situação atual:**\n- Taxa de precisão média da equipe: **${avgAccuracy}%**\n- Top performer: **${topPerformer.name}** com **${topPerformer.tasksCompleted} tarefas** concluídas\n\n**Estratégias recomendadas:**\n1. Blocos de foco de 50 min com pausas de 10 min\n2. Priorizar tarefas com SLA alto no início do dia\n3. Redistribuição semanal baseada em carga atual\n4. Reuniões 1:1 para colaboradores com precisão abaixo de 90%`;
  }

  // Tarefas atrasadas ou pendentes
  if (text.includes('atras') || text.includes('pendente') || text.includes('tarefa') || text.includes('prazo')) {
    const overdue = mockTasks.filter((t) => t.status === 'overdue');
    const pending = mockTasks.filter((t) => t.status === 'pending');
    const critical = mockTasks.filter((t) => t.priority === 'critical');

    return `📋 **Status das Tarefas**\n\n- **Atrasadas:** ${overdue.length} tarefa(s)\n- **Pendentes:** ${pending.length} tarefa(s)\n- **Críticas:** ${critical.length} tarefa(s)\n\n${overdue.length > 0 ? `⚠️ Tarefas atrasadas: ${overdue.map((t) => t.title).join(', ')}\n\n` : ''}💡 **Ação recomendada:** Priorize as tarefas críticas e atrasadas. Use a aba **Atribuições** para redistribuir se necessário.`;
  }

  // BI, planilhas e exportação
  if (text.includes('bi') || text.includes('planilha') || text.includes('excel') || text.includes('export') || text.includes('csv') || text.includes('relatorio') || text.includes('relatório')) {
    return `📊 **Exportação e BI**\n\nO sistema suporta:\n- **Exportação CSV** diretamente pela aba **Análises** — compatível com Excel, Google Sheets, Power BI e Looker Studio\n- **Snapshots offline** para auditoria e histórico\n- Dados de carga, precisão e tarefas por colaborador\n\n💡 Acesse **Análises → Exportar CSV** para baixar os dados completos da equipe.`;
  }

  // Habilidades e competências
  if (text.includes('habilidade') || text.includes('competencia') || text.includes('competência') || text.includes('skill') || text.includes('mapa')) {
    const topSkills = mockEmployees.map((e) => ({
      name: e.name,
      topSkill: e.skills.reduce((a, b) => (a.level > b.level ? a : b)),
    }));

    let response = `🧠 **Mapa de Competências**\n\nPontos fortes por colaborador:\n`;
    topSkills.forEach((e) => {
      response += `- **${e.name}:** ${e.topSkill.name} (${e.topSkill.level}%)\n`;
    });
    response += `\n💡 Acesse a aba **Competências** para visualizar o radar completo de habilidades.`;
    return response;
  }

  // Redistribuição de tarefas
  if (text.includes('redistrib') || text.includes('transferir') || text.includes('delegar')) {
    const overloaded = mockEmployees.filter((e) => e.currentLoad > 100);
    const available = mockEmployees.filter((e) => e.currentLoad < 70);

    if (overloaded.length === 0) {
      return `✅ **Redistribuição**\n\nNenhum colaborador está sobrecarregado no momento. A equipe está bem distribuída!`;
    }

    let response = `🔄 **Sugestões de Redistribuição**\n\n`;
    overloaded.forEach((from) => {
      const to = available.find((e) => e.id !== from.id);
      if (to) {
        response += `- Mover tarefas de **${from.name}** (${from.currentLoad}%) → **${to.name}** (${to.currentLoad}%)\n`;
      }
    });
    response += `\n💡 Use a aba **Atribuições** para executar a redistribuição.`;
    return response;
  }

  // Resposta genérica melhorada
  return `🤖 **Assistente IA — PerformanceAI**\n\nPosso ajudar com:\n- 📊 **Análise de carga** da equipe\n- 🚀 **Produtividade** e metas\n- 📋 **Tarefas** atrasadas e pendentes\n- 🔄 **Redistribuição** inteligente\n- 🧠 **Competências** e habilidades\n- 📁 **Exportação** para planilhas e BI\n\nDigite sua dúvida ou escolha uma das sugestões abaixo.`;
}
