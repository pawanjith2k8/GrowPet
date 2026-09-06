import React, { useState } from 'react';
import { usePet } from '../../context/PetContext';
import { Scale, Plus, TrendingUp, Calendar } from 'lucide-react';

export const WeightGrowthChart: React.FC = () => {
  const { activePet, healthLogs, addHealthLog } = usePet();
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);

  if (!activePet) return null;

  const weightLogs = healthLogs
    .filter(l => l.type === 'weight' && l.value !== undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    addHealthLog({
      type: 'weight',
      date: newDate,
      title: 'Weight Log Entry',
      value: Number(newWeight),
      unit: activePet.weightKg < 0.5 ? 'g' : 'kg',
      notes: 'Recorded in Smart Care growth log'
    });
    setNewWeight('');
    setShowForm(false);
  };

  const maxVal = Math.max(...weightLogs.map(l => l.value || 1), activePet.weightKg || 1);
  const minVal = Math.min(...weightLogs.map(l => l.value || 1), activePet.weightKg || 1) * 0.85;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Weight & Growth Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Current Baseline: {activePet.weightKg >= 1 ? `${activePet.weightKg} kg` : `${Math.round(activePet.weightKg * 1000)} g`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Weight</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddWeight} className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Weight ({activePet.weightKg < 0.5 ? 'grams' : 'kg'})</label>
              <input
                type="number"
                step="0.001"
                required
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                placeholder="e.g. 31.5"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* Visual Chart / Trend Bars */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
        <div className="flex items-end justify-between gap-2 h-36 pt-6 pb-2 px-2">
          {weightLogs.length === 0 ? (
            <div className="w-full text-center text-xs text-slate-400 self-center">
              No historical weigh-ins yet. Log your first weigh-in above!
            </div>
          ) : (
            weightLogs.map((log, idx) => {
              const heightPct = Math.min(100, Math.max(15, (((log.value || 1) - minVal) / (maxVal - minVal || 1)) * 100));
              return (
                <div key={log.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                    {log.value} {log.unit || 'kg'}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-blue-600 to-teal-400 rounded-xl transition-all duration-500 hover:opacity-80 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] text-slate-400 font-medium truncate max-w-[48px]">
                    {log.date.slice(5)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};