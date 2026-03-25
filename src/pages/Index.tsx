import { useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/layout/Sidebar';
import AIChatPanel from '@/components/chat/AIChatPanel';
import EmployeeDashboard from '@/pages/EmployeeDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import MindMapPage from '@/pages/MindMapPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import TeamPage from '@/pages/TeamPage';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const { role } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />;
      case 'team':
        return <TeamPage />;
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
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
