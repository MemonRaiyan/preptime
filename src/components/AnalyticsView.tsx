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

    let videoSolved = 0;
    let imageSolved = 0;
    let textSolved = 0;

    attempts.forEach(att => {
      const q = QUESTIONS.find(qu => qu.id === att.questionId);
      if (q) {
        if (subjectStats[q.subjectId]) {
          subjectStats[q.subjectId].total += 1;
          if (att.isCorrect) subjectStats[q.subjectId].correct += 1;
        }
        if (q.type === 'video' || q.videoUrl) {
          videoSolved++;
        } else if (q.imageUrl || q.imagePath) {
          imageSolved++;
        } else {
          textSolved++;
        }
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

    const totalVideo = QUESTIONS.filter(q => q.type === 'video' || q.videoUrl).length;
    const totalImage = QUESTIONS.filter(q => q.imageUrl || q.imagePath).length;
    const totalText = QUESTIONS.length - totalVideo - totalImage;
    const qbankCompletionPercentage = QUESTIONS.length > 0 
      ? Math.round((attempts.length / QUESTIONS.length) * 100) 
      : 0;

    return { 
      totalAttempts, correctCount, accuracy, subjectStats, weakList,
      videoSolved, totalVideo, 
      imageSolved, totalImage, 
      textSolved, totalText,
      qbankCompletionPercentage 
    };
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

      {/* Media Type & Exam QBank Completion Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Question Type Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Solved Questions by Format type</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* Text Type */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">📝 Standard Clinical MCQs</span>
                <span className="text-slate-800 dark:text-slate-200">{analytics.textSolved} / {analytics.totalText}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${analytics.totalText > 0 ? (analytics.textSolved / analytics.totalText) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Video Type */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">🎬 Video-Based Clinical Questions</span>
                <span className="text-slate-800 dark:text-slate-200">{analytics.videoSolved} / {analytics.totalVideo}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all"
                  style={{ width: `${analytics.totalVideo > 0 ? (analytics.videoSolved / analytics.totalVideo) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Image Type */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">🖼️ Image-Based Diagnostic Questions</span>
                <span className="text-slate-800 dark:text-slate-200">{analytics.imageSolved} / {analytics.totalImage}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${analytics.totalImage > 0 ? (analytics.imageSolved / analytics.totalImage) * 100 : 0}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Card 2: Syllabus Completion Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Target className="w-4 h-4 text-teal-600" />
              <span>Full QBank Completion Ratio</span>
            </h3>
            <p className="text-3xs text-slate-500 leading-normal">
              Your overall coverage of the 2,000+ medical questions mapped to pre-clinical, para-clinical, and clinical disciplines.
            </p>
          </div>

          <div className="flex items-center space-x-5 py-2">
            {/* Progress Circular representation */}
            <div className="relative w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center font-black text-base text-teal-600 dark:text-teal-400">
              {analytics.qbankCompletionPercentage}%
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">Syllabus Completion</span>
              <span className="text-3xs text-slate-400 font-medium">Goal: 100% completion before exam horizon</span>
            </div>
          </div>
          <div className="text-3xs text-slate-400">
            Current Target Score is locked at <strong className="text-teal-600 dark:text-teal-400">150 / 300 passing threshold</strong>.
          </div>
        </div>

      </div>

      {/* Completed Past Papers & Simulators List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
          <Award className="w-4.5 h-4.5 text-indigo-500" />
          <span>Completed Official Past Papers & Grand Test Simulators</span>
        </h3>
        
        {gtAttempts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-850">
            No papers or simulation tests completed yet. Navigate to the <strong>Grand Test Series</strong> to run a simulation.
          </div>
        ) : (
          <div className="space-y-3.5">
            {gtAttempts.map((att) => (
              <div
                key={att.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs transition-all hover:bg-slate-100/50"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">{att.testTitle}</span>
                    <span className={`text-3xs font-extrabold px-2 py-0.5 rounded ${
                      att.passed ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {att.passed ? 'PASS' : 'REVISE'}
                    </span>
                  </div>
                  <span className="text-3xs text-slate-400 block mt-1">
                    Completed on {new Date(att.timestamp).toLocaleDateString()} • accuracy: {att.percentage}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {att.score} / {att.totalQuestions}
                  </span>
                  <span className="text-3xs block text-slate-400">Score Achieved</span>
                </div>
              </div>
            ))}
          </div>
        )}
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
