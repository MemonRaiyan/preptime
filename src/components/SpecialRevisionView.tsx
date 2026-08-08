'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOPICS, SUBJECTS } from '../data/mockDb';
import { 
  RotateCcw, Sparkles, BookOpen, Layers, Table, 
  Brain, ArrowRight, Zap, CheckCircle2 
} from 'lucide-react';

export const SpecialRevisionView: React.FC = () => {
  const { navigateToTopic } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeTab, setActiveTabState] = useState<'traps' | 'mnemonics' | 'comparisons'>('traps');

  const filteredTopics = TOPICS.filter(t => 
    selectedSubject === 'all' || t.subjectId === selectedSubject
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Last-Month Rapid Revision Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Rapid Revision & MCQ Traps
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Consolidated 2-minute high-yield summaries, critical option traps, mnemonics, and comparison tables designed for rapid recall before examination day.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTabState('traps')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'traps' ? 'bg-white text-slate-900 font-black shadow-md' : 'text-white/80'
            }`}
          >
            ⚠️ MCQ Traps
          </button>
          <button
            onClick={() => setActiveTabState('mnemonics')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'mnemonics' ? 'bg-white text-slate-900 font-black shadow-md' : 'text-white/80'
            }`}
          >
            🧠 Mnemonics
          </button>
          <button
            onClick={() => setActiveTabState('comparisons')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'comparisons' ? 'bg-white text-slate-900 font-black shadow-md' : 'text-white/80'
            }`}
          >
            ⚖️ Tables
          </button>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-all ${
            selectedSubject === 'all'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Subjects ({TOPICS.length})
        </button>

        {SUBJECTS.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.id)}
            className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-all ${
              selectedSubject === s.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Content Display */}
      {activeTab === 'traps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map(topic => (
            <div
              key={topic.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-extrabold text-teal-600 dark:text-teal-400 uppercase">
                    {topic.subjectId.toUpperCase()} • {topic.systemName}
                  </span>
                  <span className="text-3xs font-extrabold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600">
                    High Trap Risk
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {topic.name}
                </h3>
                <div className="p-3.5 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                  {topic.commonTraps ? topic.commonTraps[0] : 'Avoid confusing acute management with long-term maintenance therapy.'}
                </div>
              </div>

              <button
                onClick={() => navigateToTopic(topic.subjectId, topic.id)}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Read Full Revision Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mnemonics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map(topic => (
            <div
              key={topic.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-2xs font-extrabold text-purple-600 dark:text-purple-400 uppercase">
                  {topic.systemName}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {topic.name}
                </h3>
                <div className="p-3.5 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 text-xs text-purple-800 dark:text-purple-300 font-mono">
                  {topic.mnemonics ? topic.mnemonics[0] : '"Remember the key diagnostic rule for this high-yield entity."'}
                </div>
              </div>

              <button
                onClick={() => navigateToTopic(topic.subjectId, topic.id)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Open in Study Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'comparisons' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            High-Yield Clinical Comparison Matrices
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-750 text-slate-400 font-extrabold uppercase">
                  <th className="py-3 px-4">Entity 1</th>
                  <th className="py-3 px-4">Entity 2</th>
                  <th className="py-3 px-4">Differentiating Investigation / Feature</th>
                  <th className="py-3 px-4">Exam Trap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Nephrotic Syndrome</td>
                  <td className="py-3.5 px-4">Nephritic Syndrome</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-600">Massive Proteinuria (&gt;3.5g/d) vs RBC Casts &amp; Hematuria</td>
                  <td className="py-3.5 px-4 text-rose-600">RBC casts indicate glomerulonephritis, NOT nephrotic</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Hanging (Suicidal)</td>
                  <td className="py-3.5 px-4">Ligature Strangulation</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-600">High, Oblique, Incomplete Mark vs Low, Horizontal, Continuous</td>
                  <td className="py-3.5 px-4 text-rose-600">Saliva dribbling is pathognomonic of ante-mortem hanging</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Erb Palsy (C5-C6)</td>
                  <td className="py-3.5 px-4">Klumpke Palsy (C8-T1)</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-600">Waiter&apos;s Tip (Adducted, pronated) vs Total Claw Hand + Horner</td>
                  <td className="py-3.5 px-4 text-rose-600">Traction angle determines root injury level</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
