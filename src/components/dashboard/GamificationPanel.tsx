import { motion } from 'framer-motion';
import { Employee } from '@/types';
import { cn } from '@/lib/utils';

interface GamificationProps {
  employee: Employee;
}

export default function GamificationPanel({ employee }: GamificationProps) {
  const xpPercent = (employee.xp / employee.xpToNext) * 100;

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Jornada & Gamificação</h3>

      {/* Level & XP */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="text-2xl font-bold gradient-text">{employee.level}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground font-medium">Nível {employee.level}</span>
            <span className="text-muted-foreground">{employee.xp}/{employee.xpToNext} XP</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'var(--gradient-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-warning/5 border border-warning/20">
        <span className="text-lg">🔥</span>
        <span className="text-xs text-foreground font-medium">{employee.weeklyStreak} semanas consecutivas</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {employee.badges.map((badge) => (
          <span key={badge} className="text-xs bg-muted px-3 py-1.5 rounded-full text-foreground/80">{badge}</span>
        ))}
      </div>
    </div>
  );
}
