import React, { useState } from 'react';
import { usePet } from '../../context/PetContext';
import { Pill, Plus, CheckCircle, Clock } from 'lucide-react';

export const MedicationTracker: React.FC = () => {
  const { activePet, medications, addMedication, toggleMedicationTaken } = usePet();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [instructions, setInstructions] = useState('');

  if (!activePet) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addMedication({
      name,
      dosage: dosage || '1 dose',
      frequency,
      startDate: new Date().toISOString().split('T')[0],
      instructions: instructions || 'Give with morning meal',
      active: true
    });
    setName('');
    setDosage('');
    setInstructions('');
    setShowForm(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Medications & Supplements
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reminders & active doses for {activePet.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Med</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Medication / Supplement Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Heartgard Plus, Probiotics"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                placeholder="e.g. 1 chewable tablet"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Instructions</label>
            <input
              type="text"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g. Administer with morning meal"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
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
              className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2.5">
        {medications.map(med => (
          <div
            key={med.id}
            className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700"
          >
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{med.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {med.dosage} • {med.frequency}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                {med.instructions}
              </p>
            </div>

            <button
              onClick={() => toggleMedicationTaken(med.id)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors flex-shrink-0"
            >
              Give Dose
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};