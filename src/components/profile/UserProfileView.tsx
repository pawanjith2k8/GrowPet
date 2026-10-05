import React, { useState } from 'react';
import { useAuth, getCurrencyForLocation } from '../../context/AuthContext';
import { usePet } from '../../context/PetContext';
import { PetProfileDetails } from '../pet-profile/PetProfileDetails';
import { LogOut, MapPin, Heart, Globe, Check } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { pets, openAddPet } = usePet();
  const [locationInput, setLocationInput] = useState(user?.location || 'India');

  const popularLocations = [
    { label: '🇮🇳 India (Flipkart, Supertails, Blinkit, Amazon IN - ₹)', value: 'India' },
    { label: '🇺🇸 United States (Chewy, Petco, PetSmart, Amazon US - $)', value: 'United States' },
    { label: '🇬🇧 United Kingdom (Pets at Home, Amazon UK - £)', value: 'United Kingdom' },
    { label: '🇨🇦 Canada (Pet Valu, Amazon CA - CA$)', value: 'Canada' },
    { label: '🇦🇺 Australia (Pet Circle, Amazon AU - AU$)', value: 'Australia' },
    { label: '🇪🇺 Europe / Germany (Zooplus, Amazon EU - €)', value: 'Germany' }
  ];

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLoc = locationInput.trim();
    if (!cleanLoc) return;
    const curr = getCurrencyForLocation(cleanLoc);
    updateUserProfile({
      location: cleanLoc,
      preferredCurrency: curr
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

        {/* Location & Region Settings Card */}
        <form onSubmit={handleSaveLocation} className="space-y-4 bg-emerald-50/50 dark:bg-slate-900/60 p-5 rounded-3xl border border-emerald-200/80 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Location & Country Preferences
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current: <strong className="text-emerald-700 dark:text-emerald-400">{user?.location || 'India'}</strong> (Currency: {user?.preferredCurrency || '₹'})
                </p>
              </div>
            </div>
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400 hidden sm:block" />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Multi-store price matching (Amazon, Flipkart, Chewy, Supertails, Blinkit) and nearby AI vet hospital dispatch automatically customize based on your home country and region.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Country / Region
              </label>
              <select
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {popularLocations.map(loc => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Update Location</span>
              </button>
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