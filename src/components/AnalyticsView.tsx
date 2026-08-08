'use client';

import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, QUESTIONS } from '../data/mockDb';
import { 
  BarChart3, Award, TrendingUp, AlertTriangle, ShieldCheck, 
  CheckCircle2, Clock, Zap, Target, ArrowRight 
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { attempts, profile, gtAttempts, navigateToTopic } = useApp();

  const analytics = useMemo(() => {
    const totalAttempts = attempts.length;
    const correctCount = attempts.filter(a => a.isCorrect).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

    // Subject accuracy map
    const subjectStats: { [key: string]: { total: number; correct: number; percentage: number; name: string } } = {};
    SUBJECTS.forEach(s => {
      subjectStats[s.id] = { total: 0, correct: 0, percentage: 0, name: s.name };
    });

    attempts.forEach(att => {
      const q = QUESTIONS.find(qu => qu.id === att.questionId);
      if (q && subjectStats[q.subjectId]) {
        subjectStats[q.subjectId].total += 1;
        if (att.isCorrect) subjectStats[q.subjectId].correct += 1;
      }
    });

    Object.keys(subjectStats).forEach(id => {
      const s = subjectStats[id];
      s.percentage = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    });

    // Lowest performing subjects
    const weakList = Object.entries(subjectStats)
      .filter(([_, stats]) => stats.total >= 1)
      .sort((a, b) => a[1].percentage - b[1].percentage);

    return { totalAttempts, correctCount, accuracy, subjectStats, weakList };
  }, [attempts]);

  const scoreRange = profile?.estimatedScoreRange || [125, 145];
  const isLikelyPassing = scoreRange[0] >= 150;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>AI Performance Diagnostics & Readiness</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            FMGE Readiness & Score Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Continuously analyzing accuracy rates, question attempt velocity, mistake patterns, and Grand Test performance to forecast your readiness band.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 space-y-1">
          <span className="text-3xs font-extrabold uppercase text-teal-300">Estimated Score Band</span>
          <div className="text-3xl font-black text-white">{scoreRange[0]} – {scoreRange[1]}</div>
          <span className="text-3xs text-slate-300">Passing Cutoff: 150 / 300</span>
        </div>
      </div>

      {/* Section 38: Educational Readiness Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-2xs text-slate-500 dark:text-slate-400 leading-normal flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
        <span>
          <strong>FMGE Readiness Estimator Notice</strong>: This score band is an educational guideline computed from your practice accuracy and simulated Grand Tests. It is not an official NBEMS forecast.
        </span>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-2xs font-extrabold uppercase text-slate-400">Total Solved</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{analytics.totalAttempts}</div>
          <span className="text-3xs text-teal-600 font-bold">MCQs & PYQs</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-2xs font-extrabold uppercase text-slate-400">Cumulative Accuracy</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{analytics.accuracy}%</div>
          <span className="text-3xs text-slate-400 font-bold">Target: &gt;65%</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-2xs font-extrabold uppercase text-slate-400">Study Streak</span>
          <div className="text-2xl font-black text-amber-500">{profile?.streak || 1} Days</div>
          <span className="text-3xs text-slate-400 font-bold">Consistent Pace</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-2xs font-extrabold uppercase text-slate-400">XP / Candidate Level</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">Lvl {profile?.level || 1}</div>
          <span className="text-3xs text-slate-400 font-bold">{profile?.xp || 0} XP Earned</span>
        </div>
      </div>

      {/* Subject-Wise Accuracy Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-teal-600" />
          <span>Subject-Wise Performance Distribution</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUBJECTS.map((s) => {
            const stats = analytics.subjectStats[s.id] || { total: 0, correct: 0, percentage: 0 };
            return (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-2"
              >
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{s.name}</span>
                  <span className={stats.percentage >= 50 ? 'text-emerald-600' : 'text-slate-500'}>
                    {stats.total > 0 ? `${stats.correct}/${stats.total} (${stats.percentage}%)` : 'No Attempts'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stats.percentage >= 50 ? 'bg-teal-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${stats.total > 0 ? stats.percentage : 15}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Subjects & Targeted Recommendations */}
      {analytics.weakList.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Priority Areas for Immediate Mark Improvement</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.weakList.slice(0, 2).map(([subId, stats]) => (
              <div
                key={subId}
                className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{stats.name}</h4>
                  <span className="text-2xs text-rose-600 dark:text-rose-400 font-bold">
                    Accuracy: {stats.percentage}% ({stats.correct}/{stats.total})
                  </span>
                </div>

                <button
                  onClick={() => navigateToTopic(subId, `${subId}-core-topic`)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-xl text-2xs font-bold shadow-sm"
                >
                  Revise Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
