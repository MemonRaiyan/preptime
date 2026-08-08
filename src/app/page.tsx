'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LandingPage } from '../components/LandingPage';
import { OnboardingWizard } from '../components/OnboardingWizard';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';

// Dynamic sub-screens loaders
import { Dashboard } from '../components/Dashboard';
import { PlannerView } from '../components/PlannerView';
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
import { CommunityView } from '../components/CommunityView';
import { AdminPanel } from '../components/AdminPanel';
import { AnalyticsView } from '../components/AnalyticsView';

import { Sparkles, Star, Award, ShieldAlert, BookOpen } from 'lucide-react';

export default function Home() {
  const { profile, activeTab, theme } = useApp();
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

  // Active Screen Switcher helper
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'planner':
        return <PlannerView />;
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
      {/* Desktop Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Mobile Header Bar */}
        <header className="md:hidden glass px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
              FM
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-850 dark:text-white">
              FMGE<span className="text-teal-600 dark:text-teal-400">MASTER</span>
            </span>
          </div>

          <span className="text-3xs bg-teal-500/10 text-teal-650 px-2 py-0.5 rounded font-extrabold uppercase">
            Level {profile?.level}
          </span>
        </header>

        {/* Content Viewport scroll area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 max-w-7xl w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
