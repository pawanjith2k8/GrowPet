import React from 'react';
import { usePet } from '../../context/PetContext';
import { Plus, Sparkles, Heart, ShieldCheck, Award } from 'lucide-react';

export const NoPetsOnboarding: React.FC = () => {
  const { openAddPet } = usePet();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm text-center space-y-6 max-w-2xl mx-auto my-6 animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-100 dark:ring-emerald-950">
        <Heart className="w-8 h-8 fill-white" />
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          Welcome to Smart Care! 🐾
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          Your AI-powered care assistant is ready. Add your first companion to get a tailored species care schedule, health tracking, and 24/7 AI veterinary assistance.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
          <div className="text-emerald-600 font-bold text-xs flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Any Species</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Dog, cat, bird, aquatic, reptile, amphibian or exotic.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
          <div className="text-blue-600 font-bold text-xs flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>24/7 AI Triage</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Photo symptom checker & urgent emergency detection.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
          <div className="text-amber-600 font-bold text-xs flex items-center gap-1.5 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Price Compare</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Live multi-retailer shopping with fastest & cheapest badges.
          </p>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="flex flex-col items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={openAddPet}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Your Pet Profile</span>
        </button>
      </div>
    </div>
  );
};