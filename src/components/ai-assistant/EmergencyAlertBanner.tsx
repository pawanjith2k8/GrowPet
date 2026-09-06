import React from 'react';
import { AlertOctagon, PhoneCall, ArrowRight, ShieldAlert } from 'lucide-react';
import { usePet } from '../../context/PetContext';

interface EmergencyAlertBannerProps {
  onDirectToVet: () => void;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({ onDirectToVet }) => {
  const { activePet } = usePet();

  return (
    <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white p-4 sm:p-5 rounded-3xl shadow-xl shadow-rose-600/20 border-2 border-white/20 animate-pulse relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <AlertOctagon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base leading-tight">
              Urgent Care Triggered for {activePet?.name || 'Your Pet'}
            </h3>
            <p className="text-xs text-rose-100 mt-0.5">
              Potential critical symptoms detected. Do not wait for online chat — consult an emergency hospital immediately.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="tel:911"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-rose-700 font-extrabold text-xs shadow-md hover:bg-rose-50 transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Emergency Vet</span>
          </a>
          <button
            onClick={onDirectToVet}
            className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs transition-colors"
          >
            <span>Locator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};