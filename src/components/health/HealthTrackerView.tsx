import React, { useState } from 'react';
import { usePet } from '../../context/PetContext';
import { WeightGrowthChart } from './WeightGrowthChart';
import { MedicationTracker } from './MedicationTracker';
import { ExpenseTracker } from './ExpenseTracker';
import { DailyChecklist } from '../dashboard/DailyChecklist';
import { Activity, Pill, Scale, DollarSign, Calendar } from 'lucide-react';

export const HealthTrackerView: React.FC = () => {
  const { activePet, healthLogs } = usePet();
  const [activeSubtab, setActiveSubtab] = useState<'all' | 'checklist' | 'growth' | 'meds' | 'expenses'>('all');

  if (!activePet) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Hub Title Banner */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Health & Care Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            All medical, growth, care and financial records for {activePet.name} ({activePet.species})
          </p>
        </div>
      </div>

      {/* Subtab Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {[
          { id: 'all', label: 'All Trackers' },
          { id: 'checklist', label: 'Daily Care' },
          { id: 'growth', label: 'Weight & Growth' },
          { id: 'meds', label: 'Medications' },
          { id: 'expenses', label: 'Expenses' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubtab(tab.id as any)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubtab === tab.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trackers Content */}
      {(activeSubtab === 'all' || activeSubtab === 'checklist') && <DailyChecklist />}
      {(activeSubtab === 'all' || activeSubtab === 'growth') && <WeightGrowthChart />}
      {(activeSubtab === 'all' || activeSubtab === 'meds') && <MedicationTracker />}
      {(activeSubtab === 'all' || activeSubtab === 'expenses') && <ExpenseTracker />}
    </div>
  );
};