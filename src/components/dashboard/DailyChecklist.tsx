import React, { useState } from 'react';
import { usePet } from '../../context/PetContext';
import { Check, Plus, Utensils, Droplets, Sparkles, Activity, ShieldCheck, Sun, Clock } from 'lucide-react';

export const DailyChecklist: React.FC = () => {
  const { activePet, careTasks, toggleCareTask, addCareTask } = usePet();
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'feeding' | 'water' | 'cleaning' | 'exercise' | 'health' | 'enrichment'>('feeding');
  const [newTime, setNewTime] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');

  if (!activePet) return null;

  const filteredTasks = careTasks.filter(t => {
    if (timeFilter === 'all') return true;
    return t.timeOfDay === timeFilter || t.timeOfDay === 'anytime';
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feeding': return Utensils;
      case 'water': return Droplets;
      case 'cleaning': return Sparkles;
      case 'exercise': return Activity;
      case 'health': return ShieldCheck;
      default: return Sun;
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addCareTask({
      title: newTitle.trim(),
      description: newDesc.trim() || `Custom care routine for ${activePet.name}`,
      category: newCategory,
      timeOfDay: newTime,
      points: 15
    });
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              Daily Species Care Plan
            </h3>
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full">
              {activePet.species}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Species-calibrated checklist to maintain optimal vitality
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'all', label: 'All' },
              { id: 'morning', label: 'Morning' },
              { id: 'afternoon', label: 'Midday' },
              { id: 'evening', label: 'Evening' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  timeFilter === f.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddForm(s => !s)}
            className="p-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 flex items-center justify-center"
            title="Add Task"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-fade-in">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Add Custom Routine for {activePet.name}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Task Name</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Evening tail & skin inspection"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="feeding">Feeding</option>
                <option value="water">Water & Hydration</option>
                <option value="cleaning">Habitat Cleaning</option>
                <option value="exercise">Exercise & Walk</option>
                <option value="health">Health & Checkup</option>
                <option value="enrichment">Enrichment & Toys</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Instructions</label>
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="e.g. 5 minutes gentle grooming"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-sm"
            >
              Save Routine
            </button>
          </div>
        </form>
      )}

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-2xl">
            No tasks scheduled for this time filter. All clear! ✨
          </div>
        ) : (
          filteredTasks.map(task => {
            const Icon = getCategoryIcon(task.category);
            return (
              <div
                key={task.id}
                onClick={() => toggleCareTask(task.id)}
                className={`flex items-start justify-between gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  task.completed
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 opacity-80'
                    : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 scale-105'
                        : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-bold leading-tight ${
                          task.completed
                            ? 'text-slate-400 dark:text-slate-500 line-through'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="px-2 py-0.2 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-200/70 dark:bg-slate-800 rounded-md">
                        {task.timeOfDay}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-0.5 leading-normal ${
                        task.completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};