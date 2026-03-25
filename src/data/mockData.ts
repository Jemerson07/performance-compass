import { Employee, Task, DailyTip, TeamMetric } from '@/types';

export const mockEmployees: Employee[] = [
  {
    id: '1', name: 'Ana Oliveira', role: 'Analista de Dados', avatar: '👩‍💻',
    skills: [
      { name: 'Comunicação', level: 75, category: 'communication' },
      { name: 'Análise', level: 92, category: 'analysis' },
      { name: 'Execução', level: 80, category: 'execution' },
      { name: 'Autonomia', level: 88, category: 'autonomy' },
      { name: 'Liderança', level: 60, category: 'leadership' },
      { name: 'Técnico', level: 95, category: 'technical' },
    ],
    currentLoad: 78, tasksCompleted: 142, tasksPending: 8,
    emailsReceived: 45, emailsResponded: 38, avgResponseTime: 23,
    accuracyRate: 96, level: 12, xp: 2840, xpToNext: 3200,
    badges: ['🎯 Precisão', '⚡ Velocidade', '🧠 Analítico'],
    weeklyStreak: 5,
  },
  {
    id: '2', name: 'Carlos Santos', role: 'Desenvolvedor', avatar: '👨‍💻',
    skills: [
      { name: 'Comunicação', level: 65, category: 'communication' },
      { name: 'Análise', level: 85, category: 'analysis' },
      { name: 'Execução', level: 90, category: 'execution' },
      { name: 'Autonomia', level: 92, category: 'autonomy' },
      { name: 'Liderança', level: 55, category: 'leadership' },
      { name: 'Técnico', level: 98, category: 'technical' },
    ],
    currentLoad: 92, tasksCompleted: 168, tasksPending: 12,
    emailsReceived: 32, emailsResponded: 28, avgResponseTime: 35,
    accuracyRate: 94, level: 14, xp: 3100, xpToNext: 3600,
    badges: ['🔥 Produtivo', '🛠️ Técnico', '🏆 Top Performer'],
    weeklyStreak: 8,
  },
  {
    id: '3', name: 'Maria Costa', role: 'Coordenadora', avatar: '👩‍💼',
    skills: [
      { name: 'Comunicação', level: 95, category: 'communication' },
      { name: 'Análise', level: 78, category: 'analysis' },
      { name: 'Execução', level: 85, category: 'execution' },
      { name: 'Autonomia', level: 82, category: 'autonomy' },
      { name: 'Liderança', level: 93, category: 'leadership' },
      { name: 'Técnico', level: 70, category: 'technical' },
    ],
    currentLoad: 65, tasksCompleted: 120, tasksPending: 5,
    emailsReceived: 60, emailsResponded: 55, avgResponseTime: 15,
    accuracyRate: 98, level: 15, xp: 3500, xpToNext: 4000,
    badges: ['👑 Líder', '💬 Comunicador', '🎯 Precisão'],
    weeklyStreak: 12,
  },
  {
    id: '4', name: 'Pedro Lima', role: 'Atendimento', avatar: '👨‍🔧',
    skills: [
      { name: 'Comunicação', level: 90, category: 'communication' },
      { name: 'Análise', level: 60, category: 'analysis' },
      { name: 'Execução', level: 88, category: 'execution' },
      { name: 'Autonomia', level: 72, category: 'autonomy' },
      { name: 'Liderança', level: 50, category: 'leadership' },
      { name: 'Técnico', level: 65, category: 'technical' },
    ],
    currentLoad: 155, tasksCompleted: 95, tasksPending: 18,
    emailsReceived: 78, emailsResponded: 52, avgResponseTime: 45,
    accuracyRate: 88, level: 8, xp: 1800, xpToNext: 2400,
    badges: ['💬 Comunicador'],
    weeklyStreak: 2,
  },
  {
    id: '5', name: 'Juliana Ferreira', role: 'Analista Financeiro', avatar: '👩‍🏫',
    skills: [
      { name: 'Comunicação', level: 70, category: 'communication' },
      { name: 'Análise', level: 96, category: 'analysis' },
      { name: 'Execução', level: 82, category: 'execution' },
      { name: 'Autonomia', level: 85, category: 'autonomy' },
      { name: 'Liderança', level: 65, category: 'leadership' },
      { name: 'Técnico', level: 88, category: 'technical' },
    ],
    currentLoad: 45, tasksCompleted: 110, tasksPending: 3,
    emailsReceived: 25, emailsResponded: 24, avgResponseTime: 18,
    accuracyRate: 99, level: 11, xp: 2600, xpToNext: 3000,
    badges: ['🎯 Precisão', '🧠 Analítico', '⭐ Consistência'],
    weeklyStreak: 7,
  },
];

export const mockTasks: Task[] = [
  { id: '1', title: 'Relatório mensal de vendas', status: 'completed', priority: 'high', dueDate: '2026-03-24', assignedTo: '1', origin: 'excel', estimatedTime: 120, actualTime: 95 },
  { id: '2', title: 'Análise de indicadores Q1', status: 'in_progress', priority: 'critical', dueDate: '2026-03-26', assignedTo: '1', origin: 'bi', estimatedTime: 180 },
  { id: '3', title: 'Responder tickets de suporte', status: 'pending', priority: 'medium', dueDate: '2026-03-25', assignedTo: '4', origin: 'email', estimatedTime: 60 },
  { id: '4', title: 'Deploy sistema novo', status: 'in_progress', priority: 'high', dueDate: '2026-03-25', assignedTo: '2', origin: 'manual', estimatedTime: 240 },
  { id: '5', title: 'Revisão de contratos', status: 'overdue', priority: 'critical', dueDate: '2026-03-22', assignedTo: '3', origin: 'email', estimatedTime: 90 },
  { id: '6', title: 'Atualizar dashboard BI', status: 'pending', priority: 'low', dueDate: '2026-03-28', assignedTo: '1', origin: 'bi', estimatedTime: 45 },
  { id: '7', title: 'Conciliação bancária', status: 'completed', priority: 'high', dueDate: '2026-03-23', assignedTo: '5', origin: 'excel', estimatedTime: 150, actualTime: 130 },
  { id: '8', title: 'Treinamento equipe', status: 'pending', priority: 'medium', dueDate: '2026-03-27', assignedTo: '3', origin: 'manual', estimatedTime: 120 },
];

export const mockTips: DailyTip[] = [
  { id: '1', message: 'Hoje você está com 20% acima da média de e-mails. Sugestão: concentre-se primeiro no que gera maior impacto.', type: 'productivity', icon: '📧' },
  { id: '2', message: 'De acordo com seu perfil analítico, seria produtivo revisar suas tarefas antes do envio.', type: 'strategy', icon: '🎯' },
  { id: '3', message: 'Você realizou 15 atividades de rotina ontem. Priorize demandas estratégicas pela manhã.', type: 'productivity', icon: '⚡' },
  { id: '4', message: 'Seu ritmo de resposta caiu 12%. Sugestão: separar 2 blocos de foco para e-mails.', type: 'alert', icon: '⏰' },
  { id: '5', message: 'Parabéns! Sua taxa de precisão está em 96%. Continue mantendo a qualidade.', type: 'wellness', icon: '🏆' },
];

export const mockTeamMetrics: TeamMetric[] = [
  { label: 'Tarefas Concluídas', value: 635, change: 12, unit: '' },
  { label: 'Tempo Médio', value: 28, change: -8, unit: 'min' },
  { label: 'Taxa de Acerto', value: 95, change: 3, unit: '%' },
  { label: 'Satisfação', value: 4.7, change: 5, unit: '/5' },
];

export const weeklyData = [
  { day: 'Seg', tarefas: 32, emails: 45, concluidas: 28 },
  { day: 'Ter', tarefas: 28, emails: 38, concluidas: 25 },
  { day: 'Qua', tarefas: 35, emails: 52, concluidas: 30 },
  { day: 'Qui', tarefas: 30, emails: 41, concluidas: 27 },
  { day: 'Sex', tarefas: 22, emails: 35, concluidas: 20 },
];
