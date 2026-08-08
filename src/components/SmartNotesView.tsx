'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, TOPICS, QUESTIONS, FLASHCARDS, CLINICAL_CASES, FREE_RESOURCES } from '../data/mockDb';
import { 
  BookOpen, Video, Brain, PenTool, Award, Stethoscope, 
  Sparkles, RotateCcw, CheckCircle2, ChevronRight, Share2, 
  Bookmark, ArrowRight, Layers 
} from 'lucide-react';

export const SmartNotesView: React.FC = () => {
  const { selectedSubjectId, selectedTopicId, setSelectedSubjectId, setSelectedTopicId, setActiveTab } = useApp();

  const [activeSubject, setActiveSubject] = useState<string>(selectedSubjectId || 'medicine');
  const [activeTopicId, setActiveTopicId] = useState<string>(selectedTopicId || 'myocardial-infarction');
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'videos' | 'flashcards' | 'mcqs' | 'cases' | 'mnemonics'>('notes');

  const currentSubject = SUBJECTS.find(s => s.id === activeSubject) || SUBJECTS[0];
  const subjectTopics = TOPICS.filter(t => t.subjectId === currentSubject.id);
  const currentTopic = TOPICS.find(t => t.id === activeTopicId) || subjectTopics[0] || TOPICS[0];

  // Connected content for active topic
  const connectedResources = FREE_RESOURCES.filter(r => r.topicId === currentTopic.id || r.subjectId === currentTopic.subjectId);
  const connectedQuestions = QUESTIONS.filter(q => q.topicId === currentTopic.id || q.subjectId === currentTopic.subjectId);
  const connectedPyqs = connectedQuestions.filter(q => q.isVerifiedPyq);
  const connectedFlashcards = FLASHCARDS.filter(f => f.subjectId === currentTopic.subjectId);
  const connectedCases = CLINICAL_CASES.filter(c => c.subjectId === currentTopic.subjectId);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Subject Selector Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSubject(s.id);
              const firstT = TOPICS.find(t => t.subjectId === s.id);
              if (firstT) setActiveTopicId(firstT.id);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSubject === s.id
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-teal-500'
            }`}
          >
            {s.name} ({s.weightage}M)
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Topic Selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-2 max-h-[700px] overflow-y-auto">
          <span className="text-2xs font-extrabold uppercase text-slate-400 block px-3 py-1">
            {currentSubject.name} Topics
          </span>

          {subjectTopics.map((topic) => {
            const isSelected = topic.id === currentTopic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-teal-500/10 border border-teal-500 text-teal-600 dark:text-teal-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-2xs uppercase text-slate-400 font-bold">{topic.systemName}</div>
                <div className="text-xs truncate">{topic.name}</div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Central Learning Page (Section 26) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Topic Title Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-2xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                {currentSubject.name} • {currentTopic.systemName}
              </span>
              <button
                onClick={() => setActiveTab('ai-tutor')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI About This Topic</span>
              </button>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {currentTopic.name}
            </h1>

            {/* Connected Hub Sub-Tabs (Section 26) */}
            <div className="flex items-center space-x-2 overflow-x-auto text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-2 scrollbar-none">
              <button
                onClick={() => setActiveSubTab('notes')}
                className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                  activeSubTab === 'notes' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>High-Yield Notes</span>
              </button>

              <button
                onClick={() => setActiveSubTab('videos')}
                className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                  activeSubTab === 'videos' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Free Media ({connectedResources.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('mcqs')}
                className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                  activeSubTab === 'mcqs' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>MCQs & PYQs ({connectedQuestions.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('flashcards')}
                className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                  activeSubTab === 'flashcards' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Flashcards ({connectedFlashcards.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('cases')}
                className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                  activeSubTab === 'cases' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Clinical Cases ({connectedCases.length})</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab 1: High Yield Notes */}
          {activeSubTab === 'notes' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="prose dark:prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                {currentTopic.highYieldNotes}
              </div>

              {/* Traps and Pearls */}
              {currentTopic.commonTraps && currentTopic.commonTraps.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1 text-xs">
                  <span className="font-extrabold text-rose-700 dark:text-rose-300 block uppercase tracking-wider">
                    ⚠️ Critical FMGE MCQ Trap
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">
                    {currentTopic.commonTraps[0]}
                  </p>
                </div>
              )}

              {currentTopic.clinicalPearls && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
                  <span className="font-extrabold text-amber-800 dark:text-amber-300 block uppercase tracking-wider">
                    💡 Clinical Pearl
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">
                    {currentTopic.clinicalPearls}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 2: Free Media & External Resources */}
          {activeSubTab === 'videos' && (
            <div className="space-y-4">
              {connectedResources.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center text-xs text-slate-400">
                  No video indexed specifically for this sub-topic yet. Check the Free Resource Hub for general subject lectures.
                </div>
              ) : (
                connectedResources.map(res => (
                  <div
                    key={res.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-3xs font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                        {res.license}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {res.title}
                      </h4>
                      <p className="text-2xs text-slate-400">
                        Source: {res.source} • {res.author} • {res.duration}
                      </p>
                    </div>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 ml-4 shadow-sm"
                    >
                      Watch Free
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub-Tab 3: MCQs & PYQs */}
          {activeSubTab === 'mcqs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-teal-500/10 p-4 rounded-2xl border border-teal-500/20 text-xs">
                <span className="font-bold text-teal-900 dark:text-teal-200">
                  Available practice questions and past exam items for this topic.
                </span>
                <button
                  onClick={() => setActiveTab('practice')}
                  className="bg-teal-600 text-white px-3 py-1.5 rounded-xl font-bold text-2xs"
                >
                  Open in Practice Arena
                </button>
              </div>

              {connectedQuestions.slice(0, 3).map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-extrabold text-teal-600 dark:text-teal-400">
                      {q.source || (q.isVerifiedPyq ? 'Verified Official PYQ' : 'FMGE Practice MCQ')}
                    </span>
                    <span className="text-3xs text-slate-400 capitalize">{q.difficulty}</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    {q.questionText}
                  </p>
                  <div className="space-y-1 text-2xs">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border ${
                          oIdx === q.correctAnswerIndex
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab 4: Flashcards */}
          {activeSubTab === 'flashcards' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 text-xs">
                <span className="font-bold text-purple-900 dark:text-purple-200">
                  Spaced Repetition Flashcard Deck for {currentSubject.name}.
                </span>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className="bg-purple-600 text-white px-3 py-1.5 rounded-xl font-bold text-2xs"
                >
                  Launch SuperMemo-2 Deck
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectedFlashcards.slice(0, 4).map(fc => (
                  <div
                    key={fc.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-600">
                      Flashcard Prompt
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {fc.front}
                    </h4>
                    <p className="text-2xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {fc.back.replace(/[*#]/g, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Clinical Cases */}
          {activeSubTab === 'cases' && (
            <div className="space-y-4">
              {connectedCases.map(c => (
                <div
                  key={c.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-extrabold text-rose-600 dark:text-rose-400">
                      Clinical Vignette • {c.patientVignette.age}yo {c.patientVignette.gender}
                    </span>
                    <button
                      onClick={() => setActiveTab('clinical-cases')}
                      className="bg-rose-600 text-white px-3 py-1 rounded-xl text-2xs font-bold"
                    >
                      Play Case Simulator
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chief Complaint: {c.patientVignette.chiefComplaint}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
