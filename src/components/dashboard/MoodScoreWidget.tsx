import React from 'react';
import { usePet } from '../../context/PetContext';
import { Flame, Sparkles, Scale, Calendar, Activity, CheckCircle2 } from 'lucide-react';

export const MoodScoreWidget: React.FC = () => {
  const { activePet, careTasks } = usePet();

  if (!activePet) return null;

  const completedCount = careTasks.filter(t => t.completed).length;
  const totalCount = careTasks.length || 1;
  const completionPct = Math.round((completedCount / totalCount) * 100);

  const getMoodStatus = (score: number) => {
    if (score >= 90) return { label: 'Optimal Vitality & Happiness', badge: 'Thriving', color: 'text-emerald-400' };
    if (score >= 75) return { label: 'Good Health & Activity', badge: 'Healthy', color: 'text-teal-400' };
    if (score >= 60) return { label: 'Moderate Care Logged', badge: 'Normal', color: 'text-amber-400' };
    return { label: 'Requires Daily Attention', badge: 'Attention', color: 'text-rose-400' };
  };

  const status = getMoodStatus(activePet.moodScore);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Pet Profile Overview */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={activePet.photoUrl}
              alt={activePet.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/60 shadow-lg shadow-black/40"
            />
            <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 rounded-md shadow">
              {activePet.category}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {activePet.name}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-white/10 text-emerald-300 rounded-full border border-white/10">
                {activePet.species}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
              <span>Age: <strong className="text-slate-200">{activePet.ageYears}y {activePet.ageMonths}m</strong></span>
              <span>•</span>
              <span>Weight: <strong className="text-slate-200">{activePet.weightKg >= 1 ? `${activePet.weightKg} kg` : `${Math.round(activePet.weightKg * 1000)} g`}</strong></span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl text-[11px] font-bold text-amber-300">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{activePet.streakDays} Day Care Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Happiness & Care Progress Metric Card */}
        <div className="w-full md:w-auto bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex items-center justify-between md:flex-col md:items-end gap-3 min-w-[200px]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wellness Score</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {activePet.moodScore}
            </span>
            <span className="text-xs font-bold text-emerald-400">/ 100</span>
          </div>

          <div className="w-full md:w-36 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>

          <span className="text-[10px] font-medium text-slate-400">
            {completedCount}/{totalCount} Daily Care Completed ({completionPct}%)
          </span>
        </div>
      </div>
    </div>
  );
};