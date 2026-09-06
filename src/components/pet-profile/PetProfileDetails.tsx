import React, { useState, useRef } from 'react';
import { usePet } from '../../context/PetContext';
import { Edit2, Trash2, Calendar, Scale, Sparkles, Award, Camera, Upload, Check } from 'lucide-react';
import { PET_AVATAR_PRESETS, getSmartPetPhoto } from '../../utils/petPhotoHelper';

export const PetProfileDetails: React.FC = () => {
  const { activePet, updatePet, deletePet, pets } = usePet();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(activePet?.name || '');
  const [species, setSpecies] = useState(activePet?.species || '');
  const [breed, setBreed] = useState(activePet?.breed || '');
  const [weightKg, setWeightKg] = useState(activePet?.weightKg || 0);
  const [bio, setBio] = useState(activePet?.bio || '');
  const [photoUrl, setPhotoUrl] = useState(activePet?.photoUrl || '');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!activePet) return null;

  const handleOpenEdit = () => {
    setName(activePet.name);
    setSpecies(activePet.species);
    setBreed(activePet.breed || '');
    setWeightKg(activePet.weightKg);
    setBio(activePet.bio || '');
    setPhotoUrl(activePet.photoUrl);
    setIsEditing(true);
    setShowPhotoPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newUrl = reader.result;
        setPhotoUrl(newUrl);
        updatePet(activePet.id, { photoUrl: newUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    setPhotoUrl(url);
    updatePet(activePet.id, { photoUrl: url });
    setShowPhotoPicker(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePet(activePet.id, {
      name: name.trim(),
      species: species.trim(),
      breed: breed.trim() || undefined,
      weightKg: Number(weightKg),
      photoUrl: photoUrl.trim() || activePet.photoUrl,
      bio: bio.trim()
    });
    setIsEditing(false);
    setShowPhotoPicker(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => setShowPhotoPicker(p => !p)}>
            <img
              src={activePet.photoUrl}
              alt={activePet.name}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-emerald-400 shadow-md transition-transform group-hover:scale-105"
            />
            <button
              type="button"
              className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span>Change</span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{activePet.name}</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full capitalize">
                {activePet.species}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {activePet.breed ? `${activePet.breed} • ` : ''}Category: {activePet.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPhotoPicker(p => !p)}
            className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Change Photo</span>
          </button>

          <button
            onClick={isEditing ? () => setIsEditing(false) : handleOpenEdit}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>

          {pets.length > 1 && (
            <button
              onClick={() => {
                if (confirm(`Remove profile for ${activePet.name}?`)) {
                  deletePet(activePet.id);
                }
              }}
              className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Instant Quick Photo / Avatar Picker Panel */}
      {showPhotoPicker && (
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-900/60 border border-emerald-200 dark:border-slate-700 animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Choose Avatar or Upload Real Photo for {activePet.name}
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-300 dark:border-slate-700 shadow-sm hover:bg-emerald-50 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PET_AVATAR_PRESETS.map(preset => {
              const isChosen = activePet.photoUrl === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`flex-shrink-0 flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                    isChosen
                      ? 'border-emerald-500 bg-white dark:bg-slate-800 ring-2 ring-emerald-500/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:border-emerald-400'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-12 h-12 rounded-lg object-cover" />
                  <span className="text-[10px] text-slate-700 dark:text-slate-300 mt-1 font-semibold whitespace-nowrap px-1">
                    {preset.emoji} {preset.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Pet Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Species / Animal Type</label>
              <input
                type="text"
                value={species}
                onChange={e => setSpecies(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Breed / Morph</label>
              <input
                type="text"
                value={breed}
                onChange={e => setBreed(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.001"
                value={weightKg}
                onChange={e => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Photo URL</label>
            <input
              type="url"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Personality Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Age</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {activePet.ageYears}y {activePet.ageMonths}m
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>Weight</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {activePet.weightKg >= 1 ? `${activePet.weightKg} kg` : `${Math.round(activePet.weightKg * 1000)} g`}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Happiness</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {activePet.moodScore} / 100
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Award className="w-3.5 h-3.5 text-rose-600" />
              <span>Care Streak</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {activePet.streakDays} Days 🔥
            </p>
          </div>
        </div>
      )}

      {activePet.bio && (
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40">
          <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1">
            Personality & Favorite Treats
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {activePet.bio}
          </p>
        </div>
      )}
    </div>
  );
};