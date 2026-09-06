import React from 'react';
import { usePet } from '../../context/PetContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, Plus, Settings, UserCheck, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { activePet, openAddPet, setActiveTab } = usePet();
  const { user } = useAuth();

  const getSpeciesEmoji = (category?: string) => {
    switch (category) {
      case 'mammal': return '🐾';
      case 'bird': return '🪶';
      case 'aquatic': return '🫧';
      case 'reptile': return '🦎';
      case 'amphibian': return '🐸';
      default: return '✨';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setActiveTab('home')}>
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Heart className="w-4.5 h-4.5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-base tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700 dark:from-white dark:via-slate-100 dark:to-emerald-400 bg-clip-text text-transparent leading-none">
                SmartCare
              </h1>
              <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-md">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden xs:block mt-0.5">
              AI-Powered Companion Health
            </p>
          </div>
        </div>

        {/* Active Pet Pill & Header Actions */}
        <div className="flex items-center gap-2">
          {activePet && (
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 rounded-full py-1 px-3 cursor-pointer transition-all shadow-sm"
            >
              <img
                src={activePet.photoUrl}
                alt={activePet.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[80px] sm:max-w-[120px] truncate">
                {activePet.name}
              </span>
              <span className="text-xs">{getSpeciesEmoji(activePet.category)}</span>
            </div>
          )}

          <button
            onClick={openAddPet}
            className="p-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center"
            title="Add another pet"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="p-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Settings & Profile"
          >
            {user?.isGuest ? (
              <UserCheck className="w-4 h-4 text-amber-500" />
            ) : (
              <Settings className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};