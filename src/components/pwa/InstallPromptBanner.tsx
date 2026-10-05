import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { isStandaloneMode, isIOSDevice } from '../../utils/pwaRegister';
import { IOSInstallModal } from './IOSInstallModal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPromptBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    const standalone = isStandaloneMode();
    setIsStandalone(standalone);
    setIsIOS(isIOSDevice());

    if (standalone) {
      return; // Already installed, do not show prompt
    }

    // Check dismissal cooldown (7 days)
    const dismissedTimestamp = localStorage.getItem('growpet_install_dismissed');
    if (dismissedTimestamp) {
      const elapsed = Date.now() - parseInt(dismissedTimestamp, 10);
      if (elapsed < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Capture Chrome / Android install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Share with other components (e.g. UserProfileView install button)
      (window as any).__pwaDeferred = e;
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
      (window as any).__pwaDeferred = null;
      console.log('[GrowPet PWA] Application installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // On iOS Safari, show prompt banner after 3 seconds if not standalone
    if (isIOSDevice() && !standalone) {
      const timer = setTimeout(() => {
        if (!localStorage.getItem('growpet_install_dismissed')) {
          setShowBanner(true);
        }
      }, 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setIsIOSModalOpen(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('growpet_install_dismissed', Date.now().toString());
  };

  if (isStandalone || !showBanner) {
    return (
      <IOSInstallModal
        isOpen={isIOSModalOpen}
        onClose={() => setIsIOSModalOpen(false)}
      />
    );
  }

  return (
    <>
      <div className="bg-slate-900/95 dark:bg-slate-900/95 text-white border-b border-emerald-500/30 px-4 py-2.5 shadow-lg backdrop-blur-md sticky top-0 z-40 animate-fade-in">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/icons/icon-192x192.png"
              alt="GrowPet"
              className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-emerald-400 shadow-sm"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white truncate">Install GrowPet</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 font-extrabold uppercase rounded-md">
                  PWA
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">
                Fast offline access, full-screen mode & zero app store login required
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss for 7 days"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <IOSInstallModal
        isOpen={isIOSModalOpen}
        onClose={() => setIsIOSModalOpen(false)}
      />
    </>
  );
};
