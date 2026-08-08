'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LandingPage } from '../components/LandingPage';
import { OnboardingWizard } from '../components/OnboardingWizard';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';
import { GlobalSearchModal } from '../components/GlobalSearchModal';

// All View Sub-Screens
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

import { Search, Flame } from 'lucide-react';

export default function Home() {
  const { profile, activeTab, openSearch } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);

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
      case 'resources':
        return <FreeResourceHub />;
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

      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-xs">
              FM
            </div>
            <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
              FMGE<span className="text-teal-500">MASTER</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={openSearch}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <span className="text-3xs bg-teal-500/10 text-teal-600 font-extrabold px-2 py-1 rounded-md">
              Lvl {profile?.level}
            </span>
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
