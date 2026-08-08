'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CLINICAL_CASES, SUBJECTS } from '../data/mockDb';
import { 
  Stethoscope, Clock, Heart, Thermometer, User, Award, 
  HelpCircle, ChevronRight, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';

export const ClinicalCasesView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [activeCaseIndex, setActiveCaseIndex] = useState<number | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [step: number]: number }>({});
  const [caseFinished, setCaseFinished] = useState<boolean>(false);

  const getSubjectName = (subId: string) => {
    return SUBJECTS.find(s => s.id === subId)?.name || subId;
  };

  const handleStartCase = (idx: number) => {
    setActiveCaseIndex(idx);
    setCurrentStepIndex(0);
    setSelectedAnswers({});
    setCaseFinished(false);
  };

  const handleSelectOption = (optIdx: number) => {
    if (selectedAnswers[currentStepIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [currentStepIndex]: optIdx }));
  };

  const handleNextStep = () => {
    const activeCase = CLINICAL_CASES[activeCaseIndex!];
    if (currentStepIndex < activeCase.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCaseFinished(true);
    }
  };

  const handleExitCase = () => {
    setActiveCaseIndex(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {activeCaseIndex === null ? (
        // List of cases selection screen
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight">Clinical Case Simulator</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Train your differential diagnostic skills with multi-step interactive patient trials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLINICAL_CASES.map((item, idx) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48 card-hover-effect"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-4xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-2.5 py-1 rounded">
                      {getSubjectName(item.subjectId)}
                    </span>
                    <span className="text-4xs text-slate-400 font-semibold">{item.steps.length} diagnostic steps</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-850 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    Patient: {item.patientVignette.age}-year-old {item.patientVignette.gender}. Chief Complaint: {item.patientVignette.chiefComplaint}
                  </p>
                </div>

                <button
                  onClick={() => handleStartCase(idx)}
                  className="w-full mt-4 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-3xs font-extrabold tracking-wider uppercase rounded-xl active:scale-95 transition-all text-center"
                >
                  Initiate Simulator Case
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Active Case Workroom
        (() => {
          const activeCase = CLINICAL_CASES[activeCaseIndex];
          const activeStep = activeCase.steps[currentStepIndex];
          const isSelected = selectedAnswers[currentStepIndex] !== undefined;
          const userAns = selectedAnswers[currentStepIndex];

          return (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Back to list and header */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleExitCase}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-650 hover:underline"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>Exit Case Workroom</span>
                </button>

                <span className="text-2xs bg-slate-100 dark:bg-slate-800 text-slate-600 px-3 py-1.5 rounded-full font-bold">
                  Step {currentStepIndex + 1} of {activeCase.steps.length}
                </span>
              </div>

              {caseFinished ? (
                // Case Completed display
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
                  <Award className="w-16 h-16 text-teal-500 mx-auto fill-teal-500/10" />
                  <h3 className="text-2xl font-black text-slate-850 dark:text-white">Differential Diagnosis Complete</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Excellent training! You have finished resolving all clinical steps for this patient.
                  </p>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleExitCase}
                      className="px-6 py-3.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs active:scale-95 transition-all"
                    >
                      Return to Selection
                    </button>
                  </div>
                </div>
              ) : (
                // Active Step panel
                <div className="space-y-6">
                  {/* Patient Clinical Profile Card */}
                  <div className="bg-slate-900 text-slate-250 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2 text-teal-400 font-extrabold text-xs uppercase tracking-wider">
                        <Stethoscope className="w-4.5 h-4.5" />
                        <span>Admitting Patient Record</span>
                      </div>
                      <span className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Vitals & Labs</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                        <User className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                        <span className="block text-4xs text-slate-500 uppercase font-semibold">Profile</span>
                        <span className="text-xs font-bold text-white">{activeCase.patientVignette.age} y/o {activeCase.patientVignette.gender}</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                        <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
                        <span className="block text-4xs text-slate-500 uppercase font-semibold">Heart Rate</span>
                        <span className="text-xs font-bold text-white">{activeCase.patientVignette.vitals.hr} bpm</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                        <Thermometer className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                        <span className="block text-4xs text-slate-500 uppercase font-semibold">Temp</span>
                        <span className="text-xs font-bold text-white">{activeCase.patientVignette.vitals.temp}</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                        <Stethoscope className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <span className="block text-4xs text-slate-500 uppercase font-semibold">Blood Pressure</span>
                        <span className="text-xs font-bold text-white">{activeCase.patientVignette.vitals.bp}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl text-xs text-slate-350 leading-relaxed font-normal">
                      <span className="font-extrabold text-white block mb-1">Chief Complaint:</span>
                      {activeCase.patientVignette.chiefComplaint}
                    </div>
                  </div>

                  {/* Active Question Step Workspace */}
                  <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="space-y-3">
                      <span className="text-4xs font-bold uppercase tracking-wider text-teal-650 bg-teal-50 dark:bg-teal-950/20 px-2.5 py-1 rounded">
                        {activeStep.title}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {activeStep.prompt}
                      </p>
                      <h4 className="text-sm md:text-base font-extrabold text-slate-850 dark:text-white leading-snug">
                        {activeStep.questionText}
                      </h4>
                    </div>

                    {/* Options list */}
                    <div className="space-y-3 pt-2">
                      {activeStep.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === activeStep.correctAnswerIndex;
                        let optStyles = 'border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50/50 text-slate-800 dark:text-slate-350';

                        if (isSelected) {
                          if (isCorrect) {
                            optStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold';
                          } else if (userAns === optIdx) {
                            optStyles = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold';
                          } else {
                            optStyles = 'border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            disabled={isSelected}
                            className={`w-full p-4 text-left border rounded-2xl active:scale-99 transition-all text-xs md:text-sm flex items-center justify-between ${optStyles}`}
                          >
                            <span>{opt}</span>
                            {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                            {isSelected && userAns === optIdx && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Step Explanations rationale */}
                    {isSelected && (
                      <div className="mt-8 border-t border-dashed border-slate-200 dark:border-slate-800 pt-6 space-y-4 animate-pulse-slow">
                        <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-xl space-y-1.5">
                          <span className="block text-2xs font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">Clinical Reasoning Rationale</span>
                          <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-normal">
                            {activeStep.explanation}
                          </p>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850 space-y-1">
                          <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-500">Key Clinical Pearls:</span>
                          <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed italic">
                            &ldquo;{activeStep.clinicalPearls}&rdquo;
                          </p>
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            onClick={handleNextStep}
                            className="flex items-center space-x-1.5 px-6 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-xs font-bold rounded-2xl shadow-md active:scale-95 transition-all"
                          >
                            <span>Continue Diagnostic Step</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          );
        })()
      )}
    </div>
  );
};
