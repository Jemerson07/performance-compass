export type UserRole = 'employee' | 'manager';

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: Skill[];
  currentLoad: number; // percentage
  tasksCompleted: number;
  tasksPending: number;
  emailsReceived: number;
  emailsResponded: number;
  avgResponseTime: number; // minutes
  accuracyRate: number; // percentage
  level: number;
  xp: number;
  xpToNext: number;
  badges: string[];
  weeklyStreak: number;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'communication' | 'analysis' | 'execution' | 'autonomy' | 'leadership' | 'technical';
}

export interface Task {
  id: string;
  title: string;
  status: 'completed' | 'pending' | 'in_progress' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  assignedTo: string;
  origin: 'excel' | 'email' | 'bi' | 'manual';
  estimatedTime: number;
  actualTime?: number;
}

export interface DailyTip {
  id: string;
  message: string;
  type: 'productivity' | 'wellness' | 'strategy' | 'alert';
  icon: string;
}

export interface TeamMetric {
  label: string;
  value: number;
  change: number;
  unit: string;
}
