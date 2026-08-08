'use client';

import React from 'react';
import { BookOpen, HelpCircle, Activity, Award, Calendar, Zap, MessageSquare } from 'lucide-react';

interface LandingPageProps {
  onStartFree: () => void;
  onTakeDiagnostic: () => void;
  onOpenTutor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartFree, onTakeDiagnostic, onOpenTutor }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            FM
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white">
            FMGE<span className="text-teal-600 dark:text-teal-400">MASTER</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onStartFree}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onStartFree}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Background gradient blur */}
        <div className="absolute top-0 -z-10 w-72 h-72 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-500/10" />
        <div className="absolute right-10 bottom-0 -z-10 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />

        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-400 text-sm font-medium mb-6">
          <Zap className="w-4 h-4 fill-current" />
          <span>Prepare Smarter. Clear the 150+ Threshold with Confidence.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl">
          AI-Powered Preparation for the <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">FMGE</span> Exam
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mt-6 leading-relaxed">
          The ultimate medical prep ecosystem designed specifically for foreign medical graduates. Complete onboarding, diagnose weak areas, practice original questions, and let AI build your custom planner.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-10">
          <button
            onClick={onStartFree}
            className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20 transition-all active:scale-98"
          >
            Get Started (Free Forever)
          </button>
          <button
            onClick={onTakeDiagnostic}
            className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl font-bold shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all active:scale-98"
          >
            Take 15-Min Diagnostic
          </button>
        </div>

        {/* Disclaimer Alert */}
        <div className="mt-12 max-w-3xl p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-left text-xs text-amber-800 dark:text-amber-300">
          <span className="font-bold">⚠️ IMPORTANT FMGE DISCLAIMER:</span> This platform is an independent educational preparation tool and is not affiliated with the National Board of Examinations in Medical Sciences (NBEMS) or any FMGE examination authority. Exam pattern, eligibility, dates, and rules can change. Always verify current information through official NBEMS sources.
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-16">
          Everything You Need to Succeed on a ₹0 Budget
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm card-hover-effect">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Structured Study Notes</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Unlock original high-yield notes across all 17 pre-clinical, para-clinical, and clinical subjects. Highlight key paragraphs and flag clinical traps.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm card-hover-effect">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Study Planner</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Enter your weak areas and days until the exam. The engine generates a daily routine and auto-adjusts based on your quiz accuracy scores.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm card-hover-effect">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Question Generator</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Create randomized quick-quizzes with clinical vignettes, single best answer, and image-based queries. Detailed rationale for correct & incorrect options.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm card-hover-effect">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Spaced Repetition</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Anki-style flashcards with an embedded SuperMemo-2 algorithm. Set cards as Again, Hard, Good, or Easy to schedule them for optimal long-term retention.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm card-hover-effect">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Mistake Notebook</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Auto-saves every incorrect answer. Categorize by error types (Silly, Misread, Concept, Memory) and load target revision tests of just your mistakes.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm card-hover-effect">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Grand Test Simulator</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              A full 300-question exam interface split in two sessions with an active countdown timer, palette overview, and estimated score readiness chart.
            </p>
          </div>
        </div>
      </section>

      {/* AI Tutor Hero Section */}
      <section className="bg-teal-600 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Meet your personal AI Medical Coach</h2>
            <p className="text-teal-100 text-lg leading-relaxed mb-6">
              Stuck on a complex diagnosis or metabolic pathway? Ask the tutor. Switch explanation modes on-the-fly: Simple, High-Yield FMGE, Clinical Cases, or Mnemonics.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-white/20 hover:bg-white/30 cursor-pointer rounded-full text-xs font-semibold">Explain Nephrotic vs Nephritic</span>
              <span className="px-3 py-1 bg-white/20 hover:bg-white/30 cursor-pointer rounded-full text-xs font-semibold">Create mnemonics for JVP waves</span>
              <span className="px-3 py-1 bg-white/20 hover:bg-white/30 cursor-pointer rounded-full text-xs font-semibold">Drug of choice for Eclampsia</span>
            </div>
          </div>
          <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-white/10 w-full md:w-96 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-400">FMGE AI Tutor - Active</span>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl font-mono border border-slate-800">
              User: &quot;Give me a clinical scenario for organophosphate poisoning.&quot;
            </div>
            <div className="text-xs text-teal-300 leading-relaxed bg-teal-950/30 p-3 rounded-xl border border-teal-900/30">
              <span className="font-bold text-white block mb-1">AI Tutor:</span>
              A 42-year-old farmer is rushed to the ED. Symptoms: Pinpoint pupils, bradycardia, muscle twitching, and excess bronchial secretions...
            </div>
            <button
              onClick={onOpenTutor}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
            >
              Try AI Tutor Sandbox
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center border-t border-slate-800">
        <p className="text-sm">© 2026 FMGE Master. All rights reserved.</p>
        <p className="text-xs text-slate-500 mt-2 max-w-xl mx-auto">
          FMGE Master is an independent preparatory platform. All educational assessments, notes, mock questions, and AI planners are for self-study and training purposes only. Medical references should be verified against standard guidelines.
        </p>
      </footer>
    </div>
  );
};
