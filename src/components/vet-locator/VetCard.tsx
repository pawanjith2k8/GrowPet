import React from 'react';
import { VetClinic } from '../../types';
import { usePet } from '../../context/PetContext';
import { isSpeciesMatch } from '../../services/vetService';
import { Phone, ExternalLink, MapPin, Clock, Star, AlertTriangle, ShieldCheck } from 'lucide-react';

interface VetCardProps {
  vet: VetClinic;
}

export const VetCard: React.FC<VetCardProps> = ({ vet }) => {
  const { activePet } = usePet();
  const matchesSpecies = isSpeciesMatch(vet, activePet?.category);

  return (
    <div className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 shadow-subtle ${
      vet.isEmergency247
        ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
        : matchesSpecies
        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 hover:border-emerald-500'
        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
    }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {vet.isEmergency247 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                24/7 Emergency Hospital
              </span>
            )}

            {matchesSpecies && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Specialty Matched ({activePet?.species})
              </span>
            )}

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              vet.isOpenNow
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
            >
              {vet.isOpenNow ? '• Open Now' : 'Closed'}
            </span>
          </div>

          <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug tracking-tight">
            {vet.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{vet.rating}</span>
              <span className="text-slate-400 font-normal">({vet.reviewCount})</span>
            </div>
            <span>•</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {vet.distanceKm} km away
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {vet.phone ? (
            <a
              href={`tel:${vet.phone}`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          ) : null}

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${vet.latitude},${vet.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-sm transition-transform active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span>Directions</span>
          </a>

          {vet.website && vet.website.startsWith('http') ? (
            <a
              href={vet.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              <span>Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : null}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{vet.address}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>{vet.hours}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        {vet.specialties.map((spec, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold"
          >
            {spec}
          </span>
        ))}
      </div>
    </div>
  );
};