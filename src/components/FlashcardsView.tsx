'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Flashcard } from '../types/database';
import { SUBJECTS, TOPICS } from '../data/mockDb';
import { 
  Brain, RotateCcw, CheckCircle2, Sparkles, Plus, 
  Layers, ArrowRight, HelpCircle, Eye, EyeOff 
} from 'lucide-react';

export const FlashcardsView: React.FC = () => {
  const { flashcards, reviewFlashcard, createFlashcard, profile } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  
  // Custom Card Creator modal
  const [showCreatorModal, setShowCreatorModal] = useState<boolean>(false);
  const [newFront, setNewFront] = useState<string>('');
  const [newBack, setNewBack] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('pharmacology');

  // Filter cards due for review or by subject
  const filteredCards = useMemo(() => {
    return flashcards.filter(c => {
      if (selectedSubject !== 'all' && c.subjectId !== selectedSubject) return false;
      return true;
    });
  }, [flashcards, selectedSubject]);

  const currentCard = filteredCards[currentCardIndex] || filteredCards[0];

  const handleReviewRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    reviewFlashcard(currentCard.id, rating);
    setIsFlipped(false);

    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    createFlashcard({
      subjectId: newSubject,
      topicId: `${newSubject}-user-topic`,
      front: newFront,
      back: newBack,
      difficulty: 'good',
      intervalDays: 1,
      easeFactor: 2.5
    });

    setNewFront('');
    setNewBack('');
    setShowCreatorModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-purple-200">
            <Brain className="w-3.5 h-3.5" />
            <span>SuperMemo-2 Spaced Repetition Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            FMGE Spaced Repetition Deck
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Never forget previously studied topics. Automatically scheduled reviews on Day 1, 3, 7, 14, 30, and 60 based on your recall ease rating.
          </p>
        </div>

        <button
          onClick={() => setShowCreatorModal(true)}
          className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-purple-600" />
          <span>Add Custom Card</span>
        </button>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        <button
          onClick={() => {
            setSelectedSubject('all');
            setCurrentCardIndex(0);
            setIsFlipped(false);
          }}
          className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-all ${
            selectedSubject === 'all'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Subjects ({flashcards.length})
        </button>

        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedSubject(s.id);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-all ${
              selectedSubject === s.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Main Flashcard View */}
      {currentCard ? (
        <div className="space-y-6">
          
          {/* Card Counter & Progress */}
          <div className="flex items-center justify-between text-2xs font-extrabold text-slate-400 uppercase tracking-wider">
            <span>Card {currentCardIndex + 1} of {filteredCards.length}</span>
            <span>Interval: {currentCard.intervalDays} Days • Ease: {currentCard.easeFactor.toFixed(2)}</span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(prev => !prev)}
            className="min-h-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-xl hover:border-purple-500/50 cursor-pointer transition-all flex flex-col justify-between select-none relative overflow-hidden"
          >
            {/* Flip hint */}
            <div className="flex items-center justify-between">
              <span className="text-3xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {isFlipped ? 'Answer & Rationale' : 'Question Prompt'}
              </span>
              <span className="text-3xs text-slate-400 font-bold flex items-center space-x-1">
                {isFlipped ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>Click card to {isFlipped ? 'hide answer' : 'flip'}</span>
              </span>
            </div>

            {/* Card Content Text */}
            <div className="my-auto py-6">
              {isFlipped ? (
                <div className="prose dark:prose-invert prose-sm max-w-none text-slate-900 dark:text-white leading-relaxed font-medium">
                  <p className="text-base md:text-lg">{currentCard.back.replace(/[*#]/g, '')}</p>
                </div>
              ) : (
                <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentCard.front}
                </h3>
              )}
            </div>

            <div className="text-2xs text-slate-400 text-center font-mono">
              FMGE Master Spaced Repetition
            </div>
          </div>

          {/* SuperMemo-2 4-Rating Buttons */}
          {isFlipped ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-scale-up">
              <button
                onClick={() => handleReviewRating('again')}
                className="p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 hover:border-rose-500 text-rose-700 dark:text-rose-300 hover:text-white transition-all text-center space-y-1"
              >
                <div className="font-black text-sm">Again</div>
                <div className="text-3xs opacity-80">1 Day (Reset)</div>
              </button>

              <button
                onClick={() => handleReviewRating('hard')}
                className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-700 dark:text-amber-300 hover:text-white transition-all text-center space-y-1"
              >
                <div className="font-black text-sm">Hard</div>
                <div className="text-3xs opacity-80">2 Days</div>
              </button>

              <button
                onClick={() => handleReviewRating('good')}
                className="p-4 rounded-2xl bg-teal-500/10 hover:bg-teal-500 border border-teal-500/30 hover:border-teal-500 text-teal-700 dark:text-teal-300 hover:text-white transition-all text-center space-y-1"
              >
                <div className="font-black text-sm">Good</div>
                <div className="text-3xs opacity-80">4 Days</div>
              </button>

              <button
                onClick={() => handleReviewRating('easy')}
                className="p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 hover:border-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white transition-all text-center space-y-1"
              >
                <div className="font-black text-sm">Easy</div>
                <div className="text-3xs opacity-80">7+ Days</div>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-600/10 transition-all text-xs"
            >
              Show Answer (Spacebar / Click)
            </button>
          )}

        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">All Cards Reviewed for Today!</h3>
          <p className="text-xs text-slate-400">Great recall discipline. Check back tomorrow for your next spaced review interval.</p>
        </div>
      )}

      {/* Custom Flashcard Creator Modal */}
      {showCreatorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-4 animate-scale-up">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Create New Custom Flashcard
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                >
                  {SUBJECTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Front (Question Prompt) *</label>
                <textarea
                  required
                  rows={2}
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. What is the drug of choice for MRSA infection?"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Back (High Yield Answer) *</label>
                <textarea
                  required
                  rows={3}
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. Vancomycin (or Daptomycin / Linezolid)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatorModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-bold shadow-md"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
