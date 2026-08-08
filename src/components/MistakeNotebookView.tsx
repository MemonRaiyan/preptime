'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QUESTIONS, SUBJECTS } from '../data/mockDb';
import { MistakeCategory } from '../types/database';
import { 
  AlertTriangle, Brain, AlertCircle, RefreshCw, BarChart2, 
  HelpCircle, ChevronRight, PenTool, CheckCircle, Flame 
} from 'lucide-react';

export const MistakeNotebookView: React.FC = () => {
  const { attempts, categorizeMistake, setActiveTab } = useApp();

  // Find incorrect attempts and match them to questions
  const mistakes = attempts.filter(att => !att.isCorrect).map(att => {
    const question = QUESTIONS.find(q => q.id === att.questionId);
    return {
      attempt: att,
      question
    };
  }).filter(m => m.question !== undefined); // filter out invalid questions

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Group stats
  const totalMistakes = mistakes.length;
  const categories: { id: MistakeCategory; label: string; color: string; desc: string }[] = [
    { id: 'concept', label: 'Concept Mistake', color: 'bg-rose-500', desc: 'Need to review notes & pathophysiology' },
    { id: 'memory', label: 'Memory Mistake', color: 'bg-amber-500', desc: 'Forgot active recall or drug of choice' },
    { id: 'misread', label: 'Misread Question', color: 'bg-indigo-500', desc: 'Missed keywords like "EXCEPT" or "MOST"' },
    { id: 'silly', label: 'Silly Mistake', color: 'bg-blue-500', desc: 'Accidental click or calculation error' },
    { id: 'guess', label: 'Educated Guess', color: 'bg-teal-500', desc: 'Gave a shot on 50/50 options' }
  ];

  const categoryCounts = mistakes.reduce((acc, curr) => {
    const cat = curr.attempt.mistakeCategory || 'concept';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as { [key in MistakeCategory]?: number });

  const getSubjectName = (subId: string) => {
    return SUBJECTS.find(s => s.id === subId)?.name || subId;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-900 to-rose-950 p-8 rounded-3xl border border-rose-800 text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-rose-300 border border-white/10">
            <AlertTriangle className="w-3.5 h-3.5 fill-current" />
            <span>Smart Revision Hub</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Mistake Notebook</h1>
          <p className="text-rose-105 text-rose-200 text-sm max-w-md">
            Do not run away from incorrect answers. Categorize your errors to see patterns and study target weaknesses.
          </p>
        </div>

        {totalMistakes > 0 && (
          <button
            onClick={() => setActiveTab('practice')}
            className="px-6 py-3.5 bg-white text-rose-900 hover:bg-rose-50 rounded-2xl text-xs font-extrabold shadow-lg active:scale-95 transition-all flex items-center space-x-2 shrink-0"
          >
            <PenTool className="w-4 h-4" />
            <span>Launch Mistake Test ({totalMistakes})</span>
          </button>
        )}
      </div>

      {totalMistakes === 0 ? (
        // Empty state
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-900/40">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-white">Notebook is Clean!</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Awesome job! You have not logged any mistakes. Jump to Practice Arena to start your diagnostics.
          </p>
          <button
            onClick={() => setActiveTab('practice')}
            className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Go to Practice Arena
          </button>
        </div>
      ) : (
        // Mistake Notebook Dashboard
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left panel: Category distribution analysis */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit space-y-6">
            <div>
              <h3 className="font-bold text-sm text-slate-850 dark:text-white mb-2">Failure Category Distribution</h3>
              <p className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Categorization helps pinpoint habit loop changes</p>
            </div>

            {/* Custom visual progress bar */}
            <div className="space-y-4">
              {categories.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const percentage = Math.round((count / totalMistakes) * 100);
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex justify-between text-2xs font-bold text-slate-600 dark:text-slate-400">
                      <span>{cat.label}</span>
                      <span className="text-slate-850 dark:text-slate-250">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                      <div 
                        className={`${cat.color} h-full rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-4xs text-slate-400 block">{cat.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Mistakes list explorer */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-850 dark:text-white mb-2">Log Registry ({totalMistakes} incorrect responses)</h3>
            
            <div className="space-y-3">
              {mistakes.map((item, idx) => {
                const q = item.question!;
                const isExpanded = expandedIndex === idx;
                const activeCategory = item.attempt.mistakeCategory || 'concept';
                
                return (
                  <div 
                    key={item.attempt.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
                  >
                    {/* Collapsed Header */}
                    <div 
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/20"
                    >
                      <div className="space-y-1 overflow-hidden pr-4">
                        <span className="block text-4xs font-bold uppercase tracking-wider text-teal-650 dark:text-teal-400">
                          {getSubjectName(q.subjectId)} • {q.systemName}
                        </span>
                        <p className="text-xs font-bold text-slate-850 dark:text-white truncate">
                          {q.questionText}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <span className={`text-4xs font-extrabold uppercase px-2.5 py-1.5 rounded-md text-white ${
                          categories.find(c => c.id === activeCategory)?.color || 'bg-rose-500'
                        }`}>
                          {activeCategory}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-all ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10 space-y-6">
                        {/* Question text */}
                        <div className="space-y-2">
                          <span className="text-2xs font-extrabold uppercase text-slate-500">Question Body</span>
                          <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-300 leading-relaxed">
                            {q.questionText}
                          </p>
                        </div>

                        {/* Answers comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border border-rose-250 bg-rose-500/5 rounded-xl border border-rose-100 dark:border-rose-950/10">
                            <span className="block text-4xs font-extrabold uppercase tracking-wider text-rose-500 mb-1">Your Answer</span>
                            <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                              {q.options[item.attempt.selectedOptionIndex]}
                            </span>
                          </div>
                          <div className="p-4 border border-emerald-250 bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-950/10">
                            <span className="block text-4xs font-extrabold uppercase tracking-wider text-emerald-500 mb-1">Correct Answer</span>
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              {q.options[q.correctAnswerIndex]}
                            </span>
                          </div>
                        </div>

                        {/* Mistake categorization modifier */}
                        <div className="space-y-3">
                          <span className="block text-2xs font-extrabold uppercase text-slate-500">Change Error Classification:</span>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => categorizeMistake(item.attempt.id, cat.id)}
                                className={`px-3 py-1.5 rounded-full text-3xs font-extrabold tracking-wide uppercase transition-all ${
                                  activeCategory === cat.id
                                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-white shadow-sm'
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                                }`}
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Detailed explanation */}
                        <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-xl space-y-1.5">
                          <span className="block text-2xs font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">Explanation Review</span>
                          <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
