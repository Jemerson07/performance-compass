import { useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import AIChatPanel from '@/components/chat/AIChatPanel';
import OfflineIndicator from '@/components/OfflineIndicator';
import InstallPrompt from '@/components/InstallPrompt';
import EmployeeDashboard from '@/pages/EmployeeDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import MindMapPage from '@/pages/MindMapPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import TeamPage from '@/pages/TeamPage';
import AuthPage from '@/pages/AuthPage';
import TaskAssignmentPage from '@/pages/TaskAssignmentPage';
import EmployeeManagementPage from '@/pages/EmployeeManagementPage';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
            <span className="text-primary text-xl">⚡</span>
          </div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />;
      case 'team':
        return <TeamPage />;
      case 'tasks':
        return <TaskAssignmentPage />;
      case 'employees':
        return <EmployeeManagementPage />;
      case 'mindmap':
        return <MindMapPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="ml-[260px] p-8 max-w-[1400px]">
        {renderPage()}
      </main>
      <AIChatPanel />
      <OfflineIndicator />
      <InstallPrompt />
    </div>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
          <span className="text-primary text-xl">⚡</span>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default function Index() {
  return <AuthGate />;
}
