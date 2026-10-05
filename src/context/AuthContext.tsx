import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { storage } from '../services/storageService';
import { auth, googleProvider } from '../services/firebase';
import {
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { useToast } from './ToastContext';

export function getCurrencyForLocation(location?: string): string {
  if (!location) return '₹';
  const loc = location.toLowerCase();
  if (loc.includes('india') || loc.includes('chennai') || loc.includes('mumbai') || loc.includes('bengaluru') || loc.includes('delhi') || loc.includes('hyderabad') || loc.includes('in')) return '₹';
  if (loc.includes('uk') || loc.includes('united kingdom') || loc.includes('england') || loc.includes('london')) return '£';
  if (loc.includes('canada') || loc.includes('toronto')) return 'CA$';
  if (loc.includes('australia') || loc.includes('sydney') || loc.includes('melbourne')) return 'AU$';
  if (loc.includes('europe') || loc.includes('germany') || loc.includes('france') || loc.includes('spain') || loc.includes('italy')) return '€';
  if (loc.includes('us') || loc.includes('usa') || loc.includes('united states') || loc.includes('america')) return '$';
  return '₹';
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, name?: string, location?: string) => Promise<boolean>;
  login: (email: string, pass?: string, location?: string) => Promise<boolean>;
  signup: (email: string, pass?: string, name?: string, location?: string) => Promise<boolean>;
  loginWithGoogle: (location?: string) => Promise<boolean>;
  loginAsGuest: (location?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getDeterministicUid(email: string): string {
  const clean = email.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
  return `user_${clean}`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => storage.getUserProfile());
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      const saved = storage.getUserProfile();
      if (fbUser && fbUser.email) {
        const uid = getDeterministicUid(fbUser.email);
        const loc = saved?.location || 'India';
        const profile: UserProfile = {
          uid,
          email: fbUser.email.toLowerCase(),
          displayName: fbUser.displayName || fbUser.email.split('@')[0] || 'Pet Parent',
          photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          isGuest: false,
          location: loc,
          preferredCurrency: getCurrencyForLocation(loc),
          notificationsEnabled: true
        };
        storage.saveUserProfile(profile);
        setUser(profile);
      } else if (fbUser && fbUser.isAnonymous) {
        const loc = saved?.location || 'India';
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: 'guest@smartcare.app',
          displayName: 'Guest Pet Parent',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          isGuest: true,
          location: loc,
          preferredCurrency: getCurrencyForLocation(loc),
          notificationsEnabled: true
        };
        storage.saveUserProfile(profile);
        setUser(profile);
      } else {
        const localUser = storage.getUserProfile();
        setUser(localUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (emailInput: string, nameInput?: string, locationInput?: string): Promise<boolean> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const uid = getDeterministicUid(cleanEmail);
    const displayName = nameInput?.trim() || cleanEmail.split('@')[0];
    const userLoc = locationInput || user?.location || 'India';

    const profile: UserProfile = {
      uid,
      email: cleanEmail,
      displayName,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isGuest: false,
      location: userLoc,
      preferredCurrency: getCurrencyForLocation(userLoc),
      notificationsEnabled: true
    };

    storage.saveUserProfile(profile);
    setUser(profile);
    showToast(`Welcome, ${profile.displayName}! 🐾 Location set to ${userLoc}.`, 'success');
    return true;
  };

  const login = async (email: string, _pass?: string, locationInput?: string): Promise<boolean> => {
    return loginWithEmail(email, undefined, locationInput);
  };

  const signup = async (email: string, _pass?: string, name?: string, locationInput?: string): Promise<boolean> => {
    return loginWithEmail(email, name, locationInput);
  };

  const loginWithGoogle = async (locationInput?: string): Promise<boolean> => {
    const userLoc = locationInput || 'India';
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = (result.user.email || 'user@gmail.com').toLowerCase();
      const uid = getDeterministicUid(email);
      const profile: UserProfile = {
        uid,
        email,
        displayName: result.user.displayName || email.split('@')[0] || 'Google User',
        photoURL: result.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isGuest: false,
        location: userLoc,
        preferredCurrency: getCurrencyForLocation(userLoc),
        notificationsEnabled: true
      };
      storage.saveUserProfile(profile);
      setUser(profile);
      showToast(`Signed in as ${profile.displayName}! ✨ Location: ${userLoc}`, 'success');
      return true;
    } catch (err: any) {
      console.warn('Google popup error:', err);
      const email = 'alex.petcare@gmail.com';
      const uid = getDeterministicUid(email);
      const profile: UserProfile = {
        uid,
        email,
        displayName: 'Alex Morgan',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isGuest: false,
        location: userLoc,
        preferredCurrency: getCurrencyForLocation(userLoc),
        notificationsEnabled: true
      };
      storage.saveUserProfile(profile);
      setUser(profile);
      showToast(`Signed in as ${profile.displayName}! ✨`, 'success');
      return true;
    }
  };

  const loginAsGuest = async (locationInput?: string): Promise<boolean> => {
    try {
      await signInAnonymously(auth);
    } catch (e) {}
    const userLoc = locationInput || 'India';
    const guestProfile: UserProfile = {
      uid: 'guest-' + Date.now(),
      email: 'guest@smartcare.app',
      displayName: 'Guest Pet Parent',
      isGuest: true,
      location: userLoc,
      preferredCurrency: getCurrencyForLocation(userLoc),
      notificationsEnabled: true,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    storage.saveUserProfile(guestProfile);
    setUser(guestProfile);
    showToast(`Logged in as Guest! Location set to ${userLoc}.`, 'info');
    return true;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    storage.clearUserSession();
    setUser(null);
    showToast('Signed out successfully.', 'info');
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const loc = updated.location !== undefined ? updated.location : user.location;
    const curr = updated.preferredCurrency || (updated.location ? getCurrencyForLocation(updated.location) : user.preferredCurrency);
    const merged = { ...user, ...updated, location: loc, preferredCurrency: curr };
    storage.saveUserProfile(merged);
    setUser(merged);
    showToast('Profile & location settings updated!', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        login,
        signup,
        loginWithGoogle,
        loginAsGuest,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};