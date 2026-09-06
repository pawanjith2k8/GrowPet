import React, { useState } from 'react';
import { usePet } from '../../context/PetContext';
import { analyzeSymptomPhoto } from '../../services/aiService';
import { SymptomCheckResult } from '../../types';
import { X, Camera, Upload, AlertTriangle, AlertCircle, CheckCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface PhotoSymptomCheckerModalProps {
  onClose: () => void;
}

export const PhotoSymptomCheckerModal: React.FC<PhotoSymptomCheckerModalProps> = ({ onClose }) => {
  const { activePet, setActiveTab } = usePet();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomCheckResult | null>(null);

  if (!activePet) return null;

  const sampleImages = [
    { label: 'Minor Skin Redness', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', notes: 'Mild redness and scratching on paw pad' },
    { label: 'Eye Cloudiness', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', notes: 'Squinting and slight discharge in right eye' },
    { label: 'Feather Molt Inspection', url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80', notes: 'Uneven feather loss on neck' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview && !symptomNotes.trim()) return;
    setLoading(true);
    try {
      const res = await analyzeSymptomPhoto(imagePreview || '', symptomNotes, activePet);
      setResult(res);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-500/20">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Photo Symptom Checker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            AI Visual Screening for <span className="font-bold text-emerald-600 dark:text-emerald-400">{activePet.name} ({activePet.species})</span>
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Upload Pet Symptom Photo
              </label>
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-3xl p-4 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-2xl border border-emerald-400 shadow-md"
                    />
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Photo attached (Tap to change)
                    </span>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Take photo or tap to browse
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Supports skin spots, eye redness, swelling, limping
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Preset Samples */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Or try a test case:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setImagePreview(s.url);
                      setSymptomNotes(s.notes);
                    }}
                    className="text-left p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-400 text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptom Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Describe Symptoms / Behavior
              </label>
              <textarea
                rows={2}
                required
                value={symptomNotes}
                onChange={e => setSymptomNotes(e.target.value)}
                placeholder="e.g. Started scratching ear 2 days ago, slight discharge, normal appetite otherwise..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!imagePreview && !symptomNotes.trim())}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Scanning with Vision AI...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Symptom Analysis</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Triage Badge */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                result.urgencyLevel === 'emergency'
                  ? 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
                  : result.urgencyLevel === 'urgent'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
              }`}
            >
              {result.urgencyLevel === 'emergency' ? (
                <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
              ) : result.urgencyLevel === 'urgent' ? (
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide">
                  Urgency: {result.urgencyLevel.toUpperCase()}
                </h4>
                <p className="text-xs mt-0.5 leading-relaxed font-medium">
                  {result.symptomSummary}
                </p>
              </div>
            </div>

            {/* Possible Causes */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Differential Possibilities to Discuss with Vet:
              </h5>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                {result.possibleCauses.map((cause, idx) => (
                  <li key={idx}>{cause}</li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Recommended Next Actions:
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-slate-400 text-center italic">
              {result.disclaimer}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setResult(null)}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                Check Another
              </button>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('vet');
                }}
                className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Locate Recommended Clinic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};