'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/mockDb';
import { 
  BarChart3, TrendingUp, Sparkles, AlertCircle, Award, 
  Clock, CheckCircle, Flame, Star, Zap 
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { profile, attempts } = useApp();

  if (!profile) return null;

  // Calculate statistics
  const totalQuestions = attempts.length;
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const totalAccuracy = totalQuestions > 0 ? Math.round((correctAttempts / totalQuestions) * 100) : 0;

  const getSubjectName = (subId: string) => {
    return SUBJECTS.find(s => s.id === subId)?.name || subId;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight">Performance Analytics</h2>
        <p className="text-xs text-slate-500">AI-compiled diagnostic charts indicating exam readiness thresholds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Readiness overview */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-teal-650 dark:text-teal-400">
            <Sparkles className="w-5 h-5 fill-current" />
            <h3 className="font-bold text-sm">Exam Readiness</h3>
          </div>

          <div className="space-y-1">
            <span className="text-4xs text-slate-400 font-bold uppercase tracking-wider block">Estimated Score Range</span>
            <span className="text-3xl font-black text-slate-850 dark:text-white tracking-tight">
              {profile.estimatedScoreRange[0]}–{profile.estimatedScoreRange[1]}
            </span>
            <span className="text-4xs text-slate-550 block font-semibold text-slate-400 mt-1">Passing threshold: 150 marks</span>
          </div>

          <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-2xl text-xs text-teal-850 dark:text-teal-450 leading-relaxed font-normal">
            This estimate is calculated based on cumulative question accuracy, difficulty indices, and active spaced-repetition schedules.
          </div>
        </div>

        {/* Accuracy and speed statistics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-blue-500">
            <BarChart3 className="w-5 h-5" />
            <h3 className="font-bold text-sm">Review Metrics</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
              <span className="block text-4xs text-slate-400 font-bold uppercase mb-1">Total Solved</span>
              <span className="block text-xl font-black text-slate-850 dark:text-white">{totalQuestions}</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
              <span className="block text-4xs text-slate-400 font-bold uppercase mb-1">Accuracy</span>
              <span className="block text-xl font-black text-teal-650 dark:text-teal-400">{totalAccuracy}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-3xs font-semibold text-slate-500">
            <span>Avg Response time: 24s</span>
            <span>Completion target: 90%</span>
          </div>
        </div>

        {/* Strength indicators */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-orange-500">
            <Flame className="w-5 h-5" />
            <h3 className="font-bold text-sm">Gamification Progress</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-2xs font-bold text-slate-600 dark:text-slate-400">
              <span>Level {profile.level} Achievement</span>
              <span>{profile.xp} XP</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-full rounded-full"
                style={{ width: `${(profile.xp / (profile.level * 150)) * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {profile.badges.map(b => (
                <span key={b} className="text-4xs bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Accuracy line representation - SVG graphic */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-850 dark:text-white mb-1">Score Accuracy Trend</h3>
          <p className="text-2xs text-slate-400">Chronological plot of quiz performances over the past weeks.</p>
        </div>

        {/* Premium SVG Line graph */}
        <div className="h-44 w-full bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-center relative overflow-hidden">
          <svg className="w-full h-full p-4" viewBox="0 0 500 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0"/>
              </linearGradient>
            </defs>
            {/* Grid lines */}
            <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-850" />
            <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-850" />
            <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-850" />
            
            {/* Trend path */}
            <path 
              d="M 10 90 L 100 80 L 200 65 L 300 45 L 400 35 L 490 25" 
              fill="none" 
              stroke="#0d9488" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />
            {/* Gradient fill underneath */}
            <path 
              d="M 10 90 L 100 80 L 200 65 L 300 45 L 400 35 L 490 25 L 490 100 L 10 100 Z" 
              fill="url(#chartGrad)"
            />
            {/* Data dots */}
            <circle cx="10" cy="90" r="4.5" fill="#0d9488" />
            <circle cx="100" cy="80" r="4.5" fill="#0d9488" />
            <circle cx="200" cy="65" r="4.5" fill="#0d9488" />
            <circle cx="300" cy="45" r="4.5" fill="#0d9488" />
            <circle cx="400" cy="35" r="4.5" fill="#0d9488" />
            <circle cx="490" cy="25" r="4.5" fill="#0d9488" />
          </svg>
          <div className="absolute bottom-2 left-4 text-4xs font-bold text-slate-400 uppercase tracking-widest">Baseline (120)</div>
          <div className="absolute top-2 right-4 text-4xs font-bold text-teal-650 uppercase tracking-widest">Current (168)</div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsView;
