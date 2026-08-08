'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CLINICAL_CASES } from '../data/mockDb';
import { 
  Stethoscope, CheckCircle2, XCircle, ArrowRight, 
  Sparkles, RotateCcw, Award, Heart, Activity, AlertCircle 
} from 'lucide-react';

export const ClinicalCasesView: React.FC = () => {
  const { addAttempt, profile } = useApp();

  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [caseCompleted, setCaseCompleted] = useState<boolean>(false);
  const [caseScore, setCaseScore] = useState<number>(0);

  const activeCase = CLINICAL_CASES[activeCaseIndex] || CLINICAL_CASES[0];
  const currentStep = activeCase.steps[currentStepIndex];

  const handleSelectOption = (optIdx: number) => {
    if (showExplanation) return;

    setSelectedOption(optIdx);
    setShowExplanation(true);

    const isCorrect = optIdx === currentStep.correctAnswerIndex;
    if (isCorrect) {
      setCaseScore(prev => prev + 1);
    }
    addAttempt(`case_${activeCase.id}_step_${currentStep.stepNumber}`, optIdx, isCorrect, 20);
  };

  const handleNextStep = () => {
    if (currentStepIndex < activeCase.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setCaseCompleted(true);
    }
  };

  const handleRestartCase = () => {
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setCaseCompleted(false);
    setCaseScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-indigo-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-rose-200">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Interactive Multi-Step Patient Vignettes</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Clinical Case Simulator
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Progressive patient presentations with real-time vitals. Make step-by-step decisions for Initial Diagnosis, Confirmatory Investigations, Immediate Resuscitation, and Managing Complications.
          </p>
        </div>

        {/* Case selector dropdown */}
        <select
          value={activeCaseIndex}
          onChange={(e) => {
            setActiveCaseIndex(Number(e.target.value));
            handleRestartCase();
          }}
          className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs font-bold outline-none shrink-0"
        >
          {CLINICAL_CASES.map((c, idx) => (
            <option key={c.id} value={idx} className="text-slate-900">
              Case {idx + 1}: {c.title.slice(0, 32)}...
            </option>
          ))}
        </select>
      </div>

      {/* Patient Vignette Card (Age, Gender, Vitals, Chief Complaint) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                {activeCase.title}
              </h2>
              <span className="text-2xs text-slate-400 font-bold uppercase">
                {activeCase.systemName} • {activeCase.patientVignette.age} Years • {activeCase.patientVignette.gender.toUpperCase()}
              </span>
            </div>
          </div>

          <span className="text-2xs font-extrabold px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
            Step {currentStepIndex + 1} of {activeCase.steps.length}
          </span>
        </div>

        {/* Patient Vitals Monitor Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-3xs text-slate-400 font-bold block">Blood Pressure</span>
            <span className="text-sm font-black text-rose-600 dark:text-rose-400">
              {activeCase.patientVignette.vitals.bp}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-3xs text-slate-400 font-bold block">Heart Rate</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {activeCase.patientVignette.vitals.hr} bpm
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-3xs text-slate-400 font-bold block">Temperature</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {activeCase.patientVignette.vitals.temp}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-3xs text-slate-400 font-bold block">Oxygen Saturation</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {activeCase.patientVignette.vitals.spo2}
            </span>
          </div>
        </div>

        {/* Chief Complaint & Physical Exam */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs leading-relaxed">
          <div className="font-bold text-slate-900 dark:text-white">
            Chief Complaint: {activeCase.patientVignette.chiefComplaint}
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            {activeCase.patientVignette.historyOfPresentIllness}
          </p>
          <div className="text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
            <strong>Physical Exam</strong>: {activeCase.patientVignette.physicalExam}
          </div>
        </div>

      </div>

      {/* Case Completion Summary */}
      {caseCompleted ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-scale-up">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Clinical Vignette Solved!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You made {caseScore} out of {activeCase.steps.length} optimal clinical decisions.
          </p>
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 max-w-xl mx-auto font-semibold">
            💡 Takeaway: {activeCase.takeawayMessage}
          </div>
          <button
            onClick={handleRestartCase}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md transition-all inline-flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Case</span>
          </button>
        </div>
      ) : (
        /* Active Progressive Step Question */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          
          <div className="space-y-2">
            <span className="text-2xs font-extrabold uppercase px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-600">
              Stage: {currentStep.stageName}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {currentStep.prompt}
            </p>
            <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
              {currentStep.questionText}
            </h3>
          </div>

          {/* 4 Interactive Decision Options */}
          <div className="space-y-3">
            {currentStep.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectAnswer = optIdx === currentStep.correctAnswerIndex;
              let style = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-rose-500';

              if (showExplanation) {
                if (isCorrectAnswer) style = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                else if (isSelected && !isCorrectAnswer) style = 'bg-rose-500 text-white border-rose-600';
                else style = 'opacity-60 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
              } else if (isSelected) {
                style = 'bg-rose-600 text-white border-rose-600';
              }

              return (
                <button
                  key={optIdx}
                  disabled={showExplanation}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs md:text-sm font-semibold flex items-center space-x-3 transition-all ${style}`}
                >
                  <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-black text-xs shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showExplanation && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  )}
                  {showExplanation && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Step Explanation & Clinical Pearls */}
          {showExplanation && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-scale-up">
              <div className="font-bold text-slate-900 dark:text-white">
                Clinical Rationale:
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStep.explanation}
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-2xs text-amber-800 dark:text-amber-300 font-bold">
                🩺 Pearl: {currentStep.clinicalPearls}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md"
                >
                  <span>{currentStepIndex < activeCase.steps.length - 1 ? 'Proceed to Next Decision' : 'View Case Resolution'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
