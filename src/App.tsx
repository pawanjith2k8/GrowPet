import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PetProvider, usePet } from './context/PetContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { PetSelector } from './components/layout/PetSelector';
import { MoodScoreWidget } from './components/dashboard/MoodScoreWidget';
import { QuickActions } from './components/dashboard/QuickActions';
import { DailyChecklist } from './components/dashboard/DailyChecklist';
import { UpcomingReminders } from './components/dashboard/UpcomingReminders';
import { NoPetsOnboarding } from './components/dashboard/NoPetsOnboarding';
import { AIChatView } from './components/ai-assistant/AIChatView';
import { HealthTrackerView } from './components/health/HealthTrackerView';
import { ShoppingView } from './components/shopping/ShoppingView';
import { VetLocatorView } from './components/vet-locator/VetLocatorView';
import { UserProfileView } from './components/profile/UserProfileView';
import { AddPetModal } from './components/pet-profile/AddPetModal';

const MainAppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { activeTab, pets, activePet } = usePet();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 animate-pulse flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-500/30 mb-4">
          🐾
        </div>
        <p className="text-sm text-emerald-200 font-bold animate-pulse">
          Starting Smart Care for Happy Pets...
        </p>
      </div>
    );
  }

  // If not authenticated, open Login page first!
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 space-y-5 pb-24">
        {/* Horizontal Quick Pet Selector if user has pets */}
        {pets.length > 0 && <PetSelector />}

        {/* Views */}
        {activeTab === 'home' && (
          pets.length === 0 ? (
            <NoPetsOnboarding />
          ) : (
            <div className="space-y-5 animate-fade-in">
              <MoodScoreWidget />
              <QuickActions />
              <DailyChecklist />
              <UpcomingReminders />
            </div>
          )
        )}

        {activeTab === 'chat' && (
          pets.length === 0 ? (
            <NoPetsOnboarding />
          ) : (
            <AIChatView />
          )
        )}

        {activeTab === 'health' && (
          pets.length === 0 ? (
            <NoPetsOnboarding />
          ) : (
            <HealthTrackerView />
          )
        )}

        {activeTab === 'shop' && <ShoppingView />}
        {activeTab === 'vet' && <VetLocatorView />}
        {activeTab === 'profile' && <UserProfileView />}
      </main>

      <BottomNav />
      <AddPetModal />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PetProvider>
          <MainAppContent />
        </PetProvider>
      </AuthProvider>
    </ToastProvider>
  );
}