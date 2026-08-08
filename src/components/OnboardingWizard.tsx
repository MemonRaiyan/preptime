'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, QUESTIONS } from '../data/mockDb';
import { SupportedLanguage, LearningStyle } from '../types/database';
import { 
  Sparkles, CheckCircle2, ArrowRight, BookOpen, PenTool, 
  Brain, Stethoscope, Video, Award, ShieldCheck 
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { onboardUser } = useApp();

  const [step, setStep] = useState<number>(1);
  
  // Step 1: Basic info
  const [name, setName] = useState<string>('');
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [previousScore, setPreviousScore] = useState<string>('');
  const [targetExam, setTargetExam] = useState<string>('December 2026');
  const [studyHours, setStudyHours] = useState<number>(8);

  // Step 2: Subject assessment
  const [strongSubjects, setStrongSubjects] = useState<string[]>(['anatomy', 'physiology']);
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['psm', 'medicine']);

  // Step 3: Style & Language
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('mixed');
  const [language, setLanguage] = useState<SupportedLanguage>('english');

  // Step 4: Diagnostic Test
  const [diagAnswers, setDiagAnswers] = useState<{ [qId: string]: number }>({});
  const diagQuestions = QUESTIONS.slice(0, 5);

  const toggleSubjectSelection = (id: string, type: 'strong' | 'weak') => {
    if (type === 'strong') {
      setStrongSubjects(prev => 
        prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
      );
    } else {
      setWeakSubjects(prev => 
        prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
      );
    }
  };

  const handleFinishOnboarding = () => {
    onboardUser({
      name: name.trim() || 'Candidate',
      attemptNumber,
      previousScore: previousScore ? Number(previousScore) : null,
      targetExam,
      studyHoursPerDay: studyHours,
      strongSubjects,
      weakSubjects: weakSubjects.length > 0 ? weakSubjects : ['psm', 'medicine'],
      learningStyle,
      currentLevel: attemptNumber > 1 ? 'repeater' : 'intermediate',
      preferredLanguage: language
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-10 space-y-6 animate-scale-up">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-2xs font-extrabold uppercase text-slate-400">
            <span>Step {step} of 4</span>
            <span>Personalized FMGE AI Calibration</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Candidate Exam Profile */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                Tell Us About Your FMGE Journey
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We will personalize your daily study schedule and adaptive question targeting.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Full Name / Alias *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Aryan Khan"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-teal-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">FMGE Attempt</label>
                  <select
                    value={attemptNumber}
                    onChange={(e) => setAttemptNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none"
                  >
                    <option value={1}>1st Attempt (Fresh Graduate)</option>
                    <option value={2}>2nd Attempt</option>
                    <option value={3}>3rd Attempt+</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Previous Score (if any)</label>
                  <input
                    type="number"
                    value={previousScore}
                    onChange={(e) => setPreviousScore(e.target.value)}
                    placeholder="e.g. 138 (or leave blank)"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Exam Session</label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="December 2026">December 2026 Session</option>
                    <option value="June 2027">June 2027 Session</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Daily Study Hours</label>
                  <select
                    value={studyHours}
                    onChange={(e) => setStudyHours(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none"
                  >
                    <option value={4}>4 Hours / Day</option>
                    <option value={6}>6 Hours / Day</option>
                    <option value={8}>8 Hours / Day (Recommended)</option>
                    <option value={10}>10+ Hours / Day (Intensive)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs"
            >
              <span>Continue to Subject Strengths</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Subject Strengths & Weaknesses */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                Select Your Strong & Weak Subjects
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                The AI will adaptively weight your daily drills towards your weak subjects.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-rose-600 dark:text-rose-400 block mb-2">
                  Select Weak / High Priority Subjects:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                  {SUBJECTS.map(s => {
                    const isSelected = weakSubjects.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSubjectSelection(s.id, 'weak')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          isSelected 
                            ? 'bg-rose-600 text-white shadow-sm' 
                            : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {s.name} ({s.weightage}M)
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-2">
                  Select Strong / Confident Subjects:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                  {SUBJECTS.map(s => {
                    const isSelected = strongSubjects.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSubjectSelection(s.id, 'strong')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          isSelected 
                            ? 'bg-emerald-600 text-white shadow-sm' 
                            : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-2xl font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-2xl font-bold text-xs shadow-md"
              >
                Next: Learning Style
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Style & Language */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                Preferred Style & AI Language
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize how the AI Teacher and study room present explanations.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Learning Style</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['mixed', 'mcq', 'video', 'flashcard', 'clinical'] as LearningStyle[]).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setLearningStyle(style)}
                      className={`p-3 rounded-2xl border text-left capitalize font-bold transition-all ${
                        learningStyle === style
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {style} Approach
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-2">AI Teacher Language</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['english', 'hinglish', 'hindi', 'gujarati'] as SupportedLanguage[]).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`p-3 rounded-2xl border text-left capitalize font-bold transition-all ${
                        language === lang
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-2xl font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-2xl font-bold text-xs shadow-md"
              >
                Next: Quick Diagnostic Test
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Quick Diagnostic Test */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                5-Question Diagnostic Assessment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Answer these 5 high-yield clinical MCQs to establish your initial score band.
              </p>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto p-1">
              {diagQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                >
                  <div className="font-bold text-slate-900 dark:text-white">
                    {idx + 1}. {q.questionText}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = diagAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setDiagAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            isChosen
                              ? 'bg-teal-600 text-white border-teal-600 font-bold'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleFinishOnboarding}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My Preparation Plan & Enter App</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
