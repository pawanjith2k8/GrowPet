import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Heart, Mail, ShieldCheck, ArrowRight, Shield, Stethoscope, Activity, MapPin } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('India');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const popularLocations = [
    { label: '🇮🇳 India', value: 'India' },
    { label: '🇺🇸 United States', value: 'United States' },
    { label: '🇬🇧 United Kingdom', value: 'United Kingdom' },
    { label: '🇨🇦 Canada', value: 'Canada' },
    { label: '🇦🇺 Australia', value: 'Australia' },
    { label: '🇪🇺 Europe', value: 'Germany' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithEmail(email, undefined, location);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error signing in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Top Brand Pill */}
      <div className="pt-6 sm:pt-10 flex items-center gap-2.5 z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/25">
          <Heart className="w-5 h-5 fill-slate-950 stroke-slate-950" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
            SmartCare AI
          </span>
          <span className="ml-2 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full">
            All-in-One Pet Care
          </span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl shadow-black/80 relative z-10 animate-fade-in my-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome to GrowPet
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1.5">
            Sign in to access personalized pet care, 24/7 AI vet triage, and local store price matching.
          </p>
        </div>

        {/* Location Selection Component */}
        <div className="mb-5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Select Your Country / Location</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Price matching stores (Amazon, Flipkart, Chewy, Supertails) and nearby vet dispatch adapt to your location.
          </p>
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {popularLocations.map(loc => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Google SSO */}
        <button
          type="button"
          onClick={() => loginWithGoogle(location)}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs transition-all shadow-md active:scale-[0.99] mb-4"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-4 h-4"
          />
          <span>Sign In with Google</span>
        </button>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            or enter your email
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Continue with Email</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Guest Mode */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => loginAsGuest(location)}
            className="text-xs text-slate-400 hover:text-emerald-400 font-bold flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Try as Guest ({location})</span>
          </button>
        </div>
      </div>

      {/* Feature Badges Footer */}
      <div className="pb-4 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs font-semibold z-10">
        <span className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-500" />
          Firebase Auth Encrypted
        </span>
        <span className="flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-emerald-500" />
          SmartCare AI Multimodal Ready
        </span>
        <span className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-emerald-500" />
          Country-based Price & Store Matching
        </span>
      </div>
    </div>
  );
};