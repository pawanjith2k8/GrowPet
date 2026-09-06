import React, { useState, useEffect, useMemo } from 'react';
import { usePet } from '../../context/PetContext';
import { VetClinic } from '../../types';
import { getSortedVets, getUserCoordinates, searchLocationByCity, fetchLiveNearbyVets } from '../../services/vetService';
import { VetCard } from './VetCard';
import { VetMapView } from './VetMapView';
import { MapPin, Navigation, List, Map, AlertTriangle, ShieldCheck, Clock, Search, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const VetLocatorView: React.FC = () => {
  const { activePet } = usePet();
  const { showToast } = useToast();
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; locationName?: string } | null>(null);
  const [allClinics, setAllClinics] = useState<VetClinic[]>([]);
  const [locating, setLocating] = useState(false);
  const [loadingVets, setLoadingVets] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterEmergency, setFilterEmergency] = useState(false);
  const [filterSpeciesMatch, setFilterSpeciesMatch] = useState(false);
  const [filterOpenNow, setFilterOpenNow] = useState(false);

  // Initial load
  useEffect(() => {
    handleGetLocation(false);
  }, []);

  const handleGetLocation = async (userInitiated = true) => {
    setLocating(true);
    setLoadingVets(true);
    try {
      const coords = await getUserCoordinates();
      if (coords) {
        setUserCoords(coords);
        const clinics = await fetchLiveNearbyVets(coords.lat, coords.lng, coords.locationName || 'Your City');
        setAllClinics(clinics);
        if (userInitiated) {
          showToast(`📍 Found ${clinics.length} veterinary hospitals near ${coords.locationName || 'your GPS location'}!`, 'success');
        }
      } else {
        // Fallback default coordinates (e.g. user area)
        const fallbackLat = 37.7749;
        const fallbackLng = -122.4194;
        setUserCoords({ lat: fallbackLat, lng: fallbackLng, locationName: 'Local Area' });
        const clinics = await fetchLiveNearbyVets(fallbackLat, fallbackLng, 'Local Area');
        setAllClinics(clinics);
        if (userInitiated) {
          showToast('GPS permission required. Showing regional veterinary centers.', 'info');
        }
      }
    } catch (e) {
      console.warn('Vet locator load warning:', e);
    } finally {
      setLocating(false);
      setLoadingVets(false);
    }
  };

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoadingVets(true);
    try {
      const location = await searchLocationByCity(searchQuery.trim());
      if (location) {
        setUserCoords(location);
        const clinics = await fetchLiveNearbyVets(location.lat, location.lng, location.locationName);
        setAllClinics(clinics);
        showToast(`📍 Found ${clinics.length} clinics near ${location.locationName}!`, 'success');
      } else {
        showToast(`Could not find "${searchQuery}". Please check the spelling or postal code.`, 'warning');
      }
    } catch (err) {
      showToast('Search failed. Please try again.', 'error');
    } finally {
      setLoadingVets(false);
    }
  };

  const filteredVets = useMemo(() => {
    return getSortedVets(
      allClinics,
      activePet?.category,
      filterEmergency,
      filterOpenNow,
      filterSpeciesMatch
    );
  }, [allClinics, activePet?.category, filterEmergency, filterOpenNow, filterSpeciesMatch]);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-14 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Nearby Veterinary Hospitals
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              GPS & Live OpenStreetMap
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {userCoords?.locationName ? `Clinics near ${userCoords.locationName}` : 'Find 24/7 emergency & species specialist vet care near you'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleGetLocation(true)}
            disabled={locating || loadingVets}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-60"
          >
            {locating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span>{locating ? 'Locating GPS...' : 'Use My GPS'}</span>
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xl transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-xl transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* City Search Bar & Google Maps Direct Button */}
      <div className="space-y-2">
        <form onSubmit={handleCitySearch} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by city, town or zip code (e.g. Dallas, TX or Chennai)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loadingVets}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            {loadingVets ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
        </form>

        {/* Quick City Shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Popular cities:</span>
          {['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'New York', 'London', 'Dallas'].map(city => (
            <button
              key={city}
              type="button"
              onClick={async () => {
                setSearchQuery(city);
                setLoadingVets(true);
                try {
                  const location = await searchLocationByCity(city);
                  if (location) {
                    setUserCoords(location);
                    const clinics = await fetchLiveNearbyVets(location.lat, location.lng, location.locationName);
                    setAllClinics(clinics);
                    showToast(`📍 Showing hospitals in ${location.locationName}!`, 'success');
                  }
                } catch (e) {}
                setLoadingVets(false);
              }}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 text-[11px] font-semibold whitespace-nowrap transition-colors"
            >
              {city}
            </button>
          ))}
        </div>

        {/* Live Google Maps launch card */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 truncate">
              Location: <span className="underline">{userCoords?.locationName || 'Detecting Area...'}</span>
            </span>
          </div>
          <a
            href={
              userCoords
                ? `https://www.google.com/maps/search/veterinary+hospitals+in+${encodeURIComponent(userCoords.locationName || '')}`
                : 'https://www.google.com/maps/search/veterinary+hospital+near+me'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 flex items-center gap-1 bg-white dark:bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-xs flex-shrink-0"
          >
            <span>Open in Google Maps</span>
            <Navigation className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <button
          onClick={() => {
            setFilterEmergency(false);
            setFilterSpeciesMatch(false);
            setFilterOpenNow(false);
          }}
          className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            !filterEmergency && !filterSpeciesMatch && !filterOpenNow
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All Clinics ({filteredVets.length})
        </button>

        <button
          onClick={() => setFilterEmergency(e => !e)}
          className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            filterEmergency
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>24/7 Emergency Only</span>
        </button>

        <button
          onClick={() => setFilterSpeciesMatch(s => !s)}
          className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            filterSpeciesMatch
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{activePet?.species || 'Species'} Specialists</span>
        </button>

        <button
          onClick={() => setFilterOpenNow(o => !o)}
          className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            filterOpenNow
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Open Now</span>
        </button>
      </div>

      {/* Loading state */}
      {loadingVets ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Querying live OpenStreetMap veterinary registries...
          </p>
        </div>
      ) : filteredVets.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-3">
          <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No clinics found matching the selected filter criteria in this area.
          </p>
          <button
            onClick={() => {
              setFilterEmergency(false);
              setFilterSpeciesMatch(false);
              setFilterOpenNow(false);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Show All Nearby Clinics
          </button>
        </div>
      ) : viewMode === 'map' ? (
        <VetMapView vets={filteredVets} />
      ) : (
        <div className="space-y-3.5">
          {filteredVets.map(vet => (
            <VetCard key={vet.id} vet={vet} />
          ))}
        </div>
      )}
    </div>
  );
};