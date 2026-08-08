'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QUESTIONS, SUBJECTS } from '../data/mockDb';
import { Question, Difficulty, QuestionType } from '../types/database';
import { 
  Award, Clock, CheckCircle2, AlertCircle, Bookmark, Sparkles, 
  HelpCircle, ChevronLeft, ChevronRight, RefreshCw, Star, Info 
} from 'lucide-react';

export const PracticeArena: React.FC = () => {
  const { addAttempt, attempts } = useApp();
  
  // Selection screen state
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [quizSize, setQuizSize] = useState<number>(10);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);

  // Active quiz state
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [index: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0); // in seconds
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isQuizActive && !quizFinished) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive, quizFinished]);

  // Start the quiz handler
  const handleStartQuiz = () => {
    // Filter questions based on criteria
    let filtered = [...QUESTIONS];
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(q => q.subjectId === selectedSubject);
    }
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    // Shuffle and pick size
    filtered.sort(() => 0.5 - Math.random());
    const finalSelection = filtered.slice(0, Math.min(quizSize, filtered.length));

    if (finalSelection.length === 0) {
      alert('No questions match your criteria! Try expanding difficulty or subjects.');
      return;
    }

    setQuizQuestions(finalSelection);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions(new Set());
    setStartTime(Date.now());
    setTimeSpent(0);
    setQuizFinished(false);
    setIsQuizActive(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    // Prevent changing answer once submitted
    if (selectedAnswers[currentIndex] !== undefined) return;

    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    const question = quizQuestions[currentIndex];
    const isCorrect = optionIndex === question.correctAnswerIndex;
    
    // Log in global AppContext
    addAttempt(question.id, optionIndex, isCorrect, 15); // simulate 15s spent
  };

  const toggleFlag = () => {
    const next = new Set(flaggedQuestions);
    if (next.has(currentIndex)) {
      next.delete(currentIndex);
    } else {
      next.add(currentIndex);
    }
    setFlaggedQuestions(next);
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizFinished(true);
  };

  const handleReset = () => {
    setIsQuizActive(false);
    setQuizFinished(false);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Active Question info
  const activeQ = quizQuestions[currentIndex];
  const totalCorrect = quizQuestions.reduce((acc, q, idx) => {
    const answeredIdx = selectedAnswers[idx];
    return answeredIdx === q.correctAnswerIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6 pb-20">
      {!isQuizActive ? (
        // Quiz Configuration Dashboard
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight">Practice Arena</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Generate tailor-made medical mock reviews matching your weak topics.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Subject filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-2xl text-slate-800 dark:text-white focus:outline-none text-sm"
              >
                <option value="all">All Subjects combined</option>
                {SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Difficulty filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Difficulty Threshold</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'all', label: 'Mixed' },
                  { id: 'easy', label: 'Easy' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'hard', label: 'Hard' }
                ].map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id as any)}
                    className={`py-3 px-4 border rounded-2xl active:scale-95 transition-all text-xs font-bold ${
                      selectedDifficulty === diff.id
                        ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400'
                        : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-350'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz size picker */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Question Count</label>
              <div className="grid grid-cols-4 gap-3">
                {[10, 20, 50, 100].map((size) => (
                  <button
                    key={size}
                    onClick={() => setQuizSize(size)}
                    className={`py-3 px-4 border rounded-2xl active:scale-95 transition-all text-xs font-bold ${
                      quizSize === size
                        ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400'
                        : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-350'
                    }`}
                  >
                    {size} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>Launch Practice Run</span>
            <PlayIcon className="w-4 h-4" />
          </button>
        </div>
      ) : quizFinished ? (
        // Scorecard summary screen
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6 text-center">
          <Award className="w-16 h-16 text-teal-500 mx-auto fill-teal-500/10" />
          <h2 className="text-2xl font-black text-slate-850 dark:text-white">Practice Finished!</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review your parameters and mistakes below.</p>

          <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-6 my-6">
            <div>
              <span className="block text-2xl font-black text-slate-850 dark:text-white">{totalCorrect} / {quizQuestions.length}</span>
              <span className="text-4xs text-slate-400 uppercase font-bold tracking-wider">Score</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-teal-650 dark:text-teal-400">{Math.round((totalCorrect / quizQuestions.length) * 100)}%</span>
              <span className="text-4xs text-slate-400 uppercase font-bold tracking-wider">Accuracy</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-850 dark:text-white">{formatTime(timeSpent)}</span>
              <span className="text-4xs text-slate-400 uppercase font-bold tracking-wider">Time Spent</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleReset}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs active:scale-95 transition-all"
            >
              New Practice Configuration
            </button>
            <button
              onClick={() => {
                // review mistakes mode in mistake tab
                handleReset();
              }}
              className="flex-1 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs shadow-md active:scale-95 transition-all"
            >
              Explanations Review
            </button>
          </div>
        </div>
      ) : (
        // Active Quiz Interface
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main workspace: Question panel */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Header: Progress, Flag, and Timer */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="text-2xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-3 py-1.5 rounded-full">
                  Question {currentIndex + 1} of {quizQuestions.length}
                </span>
                {activeQ.isVerifiedPyq ? (
                  <span className="text-3xs bg-teal-500/10 border border-teal-500/30 text-teal-650 px-2 py-0.5 rounded-md font-bold">
                    VERIFIED PYQ
                  </span>
                ) : (
                  <span className="text-3xs bg-amber-500/10 border border-amber-500/30 text-amber-600 px-2 py-0.5 rounded-md font-bold">
                    AI PRACTICE QUESTION
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-850">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(timeSpent)}</span>
                </div>
                <button
                  onClick={toggleFlag}
                  className={`p-2 rounded-xl border transition-colors ${
                    flaggedQuestions.has(currentIndex)
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              {activeQ.imagePath && (
                <div className="w-full max-h-56 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center relative">
                  {/* Real visual placeholder to satisfy ₹0 budget visual excellence */}
                  <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center">
                    <Info className="w-8 h-8 mb-2 text-teal-600" />
                    <span className="font-bold">Medical Slide Image - Placeholder</span>
                    <span>Dermatological/Radiological diagnosis reference diagram</span>
                  </div>
                </div>
              )}
              <h3 className="text-base font-bold text-slate-850 dark:text-white leading-relaxed">
                {activeQ.questionText}
              </h3>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              {activeQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentIndex] !== undefined;
                const isUserSelection = selectedAnswers[currentIndex] === idx;
                const isCorrect = idx === activeQ.correctAnswerIndex;

                let optionStyles = 'border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-950/10 text-slate-800 dark:text-slate-350';
                
                if (isSelected) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold';
                  } else if (isUserSelection) {
                    optionStyles = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold';
                  } else {
                    optionStyles = 'border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSelected}
                    className={`w-full p-4 text-left border rounded-2xl active:scale-99 transition-all text-xs md:text-sm flex items-center justify-between ${optionStyles}`}
                  >
                    <span>{option}</span>
                    {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                    {isSelected && isUserSelection && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanations - displayed after user selects an answer */}
            {selectedAnswers[currentIndex] !== undefined && (
              <div className="mt-8 border-t border-dashed border-slate-200 dark:border-slate-800 pt-6 space-y-5 animate-pulse-slow">
                
                {/* Rationale header */}
                <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 text-xs font-extrabold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Answer Explanation</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeQ.explanation}
                  </p>
                </div>

                {/* Why other options are wrong */}
                <div className="space-y-2">
                  <span className="block text-2xs font-extrabold uppercase tracking-wider text-rose-500">Why other options are wrong:</span>
                  <ul className="list-disc pl-5 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                    {activeQ.whyOtherOptionsWrong.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>

                {/* High yield point & memory trick */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">High-Yield Concept:</span>
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                      {activeQ.highYieldPoint}
                    </p>
                  </div>

                  {activeQ.memoryTrick && (
                    <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                      <span className="block text-2xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">Memory Trick:</span>
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-semibold italic">
                        &ldquo;{activeQ.memoryTrick}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prev / Next controls */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                  currentIndex === 0 ? 'opacity-30 pointer-events-none' : 'active:scale-95'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-semibold">Prev</span>
              </button>

              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 bg-teal-650 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50"
              >
                Submit Exam Run
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === quizQuestions.length - 1}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                  currentIndex === quizQuestions.length - 1 ? 'opacity-30 pointer-events-none' : 'active:scale-95'
                }`}
              >
                <span className="text-xs font-semibold">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right workspace: Navigation Palette sidebar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit space-y-6">
            <div>
              <h3 className="font-bold text-sm text-slate-850 dark:text-white mb-2">Question Palette</h3>
              <p className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Quickly jump across indices</p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {quizQuestions.map((_, idx) => {
                const isSelected = currentIndex === idx;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isFlagged = flaggedQuestions.has(idx);

                let btnStyles = 'border-slate-200 dark:border-slate-800 text-slate-500';
                if (isAnswered) {
                  const q = quizQuestions[idx];
                  const ans = selectedAnswers[idx];
                  btnStyles = ans === q.correctAnswerIndex 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-rose-500 text-white border-rose-500';
                }
                if (isFlagged) btnStyles = 'bg-yellow-500 text-white border-yellow-500';
                if (isSelected) btnStyles = 'ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-slate-900 ' + btnStyles;

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-9 h-9 text-xs font-bold rounded-lg border flex items-center justify-center transition-all ${btnStyles}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-3xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
                <span>Correct answers Solved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded bg-rose-500" />
                <span>Incorrect attempts</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded bg-yellow-500" />
                <span>Flagged for review</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// Simple vector PlayIcon
const PlayIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
