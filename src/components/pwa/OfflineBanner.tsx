import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export const OfflineBanner: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (!isOnline) {
    return (
      <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md animate-fade-in">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>You are currently offline. GrowPet is running from cache. Cloud sync and AI features require an internet connection.</span>
      </div>
    );
  }

  if (wasOffline) {
    return (
      <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md animate-fade-in">
        <Wifi className="w-4 h-4 shrink-0" />
        <span>Internet reconnected! Cloud synchronization is active.</span>
      </div>
    );
  }

  return null;
};
