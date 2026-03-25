import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, Cloud, CloudOff } from 'lucide-react';
import { offlineQueue } from '@/lib/offlineQueue';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      setQueueSize(offlineQueue.getQueueSize());
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
          isOnline
            ? 'bg-success/10 text-success border border-success/20'
            : 'bg-warning/10 text-warning border border-warning/20'
        }`}>
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
          {queueSize > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-warning text-warning-foreground text-[10px]">
              {queueSize}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50"
          >
            <div className={`glass-card p-4 max-w-sm ${
              isOnline
                ? 'border-success/30'
                : 'border-warning/30'
            }`}>
              <div className="flex items-start gap-3">
                {isOnline ? (
                  <Cloud className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <CloudOff className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {isOnline ? 'Conectado' : 'Modo Offline'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {isOnline
                      ? 'Conexão restaurada. Sincronizando dados...'
                      : 'Você está offline. As alterações serão sincronizadas quando a conexão for restaurada.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
