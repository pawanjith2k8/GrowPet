import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 3500) => {
    const id = 'toast-' + Date.now() + '-' + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map(toast => {
          let bg = 'bg-emerald-600 text-white';
          let Icon = CheckCircle2;
          if (toast.type === 'error') { bg = 'bg-rose-600 text-white'; Icon = AlertCircle; }
          else if (toast.type === 'warning') { bg = 'bg-amber-600 text-white'; Icon = AlertTriangle; }
          else if (toast.type === 'info') { bg = 'bg-sky-600 text-white'; Icon = Info; }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${bg}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium leading-snug break-words">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};