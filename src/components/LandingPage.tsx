'use client';

import React from 'react';
import { 
  Sparkles, BookOpen, Video, PenTool, Award, Brain, 
  Stethoscope, Image as ImageIcon, ShieldCheck, ArrowRight, 
  CheckCircle2, Compass, Zap 
} from 'lucide-react';

interface LandingPageProps {
  onStartFree: () => void;
  onTakeDiagnostic: () => void;
  onOpenTutor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  onTakeDiagnostic,
  onOpenTutor
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="px-6 md:px-12 py-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-500/20">
            FM
          </div>
          <span className="font-black text-2xl tracking-tight text-white">
            FMGE<span className="text-teal-400">MASTER</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onTakeDiagnostic}
            className="hidden sm:inline-flex bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-2xl text-xs font-bold transition-all"
          >
            Take Diagnostic Test
          </button>
          <button
            onClick={onStartFree}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-5 py-2 rounded-2xl text-xs font-black shadow-lg shadow-teal-500/20 transition-all"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* Hero Section (Section 55) */}
      <section className="px-6 md:px-12 py-16 md:py-28 max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
        
        {/* Free First Pill */}
        <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 rounded-full text-xs font-black text-teal-400">
          <Sparkles className="w-4 h-4" />
          <span>100% Free-First AI Medical Preparation Ecosystem</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight md:leading-none">
          PREPARE FOR FMGE.<br />
          <span className="bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            FOR FREE.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          "One intelligent platform to learn, practice, revise and track your FMGE preparation — organized, personalized and AI-powered."
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartFree}
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 px-8 py-4 rounded-3xl font-black text-sm shadow-xl shadow-teal-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            <span>START FREE PREPARATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTakeDiagnostic}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-3xl font-bold text-sm transition-all"
          >
            TAKE DIAGNOSTIC TEST
          </button>

          <button
            onClick={onOpenTutor}
            className="w-full sm:w-auto bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-8 py-4 rounded-3xl font-bold text-sm transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>ASK AI TEACHER</span>
          </button>
        </div>

        {/* Free Core Commitments */}
        <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-400">
          <div className="flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Free 19-Subject Syllabus</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Free AI Tutor & Quizzes</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Free Verified PYQs</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Free Grand Test Series</span>
          </div>
        </div>

      </section>

      {/* Feature Grid: "Everything in One Place" */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-black text-white">
            Everything You Need for FMGE in One Place
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto">
            STUDY + AI TEACHER + QBANK + REVISION SYSTEM + TEST SERIES + RESOURCE SEARCH + PERFORMANCE COACH.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-teal-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Free Resource Hub</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated indexing of legitimate open-access lectures (YouTube), WHO/CDC guidelines, NIH PubMed articles, and official educational documents.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI FMGE Teacher (9 Modes)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Learn concepts through Simple, Exam-traps, Rapid Revision, Clinical Vignettes, Oral Viva, Comparison tables, or Hindi/Gujarati multilingual voice.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Spaced Repetition & Mistakes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              SuperMemo-2 flashcards and automatic root-cause mistake logging with frequency tracking (e.g. "Beta Blockers failed 7 times").
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Verified PYQs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparently labeled verified past-year questions with authenticated exam years, why the correct answer is right, and why the other 3 are wrong.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-rose-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Clinical Cases & Images</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Progressive patient vignettes with real-time vitals and high-yield image spotters for Radiology, Pathology, Dermatology, and Ophthalmology.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-teal-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Grand Test Simulations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              50, 100, 150 and full 300-question FMGE simulations with timed question palettes, post-test AI root-cause diagnostics, and readiness estimation.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 px-6 md:px-12 py-8 bg-slate-950 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          FMGE Master • The Free-First AI FMGE Preparation Ecosystem.
        </div>
        <div>
          Independent educational platform. Not affiliated with NBEMS or NMC.
        </div>
      </footer>

    </div>
  );
};
