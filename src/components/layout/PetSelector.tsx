import React from 'react';
import { usePet } from '../../context/PetContext';
import { Plus } from 'lucide-react';

export const PetSelector: React.FC = () => {
  const { pets, activePet, setActivePetId, openAddPet } = usePet();

  const getSpeciesEmoji = (category: string) => {
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
    <div className="w-full overflow-x-auto scrollbar-none py-1">
      <div className="flex items-center gap-2.5 min-w-max">
        {pets.map(pet => {
          const isSelected = activePet?.id === pet.id;
          const emoji = getSpeciesEmoji(pet.category);

          return (
            <div
              key={pet.id}
              onClick={() => setActivePetId(pet.id)}
              className={`flex items-center gap-3 p-2 pr-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20 scale-[1.01]'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="relative">
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <span className="absolute -bottom-1 -right-1 text-xs bg-white dark:bg-slate-800 rounded-full p-0.5 shadow border border-slate-200 dark:border-slate-700">
                  {emoji}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {pet.name}
                  </h3>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                    {pet.moodScore}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[100px]">
                  {pet.species}
                </p>
              </div>
            </div>
          );
        })}

        {/* Add Pet Button */}
        <button
          onClick={openAddPet}
          className="flex items-center gap-2 p-2.5 px-3.5 rounded-2xl border-2 border-dashed border-emerald-400/60 dark:border-emerald-800 hover:border-emerald-500 bg-emerald-50/40 dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 text-xs font-bold transition-all hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>Add Pet</span>
        </button>
      </div>
    </div>
  );
};