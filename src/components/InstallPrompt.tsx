import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const apkCommand = 'adb install performance-ai.apk';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const dismissed = localStorage.getItem('installPromptDismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  const copyApkCommand = async () => {
    await navigator.clipboard.writeText(apkCommand);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-50"
        >
          <div className="glass-card p-4 border-primary/30 space-y-3">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Instalar PerformanceAI</h4>
                  <p className="text-xs text-muted-foreground">Use offline em desktop e mobile</p>
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1 rounded hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleInstall}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Instalar Aplicativo (PWA)
            </button>

            <div className="rounded-lg border border-border p-3 bg-muted/30">
              <p className="text-xs font-medium flex items-center gap-1 mb-2"><Smartphone className="w-3.5 h-3.5" /> Instalação APK rápida (Android)</p>
              <p className="text-[11px] text-muted-foreground mb-2">Gere seu APK da versão web e instale via ADB no dispositivo:</p>
              <code className="text-[11px] block bg-background rounded px-2 py-1 mb-2">{apkCommand}</code>
              <button onClick={copyApkCommand} className="text-[11px] px-2 py-1 rounded bg-background border border-border hover:bg-muted">Copiar comando</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
