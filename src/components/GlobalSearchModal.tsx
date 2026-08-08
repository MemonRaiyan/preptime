'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, TOPICS, QUESTIONS, FLASHCARDS, CLINICAL_CASES, FREE_RESOURCES } from '../data/mockDb';
import { 
  Search, X, BookOpen, Video, PenTool, Award, Brain, 
  Stethoscope, Sparkles, RotateCcw, ArrowRight, ShieldCheck, FileText, CheckCircle2
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, navigateToTopic, setActiveTab } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Real-time search grouping across 8 dimensions
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        topics: TOPICS.slice(0, 4),
        resources: FREE_RESOURCES.slice(0, 4),
        questions: QUESTIONS.filter(qu => !qu.isVerifiedPyq).slice(0, 3),
        pyqs: QUESTIONS.filter(qu => qu.isVerifiedPyq).slice(0, 3),
        flashcards: FLASHCARDS.slice(0, 3),
        cases: CLINICAL_CASES.slice(0, 2),
        totalMatches: 19
      };
    }

    const matchedTopics = TOPICS.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.highYieldNotes.toLowerCase().includes(q) ||
      t.systemName.toLowerCase().includes(q) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
    );

    const matchedResources = FREE_RESOURCES.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.source.toLowerCase().includes(q)
    );

    const matchedQuestions = QUESTIONS.filter(qu => 
      !qu.isVerifiedPyq && (
        qu.questionText.toLowerCase().includes(q) ||
        qu.highYieldPoint.toLowerCase().includes(q) ||
        qu.systemName.toLowerCase().includes(q)
      )
    );

    const matchedPyqs = QUESTIONS.filter(qu => 
      qu.isVerifiedPyq && (
        qu.questionText.toLowerCase().includes(q) ||
        qu.highYieldPoint.toLowerCase().includes(q) ||
        qu.systemName.toLowerCase().includes(q) ||
        (qu.source && qu.source.toLowerCase().includes(q))
      )
    );

    const matchedFlashcards = FLASHCARDS.filter(fc => 
      fc.front.toLowerCase().includes(q) ||
      fc.back.toLowerCase().includes(q) ||
      (fc.systemName && fc.systemName.toLowerCase().includes(q))
    );

    const matchedCases = CLINICAL_CASES.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.systemName.toLowerCase().includes(q) ||
      c.patientVignette.chiefComplaint.toLowerCase().includes(q)
    );

    const totalMatches = 
      matchedTopics.length + matchedResources.length + 
      matchedQuestions.length + matchedPyqs.length + 
      matchedFlashcards.length + matchedCases.length;

    return {
      topics: matchedTopics,
      resources: matchedResources,
      questions: matchedQuestions,
      pyqs: matchedPyqs,
      flashcards: matchedFlashcards,
      cases: matchedCases,
      totalMatches
    };
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelectTopic = (subjectId: string, topicId: string) => {
    closeSearch();
    navigateToTopic(subjectId, topicId);
  };

  const handleOpenTutor = () => {
    closeSearch();
    setActiveTab('ai-tutor');
  };

  const handleOpenPractice = () => {
    closeSearch();
    setActiveTab('practice');
  };

  const handleOpenFlashcards = () => {
    closeSearch();
    setActiveTab('flashcards');
  };

  const handleOpenCases = () => {
    closeSearch();
    setActiveTab('clinical-cases');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 px-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
        
        {/* Search Header Bar */}
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any FMGE topic, e.g. 'ECG', 'Preeclampsia', 'Brachial Plexus', 'Beta Blockers'..."
            className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 font-semibold text-lg md:text-xl"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 overflow-x-auto text-xs font-bold scrollbar-none">
          <button 
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              activeCategoryFilter === 'all' 
                ? 'bg-teal-600 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Results ({searchResults.totalMatches})
          </button>
          <button 
            onClick={() => setActiveCategoryFilter('learn')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              activeCategoryFilter === 'learn' 
                ? 'bg-teal-600 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            📄 Notes ({searchResults.topics.length})
          </button>
          <button 
            onClick={() => setActiveCategoryFilter('videos')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              activeCategoryFilter === 'videos' 
                ? 'bg-teal-600 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            📺 Free Media ({searchResults.resources.length})
          </button>
          <button 
            onClick={() => setActiveCategoryFilter('pyqs')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              activeCategoryFilter === 'pyqs' 
                ? 'bg-teal-600 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            🎯 Verified PYQs ({searchResults.pyqs.length})
          </button>
          <button 
            onClick={() => setActiveCategoryFilter('mcqs')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              activeCategoryFilter === 'mcqs' 
                ? 'bg-teal-600 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            📝 MCQs ({searchResults.questions.length})
          </button>
        </div>

        {/* Results Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick AI Action Card */}
          <div className="bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-purple-500/10 border border-teal-500/30 dark:border-teal-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-black shadow-md shadow-teal-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Ask Free AI Tutor about {query ? `"${query}"` : 'any FMGE topic'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant simple explanation, high-yield exam traps, and automatic 5-MCQ drill.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenTutor}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all shrink-0"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: LEARN (Smart Notes & Core Topics) */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'learn') && searchResults.topics.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Learn — High-Yield Topic Notes ({searchResults.topics.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.topics.map((topic) => {
                  const subject = SUBJECTS.find(s => s.id === topic.subjectId);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic.subjectId, topic.id)}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 dark:hover:border-teal-500 cursor-pointer transition-all hover:shadow-md group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xs font-extrabold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
                          {subject?.name || topic.subjectId}
                        </span>
                        <span className="text-2xs text-slate-400">{topic.systemName}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {topic.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {topic.highYieldNotes.replace(/###|\*|__/g, '')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: FREE VIDEOS & RESOURCES */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'videos') && searchResults.resources.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Free Educational Media & Guidelines ({searchResults.resources.length})</span>
              </div>
              <div className="space-y-2">
                {searchResults.resources.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => {
                      closeSearch();
                      setActiveTab('resources');
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-indigo-500 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                        {res.resourceType === 'VIDEO' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {res.title}
                          </span>
                          <span className="text-3xs font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                            {res.license}
                          </span>
                        </div>
                        <div className="text-2xs text-slate-400 truncate">
                          Source: {res.source} • {res.author} • {res.duration}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: VERIFIED PYQS */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'pyqs') && searchResults.pyqs.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Verified Official PYQs ({searchResults.pyqs.length})</span>
              </div>
              <div className="space-y-2">
                {searchResults.pyqs.map((q) => (
                  <div
                    key={q.id}
                    onClick={handleOpenPractice}
                    className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 hover:border-amber-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xs font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        {q.source || `FMGE ${q.pyqYear} Official`}
                      </span>
                      <span className="text-2xs text-slate-400">{q.systemName}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {q.questionText}
                    </p>
                    <div className="mt-2 text-2xs text-amber-600 dark:text-amber-400 font-bold">
                      💡 High Yield Pearl: {q.highYieldPoint}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: PRACTICE MCQS */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'mcqs') && searchResults.questions.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                <PenTool className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>FMGE Practice Questions ({searchResults.questions.length})</span>
              </div>
              <div className="space-y-2">
                {searchResults.questions.map((q) => (
                  <div
                    key={q.id}
                    onClick={handleOpenPractice}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-2xs text-slate-400 mb-1">
                      <span>{q.systemName}</span>
                      <span className="capitalize">{q.difficulty} Difficulty</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                      {q.questionText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: FLASHCARDS */}
          {activeCategoryFilter === 'all' && searchResults.flashcards.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Spaced Repetition Flashcards ({searchResults.flashcards.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.flashcards.map((fc) => (
                  <div
                    key={fc.id}
                    onClick={handleOpenFlashcards}
                    className="p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 hover:border-purple-500 cursor-pointer transition-all"
                  >
                    <div className="text-2xs font-extrabold text-purple-600 dark:text-purple-400 mb-1">
                      Flashcard Prompt
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {fc.front}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: CLINICAL CASES */}
          {activeCategoryFilter === 'all' && searchResults.cases.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                <Stethoscope className="w-4 h-4 text-rose-500" />
                <span>Interactive Clinical Cases ({searchResults.cases.length})</span>
              </div>
              <div className="space-y-2">
                {searchResults.cases.map((c) => (
                  <div
                    key={c.id}
                    onClick={handleOpenCases}
                    className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 hover:border-rose-500 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="text-2xs font-extrabold text-rose-600 dark:text-rose-400">
                        {c.patientVignette.age}yo {c.patientVignette.gender} • {c.systemName}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {c.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Chief Complaint: {c.patientVignette.chiefComplaint}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results fallback */}
          {searchResults.totalMatches === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">No direct matches found for "{query}"</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Try searching for broader medical subjects, symptoms, drug classes, or ask the AI Tutor directly.
              </p>
              <button
                onClick={handleOpenTutor}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg transition-all"
              >
                Ask AI Tutor to Explain "{query}"
              </button>
            </div>
          )}

        </div>

        {/* Footer shortcuts */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between text-2xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">ESC</kbd> to close</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Ctrl+K</kbd> to open anytime</span>
          </div>
          <span className="font-bold text-teal-600 dark:text-teal-400">FMGE Master One-Search</span>
        </div>

      </div>
    </div>
  );
};
