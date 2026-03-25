import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  selectedEmployeeId: string;
  setSelectedEmployeeId: (id: string) => void;
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('1');
  const [isChatOpen, setChatOpen] = useState(false);

  return (
    <AppContext.Provider value={{ selectedEmployeeId, setSelectedEmployeeId, isChatOpen, setChatOpen }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
