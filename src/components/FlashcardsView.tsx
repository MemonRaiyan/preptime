'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/mockDb';
import { Brain, Star, Award, RotateCw, CheckCircle, ChevronRight, Eye } from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const { flashcards, reviewFlashcard } = useApp();
  
  // Get active queue: Cards due today (nextReviewDate <= today)
  const todayStr = new Date().toISOString().split('T')[0];
  const dueCards = flashcards.filter(c => c.nextReviewDate <= todayStr);
  const reviewedTodayCount = flashcards.filter(c => c.nextReviewDate > todayStr).length;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const activeCard = dueCards[currentIndex];

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!activeCard) return;
    reviewFlashcard(activeCard.id, rating);
    setIsFlipped(false);
    
    // If there are more cards, slide to next, otherwise done
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed current batch
      setCurrentIndex(0);
    }
  };

  const getSubjectName = (subId: string) => {
    return SUBJECTS.find(s => s.id === subId)?.name || subId;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-teal-950 to-emerald-950 p-8 rounded-3xl border border-teal-800 text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-teal-300 border border-white/10">
            <Brain className="w-3.5 h-3.5 fill-current" />
            <span>Spaced Repetition Active (Anki style)</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Active Flashcards</h1>
          <p className="text-teal-200 text-sm max-w-md">
            Revise key medical facts, clinical presentations, and drug of choices at optimized intervals to avoid forgetting curves.
          </p>
        </div>

        <div className="flex space-x-4 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl text-center shrink-0">
          <div>
            <span className="block text-2xl font-black text-teal-400">{dueCards.length}</span>
            <span className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Due Today</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <span className="block text-2xl font-black text-emerald-400">{reviewedTodayCount}</span>
            <span className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Reviewed</span>
          </div>
        </div>
      </div>

      {dueCards.length === 0 ? (
        // Batch completed screen
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-900/40">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-white">Deck Clear for Today!</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Congratulations! You have completed all flashcards scheduled for review today. Keep it up!
          </p>
          <span className="text-3xs block text-slate-400">
            Next review queue will trigger tomorrow morning.
          </span>
        </div>
      ) : (
        // Active Flashcard review screen
        <div className="max-w-2xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Card {currentIndex + 1} of {dueCards.length}
            </span>
            <span className="text-4xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-3 py-1.5 rounded-full border border-teal-100 dark:border-teal-900/30">
              {getSubjectName(activeCard.subjectId)}
            </span>
          </div>

          {/* Flashcard container with 3D Flip effect placeholder */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-8 flex flex-col justify-between cursor-pointer hover:shadow-xl active:scale-99 transition-all text-center relative overflow-hidden"
          >
            {/* Soft decorative background glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-teal-400/5 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-400/5 blur-2xl" />

            <div className="text-4xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block pt-2">
              {isFlipped ? 'Answer Detail (Back)' : 'Medical Term (Front)'}
            </div>

            {/* Content text */}
            <div className="flex-1 flex items-center justify-center px-4 my-6">
              {isFlipped ? (
                <p className="text-base md:text-lg font-extrabold text-slate-850 dark:text-white leading-relaxed">
                  {activeCard.back}
                </p>
              ) : (
                <p className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-355 text-slate-650 leading-relaxed">
                  {activeCard.front}
                </p>
              )}
            </div>

            <div className="flex justify-center items-center text-4xs font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 dark:border-slate-850 pt-4">
              <Eye className="w-3.5 h-3.5 mr-1" />
              <span>Tap card to reveal description</span>
            </div>
          </div>

          {/* Review grading options */}
          {isFlipped && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-850 animate-pulse-slow">
              <button
                onClick={() => handleRating('again')}
                className="py-3 bg-rose-500 text-white rounded-2xl font-bold text-xs hover:bg-rose-600 shadow-md shadow-rose-500/10 active:scale-95 transition-all flex flex-col items-center justify-center space-y-1"
              >
                <span>Again</span>
                <span className="text-4xs opacity-80 normal-case font-normal">(1 min)</span>
              </button>
              <button
                onClick={() => handleRating('hard')}
                className="py-3 bg-amber-500 text-white rounded-2xl font-bold text-xs hover:bg-amber-600 shadow-md shadow-amber-500/10 active:scale-95 transition-all flex flex-col items-center justify-center space-y-1"
              >
                <span>Hard</span>
                <span className="text-4xs opacity-80 normal-case font-normal">(2 days)</span>
              </button>
              <button
                onClick={() => handleRating('good')}
                className="py-3 bg-teal-600 text-white rounded-2xl font-bold text-xs hover:bg-teal-500 shadow-md shadow-teal-500/10 active:scale-95 transition-all flex flex-col items-center justify-center space-y-1"
              >
                <span>Good</span>
                <span className="text-4xs opacity-80 normal-case font-normal">(4 days)</span>
              </button>
              <button
                onClick={() => handleRating('easy')}
                className="py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-500 shadow-md shadow-blue-500/10 active:scale-95 transition-all flex flex-col items-center justify-center space-y-1"
              >
                <span>Easy</span>
                <span className="text-4xs opacity-80 normal-case font-normal">(6 days)</span>
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
