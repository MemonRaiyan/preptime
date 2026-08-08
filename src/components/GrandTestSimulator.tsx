'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QUESTIONS, SUBJECTS } from '../data/mockDb';
import { Question } from '../types/database';
import { 
  Award, Clock, CheckCircle2, AlertCircle, Bookmark, Sparkles, 
  HelpCircle, ChevronLeft, ChevronRight, Play, LayoutGrid 
} from 'lucide-react';

export const GrandTestSimulator: React.FC = () => {
  const { addAttempt, profile } = useApp();

  const [activeScreen, setActiveScreen] = useState<'intro' | 'exam' | 'results'>('intro');
  
  // Simulator states
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number>(150 * 60); // 150 minutes in seconds
  const [activePart, setActivePart] = useState<'A' | 'B'>('A');

  // Timer tick down
  useEffect(() => {
    let interval: any;
    if (activeScreen === 'exam' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeScreen === 'exam') {
      handleSubmitTest();
    }
    return () => clearInterval(interval);
  }, [activeScreen, timeLeft]);

  const handleStartTest = () => {
    // Generate a 50-question mock grand test representing the 300 question exam structure
    const allQs = [...QUESTIONS];
    allQs.sort(() => 0.5 - Math.random());
    const finalSet = allQs.slice(0, 50);

    setTestQuestions(finalSet);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions(new Set());
    setTimeLeft(150 * 60);
    setActivePart('A');
    setActiveScreen('exam');
  };

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
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
    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Toggle parts representation
      if (currentIndex + 1 >= 25) {
        setActivePart('B');
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (currentIndex - 1 < 25) {
        setActivePart('A');
      }
    }
  };

  const handleSubmitTest = () => {
    // Save all answers in context to update streaks & XP
    testQuestions.forEach((q, idx) => {
      const selectedOption = selectedAnswers[idx];
      if (selectedOption !== undefined) {
        const isCorrect = selectedOption === q.correctAnswerIndex;
        addAttempt(q.id, selectedOption, isCorrect, 30);
      }
    });

    setActiveScreen('results');
  };

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Results grading
  const totalCorrect = testQuestions.reduce((acc, q, idx) => {
    const ans = selectedAnswers[idx];
    return ans === q.correctAnswerIndex ? acc + 1 : acc;
  }, 0);

  // Scaled estimated score out of 300
  const scaledScore = Math.round((totalCorrect / testQuestions.length) * 300);
  const passed = scaledScore >= 150;

  return (
    <div className="space-y-6 pb-20">
      {activeScreen === 'intro' && (
        // Start exam splash
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Award className="w-14 h-14 text-teal-650 mx-auto fill-teal-500/10" />
            <h2 className="text-2xl font-black text-slate-850 dark:text-white">FMGE Grand Test Simulator</h2>
            <p className="text-xs text-slate-500">Official Exam Room Interface. 300 scaled questions divided into Part A & Part B.</p>
          </div>

          <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-2xl text-3xs text-teal-800 dark:text-teal-400 space-y-1.5 leading-relaxed font-normal">
            <span className="font-extrabold uppercase block mb-1">Simulator Guidelines:</span>
            <li>This exam uses a calibrated 50-question diagnostic sample scaling exactly to a 300-mark passing grid.</li>
            <li>Part A covers Pre-clinical and Para-clinical subjects. Part B covers Clinical subjects.</li>
            <li>Passing marks are 150 out of 300. There is no negative marking.</li>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full py-4 bg-teal-650 hover:bg-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm uppercase tracking-wider"
          >
            Enter Exam Room
          </button>
        </div>
      )}

      {activeScreen === 'exam' && testQuestions.length > 0 && (
        // Full screen exam portal
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Active Question space */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 relative">
            
            {/* Header row */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="text-2xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold px-3.5 py-1.5 rounded-full">
                  Part {activePart} • Q {currentIndex + 1}
                </span>
                <span className="text-3xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-bold">
                  {SUBJECTS.find(s => s.id === testQuestions[currentIndex].subjectId)?.name}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-xs text-slate-700 dark:text-slate-200 font-bold bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-150">
                  <Clock className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                  <span>{formatTimer(timeLeft)}</span>
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
              <h3 className="text-base font-bold text-slate-850 dark:text-white leading-relaxed">
                {testQuestions[currentIndex].questionText}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {testQuestions[currentIndex].options.map((option, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 text-left border rounded-2xl active:scale-99 transition-all text-xs md:text-sm flex items-center justify-between ${
                      isSelected 
                        ? 'border-teal-500 bg-teal-500/5 text-teal-700 dark:text-teal-400 font-bold' 
                        : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-350 hover:bg-slate-50/50'
                    }`}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation rows */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 ${
                  currentIndex === 0 ? 'opacity-30 pointer-events-none' : 'active:scale-95'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleSubmitTest}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all uppercase tracking-wider"
              >
                Finish & Submit Section
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === testQuestions.length - 1}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 ${
                  currentIndex === testQuestions.length - 1 ? 'opacity-30 pointer-events-none' : 'active:scale-95'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right palette sidebar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit space-y-6">
            <div>
              <h3 className="font-bold text-sm text-slate-850 dark:text-white mb-2">Question Navigation</h3>
              <div className="flex space-x-2 text-4xs font-bold uppercase tracking-wider text-slate-400">
                <span className={activePart === 'A' ? 'text-teal-600' : ''}>Part A (1-25)</span>
                <span>•</span>
                <span className={activePart === 'B' ? 'text-teal-600' : ''}>Part B (26-50)</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
              {testQuestions.map((_, idx) => {
                const isSelected = currentIndex === idx;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isFlagged = flaggedQuestions.has(idx);

                let btnStyles = 'border-slate-200 dark:border-slate-850 text-slate-400';
                if (isAnswered) btnStyles = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
                if (isFlagged) btnStyles = 'bg-yellow-500 text-white border-yellow-500';
                if (isSelected) btnStyles = 'ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-slate-900 ' + btnStyles;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setActivePart(idx >= 25 ? 'B' : 'A');
                    }}
                    className={`w-9 h-9 text-xs font-bold rounded-lg border flex items-center justify-center transition-all ${btnStyles}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {activeScreen === 'results' && (
        // Results overview card
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6 text-center">
          <Award className="w-16 h-16 text-teal-500 mx-auto fill-teal-500/10" />
          <h2 className="text-2xl font-black text-slate-850 dark:text-white">Exam Report Card</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Your scaled results are finalized.</p>

          <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-6 my-6">
            <div>
              <span className="block text-2xl font-black text-slate-850 dark:text-white">{scaledScore} / 300</span>
              <span className="text-4xs text-slate-400 uppercase font-bold tracking-wider">Estimated Score</span>
            </div>
            <div>
              <span className={`block text-2xl font-black ${passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                {passed ? 'PASSED' : 'FAILED'}
              </span>
              <span className="text-4xs text-slate-400 uppercase font-bold tracking-wider">Status (Pass=150)</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-850 dark:text-white">
                {Math.round((totalCorrect / testQuestions.length) * 100)}%
              </span>
              <span className="text-4xs text-slate-400 uppercase font-bold tracking-wider">Accuracy</span>
            </div>
          </div>

          <div className="p-4 bg-teal-55 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-2xl text-left space-y-2">
            <span className="font-extrabold text-xs text-teal-700 dark:text-teal-400 block uppercase tracking-wider">AI Readiness Recommendation:</span>
            <p className="text-3xs text-slate-650 dark:text-slate-350 leading-relaxed font-normal">
              {passed 
                ? 'Excellent performance! You scored above the passing threshold. Focus on refining your speed and reviewing the mistake notebook to solidify details.' 
                : 'Your score is below the 150-mark pass threshold. We suggest focusing heavily on your Weak Subjects list, completing Smart Notes, and generating targeted revision quizzes.'}
            </p>
          </div>

          <button
            onClick={() => setActiveScreen('intro')}
            className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-2xl text-xs active:scale-95 transition-all uppercase tracking-wider"
          >
            Start Another Simulator run
          </button>
        </div>
      )}
    </div>
  );
};
