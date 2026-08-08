'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/mockDb';
import { 
  Flame, Award, CheckCircle, BarChart3, TrendingUp, AlertTriangle, 
  HelpCircle, ChevronRight, Play, ArrowUpRight, Sparkles 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile, attempts, dailyTasks, toggleTaskComplete, setActiveTab } = useApp();

  if (!profile) return null;

  // Calculate statistics
  const totalSolved = attempts.length;
  const correctCount = attempts.filter(a => a.isCorrect).length;
  const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 0;
  
  // Completed topics estimation (unique topics solved)
  const solvedQuestionsSet = new Set(attempts.map(a => a.questionId));
  const completedTopicsCount = Math.min(50, Math.round(solvedQuestionsSet.size * 0.4)); 

  // Countdown calculation
  const targetDate = new Date('2026-12-15T00:00:00'); // Assume Dec 15, 2026
  const diffTime = Math.max(0, targetDate.getTime() - Date.now());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine weak areas based on accuracy
  const subjectAccuracyMap: { [key: string]: { correct: number; total: number } } = {};
  attempts.forEach(att => {
    // Look up question details
    const qId = att.questionId;
    // We would link to the question db
  });

  const getSubjectName = (id: string) => {
    return SUBJECTS.find(s => s.id === id)?.name || id;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Greeting & Countdown Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-8 rounded-3xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 px-3 py-1 rounded-full text-xs font-bold text-teal-400 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Revision Plan Live</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Dr. {profile.name}</span>!
          </h1>
          <p className="text-slate-400 text-sm max-w-md">
            Your customized daily revision track is prepped. Let&apos;s clear the 150+ threshold today.
          </p>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center space-x-4 shrink-0">
          <div className="text-center">
            <span className="block text-3xl font-black text-teal-400 tracking-tight">{diffDays}</span>
            <span className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Days to FMGE</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-left">
            <span className="block text-xs font-bold text-white">Target Exam</span>
            <span className="text-3xs text-slate-400">{profile.targetExam}</span>
          </div>
        </div>
      </div>

      {/* Stats KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Estimated Score Gauge */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Estimated FMGE Score</span>
            <TrendingUp className="w-5 h-5 text-teal-650 text-teal-650" />
          </div>
          <div className="my-4">
            <span className="text-2xl md:text-3xl font-black text-slate-850 dark:text-white tracking-tight">
              {profile.estimatedScoreRange[0]}–{profile.estimatedScoreRange[1]}
            </span>
            <span className="text-4xs block text-slate-400 font-semibold mt-1">Passing requirement: 150+</span>
          </div>
          <div className="text-3xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-2 py-1 rounded-md font-semibold text-center border border-teal-100 dark:border-teal-900/30">
            Educational estimate only
          </div>
        </div>

        {/* Streak Counter */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Daily Streak</span>
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          </div>
          <div className="my-4">
            <span className="text-2xl md:text-3xl font-black text-slate-850 dark:text-white tracking-tight">
              {profile.streak} <span className="text-base text-slate-400 font-semibold">Days</span>
            </span>
          </div>
          <div className="text-3xs text-slate-500 dark:text-slate-400">
            Last active: {profile.lastStudyDate || 'Never'}
          </div>
        </div>

        {/* Completed Topics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Topics Mastered</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="my-4">
            <span className="text-2xl md:text-3xl font-black text-slate-850 dark:text-white tracking-tight">
              {completedTopicsCount} <span className="text-base text-slate-400 font-semibold">/ 50</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${(completedTopicsCount / 50) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions Solved & Accuracy */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Questions Solved</span>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="my-4">
            <span className="text-2xl md:text-3xl font-black text-slate-850 dark:text-white tracking-tight">
              {totalSolved}
            </span>
            <span className="text-xs text-slate-400 ml-2 font-bold">({accuracy}% Acc)</span>
          </div>
          <div className="text-3xs text-slate-500 dark:text-slate-400">
            Total active review cycles: {totalSolved}
          </div>
        </div>
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Targets & Plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-850 dark:text-white">Today&apos;s Checklist</h2>
                <p className="text-xs text-slate-450 dark:text-slate-455 text-slate-500">Core study allocations generated by AI.</p>
              </div>
              <button 
                onClick={() => setActiveTab('planner')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center space-x-1 hover:underline"
              >
                <span>View Planner</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {dailyTasks.map((task) => {
                const isCompleted = task.completedCount >= task.targetCount;
                return (
                  <div 
                    key={task.id}
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`flex items-center justify-between p-4 border rounded-2xl active:scale-99 transition-all cursor-pointer ${
                      isCompleted 
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 opacity-60' 
                        : 'border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50/20 dark:hover:bg-slate-950/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isCompleted 
                          ? 'border-teal-500 bg-teal-500 text-white' 
                          : 'border-slate-300 dark:border-slate-700 bg-transparent'
                      }`}>
                        {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <span className={`block font-bold text-xs uppercase tracking-wider ${
                          isCompleted ? 'text-slate-400' : 'text-teal-600 dark:text-teal-400'
                        }`}>
                          {getSubjectName(task.subjectId)}
                        </span>
                        <span className={`block text-sm font-semibold mt-0.5 ${
                          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-250'
                        }`}>
                          {task.taskType === 'mcq' && `Practice ${task.targetCount} MCQs in ${task.topicId}`}
                          {task.taskType === 'revision' && `Review mistakes & high-yield points for ${task.topicId}`}
                          {task.taskType === 'flashcard' && `Memorize ${task.targetCount} flashcards`}
                          {task.taskType === 'quiz' && `Attempt daily mini-quiz`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        {task.completedCount} / {task.targetCount}
                      </span>
                      <span className="block text-4xs text-slate-400 font-semibold uppercase mt-0.5">
                        {task.durationMinutes} min
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Study Anchors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-teal-550 from-teal-600 to-teal-500 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between h-44 cursor-pointer hover:shadow-lg hover:shadow-teal-500/10 active:scale-98 transition-all" onClick={() => setActiveTab('practice')}>
              <div>
                <h3 className="font-extrabold text-lg">Practice Arena</h3>
                <p className="text-xs text-teal-100 mt-1">Jump into subject tests, custom AI generated quizzes, or actual verified PYQs.</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xs bg-white/20 px-3 py-1 rounded-full font-bold">100+ MCQs Ready</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-teal-600">
                  <Play className="w-4 h-4 fill-current text-teal-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between h-44 cursor-pointer hover:shadow-lg hover:shadow-slate-900/10 active:scale-98 transition-all" onClick={() => setActiveTab('ai-tutor')}>
              <div>
                <h3 className="font-extrabold text-lg">Ask AI Tutor</h3>
                <p className="text-xs text-slate-350 text-slate-400 mt-1">Instant high-yield summaries, mnemonics, or comparison tables for any query.</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xs bg-white/10 px-3 py-1 rounded-full font-bold">Simple/Clinical/Compare</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900">
                  <ArrowUpRight className="w-4 h-4 text-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Weak Areas & Badges */}
        <div className="space-y-6">
          {/* Weak Areas Alerts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 mb-4 border-b pb-2 border-slate-100 dark:border-slate-800">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Focus Weak Areas</h3>
            </div>
            {profile.weakSubjects.length > 0 ? (
              <div className="space-y-3">
                {profile.weakSubjects.map((subId) => (
                  <div key={subId} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {getSubjectName(subId)}
                    </span>
                    <button 
                      onClick={() => setActiveTab('practice')}
                      className="text-4xs font-bold uppercase tracking-wider text-rose-650 hover:underline text-rose-500"
                    >
                      Quiz Topic
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed text-center py-4">
                Excellent! No weak areas logged yet. Complete quizzes to scan metrics.
              </p>
            )}
          </div>

          {/* Badges / Gamified Achievements */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-4 border-b pb-2 border-slate-100 dark:border-slate-800">
              <Award className="w-5 h-5" />
              <h3 className="font-bold text-sm">Unlocked Badges</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {profile.badges.map((badge) => (
                <div 
                  key={badge}
                  className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl flex flex-col items-center justify-center text-center"
                >
                  <Award className="w-6 h-6 text-amber-500 fill-amber-500/10 mb-1.5" />
                  <span className="text-4xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 truncate w-full">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
