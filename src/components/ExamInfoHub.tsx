'use client';

import React from 'react';
import { OFFICIAL_EXAM_INFO, SUBJECTS } from '../data/mockDb';
import { 
  Building2, ExternalLink, ShieldCheck, FileText, CheckCircle2, 
  AlertCircle, Award, Calendar, HelpCircle 
} from 'lucide-react';

export const ExamInfoHub: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Official Guidelines & Blueprint</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Official FMGE Exam Information Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Essential guidelines, eligibility criteria, document checklists, and syllabus mark allocations directly compiled from official National Board of Examinations in Medical Sciences (NBEMS) bulletins.
          </p>
        </div>

        <a
          href={OFFICIAL_EXAM_INFO.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center space-x-2 shrink-0"
        >
          <span>Visit Official NBEMS Website</span>
          <ExternalLink className="w-4 h-4 text-blue-600" />
        </a>
      </div>

      {/* Crucial Disclaimer Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-800 dark:text-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {OFFICIAL_EXAM_INFO.disclaimer}
        </p>
      </div>

      {/* Paper Pattern & Passing Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pattern Card 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block">
            Exam Structure
          </span>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {OFFICIAL_EXAM_INFO.paperPattern.totalQuestions} MCQs (Computer-Based)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Conducted in 2 sessions of 150 questions each (150 minutes per session). All questions are single best response format.
          </p>
        </div>

        {/* Pattern Card 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block">
            Passing Standard
          </span>
          <h3 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
            {OFFICIAL_EXAM_INFO.paperPattern.passingCutoff}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Candidates must score a minimum of 150 marks out of 300 to qualify for provisional/permanent registration with the NMC or State Medical Council.
          </p>
        </div>

        {/* Pattern Card 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block">
            Negative Marking Policy
          </span>
          <h3 className="font-bold text-lg text-teal-600 dark:text-teal-400">
            Zero Negative Marking
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            There is no penalty for incorrect answers. Aspirants are strongly advised to attempt all 300 questions without leaving any blank.
          </p>
        </div>

      </div>

      {/* Eligibility & Document Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Eligibility Criteria */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <span>Eligibility Criteria (NBEMS & NMC)</span>
          </h3>

          <ul className="space-y-3 text-xs">
            {OFFICIAL_EXAM_INFO.eligibilityCriteria.map((crit, idx) => (
              <li key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 leading-relaxed">
                {crit}
              </li>
            ))}
          </ul>
        </div>

        {/* Mandatory Document Verification Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Essential Document Submission Checklist</span>
          </h3>

          <ul className="space-y-3 text-xs">
            {OFFICIAL_EXAM_INFO.importantDocuments.map((doc, idx) => (
              <li key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Official 19-Subject Marks Weightage Blueprint Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Official Subject Weightage Allocation (Total 300 Marks)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {SUBJECTS.map((s) => (
            <div
              key={s.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                <span className="text-3xs uppercase text-slate-400 font-extrabold">{s.category}</span>
              </div>
              <span className="text-sm font-black text-teal-600 dark:text-teal-400">
                {s.weightage} M
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
