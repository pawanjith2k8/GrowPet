import React, { useState, useRef } from 'react';
import { usePet } from '../../context/PetContext';
import { SpeciesCategory } from '../../types';
import { X, Sparkles, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { PET_AVATAR_PRESETS, getSmartPetPhoto } from '../../utils/petPhotoHelper';

export const AddPetModal: React.FC = () => {
  const { isAddPetOpen, closeAddPet, addPet } = usePet();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [category, setCategory] = useState<SpeciesCategory>('mammal');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState(1);
  const [ageMonths, setAgeMonths] = useState(0);
  const [weightKg, setWeightKg] = useState(4.0);
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [userSelectedCustomPhoto, setUserSelectedCustomPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isAddPetOpen) return null;

  const currentEffectivePhoto = photoUrl || getSmartPetPhoto(species, breed, category);

  const handleSpeciesChange = (text: string) => {
    setSpecies(text);
    const low = text.toLowerCase();

    // Auto-select category if obvious
    let newCat = category;
    if (low.includes('cat') || low.includes('dog') || low.includes('rabbit') || low.includes('hamster') || low.includes('puppy') || low.includes('kitten')) {
      newCat = 'mammal';
    } else if (low.includes('bird') || low.includes('parrot') || low.includes('canary') || low.includes('budgie') || low.includes('cockatiel')) {
      newCat = 'bird';
    } else if (low.includes('fish') || low.includes('betta') || low.includes('goldfish') || low.includes('aquarium')) {
      newCat = 'aquatic';
    } else if (low.includes('gecko') || low.includes('dragon') || low.includes('snake') || low.includes('lizard') || low.includes('turtle')) {
      newCat = 'reptile';
    } else if (low.includes('frog') || low.includes('axolotl') || low.includes('toad')) {
      newCat = 'amphibian';
    }
    setCategory(newCat);

    // Auto update photo if user hasn't explicitly picked a custom one
    if (!userSelectedCustomPhoto) {
      setPhotoUrl(getSmartPetPhoto(text, breed, newCat));
    }
  };

  const handleBreedChange = (text: string) => {
    setBreed(text);
    if (!userSelectedCustomPhoto) {
      setPhotoUrl(getSmartPetPhoto(species, text, category));
    }
  };

  const handleCategoryChange = (cat: SpeciesCategory) => {
    setCategory(cat);
    if (!userSelectedCustomPhoto) {
      setPhotoUrl(getSmartPetPhoto(species, breed, cat));
    }
  };

  const handleAvatarSelect = (url: string) => {
    setPhotoUrl(url);
    setUserSelectedCustomPhoto(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read as Base64
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        setUserSelectedCustomPhoto(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !species.trim()) return;

    addPet({
      name: name.trim(),
      species: species.trim(),
      category,
      breed: breed.trim() || undefined,
      ageYears: Number(ageYears) || 0,
      ageMonths: Number(ageMonths) || 0,
      weightKg: Number(weightKg) || 1,
      photoUrl: currentEffectivePhoto,
      bio: bio.trim() || (`Beloved ${species}`)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative my-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={closeAddPet}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Add New Pet Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cats, dogs, birds, aquatic, reptiles & small pets — unlimited profiles
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Preview & Quick Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <img
                  src={currentEffectivePhoto}
                  alt="Pet Preview"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md bg-slate-200"
                />
                <span className="absolute -bottom-1 -right-1 text-xs bg-emerald-600 text-white rounded-full p-0.5 shadow">
                  <Check className="w-3 h-3" />
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Profile Photo
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Auto-adapts to your animal type (Cat, Dog, Bird, etc.) or choose an avatar below.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload Photo</span>
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
            </div>

            {/* Quick Avatar Presets Grid */}
            <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-2.5">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">
                Quick Avatars:
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {PET_AVATAR_PRESETS.map(preset => {
                  const isChosen = currentEffectivePhoto === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleAvatarSelect(preset.url)}
                      title={preset.name}
                      className={`flex-shrink-0 flex flex-col items-center p-1 rounded-xl border transition-all ${
                        isChosen
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 font-medium whitespace-nowrap px-1">
                        {preset.emoji} {preset.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Species Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Species Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'mammal', label: 'Mammal', icon: '🐾' },
                { id: 'bird', label: 'Bird', icon: '🪶' },
                { id: 'aquatic', label: 'Aquatic', icon: '🫧' },
                { id: 'reptile', label: 'Reptile', icon: '🦎' },
                { id: 'amphibian', label: 'Amphibian', icon: '🐸' },
                { id: 'other', label: 'Other', icon: '✨' },
              ].map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id as SpeciesCategory)}
                  className={`flex flex-col items-center py-2 px-1 rounded-2xl border text-center transition-all ${
                    category === cat.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-[10px] mt-1 capitalize">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pet Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Luna, Milo, Bella"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Species / Animal Type *
              </label>
              <input
                type="text"
                required
                value={species}
                onChange={e => handleSpeciesChange(e.target.value)}
                placeholder="e.g. Cat, Dog, Parrot, Rabbit..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Breed / Morph (Optional)
              </label>
              <input
                type="text"
                value={breed}
                onChange={e => handleBreedChange(e.target.value)}
                placeholder="e.g. Persian, Tabby, Golden"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Age (Years)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={ageYears}
                onChange={e => setAgeYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={weightKg}
                onChange={e => setWeightKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Image URL (Optional)
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={e => {
                setPhotoUrl(e.target.value);
                setUserSelectedCustomPhoto(true);
              }}
              placeholder="Paste any web image URL or leave empty for auto-stock"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Favorite Treats & Personality Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Loves tuna treats, sunny window perches, cardboard boxes, and afternoon naps..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
          >
            Save & Generate Species Care Plan 🐾
          </button>
        </form>
      </div>
    </div>
  );
};