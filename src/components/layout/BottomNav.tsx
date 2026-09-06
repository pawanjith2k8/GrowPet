import React from 'react';
import { usePet } from '../../context/PetContext';
import { Home, MessageSquareQuote, ShoppingBag, MapPin, Activity } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = usePet();

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'AI Vet', icon: MessageSquareQuote, badge: 'AI' },
    { id: 'health', label: 'Health Hub', icon: Activity },
    { id: 'shop', label: 'Price Match', icon: ShoppingBag },
    { id: 'vet', label: 'Vet Locator', icon: MapPin },
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 shadow-2xl shadow-black/60 rounded-3xl p-1.5 pointer-events-auto flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 bg-white/10 font-bold scale-105'
                  : 'text-slate-400 hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1.2 py-0.2 bg-gradient-to-r from-amber-400 to-rose-500 text-[8px] font-black text-slate-950 rounded-full leading-none shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};