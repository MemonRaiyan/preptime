'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Question, Difficulty, MistakeCategory } from '../types/database';
import { QUESTIONS, SUBJECTS, TOPICS } from '../data/mockDb';
import { 
  CheckCircle2, XCircle, Sparkles, ShieldCheck, PenTool, 
  RotateCcw, Award, ArrowRight, Zap, Filter, HelpCircle, 
  BookOpen, Brain, Clock, ChevronRight, AlertTriangle 
} from 'lucide-react';

export const PracticeArena: React.FC = () => {
  const { addAttempt, categorizeMistake, attempts, profile, navigateToTopic } = useApp();

  // Mode Selection: 'custom_quiz' | 'daily_challenge' | 'verified_pyqs' | 'active_test'
  const [practiceMode, setPracticeMode] = useState<'custom_quiz' | 'daily_challenge' | 'verified_pyqs' | 'active_test'>('daily_challenge');

  // Custom Quiz Configuration Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [examNameFilter, setExamNameFilter] = useState<string>('all');
  const [pyqYearFilter, setPyqYearFilter] = useState<string>('all');

  // Active Test Runtime State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [qId: string]: boolean }>({});
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Filtered pool of questions
  const availableQuestions = useMemo(() => {
    return QUESTIONS.filter(q => {
      if (practiceMode === 'verified_pyqs' && !q.isVerifiedPyq) return false;
      if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (examNameFilter !== 'all' && q.examName !== examNameFilter) return false;
      if (pyqYearFilter !== 'all' && q.pyqYear?.toString() !== pyqYearFilter) return false;
      return true;
    });
  }, [practiceMode, selectedSubject, selectedDifficulty, examNameFilter, pyqYearFilter]);

  // Start a Quiz
  const startQuiz = (mode: 'custom_quiz' | 'daily_challenge' | 'verified_pyqs') => {
    let pool: Question[] = [];
    
    if (mode === 'daily_challenge') {
      // 20 mixed questions
      pool = [...QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 20);
    } else if (mode === 'verified_pyqs') {
      pool = QUESTIONS.filter(q => q.isVerifiedPyq);
      if (selectedSubject !== 'all') {
        pool = pool.filter(q => q.subjectId === selectedSubject);
      }
      pool = pool.slice(0, questionCount);
    } else {
      pool = availableQuestions.slice(0, questionCount);
    }

    if (pool.length === 0) {
      pool = QUESTIONS.slice(0, 10);
    }

    setActiveQuestions(pool);
    setCurrentIndex(0);
    setUserAnswers({});
    setRevealedAnswers({});
    setTestCompleted(false);
    setPracticeMode('active_test');
    setTimerSeconds(0);
    setTimerRunning(true);
  };

  // Timer interval for active test
  React.useEffect(() => {
    let interval: any = null;
    if (timerRunning && !testCompleted) {
      interval = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, testCompleted]);

  const currentQ = activeQuestions[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    if (!currentQ || revealedAnswers[currentQ.id]) return;

    setUserAnswers(prev => ({ ...prev, [currentQ.id]: optIndex }));
    setRevealedAnswers(prev => ({ ...prev, [currentQ.id]: true }));

    const isCorrect = optIndex === currentQ.correctAnswerIndex;
    addAttempt(currentQ.id, optIndex, isCorrect, 15);
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setTestCompleted(true);
      setTimerRunning(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Calculate score summary
  const scoreStats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    activeQuestions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected === undefined) {
        unanswered++;
      } else if (selected === q.correctAnswerIndex) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const total = activeQuestions.length;
    const accuracy = total > 0 ? Math.round((correct / (correct + incorrect || 1)) * 100) : 0;
    return { correct, incorrect, unanswered, total, accuracy };
  }, [activeQuestions, userAnswers]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Render Test Completion Screen
  if (practiceMode === 'active_test' && testCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
        
        {/* Results Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Quiz Completed!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total Time: {formatTimer(timerSeconds)} • Average: {Math.round(timerSeconds / (activeQuestions.length || 1))}s/question
          </p>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-2xs text-slate-400 font-bold block">Score</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {scoreStats.correct} / {scoreStats.total}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-2xs text-emerald-600 dark:text-emerald-400 font-bold block">Accuracy</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {scoreStats.accuracy}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-2xs text-rose-600 dark:text-rose-400 font-bold block">Mistakes</span>
              <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                {scoreStats.incorrect}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
              <span className="text-2xs text-teal-600 dark:text-teal-400 font-bold block">XP Earned</span>
              <span className="text-xl font-black text-teal-600 dark:text-teal-400">
                +{scoreStats.correct * 15 + 20} XP
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <button
              onClick={() => startQuiz('daily_challenge')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all"
            >
              Practice Another Set
            </button>
            <button
              onClick={() => setPracticeMode('daily_challenge')}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-bold text-xs transition-all"
            >
              Return to Arena Hub
            </button>
          </div>
        </div>

        {/* Detailed Question-by-Question Review */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Detailed Solution & Option Breakdown ({activeQuestions.length})
          </h3>

          {activeQuestions.map((q, qIndex) => {
            const userChoice = userAnswers[q.id];
            const isCorrect = userChoice === q.correctAnswerIndex;
            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      #{qIndex + 1}
                    </span>
                    <span className={`text-2xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      isCorrect ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {isCorrect ? 'Correct' : userChoice !== undefined ? 'Incorrect' : 'Skipped'}
                    </span>
                    <span className="text-2xs text-slate-400 font-bold">{q.systemName}</span>
                  </div>
                  <span className="text-2xs font-extrabold text-teal-600 dark:text-teal-400">
                    {q.source || (q.isVerifiedPyq ? 'Verified PYQ' : 'FMGE-Style Drill')}
                  </span>
                </div>

                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {q.questionText}
                </p>

                {/* 4 Options breakdown */}
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isRightAnswer = oIdx === q.correctAnswerIndex;
                    const isSelected = oIdx === userChoice;
                    let style = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                    if (isRightAnswer) style = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                    else if (isSelected && !isRightAnswer) style = 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300';

                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-2xl border text-xs flex items-center space-x-3 ${style}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center font-bold text-3xs shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                        {isRightAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />}
                        {isSelected && !isRightAnswer && <XCircle className="w-4 h-4 text-rose-600 ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">
                    📖 Medical Explanation
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>

                  {/* Why other options are wrong */}
                  {q.whyOtherOptionsWrong && q.whyOtherOptionsWrong.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block">
                        Why Distractor Options Are Wrong:
                      </span>
                      <ul className="space-y-1">
                        {q.whyOtherOptionsWrong.map((why, wIdx) => (
                          <li key={wIdx} className="text-2xs text-slate-500 dark:text-slate-400">
                            • {why}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* High Yield Pearl & Mnemonic */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="text-2xs font-extrabold text-amber-800 dark:text-amber-300 block">
                      💡 High Yield Pearl: {q.highYieldPoint}
                    </span>
                    {q.memoryTrick && (
                      <span className="text-3xs text-amber-700 dark:text-amber-400 font-mono block">
                        🧠 Mnemonic: {q.memoryTrick}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // Active Quiz Playing View
  if (practiceMode === 'active_test' && currentQ) {
    const isAnswered = userAnswers[currentQ.id] !== undefined;
    const isRevealed = revealedAnswers[currentQ.id];

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
        
        {/* Test Navigation Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Question {currentIndex + 1} of {activeQuestions.length}
            </span>
            <span className="text-2xs font-extrabold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 uppercase">
              {currentQ.systemName}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-teal-500" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
            <button
              onClick={() => {
                setTestCompleted(true);
                setTimerRunning(false);
              }}
              className="text-xs font-bold text-rose-500 hover:underline"
            >
              End Quiz
            </button>
          </div>
        </div>

        {/* Question Palette Strip */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
          {activeQuestions.map((q, idx) => {
            const answered = userAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            let dotStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
            if (answered) dotStyle = 'bg-teal-600 text-white font-bold';
            if (isCurrent) dotStyle += ' ring-2 ring-teal-400';

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-xl text-3xs font-bold shrink-0 transition-all ${dotStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Body Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          
          {/* Source badge */}
          <div className="flex items-center justify-between">
            <span className="text-2xs font-black uppercase tracking-wider text-slate-400">
              {currentQ.type.toUpperCase()} • {currentQ.difficulty.toUpperCase()} DIFFICULTY
            </span>
            <span className={`text-2xs font-extrabold px-2.5 py-1 rounded-full ${
              currentQ.isVerifiedPyq 
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20' 
                : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
            }`}>
              {currentQ.source || (currentQ.isVerifiedPyq ? 'Verified PYQ' : 'FMGE Practice MCQ')}
            </span>
          </div>

          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.questionText}
          </h2>

          {currentQ.videoUrl && (
            <div className="w-full rounded-2xl overflow-hidden bg-black/5 border border-slate-200 dark:border-slate-700">
              <video src={currentQ.videoUrl} controls className="w-full max-h-64 object-cover" />
            </div>
          )}

          {/* 4 Interactive Options */}
          <div className="space-y-3">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = userAnswers[currentQ.id] === optIdx;
              const isCorrectAnswer = optIdx === currentQ.correctAnswerIndex;
              let optionStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-500';

              if (isRevealed) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-rose-500 text-white border-rose-600';
                } else {
                  optionStyle = 'opacity-60 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
                }
              } else if (isSelected) {
                optionStyle = 'bg-teal-600 text-white border-teal-600';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs md:text-sm font-semibold flex items-center space-x-3 transition-all ${optionStyle}`}
                >
                  <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center font-black text-xs shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1">{optionText}</span>
                  {isRevealed && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  )}
                  {isRevealed && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Revealed Answer & High Yield Box */}
          {isRevealed && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-scale-up">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Detailed Rationale & High-Yield Analysis</span>
                <span className="text-2xs text-teal-600 dark:text-teal-400 font-extrabold">
                  {userAnswers[currentQ.id] === currentQ.correctAnswerIndex ? '✓ Correct Answer' : '✗ Mistake Recorded'}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>

              {/* If incorrect, prompt mistake classification (Section 17) */}
              {userAnswers[currentQ.id] !== currentQ.correctAnswerIndex && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <div className="flex items-center space-x-1.5 text-2xs font-extrabold text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Why did you miss this question? (Auto-saved to Mistake Notebook)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(['concept', 'memory', 'misread', 'silly', 'guess'] as MistakeCategory[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          const lastAtt = attempts[0];
                          if (lastAtt) categorizeMistake(lastAtt.id, cat);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-3xs font-extrabold capitalize text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-500"
                      >
                        {cat} Mistake
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-2xs text-amber-800 dark:text-amber-300 font-bold">
                💡 High Yield Point: {currentQ.highYieldPoint}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-teal-600/10 transition-all"
            >
              <span>{currentIndex === activeQuestions.length - 1 ? 'Finish & Review' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    );
  }

  // Arena Hub Default Landing Screen
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Hero Strip */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <Zap className="w-3.5 h-3.5" />
            <span>Unlimited AI Practice & Verified PYQ Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Practice Arena & Verified PYQs
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Practice 19 clinical question types, solve authentic past-year questions, or launch the Daily 20-Question AI Challenge with detailed option breakdowns.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => startQuiz('daily_challenge')}
            className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Start Daily 20 AI Challenge</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Daily Challenge */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-teal-500 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Free Daily 20 Challenge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              20 mixed adaptive questions generated daily. Earn +50 XP and maintain your daily preparation streak.
            </p>
          </div>
          <button
            onClick={() => startQuiz('daily_challenge')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-2xl text-xs font-bold shadow-md transition-all"
          >
            Launch Daily 20
          </button>
        </div>

        {/* Card 2: Verified PYQ Engine */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-amber-500 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Verified Official PYQs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Practice only genuine past exam questions with authenticated exam years (FMGE 2022–2024).
            </p>
          </div>
          <button
            onClick={() => startQuiz('verified_pyqs')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-2xl text-xs font-bold shadow-md transition-all"
          >
            Practice Verified PYQs
          </button>
        </div>

        {/* Card 3: Custom AI Quiz Generator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-indigo-500 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Custom Targeted Drill
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Customize subject, specific systems, difficulty, and question count to target your known weak areas.
            </p>
          </div>
          <button
            onClick={() => setPracticeMode('custom_quiz')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl text-xs font-bold shadow-md transition-all"
          >
            Configure Custom Drill
          </button>
        </div>

      </div>

      {/* Custom Quiz Configuration Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
          <Filter className="w-4 h-4 text-teal-600" />
          <span>Configure Your Custom Practice Session</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          {/* Subject Filter */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">All 19 Subjects</option>
              {SUBJECTS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.weightage} Marks)</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">Mixed Difficulties</option>
              <option value="easy">Easy (Fundamentals)</option>
              <option value="medium">Medium (Standard FMGE)</option>
              <option value="hard">Hard (Clinical Vignettes)</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Number of Questions</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none"
            >
              <option value={5}>5 Questions (Speed Drill)</option>
              <option value={10}>10 Questions</option>
              <option value={20}>20 Questions (Standard)</option>
              <option value={50}>50 Questions (Mini Block)</option>
            </select>
          </div>

          {/* Exam Name Filter */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Exam</label>
            <select
              value={examNameFilter}
              onChange={(e) => setExamNameFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">All (FMGE, NEET PG, INI-CET)</option>
              <option value="FMGE">FMGE Only</option>
              <option value="NEET PG">NEET PG Only</option>
              <option value="INI-CET">INI-CET Only</option>
            </select>
          </div>

          {/* PYQ Year Filter */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">PYQ Authenticity Year</label>
            <select
              value={pyqYearFilter}
              onChange={(e) => setPyqYearFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none"
            >
              <option value="all">All (AI Drills + PYQs)</option>
              {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014].map(y => (
                <option key={y} value={y.toString()}>{y} Only</option>
              ))}
            </select>
          </div>

        </div>

        <button
          onClick={() => startQuiz('custom_quiz')}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-teal-600/10 transition-all flex items-center justify-center space-x-2 text-xs"
        >
          <PenTool className="w-4 h-4" />
          <span>Start Custom Quiz Session ({availableQuestions.slice(0, questionCount).length} Questions)</span>
        </button>

      </div>

    </div>
  );
};
