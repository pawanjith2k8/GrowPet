import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Heart, Sparkles, Mail, Lock, User, ShieldCheck, ArrowRight, CheckCircle2, Shield, Eye, EyeOff, Activity, Stethoscope } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithEmail(email);
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
            Sign In with Your Email
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1.5">
            No password needed. Enter your email to immediately access all your pets and health logs.
          </p>
        </div>

        {/* Google SSO */}
        <button
          type="button"
          onClick={loginWithGoogle}
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
            onClick={loginAsGuest}
            className="text-xs text-slate-400 hover:text-emerald-400 font-bold flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Try as Guest (Instant Access)</span>
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
          Gemini AI Multimodal Ready
        </span>
        <span className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-emerald-500" />
          Real-time Price & Delivery Tracking
        </span>
      </div>
    </div>
  );
};