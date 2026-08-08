'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LandingPage } from '../components/LandingPage';
import { OnboardingWizard } from '../components/OnboardingWizard';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';
import { GlobalSearchModal } from '../components/GlobalSearchModal';

import { Dashboard } from '../components/Dashboard';
import { FreeResourceHub } from '../components/FreeResourceHub';
import { SyllabusMapView } from '../components/SyllabusMapView';
import { SmartNotesView } from '../components/SmartNotesView';
import { PracticeArena } from '../components/PracticeArena';
import { FlashcardsView } from '../components/FlashcardsView';
import { MistakeNotebookView } from '../components/MistakeNotebookView';
import { GrandTestSimulator } from '../components/GrandTestSimulator';
import { AITutor } from '../components/AITutor';
import { ClinicalCasesView } from '../components/ClinicalCasesView';
import { ImageBankView } from '../components/ImageBankView';
import { SpecialRevisionView } from '../components/SpecialRevisionView';
import { StudyRoomView } from '../components/StudyRoomView';
import { PlannerView } from '../components/PlannerView';
import { ExamInfoHub } from '../components/ExamInfoHub';
import { CommunityView } from '../components/CommunityView';
import { AdminPanel } from '../components/AdminPanel';
import { AnalyticsView } from '../components/AnalyticsView';
import { PYQPapersView } from '../components/PYQPapersView';

import { Search, Flame } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

export default function Home() {
  const { profile, activeTab, openSearch } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // If not onboarded and hasn't initiated onboarding wizard
  if (!profile && !showOnboarding) {
    return (
      <LandingPage 
        onStartFree={() => setShowOnboarding(true)}
        onTakeDiagnostic={() => setShowOnboarding(true)}
        onOpenTutor={() => setShowOnboarding(true)}
      />
    );
  }

  // If onboarding wizard active
  if (!profile && showOnboarding) {
    return <OnboardingWizard />;
  }

  // Active Screen Switcher
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'pyq-papers':
        return <PYQPapersView />;
      case 'syllabus-map':
        return <SyllabusMapView />;
      case 'learn':
        return <SmartNotesView />;
      case 'practice':
        return <PracticeArena />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'mistakes':
        return <MistakeNotebookView />;
      case 'tests':
        return <GrandTestSimulator />;
      case 'ai-tutor':
        return <AITutor />;
      case 'clinical-cases':
        return <ClinicalCasesView />;
      case 'image-bank':
        return <ImageBankView />;
      case 'resources':
        return <FreeResourceHub />;
      case 'revision':
        return <SpecialRevisionView />;
      case 'pomodoro':
        return <StudyRoomView />;
      case 'planner':
        return <PlannerView />;
      case 'exam-info':
        return <ExamInfoHub />;
      case 'community':
        return <CommunityView />;
      case 'admin':
        return <AdminPanel />;
      case 'progress':
        return <AnalyticsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {/* Global One-Search Modal Overlay */}
      <GlobalSearchModal />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Global Header Bar with Account Sync Button */}
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2.5">
            {/* Logo on mobile only */}
            <div className="flex md:hidden items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
                FM
              </div>
              <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
                FMGE<span className="text-teal-500">MASTER</span>
              </span>
            </div>
            {/* Desktop header title */}
            <div className="hidden md:block">
              <span className="text-4xs font-extrabold uppercase tracking-widest text-slate-400 block">Workspace Workspace</span>
              <h2 className="font-black text-xs text-slate-900 dark:text-white capitalize tracking-tight mt-0.5">
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Streak Counter */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-3xs font-extrabold shadow-3xs">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{profile?.streak || 1} Day Streak</span>
            </div>

            {/* Search Button */}
            <button
              onClick={openSearch}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/50 dark:border-slate-700/50"
              title="Global Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Account Profile Switcher / Login trigger */}
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 transition-all text-3xs font-black text-slate-850 dark:text-slate-100 shadow-3xs"
            >
              <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white font-black text-4xs shadow-sm">
                {profile?.name ? profile.name.substring(0,1).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">
                {profile?.name || 'Account'}
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileNav />
    </div>
  );
}
