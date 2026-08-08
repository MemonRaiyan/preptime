'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Question, GrandTest, GrandTestAttempt } from '../types/database';
import { GRAND_TESTS, QUESTIONS, SUBJECTS } from '../data/mockDb';
import { 
  Award, Clock, CheckCircle2, XCircle, AlertCircle, 
  HelpCircle, ChevronRight, Bookmark, ArrowRight, 
  BarChart3, Brain, Sparkles, ShieldAlert, RotateCcw, 
  TrendingUp, Compass, Flag 
} from 'lucide-react';

export interface GrandTestSimulatorProps {
  pyqArchiveMode?: boolean;
}

export const GrandTestSimulator: React.FC<GrandTestSimulatorProps> = ({ pyqArchiveMode = false }) => {
  const { recordGrandTestAttempt, gtAttempts, profile, navigateToTopic, setActiveTab } = useApp();

  // Selected test or null for selection screen
  const [activeTest, setActiveTest] = useState<GrandTest | null>(null);
  
  // Test runtime state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [qId: string]: boolean }>({});
  const [visited, setVisited] = useState<{ [qId: string]: boolean }>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(150 * 60);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  
  // Completed test result state
  const [latestAttempt, setLatestAttempt] = useState<GrandTestAttempt | null>(null);

  // Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (isTestRunning && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestRunning, timeRemainingSeconds]);

  // Start a Grand Test
  const handleStartTest = (test: GrandTest) => {
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMarkedForReview({});
    setVisited({ [test.questions[0]?.id || '']: true });
    setTimeRemainingSeconds(test.durationMinutes * 60);
    setIsTestRunning(true);
    setShowSubmitModal(false);
    setLatestAttempt(null);
  };

  const currentQ = activeTest?.questions[currentQuestionIndex];

  const handleSelectAnswer = (optIndex: number) => {
    if (!currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: optIndex }));
  };

  const handleClearAnswer = () => {
    if (!currentQ) return;
    setAnswers(prev => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
  };

  const handleToggleMarkForReview = () => {
    if (!currentQ) return;
    setMarkedForReview(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleNavigateQuestion = (idx: number) => {
    if (!activeTest) return;
    setCurrentQuestionIndex(idx);
    const targetQ = activeTest.questions[idx];
    if (targetQ) {
      setVisited(prev => ({ ...prev, [targetQ.id]: true }));
    }
  };

  // Submit test and generate deep AI diagnostics
  const handleSubmitTest = () => {
    if (!activeTest) return;
    setIsTestRunning(false);
    setShowSubmitModal(false);

    let totalScore = 0;
    const testAnswersRecord: any = {};
    const subjectStats: { [subId: string]: { total: number; correct: number; percentage: number } } = {};
    const mistakeCategories = { concept: 0, memory: 0, misread: 0, silly: 0, guess: 0 };
    const weakTopics: string[] = [];

    activeTest.questions.forEach((q, idx) => {
      const userSelected = answers[q.id];
      const isCorrect = userSelected === q.correctAnswerIndex;
      if (isCorrect) totalScore += 1;

      testAnswersRecord[q.id] = {
        selectedIndex: userSelected ?? -1,
        isCorrect,
        timeSpent: Math.round((activeTest.durationMinutes * 60 - timeRemainingSeconds) / activeTest.questions.length)
      };

      // Subject breakdown
      if (!subjectStats[q.subjectId]) {
        subjectStats[q.subjectId] = { total: 0, correct: 0, percentage: 0 };
      }
      subjectStats[q.subjectId].total += 1;
      if (isCorrect) subjectStats[q.subjectId].correct += 1;

      // Identify mistakes
      if (!isCorrect && userSelected !== undefined) {
        mistakeCategories.concept += 1;
        if (!weakTopics.includes(q.systemName)) {
          weakTopics.push(q.systemName);
        }
      }
    });

    // Compute subject percentages
    Object.keys(subjectStats).forEach(sub => {
      const s = subjectStats[sub];
      s.percentage = Math.round((s.correct / (s.total || 1)) * 100);
    });

    const percentage = Math.round((totalScore / (activeTest.questions.length || 1)) * 100);
    const passed = (totalScore / activeTest.questions.length) >= 0.5;

    // AI diagnostic recommendations
    const aiRecommendations = [
      `You scored ${totalScore}/${activeTest.questions.length} (${percentage}%). Passing mark in FMGE is 50.0% strictly.`,
      `Most marks lost were in: ${weakTopics.slice(0, 2).join(' and ') || 'General concepts'}.`,
      `Immediate action: Review high-yield notes and re-test incorrect questions in your Mistake Notebook.`,
      `Tomorrow's plan: Dedicate 90 minutes to high-yield clinical MCQs in your lowest scoring subjects.`
    ];

    const attempt = recordGrandTestAttempt({
      testId: activeTest.id,
      testTitle: activeTest.title,
      totalQuestions: activeTest.questions.length,
      score: totalScore,
      percentage,
      passed,
      timeSpentSeconds: activeTest.durationMinutes * 60 - timeRemainingSeconds,
      answers: testAnswersRecord,
      subjectBreakdown: subjectStats,
      mistakeAnalysis: mistakeCategories,
      aiRecommendations,
      weakTopicsIdentified: weakTopics
    });

    setLatestAttempt(attempt);
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Results & AI GT Analytics Screen (Sections 23, 24, 38)
  if (latestAttempt) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
        
        {/* Top Result Card */}
        <div className={`rounded-3xl p-8 border shadow-xl text-center space-y-4 ${
          latestAttempt.passed 
            ? 'bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border-emerald-500/30' 
            : 'bg-gradient-to-b from-rose-500/10 to-slate-900 border-rose-500/30'
        }`}>
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto ${
            latestAttempt.passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-slate-400">
              Official FMGE Passing Threshold: 150 / 300 (50.0%)
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {latestAttempt.passed ? '🎉 Qualified (Pass Level)' : '⚠️ Needs Focused Revision'}
            </h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Score: <strong className="text-slate-900 dark:text-white text-lg">{latestAttempt.score}</strong> / {latestAttempt.totalQuestions} ({latestAttempt.percentage}%)
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-2xs text-slate-400 block">Correct</span>
              <span className="font-black text-emerald-600 text-base">{latestAttempt.score}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-2xs text-slate-400 block">Incorrect</span>
              <span className="font-black text-rose-600 text-base">{latestAttempt.totalQuestions - latestAttempt.score}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-2xs text-slate-400 block">Time Spent</span>
              <span className="font-black text-slate-900 dark:text-white text-base">{formatTimer(latestAttempt.timeSpentSeconds)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-2xs text-slate-400 block">Readiness Band</span>
              <span className="font-black text-teal-600 dark:text-teal-400 text-base">
                {profile?.estimatedScoreRange ? `${profile.estimatedScoreRange[0]}-${profile.estimatedScoreRange[1]}` : '140-165'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center space-x-3 pt-4 hide-on-print">
            <button
              onClick={() => {
                setLatestAttempt(null);
                setActiveTest(null);
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all"
            >
              Back to Test Series
            </button>
            <button
              onClick={() => setActiveTab('mistakes')}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all"
            >
              Open Mistake Notebook
            </button>
            <button
              onClick={() => window.print()}
              className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-6 py-3 rounded-2xl font-bold text-xs hover:bg-indigo-200 transition-all flex items-center space-x-2"
            >
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>

        {/* Section 24: AI GT Diagnostics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                AI Post-Test Diagnostic Report
              </h3>
              <p className="text-2xs text-slate-400">
                Automated root-cause analysis of where and why you lost marks.
              </p>
            </div>
          </div>

          {/* Diagnostic Bullet Points */}
          <div className="space-y-3">
            {latestAttempt.aiRecommendations.map((rec, rIdx) => (
              <div
                key={rIdx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 flex items-start space-x-3"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>

          {/* 1-Click Actionable Study Button */}
          {latestAttempt.weakTopicsIdentified && latestAttempt.weakTopicsIdentified.length > 0 && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-2xs font-extrabold text-teal-800 dark:text-teal-300 block">
                  Actionable Next Step Recommendation:
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Practice {latestAttempt.weakTopicsIdentified[0]} Now
                </h4>
              </div>
              <button
                onClick={() => {
                  const weakSub = Object.keys(latestAttempt.subjectBreakdown)[0] || 'psm';
                  navigateToTopic(weakSub, `${weakSub}-core-topic`);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md shrink-0"
              >
                <span>Launch Targeted Study Module</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Section 23: Subject Breakdown Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>Subject-Wise Performance Distribution</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(latestAttempt.subjectBreakdown).map(([subId, stats]) => {
              const subObj = SUBJECTS.find(s => s.id === subId);
              return (
                <div key={subId} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">
                      {subObj?.name || subId}
                    </span>
                    <span className={stats.percentage >= 50 ? 'text-emerald-600' : 'text-rose-600'}>
                      {stats.correct} / {stats.total} ({stats.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        stats.percentage >= 50 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // Live Exam Simulation Interface (Section 22)
  if (isTestRunning && activeTest && currentQ) {
    const currentAnswer = answers[currentQ.id];
    const isMarked = markedForReview[currentQ.id];

    return (
      <div className="max-w-6xl mx-auto space-y-4 animate-fade-in pb-16">
        
        {/* Top Official Header Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center">
              GT
            </div>
            <div>
              <h3 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white truncate max-w-xs md:max-w-md">
                {activeTest.title}
              </h3>
              <span className="text-3xs text-slate-400">
                NBEMS Pattern Simulation • Section 1
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Exam Countdown Timer */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
              timeRemainingSeconds < 600 
                ? 'bg-rose-500/10 text-rose-600 animate-pulse' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
            }`}>
              <Clock className="w-4 h-4 text-teal-500" />
              <span>{formatTimer(timeRemainingSeconds)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Layout: Main Question Area + Right Side Question Palette */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Question Box */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 flex flex-col justify-between min-h-[480px]">
            
            <div className="space-y-6">
              {/* Question metadata */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-teal-600 dark:text-teal-400">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="text-2xs text-slate-400">of {activeTest.questions.length}</span>
                </div>
                <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentQ.systemName}
                </span>
              </div>

              {/* Question Text */}
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
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = currentAnswer === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs md:text-sm font-semibold flex items-center space-x-3 transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/10'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-500'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-black text-xs shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleMarkForReview}
                  className={`px-4 py-2 rounded-xl border flex items-center space-x-1.5 transition-all ${
                    isMarked 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                <button
                  onClick={handleClearAnswer}
                  className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavigateQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl transition-all"
                >
                  Previous
                </button>

                <button
                  onClick={() => {
                    if (currentQuestionIndex < activeTest.questions.length - 1) {
                      handleNavigateQuestion(currentQuestionIndex + 1);
                    } else {
                      setShowSubmitModal(true);
                    }
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl flex items-center space-x-1.5 shadow-md transition-all"
                >
                  <span>{currentQuestionIndex === activeTest.questions.length - 1 ? 'Review & Submit' : 'Save & Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Side: Question Palette */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Question Palette
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-3xs font-semibold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-teal-600" />
                <span>Answered ({Object.keys(answers).length})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-purple-600" />
                <span>Marked ({Object.keys(markedForReview).length})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                <span>Not Visited</span>
              </div>
            </div>

            {/* Grid of buttons */}
            <div className="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto p-1 scrollbar-none">
              {activeTest.questions.map((q, idx) => {
                const isAns = answers[q.id] !== undefined;
                const isM = markedForReview[q.id];
                const isCurr = idx === currentQuestionIndex;

                let style = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
                if (isAns) style = 'bg-teal-600 text-white font-bold';
                if (isM) style = 'bg-purple-600 text-white font-bold';
                if (isCurr) style += ' ring-2 ring-teal-400 font-black';

                return (
                  <button
                    key={q.id}
                    onClick={() => handleNavigateQuestion(idx)}
                    className={`h-8 rounded-xl text-3xs transition-all ${style}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
            >
              Submit Grand Test
            </button>
          </div>

        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4 animate-scale-up text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                <Flag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Submit Grand Test?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You have answered <strong>{Object.keys(answers).length}</strong> of {activeTest.questions.length} questions. Are you sure you want to finish and generate your AI Diagnostic Report?
              </p>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-bold"
                >
                  Return to Test
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md"
                >
                  Yes, Submit Now
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // Default Test Series Selection Hub
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <Award className="w-3.5 h-3.5" />
            <span>100% Free Full-Length FMGE Simulations</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Grand Test Series & AI Diagnostics
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Practice timed 50, 100, 150 and full 300-question FMGE simulations matching the official NBEMS pattern with instant AI error categorization and readiness band estimation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 space-y-1">
          <span className="text-3xs font-extrabold uppercase text-teal-300">Passing Cutoff</span>
          <div className="text-2xl font-black text-white">150 / 300</div>
          <span className="text-3xs text-slate-300">No Negative Marking</span>
        </div>
      </div>

      {/* Available Grand Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GRAND_TESTS.filter(t => pyqArchiveMode ? t.id.includes('gt_fmge') || t.id.includes('gt_neetpg') || t.id.includes('gt_inicet') : !t.id.includes('gt_fmge') && !t.id.includes('gt_neetpg') && !t.id.includes('gt_inicet')).map((test) => (
          <div
            key={test.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-extrabold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  {test.questionCount} Questions
                </span>
                <span className="text-2xs text-slate-400 font-mono font-bold">
                  {test.durationMinutes} Mins
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                {test.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {test.description}
              </p>
            </div>

            <button
              onClick={() => handleStartTest(test)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-2xl text-xs font-bold shadow-md shadow-teal-600/10 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Simulation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Previous Test Attempts & Score Trend History */}
      {gtAttempts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>Your Previous Grand Test Results ({gtAttempts.length})</span>
          </h3>

          <div className="space-y-3">
            {gtAttempts.map((att) => (
              <div
                key={att.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">{att.testTitle}</span>
                    <span className={`text-3xs font-extrabold px-2 py-0.5 rounded ${
                      att.passed ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {att.passed ? 'PASS' : 'REVISE'}
                    </span>
                  </div>
                  <span className="text-2xs text-slate-400">
                    {new Date(att.timestamp).toLocaleDateString()} • {formatTimer(att.timeSpentSeconds)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {att.score} / {att.totalQuestions} ({att.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
