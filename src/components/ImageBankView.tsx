'use client';

import React, { useState } from 'react';
import { QUESTIONS, SUBJECTS } from '../data/mockDb';
import { Question } from '../types/database';
import { useApp } from '../context/AppContext';
import { 
  Image as ImageIcon, Sparkles, AlertCircle, CheckCircle2, 
  HelpCircle, ChevronRight, Filter, Info, Eye 
} from 'lucide-react';

export const ImageBankView: React.FC = () => {
  const { addAttempt } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});

  // Filter image questions
  const imageQuestions = QUESTIONS.filter(q => q.type === 'image');
  const filteredQuestions = selectedFilter === 'all'
    ? imageQuestions
    : imageQuestions.filter(q => q.subjectId === selectedFilter);

  const getSubjectName = (subId: string) => {
    return SUBJECTS.find(s => s.id === subId)?.name || subId;
  };

  const handleSelectOption = (qId: string, optIdx: number, correctAnswerIndex: number) => {
    if (selectedAnswers[qId] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
    const isCorrect = optIdx === correctAnswerIndex;
    addAttempt(qId, optIdx, isCorrect, 15);
  };

  const activeQ = QUESTIONS.find(q => q.id === selectedQuestionId);

  return (
    <div className="space-y-6 pb-20">
      {selectedQuestionId === null ? (
        // Gallery selection screen
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight">Active Image Bank</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">High-yield visual cases covering pathology slides, ECG curves, dermatological rashes, and radiological indicators.</p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 pb-2">
            {[
              { id: 'all', label: 'All Images' },
              { id: 'pathology', label: 'Pathology Slides' },
              { id: 'medicine', label: 'Cardiology / ECG' },
              { id: 'obg', label: 'Obstetric Scans' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-4 py-2 border rounded-full text-2xs font-extrabold tracking-wide uppercase transition-all ${
                  selectedFilter === f.id
                    ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 text-teal-650'
                    : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredQuestions.map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between h-72 card-hover-effect"
              >
                {/* Visual Image container mockup */}
                <div className="bg-slate-100 dark:bg-slate-950 h-36 flex flex-col items-center justify-center border-b border-slate-150 relative">
                  <ImageIcon className="w-10 h-10 text-teal-600 mb-1" />
                  <span className="text-4xs font-bold uppercase tracking-widest text-slate-400">Diagnostic Slide Slide</span>
                  <span className="text-5xs bg-teal-500/10 text-teal-600 border border-teal-500/30 px-2 py-0.5 rounded font-bold uppercase absolute top-3 left-3">
                    {getSubjectName(item.subjectId)}
                  </span>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs font-bold text-slate-850 dark:text-white line-clamp-2">
                    {item.questionText}
                  </p>
                  
                  <button
                    onClick={() => setSelectedQuestionId(item.id)}
                    className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-3xs font-extrabold tracking-wider uppercase rounded-xl active:scale-95 transition-all flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Examine Case Slide</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Slide diagnosis viewer
        activeQ && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Header / exit controls */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedQuestionId(null)}
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-650 hover:underline"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Return to Gallery</span>
              </button>

              <span className="text-4xs font-bold uppercase tracking-wider text-teal-650 bg-teal-50 dark:bg-teal-950/20 px-3 py-1.5 rounded-full">
                {getSubjectName(activeQ.subjectId)} • {activeQ.systemName}
              </span>
            </div>

            {/* active card workspace */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* slide frame mockup */}
              <div className="bg-slate-950 border border-slate-850 h-64 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full text-4xs font-bold text-teal-400 border border-white/5 flex items-center space-x-1.5">
                  <Info className="w-3 h-3 text-teal-400" />
                  <span>Clinical Slide Viewer Mode</span>
                </div>
                
                <ImageIcon className="w-12 h-12 text-teal-500 fill-teal-500/10 mb-2 animate-pulse" />
                <span className="text-3xs text-white font-extrabold uppercase tracking-widest">{activeQ.systemName} Diagnostic Plate</span>
                <span className="text-4xs text-slate-500 mt-1">Plate reference: {activeQ.id.toUpperCase()}-S2</span>
              </div>

              {/* question prompt */}
              <div className="space-y-4">
                <h3 className="text-sm md:text-base font-extrabold text-slate-850 dark:text-white leading-relaxed">
                  {activeQ.questionText}
                </h3>

                {/* Options checklist */}
                <div className="space-y-3">
                  {activeQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[activeQ.id] !== undefined;
                    const isUserChoice = selectedAnswers[activeQ.id] === optIdx;
                    const isCorrect = optIdx === activeQ.correctAnswerIndex;
                    
                    let optStyles = 'border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50/50 text-slate-800 dark:text-slate-350';

                    if (isSelected) {
                      if (isCorrect) {
                        optStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold';
                      } else if (isUserChoice) {
                        optStyles = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold';
                      } else {
                        optStyles = 'border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(activeQ.id, optIdx, activeQ.correctAnswerIndex)}
                        disabled={isSelected}
                        className={`w-full p-4 text-left border rounded-2xl active:scale-99 transition-all text-xs md:text-sm flex items-center justify-between ${optStyles}`}
                      >
                        <span>{opt}</span>
                        {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                        {isSelected && isUserChoice && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanations block */}
              {selectedAnswers[activeQ.id] !== undefined && (
                <div className="mt-8 border-t border-dashed border-slate-200 dark:border-slate-800 pt-6 space-y-5 animate-pulse-slow">
                  
                  <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-xl space-y-1.5">
                    <span className="block text-2xs font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">Radiology / Pathology Rationale</span>
                    <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-normal">
                      {activeQ.explanation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-55 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 border-slate-100 dark:border-slate-850 rounded-xl">
                      <span className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">Key Imaging Concept</span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                        {activeQ.highYieldPoint}
                      </p>
                    </div>

                    {activeQ.memoryTrick && (
                      <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <span className="block text-2xs font-extrabold uppercase text-amber-600 dark:text-amber-400 mb-1">Key Mnemonic Association</span>
                        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-bold italic">
                          &ldquo;{activeQ.memoryTrick}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )
      )}
    </div>
  );
};
