import React from 'react';
import { X, Share, PlusSquare } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-5 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pr-8">
          <img
            src="/icons/icon-192x192.png"
            alt="GrowPet Logo"
            className="w-12 h-12 rounded-2xl shadow-md ring-2 ring-emerald-500/30 object-cover"
          />
          <div>
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-100 leading-tight">
              Install GrowPet on iPhone
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add to Home Screen without App Store
            </p>
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-[11px] shrink-0 mt-0.5">
              1
            </div>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Tap the <strong className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 font-bold">Share button <Share className="w-3.5 h-3.5 inline" /></strong> in Safari's bottom toolbar.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-[11px] shrink-0 mt-0.5">
              2
            </div>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Scroll down the share sheet and tap <strong className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 font-bold">Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline" /></strong>.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-[11px] shrink-0 mt-0.5">
              3
            </div>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Tap <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Add</strong> in the top-right corner. GrowPet will launch in full-screen standalone mode!
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
        >
          Got It, Thanks!
        </button>
      </div>
    </div>
  );
};
