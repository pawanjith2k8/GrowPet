import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePet } from '../../context/PetContext';
import { PetProfileDetails } from '../pet-profile/PetProfileDetails';
import { storage } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { User, Key, Bell, RefreshCw, LogOut, ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { pets, openAddPet } = usePet();
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState(user?.aiApiKey || '');
  const [provider, setProvider] = useState<'gemini' | 'anthropic' | 'openai' | 'mock'>(user?.aiProvider || 'gemini');

  const handleSaveApi = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      aiApiKey: apiKey.trim(),
      aiProvider: provider
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Active Pet Profile Card */}
      <PetProfileDetails />

      {/* User Account & Settings Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3.5">
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt="User"
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
                  {user?.displayName || 'Pet Parent'}
                </h3>
                {user?.isGuest && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-md">
                    Guest Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email} • {pets.length} Registered Pets
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-2xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* AI Key & Cloud Config */}
        <form onSubmit={handleSaveApi} className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Optional AI Assistant API Key
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            By default, Smart Care uses our high-speed veterinary intelligence model with emergency triaging. You can optionally connect your own Gemini or OpenAI API key here.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Provider</label>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="mock">Built-in Smart Model (Default)</option>
                <option value="gemini">Google Gemini (1.5 Flash)</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="openai">OpenAI GPT-4o</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">API Key (Stored locally)</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="AIzaSy... or sk-..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Pet Management Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={openAddPet}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all hover:scale-105 shadow-sm"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Add Another Pet</span>
          </button>
        </div>
      </div>
    </div>
  );
};