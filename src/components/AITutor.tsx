'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Volume2, Mic, Settings2, Globe, HelpCircle, 
  ChevronRight, Play, RefreshCw, Send, Check, BookOpen 
} from 'lucide-react';

type ExplanationMode = 'simple' | 'fmge' | 'clinical' | 'rapid' | 'exam' | 'memory' | 'compare';

export const AITutor: React.FC = () => {
  const { profile } = useApp();
  const [query, setQuery] = useState<string>('');
  const [activeMode, setActiveMode] = useState<ExplanationMode>('simple');
  const [activeLang, setActiveLang] = useState<string>(profile?.preferredLanguage || 'english');
  
  const [tutorResponse, setTutorResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const modes: { id: ExplanationMode; label: string; desc: string }[] = [
    { id: 'simple', label: 'Simple Mode', desc: 'Explain like I\'m learning this for the first time' },
    { id: 'fmge', label: 'FMGE High-Yield', desc: 'Focus strictly on high-yield facts for the exam' },
    { id: 'clinical', label: 'Clinical Case', desc: 'Explain using a realistic patient vignette' },
    { id: 'rapid', label: 'Rapid Revision', desc: 'Give a 2-minute bulleted checklist summary' },
    { id: 'exam', label: 'Exam Traps', desc: 'Flag the likely trick questions & traps' },
    { id: 'memory', label: 'Mnemonics', desc: 'Create active memory associations & tricks' },
    { id: 'compare', label: 'Comparison', desc: 'Create comparison tables of differences' }
  ];

  const languages = [
    { id: 'english', label: 'English' },
    { id: 'hinglish', label: 'Hinglish' },
    { id: 'hindi', label: 'Hindi (हिंदी)' },
    { id: 'gujarati', label: 'Gujarati (ગુજરાતી)' }
  ];

  const handleSuggestClick = (suggestion: string) => {
    setQuery(suggestion);
    triggerTutor(suggestion, activeMode, activeLang);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    triggerTutor(query, activeMode, activeLang);
  };

  const handleListen = () => {
    if (!tutorResponse) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Speak response using Web Speech API
    const cleanText = tutorResponse.replace(/[#*`\-]/g, ''); // strip markdown chars
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose appropriate voice/language helper if available
    if (activeLang === 'hindi' || activeLang === 'hinglish') {
      utterance.lang = 'hi-IN';
    } else if (activeLang === 'gujarati') {
      utterance.lang = 'gu-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Rule-based medical tutor responses based on topic query
  const triggerTutor = async (topic: string, mode: ExplanationMode, lang: string) => {
    setLoading(true);
    setTutorResponse('');
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, mode, language: lang })
      });
      const data = await res.json();
      if (data.response) {
        setTutorResponse(data.response);
      } else {
        setTutorResponse('Failed to contact the AI Tutor. Please verify your API keys in the environment settings.');
      }
    } catch (error) {
      console.error('Error fetching AI Tutor explanation:', error);
      setTutorResponse('Connection lost. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Search Input Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400">
            <Sparkles className="w-5 h-5 fill-current" />
            <h2 className="text-xl font-bold tracking-tight">AI Medical Tutor</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ask any medical question or topic. Configure explanations for rapid revision or mnemonics.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Explain nephrotic vs nephritic syndrome, atropine poisoning..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-teal-500 focus:outline-none dark:text-white text-xs md:text-sm"
          />
          <button
            type="submit"
            className="px-5 bg-teal-650 hover:bg-teal-500 text-white rounded-2xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <button 
            type="button"
            onClick={() => handleSuggestClick('Nephrotic syndrome')}
            className="px-3 py-1.5 bg-slate-55 bg-slate-50 dark:bg-slate-950 text-3xs font-extrabold uppercase tracking-wide border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Nephrotic vs Nephritic
          </button>
          <button 
            type="button"
            onClick={() => handleSuggestClick('Atropine poisoning')}
            className="px-3 py-1.5 bg-slate-55 bg-slate-50 dark:bg-slate-950 text-3xs font-extrabold uppercase tracking-wide border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Atropine & OP Poisoning
          </button>
        </div>
      </div>

      {/* Selector Options (Modes & Languages) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Explanation modes */}
        <div>
          <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Explanation Mode</span>
          <div className="flex flex-wrap gap-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setActiveMode(mode.id);
                  if (query) triggerTutor(query, mode.id, activeLang);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border active:scale-95 transition-all ${
                  activeMode === mode.id
                    ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400'
                    : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-650'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Translation configuration */}
        <div className="pt-2">
          <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Language</span>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => {
                  setActiveLang(lang.id);
                  if (query) triggerTutor(query, activeMode, lang.id);
                }}
                className={`px-3 py-1.5 rounded-full text-2xs border active:scale-95 transition-all ${
                  activeLang === lang.id
                    ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 dark:text-slate-400'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tutor Response Panel */}
      {(loading || tutorResponse) && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-teal-650 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4.5 h-4.5" />
              <span>Tutor Explanation</span>
            </div>

            {tutorResponse && (
              <button
                onClick={handleListen}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-2xs font-semibold transition-all active:scale-95 ${
                  isPlaying 
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlaying ? 'Stop Listening' : 'Listen aloud'}</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin" />
              <span className="text-xs text-slate-400">Tutor is compiling explanation...</span>
            </div>
          ) : (
            <div className="text-xs md:text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
              {tutorResponse}
            </div>
          )}

          {tutorResponse && !loading && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Did this help clear the doubt?</span>
              <div className="flex justify-center space-x-2">
                <button 
                  onClick={() => handleSuggestClick(`Ask me 5 questions about this`)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-2xs font-bold rounded-xl active:scale-95 transition-all text-slate-700 dark:text-slate-350"
                >
                  Ask me 5 questions about this
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
