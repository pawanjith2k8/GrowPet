import React from 'react';
import { usePet } from '../../context/PetContext';
import { SPECIES_QUICK_CHIPS } from '../../data/shoppingData';
import { Sparkles } from 'lucide-react';

interface SpeciesSearchChipsProps {
  onSelectChip: (query: string) => void;
  activeQuery: string;
}

export const SpeciesSearchChips: React.FC<SpeciesSearchChipsProps> = ({ onSelectChip, activeQuery }) => {
  const { activePet } = usePet();

  if (!activePet) return null;

  const chips = SPECIES_QUICK_CHIPS[activePet.category] || SPECIES_QUICK_CHIPS.other;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Recommended for {activePet.name} ({activePet.species}):</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {chips.map((chip, idx) => {
          const isSelected = activeQuery.toLowerCase() === chip.query.toLowerCase();
          return (
            <button
              key={idx}
              onClick={() => onSelectChip(chip.query)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-200'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};