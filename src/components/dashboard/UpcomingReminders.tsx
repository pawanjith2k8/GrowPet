import React from 'react';
import { usePet } from '../../context/PetContext';
import { Bell, Pill, Calendar } from 'lucide-react';

export const UpcomingReminders: React.FC = () => {
  const { activePet, medications, healthLogs, toggleMedicationTaken, setActiveTab } = usePet();

  if (!activePet) return null;

  const activeMeds = medications.filter(m => m.active);
  const upcomingVetVisits = healthLogs.filter(h => h.nextDueDate);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Medication & Vaccine Alerts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active schedules for {activePet.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('health')}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          View Hub
        </button>
      </div>

      {activeMeds.length === 0 && upcomingVetVisits.length === 0 ? (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No pending medication doses or upcoming vaccines due this week. All clear! 🌟
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {activeMeds.map(med => (
            <div
              key={med.id}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{med.name}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {med.dosage} • {med.frequency}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleMedicationTaken(med.id)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Mark Taken
              </button>
            </div>
          ))}

          {upcomingVetVisits.map(visit => (
            <div
              key={visit.id}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{visit.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Next Due Date: {visit.nextDueDate} • {visit.vetName || 'Scheduled Clinic'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};