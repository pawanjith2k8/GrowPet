import React, { useState, useRef, useEffect } from 'react';
import { usePet } from '../../context/PetContext';
import { useAuth } from '../../context/AuthContext';
import { askPetAssistant } from '../../services/aiService';
import { EmergencyAlertBanner } from './EmergencyAlertBanner';
import { PhotoSymptomCheckerModal } from './PhotoSymptomCheckerModal';
import { Send, Camera, Sparkles, RefreshCw, Bot, User, PhoneCall, Shield, Stethoscope, AlertTriangle } from 'lucide-react';

export const AIChatView: React.FC = () => {
  const { activePet, chatMessages, addChatMessage, setActiveTab } = usePet();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [hasEmergency, setHasEmergency] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, loading]);

  if (!activePet) return null;

  const quickPrompts: Record<string, string[]> = {
    mammal: [
      'Optimal daily food calorie amount',
      'Safe fruits & vegetables list',
      'Why is my pet scratching its ears?',
      'Flea & tick preventative schedule'
    ],
    bird: [
      'Safe vegetables & superfoods list',
      'Airborne toxins to avoid (Teflon)',
      'Molting care and feather nutrition',
      'Enrichment toys for vocalization'
    ],
    aquatic: [
      'Ideal water temperature & pH',
      'Water change routine with Prime',
      'Signs of fin rot vs normal growth',
      'Best live plants for low current tank'
    ],
    reptile: [
      'Basking surface temperature check',
      'Calcium + D3 dusting schedule',
      'Safe feeder insects and gut loading',
      'Preventing Metabolic Bone Disease (MBD)'
    ],
    other: [
      'Daily species care guidelines',
      'Habitat cleaning schedule',
      'Signs of subtle lethargy or illness'
    ]
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || loading) return;

    setInputText('');
    addChatMessage({
      sender: 'user',
      text: prompt
    });

    setLoading(true);
    try {
      const res = await askPetAssistant(
        prompt,
        activePet,
        chatMessages,
        user?.aiApiKey,
        user?.aiProvider || 'gemini'
      );

      if (res.isEmergency) {
        setHasEmergency(true);
      }

      addChatMessage({
        sender: res.isEmergency ? 'emergency' : 'assistant',
        text: res.text,
        isEmergency: res.isEmergency,
        emergencyActionUrl: res.emergencyActionUrl,
        symptomCheckResult: res.symptomCheckResult
      });
    } finally {
      setLoading(false);
    }
  };

  const currentChips = quickPrompts[activePet.category] || quickPrompts.other;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden relative">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activePet.photoUrl}
              alt={activePet.name}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-400"
            />
            <span className="w-3 h-3 bg-emerald-400 rounded-full absolute -top-0.5 -right-0.5 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm tracking-tight text-white">
                {activePet.name}'s AI Care Specialist
              </h3>
              <span className="text-[9px] px-2 py-0.5 font-black uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {activePet.species}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Powered by Google Gemini 1.5 Flash • 24/7 Clinical Triage
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPhotoModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-black shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Photo Triage</span>
        </button>
      </div>

      {/* Emergency Alert Banner */}
      {hasEmergency && (
        <div className="p-3 bg-rose-950/40 border-b border-rose-800/60">
          <EmergencyAlertBanner onDirectToVet={() => setActiveTab('vet')} />
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 scrollbar-thin">
        {chatMessages.map(msg => {
          const isUser = msg.sender === 'user';
          const isEmerg = msg.sender === 'emergency' || msg.isEmergency;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                    isEmerg ? 'bg-rose-600' : 'bg-slate-900 dark:bg-emerald-600'
                  }`}
                >
                  {isEmerg ? <AlertTriangle className="w-4 h-4" /> : <Stethoscope className="w-4 h-4 text-emerald-400 dark:text-white" />}
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-3xl p-4 shadow-subtle ${
                  isUser
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white rounded-br-sm'
                    : isEmerg
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 dark:border-rose-800 text-slate-900 dark:text-slate-100 rounded-bl-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm'
                }`}
              >
                <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed space-y-1">
                  {msg.text.split('\n').map((line, i) => {
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={i} className={line.startsWith('-') ? 'pl-2 my-0.5' : 'my-1'}>
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={pIdx} className="font-bold">{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>

                {isEmerg && (
                  <div className="mt-3 pt-3 border-t border-rose-200 dark:border-rose-900/60 flex flex-wrap gap-2">
                    <a
                      href="tel:911"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Emergency Call Dispatch</span>
                    </a>
                    <button
                      onClick={() => setActiveTab('vet')}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors"
                    >
                      Open Nearby 24/7 Hospitals
                    </button>
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-2 text-right ${
                    isUser ? 'text-slate-400 dark:text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start items-center text-xs text-slate-500 dark:text-slate-400 p-2">
            <div className="w-8 h-8 rounded-2xl bg-emerald-600 text-white flex items-center justify-center animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
            <span className="animate-pulse font-bold text-slate-700 dark:text-slate-300">
              Consulting Gemini veterinary medical database for {activePet.name}... 🐾
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Question Chips */}
      <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none flex gap-2 flex-shrink-0">
        {currentChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-bold whitespace-nowrap transition-colors border border-slate-200/80 dark:border-slate-700"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex-shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors border border-slate-200 dark:border-slate-700"
            title="Scan symptom with camera"
          >
            <Camera className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={`Ask clinical advice for ${activePet.name} (${activePet.species})...`}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 disabled:opacity-40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {isPhotoModalOpen && (
        <PhotoSymptomCheckerModal onClose={() => setIsPhotoModalOpen(false)} />
      )}
    </div>
  );
};