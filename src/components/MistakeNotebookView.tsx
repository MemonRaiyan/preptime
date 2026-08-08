'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MistakeCategory } from '../types/database';
import { QUESTIONS, SUBJECTS } from '../data/mockDb';
import { 
  AlertTriangle, CheckCircle2, RotateCcw, Brain, Sparkles, 
  HelpCircle, ArrowRight, ShieldCheck, Filter, Trash2 
} from 'lucide-react';

export const MistakeNotebookView: React.FC = () => {
  const { attempts, categorizeMistake, addAttempt, navigateToTopic, setActiveTab } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Filter only incorrect attempts
  const mistakeAttempts = useMemo(() => {
    return attempts.filter(att => !att.isCorrect);
  }, [attempts]);

  // Aggregate repeated mistake frequency by system/topic (Section 17)
  const repeatedMistakeFrequencies = useMemo(() => {
    const freqs: { [key: string]: { count: number; name: string; subjectId: string; topicId: string } } = {
      'Autonomic Pharmacology (Beta Blockers)': { count: 7, name: 'Beta Blockers & ANS Pharmacology', subjectId: 'pharmacology', topicId: 'autonomic-drugs' },
      'Renal Glomerulopathies (Nephrotic Syndrome)': { count: 5, name: 'Nephrotic vs Nephritic Syndromes', subjectId: 'pathology', topicId: 'nephrotic-syndrome' },
      'PSM Epidemiological Study Designs': { count: 8, name: 'Epidemiological Measures & Study Designs', subjectId: 'psm', topicId: 'epidemiology-study-designs' }
    };

    mistakeAttempts.forEach(att => {
      const q = QUESTIONS.find(qu => qu.id === att.questionId);
      if (q) {
        const key = q.systemName;
        if (!freqs[key]) {
          freqs[key] = { count: 1, name: q.systemName, subjectId: q.subjectId, topicId: q.topicId };
        } else {
          freqs[key].count += 1;
        }
      }
    });

    return Object.values(freqs).sort((a, b) => b.count - a.count);
  }, [mistakeAttempts]);

  // Filtered mistake list
  const filteredMistakes = useMemo(() => {
    return mistakeAttempts.filter(att => {
      if (activeCategoryFilter !== 'all' && att.mistakeCategory !== activeCategoryFilter) return false;
      const q = QUESTIONS.find(qu => qu.id === att.questionId);
      if (selectedSubjectFilter !== 'all' && q?.subjectId !== selectedSubjectFilter) return false;
      return true;
    });
  }, [mistakeAttempts, activeCategoryFilter, selectedSubjectFilter]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-indigo-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>AI Root-Cause Mistake Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Mistake Notebook ("My Mistakes")
          </h1>
          <p className="text-xs md:text-sm text-rose-100 leading-relaxed">
            Every incorrect question is automatically logged, categorized by root cause, and tracked for repeated errors so you never repeat the same mistake on exam day.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 space-y-1">
          <span className="text-3xs font-extrabold uppercase text-rose-200">Total Logged Mistakes</span>
          <div className="text-3xl font-black text-white">{mistakeAttempts.length}</div>
          <span className="text-3xs text-rose-100">Ready for Targeted Drill</span>
        </div>
      </div>

      {/* Section 17: Repeated Mistake Frequency Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              AI Detected Repeated Trap Patterns
            </h3>
            <p className="text-2xs text-slate-400">
              Topics where you have frequently chosen incorrect options across practice drills and tests.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {repeatedMistakeFrequencies.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-3xs font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">
                    Failed {item.count} Times
                  </span>
                  <span className="text-3xs text-slate-400 font-bold uppercase">{item.subjectId}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white pt-1">
                  {item.name}
                </h4>
              </div>

              <button
                onClick={() => navigateToTopic(item.subjectId, item.topicId)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>Launch Remedial Revision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Categorization Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs font-bold">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeCategoryFilter === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Mistakes ({mistakeAttempts.length})
            </button>
            {(['concept', 'memory', 'misread', 'silly', 'guess'] as MistakeCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  activeCategoryFilter === cat
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat} Mistakes
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

        </div>

      </div>

      {/* Mistake Items List */}
      <div className="space-y-4">
        {filteredMistakes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              No Mistakes in this Category!
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Great work! Solve more questions in the Practice Arena or Grand Test Simulator to discover any remaining blindspots.
            </p>
            <button
              onClick={() => setActiveTab('practice')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md transition-all"
            >
              Go to Practice Arena
            </button>
          </div>
        ) : (
          filteredMistakes.map((att) => {
            const q = QUESTIONS.find(qu => qu.id === att.questionId);
            if (!q) return null;

            return (
              <div
                key={att.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600">
                      {att.mistakeCategory ? `${att.mistakeCategory.toUpperCase()} MISTAKE` : 'CONCEPT MISTAKE'}
                    </span>
                    <span className="text-2xs text-slate-400 font-bold">{q.systemName}</span>
                  </div>
                  <span className="text-3xs text-slate-400">
                    Logged {new Date(att.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {q.questionText}
                </h3>

                {/* Answer comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Your Choice: {q.options[att.selectedOptionIndex] || 'Option ' + String.fromCharCode(65 + att.selectedOptionIndex)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Correct Answer: {q.options[q.correctAnswerIndex]}</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Medical Rationale:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-2xs text-amber-800 dark:text-amber-300 font-bold">
                    💡 High Yield Point: {q.highYieldPoint}
                  </div>
                </div>

                {/* Categorize & Re-test Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-1.5 text-2xs">
                    <span className="font-bold text-slate-400">Change Category:</span>
                    {(['concept', 'memory', 'misread', 'silly', 'guess'] as MistakeCategory[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => categorizeMistake(att.id, cat)}
                        className={`px-2 py-0.5 rounded capitalize font-bold transition-all ${
                          att.mistakeCategory === cat
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => navigateToTopic(q.subjectId, q.topicId)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <span>Read Topic High-Yield Notes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
