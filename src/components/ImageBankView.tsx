'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IMAGE_QUESTIONS } from '../data/mockDb';
import { 
  Image as ImageIcon, CheckCircle2, XCircle, Sparkles, 
  ZoomIn, ArrowRight, ShieldCheck, Filter, Award 
} from 'lucide-react';

export const ImageBankView: React.FC = () => {
  const { addAttempt } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const filteredItems = IMAGE_QUESTIONS.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  const currentItem = filteredItems[activeImageIndex] || IMAGE_QUESTIONS[0];
  const q = currentItem.question;

  const handleSelectOption = (optIdx: number) => {
    if (showExplanation) return;
    setSelectedOption(optIdx);
    setShowExplanation(true);
    const isCorrect = optIdx === q.correctAnswerIndex;
    addAttempt(q.id, optIdx, isCorrect, 15);
  };

  const handleNext = () => {
    if (activeImageIndex < filteredItems.length - 1) {
      setActiveImageIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>High-Yield Visual MCQ System</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            FMGE Image Bank & Spotters
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Master image-based MCQs for Radiology (X-Ray, CT, MRI), Pathology histopathology, Fundus examination, Dermatology lesions, and ENT otoscopy.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-3xs font-bold shrink-0">
          {(['all', 'Radiology', 'Ophthalmology', 'Pathology', 'Dermatology', 'ENT'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveImageIndex(0);
                setSelectedOption(null);
                setShowExplanation(false);
              }}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                activeCategory === cat
                  ? 'bg-white text-slate-900 font-black shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Visuals' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Image Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
              {currentItem.category.toUpperCase()} • SPOTTER #{activeImageIndex + 1}
            </span>
            <span className="text-2xs text-slate-400 font-bold">{currentItem.systemName}</span>
          </div>

          <div className="flex items-center space-x-2 text-2xs font-bold text-slate-400">
            <span>{activeImageIndex + 1} of {filteredItems.length}</span>
          </div>
        </div>

        {/* Image & Question Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Medical Image Display */}
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-md">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-3xs font-bold px-2.5 py-1 rounded-md">
                {currentItem.title}
              </div>
            </div>
            <p className="text-2xs text-slate-500 dark:text-slate-400 italic">
              {currentItem.description}
            </p>
          </div>

          {/* Question & 4 Options */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {q.questionText}
              </h2>

              <div className="space-y-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === q.correctAnswerIndex;
                  let style = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-500';

                  if (showExplanation) {
                    if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                    else if (isSelected && !isCorrect) style = 'bg-rose-500 text-white border-rose-600';
                    else style = 'opacity-60 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
                  } else if (isSelected) {
                    style = 'bg-teal-600 text-white border-teal-600';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={showExplanation}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold flex items-center space-x-3 transition-all ${style}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-black text-2xs shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation & High Yield Finding */}
            {showExplanation && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs animate-scale-up">
                <div className="font-bold text-slate-900 dark:text-white">
                  Visual Diagnosis Breakdown:
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {q.explanation}
                </p>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-2xs text-amber-800 dark:text-amber-300 font-bold">
                  💡 Spotter Finding: {currentItem.highYieldFinding}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrev}
                disabled={activeImageIndex === 0}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Previous Image
              </button>

              <button
                onClick={handleNext}
                disabled={activeImageIndex === filteredItems.length - 1}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
              >
                <span>Next Visual Spotter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
