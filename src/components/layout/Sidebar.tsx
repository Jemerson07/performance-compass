import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Brain, BarChart3, MessageSquare, ChevronLeft, ChevronRight, Zap, Settings } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'team', label: 'Equipe', icon: Users, managerOnly: true },
  { id: 'mindmap', label: 'Competências', icon: Brain },
  { id: 'analytics', label: 'Análises', icon: BarChart3, managerOnly: true },
];

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { role, setRole, setChatOpen } = useApp();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border min-h-[64px]">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
              <h1 className="text-sm font-bold text-foreground tracking-tight">PerformanceAI</h1>
              <p className="text-[10px] text-muted-foreground">por Jemerson</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Role Switch */}
      <div className="px-3 py-3">
        <div className="flex bg-muted rounded-lg p-0.5">
          {(['manager', 'employee'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                'flex-1 text-[11px] font-medium py-1.5 rounded-md transition-all',
                role === r ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {collapsed ? (r === 'manager' ? '👔' : '👤') : (r === 'manager' ? 'Gestor' : 'Colaborador')}
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 mt-2">
        {navItems
          .filter((item) => !item.managerOnly || role === 'manager')
          .map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                activePage === item.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
      </nav>

      {/* AI Button */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setChatOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-accent/10 text-accent hover:bg-accent/20 transition-all glow-border"
        >
          <MessageSquare className="w-[18px] h-[18px] flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-medium">
                Assistente IA
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse */}
      <div className="p-3 border-t border-sidebar-border">
        <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
