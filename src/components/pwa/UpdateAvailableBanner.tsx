import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { applyUpdate } from '../../utils/pwaRegister';

interface UpdateAvailableBannerProps {
  onDismiss?: () => void;
}

export const UpdateAvailableBanner: React.FC<UpdateAvailableBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between gap-3 sticky top-0 z-50 shadow-md animate-fade-in">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
        <span>A new version of GrowPet is available!</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => applyUpdate()}
          className="px-3 py-1 bg-white text-emerald-900 font-extrabold rounded-lg shadow-sm hover:bg-emerald-50 transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reload</span>
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/80 hover:text-white text-sm px-1"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
