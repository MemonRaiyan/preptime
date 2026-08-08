'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/mockDb';
import { LearningStyle } from '../types/database';
import { Brain, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { onboardUser } = useApp();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Form states
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'repeater' | 'revision'>('beginner');
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [targetExam, setTargetExam] = useState<string>('December 2026');
  const [studyHours, setStudyHours] = useState<number>(6);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('mixed');
  const [strongSubjects, setStrongSubjects] = useState<string[]>([]);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [preferredLanguage, setPreferredLanguage] = useState<'english' | 'hinglish' | 'hindi' | 'gujarati'>('english');
  const [name, setName] = useState<string>('');

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleStrongSubject = (subId: string) => {
    setStrongSubjects(prev =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId].filter(id => !weakSubjects.includes(id))
    );
  };

  const toggleWeakSubject = (subId: string) => {
    setWeakSubjects(prev =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId].filter(id => !strongSubjects.includes(id))
    );
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate AI Study Plan generation
    setTimeout(() => {
      onboardUser({
        name: name || 'Doctor Candidate',
        attemptNumber,
        previousScore,
        targetExam,
        studyHoursPerDay: studyHours,
        strongSubjects,
        weakSubjects,
        learningStyle,
        currentLevel,
        preferredLanguage,
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Progress header */}
        <div className="bg-slate-100 dark:bg-slate-800/40 h-2 w-full flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-full flex-1 transition-all duration-300 ${
                s <= step ? 'bg-teal-600' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        <div className="p-8 md:p-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mb-6" />
              <div className="inline-flex items-center space-x-2 text-teal-600 dark:text-teal-400 font-semibold mb-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>AI Planner Active</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Analyzing your weaknesses...
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Generating your custom daily schedules, spacing cards, and targeted question sets.
              </p>
            </div>
          ) : (
            <>
              {/* Step 1: Profile & Name */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-teal-600 dark:text-teal-400 mb-2">
                    <Brain className="w-8 h-8" />
                    <span className="font-bold text-lg">FMGE Onboarding</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Tell us about yourself
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    We tailor notes, questions, and revision intervals to match your current level.
                  </p>

                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Your Name / Alias
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Rohan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-teal-500 focus:outline-none dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Current Prep Level
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'beginner', label: 'Beginner', desc: 'Starting from scratch' },
                          { id: 'intermediate', label: 'Intermediate', desc: 'Some subjects done' },
                          { id: 'repeater', label: 'Repeater', desc: 'Attempted FMGE before' },
                          { id: 'revision', label: 'Final Revision', desc: 'Exam is very close' },
                        ].map((levelOption) => (
                          <button
                            key={levelOption.id}
                            type="button"
                            onClick={() => {
                              setCurrentLevel(levelOption.id as any);
                              if (levelOption.id === 'repeater') setAttemptNumber(2);
                            }}
                            className={`p-4 text-left border rounded-2xl active:scale-95 transition-all ${
                              currentLevel === levelOption.id
                                ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/20'
                                : 'border-slate-200 dark:border-slate-800 bg-transparent'
                            }`}
                          >
                            <span className="block font-bold text-slate-800 dark:text-white text-sm">
                              {levelOption.label}
                            </span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {levelOption.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Attempt details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Attempt History & Target
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Knowing your past scores helps the AI estimate your current readiness.
                  </p>

                  <div className="space-y-5 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          FMGE Attempt Number
                        </label>
                        <select
                          value={attemptNumber}
                          onChange={(e) => setAttemptNumber(Number(e.target.value))}
                          className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
                        >
                          <option value={1}>1st Attempt (Fresh)</option>
                          <option value={2}>2nd Attempt</option>
                          <option value={3}>3rd Attempt</option>
                          <option value={4}>4th+ Attempt</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Target Exam Window
                        </label>
                        <select
                          value={targetExam}
                          onChange={(e) => setTargetExam(e.target.value)}
                          className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
                        >
                          <option value="December 2026">December 2026</option>
                          <option value="June 2027">June 2027</option>
                          <option value="December 2027">December 2027</option>
                        </select>
                      </div>
                    </div>

                    {currentLevel === 'repeater' || attemptNumber > 1 ? (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Previous Score (out of 300)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 112"
                          min={0}
                          max={300}
                          value={previousScore || ''}
                          onChange={(e) => setPreviousScore(Number(e.target.value))}
                          className="w-full px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-teal-500 focus:outline-none dark:text-white"
                        />
                        <span className="text-xs text-slate-400 block mt-2">
                          Passing marks is 150. Let\'s clear this barrier.
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Step 3: Hours and Study style */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Study Time & Style
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    We adapt resources and planner templates to fit your learning routines.
                  </p>

                  <div className="space-y-5 pt-4">
                    <div>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-slate-700 dark:text-slate-300">Daily Study Target</span>
                        <span className="text-teal-600">{studyHours} Hours / Day</span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={16}
                        step={1}
                        value={studyHours}
                        onChange={(e) => setStudyHours(Number(e.target.value))}
                        className="w-full accent-teal-600 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Study Format
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'mcq', label: 'MCQ Practice', desc: 'Learning via resolving questions' },
                          { id: 'reading', label: 'Reading Notes', desc: 'Systematic text study' },
                          { id: 'flashcard', label: 'Flashcards', desc: 'Spaced repetition memorizing' },
                          { id: 'clinical', label: 'Clinical Cases', desc: 'Scenario diagnostics focus' },
                          { id: 'mixed', label: 'Mixed Learner', desc: 'Healthy blend of all formats' },
                        ].map((styleOption) => (
                          <button
                            key={styleOption.id}
                            type="button"
                            onClick={() => setLearningStyle(styleOption.id as any)}
                            className={`p-4 text-left border rounded-2xl active:scale-95 transition-all ${
                              learningStyle === styleOption.id
                                ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/20'
                                : 'border-slate-200 dark:border-slate-800 bg-transparent'
                            }`}
                          >
                            <span className="block font-bold text-slate-800 dark:text-white text-sm">
                              {styleOption.label}
                            </span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {styleOption.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Subject profiling */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Subject Profile
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Select your strong and weak areas. AI will structure your revisions accordingly.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 h-80 overflow-y-auto pr-2">
                    {/* Strong Subjects */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 border-b pb-2">
                        Strong Areas (Revision Focus)
                      </h3>
                      <div className="space-y-2">
                        {SUBJECTS.map((sub) => (
                          <button
                            key={`strong-${sub.id}`}
                            onClick={() => toggleStrongSubject(sub.id)}
                            className={`w-full flex items-center justify-between p-3 border rounded-xl text-left text-xs transition-all ${
                              strongSubjects.includes(sub.id)
                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400'
                                : 'border-slate-200 dark:border-slate-800 bg-transparent'
                            }`}
                          >
                            <span>{sub.name}</span>
                            {strongSubjects.includes(sub.id) && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Weak Subjects */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400 border-b pb-2">
                        Weak Areas (Foundation Focus)
                      </h3>
                      <div className="space-y-2">
                        {SUBJECTS.map((sub) => (
                          <button
                            key={`weak-${sub.id}`}
                            onClick={() => toggleWeakSubject(sub.id)}
                            className={`w-full flex items-center justify-between p-3 border rounded-xl text-left text-xs transition-all ${
                              weakSubjects.includes(sub.id)
                                ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400'
                                : 'border-slate-200 dark:border-slate-800 bg-transparent'
                            }`}
                          >
                            <span>{sub.name}</span>
                            {weakSubjects.includes(sub.id) && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Language & Submit */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Preferred AI Language
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    The AI Tutor can speak and explain concepts in multiple languages.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {[
                      { id: 'english', label: 'English Only', desc: 'Standard clinical explanations' },
                      { id: 'hinglish', label: 'Hinglish', desc: 'English terms with Hindi flow' },
                      { id: 'hindi', label: 'Hindi', desc: 'सरल हिंदी स्पष्टीकरण' },
                      { id: 'gujarati', label: 'Gujarati', desc: 'ગુજરાતી વિવરણ' },
                    ].map((langOption) => (
                      <button
                        key={langOption.id}
                        type="button"
                        onClick={() => setPreferredLanguage(langOption.id as any)}
                        className={`p-4 text-left border rounded-2xl active:scale-95 transition-all ${
                          preferredLanguage === langOption.id
                            ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/20'
                                : 'border-slate-200 dark:border-slate-800 bg-transparent'
                            }`}
                      >
                        <span className="block font-bold text-slate-800 dark:text-white text-sm">
                          {langOption.label}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {langOption.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-2xl text-xs text-teal-800 dark:text-teal-400 flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      Ready! By clicking submit, the platform generates a comprehensive preparation calendar prioritizing your weak subjects, scheduling flashcard queues, and setting up daily goals.
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`flex items-center space-x-2 px-5 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all ${
                    step === 1 ? 'opacity-0 cursor-default' : 'active:scale-95 cursor-pointer'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-semibold">Back</span>
                </button>

                {step < 5 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 rounded-2xl font-bold shadow-md active:scale-95 transition-all"
                  >
                    <span className="text-sm">Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
                  >
                    <span>Generate AI Plan</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
