import React from 'react';
import { VetClinic } from '../../types';
import { MapPin, Phone, ExternalLink, AlertTriangle } from 'lucide-react';

interface VetMapViewProps {
  vets: VetClinic[];
}

export const VetMapView: React.FC<VetMapViewProps> = ({ vets }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
            Interactive Clinic Locator Map
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Visual pinpoints of {vets.length} nearby veterinary practices
          </p>
        </div>
      </div>

      {/* Visual Map Canvas / Interactive Overlay */}
      <div className="relative w-full h-80 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center p-4">
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Centered User Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-600 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center text-white animate-bounce">
            <span className="text-xs">🐾</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-white font-bold text-[10px] shadow mt-1 whitespace-nowrap">
            Your Location
          </span>
        </div>

        {/* Surrounding Vet Pins */}
        {vets.map((v, i) => {
          const positions = [
            { top: '25%', left: '30%' },
            { top: '30%', left: '75%' },
            { top: '70%', left: '25%' },
            { top: '75%', left: '70%' },
            { top: '20%', left: '55%' },
            { top: '80%', left: '45%' },
          ];
          const pos = positions[i % positions.length];

          return (
            <div
              key={v.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            >
              <div
                className={`p-2 rounded-2xl shadow-lg border flex items-center gap-1.5 transition-transform group-hover:scale-110 ${
                  v.isEmergency247
                    ? 'bg-rose-600 text-white border-white'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-emerald-500'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-[11px] font-bold truncate max-w-[120px]">
                  {v.name.split(' ')[0]} ({v.distanceKm}km)
                </span>
              </div>

              {/* Hover Card */}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 z-30 pointer-events-auto">
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{v.name}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{v.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={`tel:${v.phone}`}
                    className="flex-1 py-1 px-2 rounded-xl bg-emerald-600 text-white text-[10px] font-bold text-center"
                  >
                    Call
                  </a>
                  {v.website && (
                    <a
                      href={v.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1 px-2 rounded-xl border border-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-bold text-center"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};