'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Calendar, BookOpen, PenTool, Brain, AlertTriangle, 
  Award, Sparkles, Stethoscope, Image as ImageIcon, RotateCcw, Clock, 
  Users, ShieldAlert, LogOut, Sun, Moon 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, profile, theme, toggleTheme, resetProgress } = useApp();

  if (!profile) return null;

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'AI Study Planner', icon: Calendar },
    { id: 'learn', label: 'Smart Notes', icon: BookOpen },
    { id: 'practice', label: 'Practice Arena', icon: PenTool },
    { id: 'flashcards', label: 'Flashcards', icon: Brain },
    { id: 'mistakes', label: 'Mistake Notebook', icon: AlertTriangle },
    { id: 'tests', label: 'Grand Tests', icon: Award },
    { id: 'ai-tutor', label: 'AI Tutor Sandbox', icon: Sparkles }
  ];

  const specialtyNavItems = [
    { id: 'clinical-cases', label: 'Clinical Cases', icon: Stethoscope },
    { id: 'image-bank', label: 'Image Bank', icon: ImageIcon },
    { id: 'revision', label: 'Revision Engine', icon: RotateCcw },
    { id: 'pomodoro', label: 'Study focus room', icon: Clock },
    { id: 'community', label: 'Community Board', icon: Users },
    { id: 'admin', label: 'Admin Controls', icon: ShieldAlert }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 min-h-screen flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-teal-500/20">
          FM
        </div>
        <span className="font-black text-xl tracking-tight text-white">
          FMGE<span className="text-teal-400">MASTER</span>
        </span>
      </div>

      {/* User Stats Card */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="bg-slate-850 bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center font-bold text-teal-400">
              Dr
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-sm text-white truncate">{profile.name}</div>
              <div className="text-xs text-slate-500">Level {profile.level} Candidate</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-2xs">
              <span>XP: {profile.xp} / {profile.level * 150}</span>
              <span className="text-teal-400 font-semibold">{Math.round((profile.xp / (profile.level * 150)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(profile.xp / (profile.level * 150)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigations */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-600 block px-3 mb-2">Core Hub</span>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-600 block px-3 mb-2">Specialty & Revision</span>
          <div className="space-y-1">
            {specialtyNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Sidebar Footer options */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white text-xs font-semibold transition-all"
        >
          <div className="flex items-center space-x-3">
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-2xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md uppercase">Toggle</span>
        </button>

        <button
          onClick={resetProgress}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-rose-950/20 hover:text-rose-400 text-xs font-semibold text-rose-500/80 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Reset Platform</span>
        </button>
      </div>
    </aside>
  );
};
