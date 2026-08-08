'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Calendar, BookOpen, PenTool, Brain, AlertTriangle, 
  Award, Sparkles, Stethoscope, Image as ImageIcon, RotateCcw, Clock, 
  Users, ShieldAlert, LogOut, Sun, Moon, Search, Video, Compass, HelpCircle, BarChart3
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, profile, theme, toggleTheme, resetProgress, openSearch } = useApp();

  if (!profile) return null;

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resources', label: 'Free Resource Hub', icon: Video },
    { id: 'syllabus-map', label: '19-Subject Syllabus', icon: Compass },
    { id: 'learn', label: 'Smart Notes & Topics', icon: BookOpen },
    { id: 'practice', label: 'Practice & PYQ Arena', icon: PenTool },
    { id: 'ai-tutor', label: 'AI FMGE Teacher', icon: Sparkles },
    { id: 'flashcards', label: 'Spaced Flashcards', icon: Brain },
    { id: 'mistakes', label: 'Mistake Notebook', icon: AlertTriangle },
    { id: 'tests', label: 'Grand Test Series', icon: Award }
  ];

  const clinicalSpecialtyNavItems = [
    { id: 'clinical-cases', label: 'Clinical Cases', icon: Stethoscope },
    { id: 'image-bank', label: 'Image Bank Spotters', icon: ImageIcon },
    { id: 'revision', label: 'Rapid Revision & Traps', icon: RotateCcw },
    { id: 'pomodoro', label: 'Focus Room Timer', icon: Clock },
    { id: 'planner', label: 'Adaptive Study Plan', icon: Calendar },
    { id: 'progress', label: 'Readiness Analytics', icon: BarChart3 },
    { id: 'exam-info', label: 'Official NBEMS Info', icon: HelpCircle },
    { id: 'community', label: 'Peer Doubt Board', icon: Users },
    { id: 'admin', label: 'Admin & Mod Pipeline', icon: ShieldAlert }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 min-h-screen flex flex-col border-r border-slate-800 shrink-0 hidden md:flex select-none">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-teal-500/20">
            FM
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            FMGE<span className="text-teal-400">MASTER</span>
          </span>
        </div>
      </div>

      {/* Quick Search Launcher Button */}
      <div className="p-3 border-b border-slate-800">
        <button
          onClick={openSearch}
          className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border border-slate-700 transition-all"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-teal-400" />
            <span>Search topics...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 text-3xs font-mono text-slate-400">Ctrl+K</kbd>
        </button>
      </div>

      {/* Navigations Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-none">
        
        <div>
          <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-500 block px-3 mb-1">Core Learning Hub</span>
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-500 block px-3 mb-1">Clinical & Revision</span>
          <div className="space-y-0.5">
            {clinicalSpecialtyNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </nav>

      {/* Bottom Profile & Toggle Footer */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-xs font-semibold transition-all"
        >
          <div className="flex items-center space-x-2.5">
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-3xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Toggle</span>
        </button>

        <button
          onClick={resetProgress}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-rose-950/20 hover:text-rose-400 text-2xs font-semibold text-rose-400/70 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Reset Platform</span>
        </button>
      </div>

    </aside>
  );
};
