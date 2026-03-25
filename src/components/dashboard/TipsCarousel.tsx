import { motion } from 'framer-motion';
import { DailyTip } from '@/types';
import { cn } from '@/lib/utils';

const typeStyles = {
  productivity: 'border-primary/30 bg-primary/5',
  strategy: 'border-accent/30 bg-accent/5',
  alert: 'border-warning/30 bg-warning/5',
  wellness: 'border-success/30 bg-success/5',
};

export default function TipsCarousel({ tips }: { tips: DailyTip[] }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="pulse-dot" />
        Dicas da IA — Hoje
      </h3>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn('p-3 rounded-lg border text-sm text-foreground/90', typeStyles[tip.type])}
          >
            <span className="mr-2">{tip.icon}</span>
            {tip.message}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
