'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, TOPICS, QUESTIONS, FLASHCARDS, CLINICAL_CASES, FREE_RESOURCES } from '../data/mockDb';
import { 
  BookOpen, CheckCircle2, ChevronRight, Sparkles, Video, 
  PenTool, Brain, Stethoscope, ArrowRight, Layers, Compass 
} from 'lucide-react';

export const SyllabusMapView: React.FC = () => {
  const { navigateToTopic, attempts, flashcards } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pre-clinical' | 'para-clinical' | 'clinical'>('all');
  const [activeSubjectId, setActiveSubjectId] = useState<string>('medicine');

  const filteredSubjects = SUBJECTS.filter(s => 
    selectedCategory === 'all' || s.category === selectedCategory
  );

  const currentSubject = SUBJECTS.find(s => s.id === activeSubjectId) || SUBJECTS[0];
  const subjectTopics = TOPICS.filter(t => t.subjectId === currentSubject.id);

  // Compute mastery status based on attempts
  const getTopicStatus = (topicId: string) => {
    const topicAttempts = attempts.filter(a => a.topicId === topicId);
    if (topicAttempts.length === 0) return 'Not Started';
    const correctCount = topicAttempts.filter(a => a.isCorrect).length;
    if (correctCount >= 5) return 'Mastered';
    if (topicAttempts.length >= 3) return 'Practicing';
    return 'Learning';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Mastered':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Practicing':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
      case 'Learning':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Visual Preparation Map</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            FMGE 19-Subject Syllabus Map
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Navigate the complete NBEMS examination curriculum. Track your topic mastery from <em>Not Started</em> to <em>Mastered</em> with instant access to free videos, notes, MCQs, and clinical cases.
          </p>
        </div>

        <div className="flex gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-xs font-bold shrink-0">
          {(['all', 'pre-clinical', 'para-clinical', 'clinical'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-md font-black'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All (300M)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column View: Left Subjects List + Right Subject Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: 19 Subjects selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-2 max-h-[700px] overflow-y-auto">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 px-3 py-2">
            Select Discipline
          </h3>
          
          {filteredSubjects.map((sub) => {
            const isSelected = sub.id === currentSubject.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubjectId(sub.id)}
                className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{sub.name}</div>
                  <span className={`text-3xs uppercase font-extrabold ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                    {sub.category} • {sub.weightage} Marks
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Subject Map & Topics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Subject Overview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-2xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  {currentSubject.category.toUpperCase()} DISCIPLINE
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {currentSubject.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-2xs text-slate-400 font-bold block">Exam Weightage</span>
                <span className="text-xl font-black text-teal-600 dark:text-teal-400">
                  {currentSubject.weightage} Marks
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentSubject.description || `Core high-yield discipline testing pathophysiological foundations and clinical diagnostic dilemmas.`}
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-3xs text-slate-400 block font-bold">Total Systems</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentSubject.systems.length}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-3xs text-slate-400 block font-bold">MCQs in QBank</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {QUESTIONS.filter(q => q.subjectId === currentSubject.id).length || 15}+
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-3xs text-slate-400 block font-bold">Free Resources</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {FREE_RESOURCES.filter(r => r.subjectId === currentSubject.id).length || 4}+
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-3xs text-slate-400 block font-bold">Flashcards</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {FLASHCARDS.filter(f => f.subjectId === currentSubject.id).length || 10}+
                </span>
              </div>
            </div>
          </div>

          {/* Topics Tree & Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Syllabus Topics & Mastery Level</span>
            </h3>

            <div className="space-y-3">
              {subjectTopics.map((topic) => {
                const status = getTopicStatus(topic.id);
                return (
                  <div
                    key={topic.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xs font-extrabold text-slate-400 uppercase">
                          {topic.systemName}
                        </span>
                        <span className={`text-3xs font-black px-2 py-0.5 rounded-full border ${getStatusBadge(status)}`}>
                          {status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                        {topic.name}
                      </h4>
                      <p className="text-2xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {topic.highYieldNotes.slice(0, 140)}...
                      </p>
                    </div>

                    <button
                      onClick={() => navigateToTopic(topic.subjectId, topic.id)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all shrink-0 w-full sm:w-auto justify-center"
                    >
                      <span>Open Topic Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
