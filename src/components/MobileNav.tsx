'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, PenTool, Award, Flame, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, profile } = useApp();

  if (!profile) return null;

  const mobileTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'pyq-papers', label: 'Papers', icon: Award },
    { id: 'practice', label: 'Practice', icon: PenTool },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'tests', label: 'Tests', icon: Flame }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              isActive 
                ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-3xs tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
