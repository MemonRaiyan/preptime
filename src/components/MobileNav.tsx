'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, BookOpen, PenTool, Sparkles, Menu, X, 
  Brain, AlertTriangle, Award, Stethoscope, Image as ImageIcon, 
  RotateCcw, Clock, Users, ShieldAlert, LogOut, Sun, Moon 
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, profile, theme, toggleTheme, resetProgress } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!profile) return null;

  const coreTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'learn', label: 'Notes', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: PenTool },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Sparkles }
  ];

  const drawerItems = [
    { id: 'planner', label: 'AI Study Planner', icon: RotateCcw },
    { id: 'flashcards', label: 'Flashcards Anki', icon: Brain },
    { id: 'mistakes', label: 'Mistake Notebook', icon: AlertTriangle },
    { id: 'tests', label: 'Grand Tests', icon: Award },
    { id: 'clinical-cases', label: 'Clinical Cases', icon: Stethoscope },
    { id: 'image-bank', label: 'Image Bank', icon: ImageIcon },
    { id: 'revision', label: 'Revision Engine', icon: RotateCcw },
    { id: 'pomodoro', label: 'Study focus room', icon: Clock },
    { id: 'community', label: 'Community Board', icon: Users },
    { id: 'admin', label: 'Admin Controls', icon: ShieldAlert }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Bottom Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-1 shadow-lg">
        {coreTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !drawerOpen;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center space-y-1 py-1.5 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-teal-600 dark:text-teal-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-3xs tracking-tight">{tab.label}</span>
            </button>
          );
        })}
        
        {/* Menu button */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`flex flex-col items-center space-y-1 py-1.5 px-3 rounded-xl transition-all ${
            drawerOpen 
              ? 'text-teal-600 dark:text-teal-400 font-bold' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-3xs tracking-tight">More</span>
        </button>
      </div>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Specialty drawer menu */}
      <div className={`md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl p-6 transition-all duration-300 max-h-[70vh] overflow-y-auto ${
        drawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <span className="font-bold text-sm text-slate-850 dark:text-slate-200">More Tools & Specialty Sections</span>
          <button 
            onClick={toggleTheme}
            className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-850 px-3 py-1.5 rounded-full text-2xs text-slate-600 dark:text-slate-300"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {drawerItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-3 p-3 rounded-2xl text-left border active:scale-95 transition-all ${
                  isActive 
                    ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 font-bold' 
                    : 'border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/40 text-slate-650 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          <button
            onClick={() => {
              setDrawerOpen(false);
              resetProgress();
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-rose-100 dark:border-rose-950/30 text-rose-500/80 hover:bg-rose-50 dark:hover:bg-rose-950/10 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Reset Platform</span>
          </button>
        </div>
      </div>
    </>
  );
};
