'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, QUESTIONS, FREE_RESOURCES } from '../data/mockDb';
import { 
  Sparkles, Calendar, BookOpen, PenTool, Brain, AlertTriangle, 
  Award, Stethoscope, Image as ImageIcon, Flame, ArrowRight, 
  CheckCircle2, Clock, Zap, Target, Search 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile, dailyTasks, toggleTaskComplete, setActiveTab, openSearch, attempts, gtAttempts, navigateToTopic } = useApp();

  const totalSolved = attempts.length;
  const correctSolved = attempts.filter(a => a.isCorrect).length;
  const accuracyRate = totalSolved > 0 ? Math.round((correctSolved / totalSolved) * 100) : 0;
  const lastGt = gtAttempts[0];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300 border border-white/10">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{profile?.streak || 1}-Day Preparation Streak</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Welcome, Dr. {profile?.name || 'Candidate'}!
          </h1>

          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Targeting <strong>{profile?.targetExam || 'December 2026'}</strong>. Today's preparation is adaptively weighted towards <strong>{profile?.weakSubjects?.join(', ') || 'PSM and General Medicine'}</strong>.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab('practice')}
              className="bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-lg transition-all"
            >
              <Zap className="w-4 h-4 text-teal-600" />
              <span>Launch Daily 20 AI Challenge</span>
            </button>

            <button
              onClick={openSearch}
              className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/30 px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>One-Search (Ctrl+K)</span>
            </button>
          </div>
        </div>

        {/* Exam Countdown Card */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 space-y-1 w-full md:w-auto">
          <span className="text-3xs font-extrabold uppercase text-teal-300 tracking-wider">Exam Horizon</span>
          <div className="text-3xl font-black text-white">{profile?.targetExam || 'Dec 2026'}</div>
          <span className="text-3xs text-slate-300 font-mono">150/300 Passing Cutoff</span>
        </div>
      </div>

      {/* Core KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Metric 1: Total MCQs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-2xs font-extrabold text-slate-400 uppercase">Questions Solved</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalSolved}</div>
          <span className="text-3xs text-teal-600 font-bold">Accuracy: {accuracyRate}%</span>
        </div>

        {/* Metric 2: Estimated Band */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-2xs font-extrabold text-slate-400 uppercase">Readiness Band</span>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
            {profile?.estimatedScoreRange ? `${profile.estimatedScoreRange[0]}-${profile.estimatedScoreRange[1]}` : '135-155'}
          </div>
          <span className="text-3xs text-slate-400 font-bold">Passing: 150/300</span>
        </div>

        {/* Metric 3: Candidate Level */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-2xs font-extrabold text-slate-400 uppercase">Candidate Level</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">Level {profile?.level || 1}</div>
          <span className="text-3xs text-slate-400 font-bold">{profile?.xp || 0} XP Earned</span>
        </div>

        {/* Metric 4: Latest GT Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-2xs font-extrabold text-slate-400 uppercase">Latest Grand Test</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {lastGt ? `${lastGt.score}/${lastGt.totalQuestions}` : 'Take Mini Mock'}
          </div>
          <span className="text-3xs text-slate-400 font-bold">{lastGt ? `${lastGt.percentage}%` : '50Q Available'}</span>
        </div>

      </div>

      {/* Two Column Layout: Today's Tasks + AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Today's Study Tasks */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Target className="w-4 h-4 text-teal-600" />
                <span>Today's Adaptive Preparation Plan</span>
              </h3>
              <p className="text-2xs text-slate-400">
                Generated based on your {profile?.studyHoursPerDay || 8} daily target hours.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('planner')}
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              View Full Calendar
            </button>
          </div>

          <div className="space-y-3">
            {dailyTasks.map((task) => {
              const isCompleted = task.completedCount >= task.targetCount;
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTaskComplete(task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isCompleted
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 hover:border-teal-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                    }`}>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isCompleted ? 'line-through opacity-70' : ''}`}>
                        {task.title}
                      </h4>
                      <span className="text-3xs text-slate-400">
                        {task.completedCount}/{task.targetCount} • {task.durationMinutes} mins
                      </span>
                    </div>
                  </div>

                  <span className="text-3xs font-extrabold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 uppercase">
                    {task.taskType}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Coach Recommendations */}
        <div className="space-y-6">
          
          {/* AI Recommendation Card */}
          <div className="bg-gradient-to-b from-indigo-500/10 to-teal-500/10 border border-indigo-500/20 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI Preparation Coach Insight</span>
            </div>

            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Focus Alert: {profile?.weakSubjects?.[0] || 'Community Medicine (PSM)'}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Based on historical FMGE weightage, PSM and Medicine account for over 60+ marks. Review epidemiological study designs today to solidify high-yield recall.
            </p>

            <button
              onClick={() => {
                const weakSub = profile?.weakSubjects?.[0] || 'psm';
                navigateToTopic(weakSub, 'epidemiology-study-designs');
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>Launch Targeted Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Hub Launchers */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Quick Study Hubs
            </h4>

            <div className="space-y-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('resources')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 flex items-center justify-between text-slate-800 dark:text-slate-200 transition-all"
              >
                <span>📺 Free Resource Hub</span>
                <ChevronRightIcon className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('mistakes')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 flex items-center justify-between text-slate-800 dark:text-slate-200 transition-all"
              >
                <span>⚠️ Mistake Notebook</span>
                <ChevronRightIcon className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('flashcards')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 flex items-center justify-between text-slate-800 dark:text-slate-200 transition-all"
              >
                <span>🧠 Spaced Flashcards Deck</span>
                <ChevronRightIcon className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('syllabus-map')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 flex items-center justify-between text-slate-800 dark:text-slate-200 transition-all"
              >
                <span>🗺️ 19-Subject Syllabus Map</span>
                <ChevronRightIcon className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

const ChevronRightIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
