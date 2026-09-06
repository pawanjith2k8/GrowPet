import React, { useState } from 'react';
import { usePet } from '../../context/PetContext';
import { MessageSquareQuote, Camera, ShoppingBag, MapPin, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { PhotoSymptomCheckerModal } from '../ai-assistant/PhotoSymptomCheckerModal';

export const QuickActions: React.FC = () => {
  const { activePet, setActiveTab } = usePet();
  const [isPhotoCheckerOpen, setIsPhotoCheckerOpen] = useState(false);

  if (!activePet) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* AI Symptom Vision Checker */}
        <div
          onClick={() => setIsPhotoCheckerOpen(true)}
          className="group p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-subtle hover:shadow-card"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Photo Symptom</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">AI Vision Screening</p>
        </div>

        {/* 24/7 AI Veterinary Consultation */}
        <div
          onClick={() => setActiveTab('chat')}
          className="group p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-subtle hover:shadow-card"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">24/7 AI Vet</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Species-tailored Chat</p>
        </div>

        {/* Price & Delivery Compare */}
        <div
          onClick={() => setActiveTab('shop')}
          className="group p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-subtle hover:shadow-card"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Price Match</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Amazon • Chewy • Petco</p>
        </div>

        {/* Emergency Vet Locator */}
        <div
          onClick={() => setActiveTab('vet')}
          className="group p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-subtle hover:shadow-card"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Find Local Vet</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">GPS & 24/7 Emergency</p>
        </div>
      </div>

      {isPhotoCheckerOpen && (
        <PhotoSymptomCheckerModal onClose={() => setIsPhotoCheckerOpen(false)} />
      )}
    </>
  );
};