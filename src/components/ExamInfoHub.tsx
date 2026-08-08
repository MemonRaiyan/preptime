'use client';

import React, { useState } from 'react';
import { OFFICIAL_EXAM_INFO, SUBJECTS } from '../data/mockDb';
import { 
  Building2, ExternalLink, ShieldCheck, FileText, CheckCircle2, 
  AlertCircle, Award, Calendar, HelpCircle 
} from 'lucide-react';

export const ExamInfoHub: React.FC = () => {
  const [linkTab, setLinkTab] = useState<'fmge' | 'neetpg' | 'ncert' | 'other'>('fmge');
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

      {/* DoorstepTutor, ExamRace, FlexiPrep & ExamPyq Reference Hub */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <span className="text-2xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
              Partner Study resources
            </span>
            <h3 className="font-black text-lg text-slate-900 dark:text-white mt-0.5">
              Verified External Portals & Reference Hub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
              Explore chapter-wise guides, books recommendations, NCERT libraries, and past papers archives.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-2xs font-bold shrink-0 self-start md:self-center">
            <button
              onClick={() => setLinkTab('fmge')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                linkTab === 'fmge' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-355'
              }`}
            >
              FMGE Portal
            </button>
            <button
              onClick={() => setLinkTab('neetpg')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                linkTab === 'neetpg' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-355'
              }`}
            >
              NEET-PG & Med Sci
            </button>
            <button
              onClick={() => setLinkTab('ncert')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                linkTab === 'ncert' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-355'
              }`}
            >
              NCERT / NIOS (School)
            </button>
            <button
              onClick={() => setLinkTab('other')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                linkTab === 'other' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-355'
              }`}
            >
              Other Exams
            </button>
          </div>
        </div>

        {/* Tab 1: FMGE Links */}
        {linkTab === 'fmge' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fade-in">
            <a
              href="https://www.doorsteptutor.com/Exams/FMGE/Part-A/Questions/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  DoorstepTutor FMGE Part-A Questions
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.doorsteptutor.com</span>
                <p className="text-slate-500 dark:text-slate-450 leading-normal text-3xs">
                  Browse chapter-wise questions, solutions, and notes covering pre-clinical and para-clinical topics.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Question Bank</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.examrace.com/FMGE/FMGE-Past-Papers/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace FMGE Past Papers Archive
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Access memory-based question papers, answers, and explanations spanning previous exam years.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Past Papers</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.examrace.com/FMGE/FMGE-Practice-Questions/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace FMGE Practice Questions
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Solved mock practice sets and revision tests to assess subject-wise readiness.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Practice Sets</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.examrace.com/FMGE/FMGE-Book-List/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace Recommended FMGE Book List
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Essential reference books, standard guidebooks, and syllabus recommended readings.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Book List</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.examrace.com/FMGE/FMGE-Scheme/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace FMGE Scheme of Exam
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Official marks structure, duration, division of parts, passing guidelines, and criteria.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Exam Scheme</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.examrace.com/FMGE/FMGE-Syllabus/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace FMGE Syllabus Blueprint
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Full 19-subject syllabus topics breakdown, systems lists, and marks distributions.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Syllabus Guide</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          </div>
        )}

        {/* Tab 2: NEET-PG & Medical Science Links */}
        {linkTab === 'neetpg' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fade-in">
            <a
              href="https://www.examrace.com/NEET-PG/NEET-PG-Previous-Years-Papers/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace NEET-PG Previous Years Papers
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Access official NEET-PG past year question papers, answers key, and memory questions.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open NEET-PG Papers</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.examrace.com/NEET-PG/NEET-PG-Practice-Tests/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace NEET-PG Mock Practice Tests
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Free online mock practice tests, MCQs, and revisions for National Eligibility cum Entrance Test PG.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Practice Tests</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.examrace.com/NEET-PG/NEET-PG-Book-List/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace NEET-PG Recommended Book List
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Reference guides, medical prep textbooks list, and subject-wise reference materials.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Book List</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.examrace.com/NEET-PG/NEET-PG-Exam-Preparation/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace NEET-PG Preparation Tips
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Strategic advice, high-yield topics guides, schedules, and revision tips for NEET-PG aspirants.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Prep Tips</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.examrace.com/Study-Material/Medical-Science/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group md:col-span-2"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamRace Medical Science High-Yield Study Notes
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.examrace.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Complete, extensive web notes database on Anatomy, Physiology, Pathology, and Medicine clinical concepts.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open Medical Study Material</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          </div>
        )}

        {/* Tab 3: NCERT & NIOS Links */}
        {linkTab === 'ncert' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fade-in">
            <a
              href="https://www.flexiprep.com/Subject-Wise-NCERT-Books-PDF/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  FlexiPrep Subject-Wise NCERT Books PDF
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.flexiprep.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Free download links for NCERT textbooks (Biology, Chemistry, Physics, etc.) for foundational revision.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open NCERT Books</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.flexiprep.com/NCERT-Notes/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  FlexiPrep NCERT Class-Wise Revision Notes
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.flexiprep.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Summarized study notes for fast foundational revisions in Science, Biology, and basics.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open NCERT Notes</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.flexiprep.com/NCERT-Exercise-Solutions/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  FlexiPrep NCERT Textbook Exercise Solutions
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.flexiprep.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Detailed step-by-step exercise answers and explanations for NCERT questions.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open solutions</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            <a
              href="https://www.flexiprep.com/NIOS-Notes/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  FlexiPrep NIOS National Open School Notes
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.flexiprep.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Study notes, syllabus guides, and summaries for NIOS secondary and senior secondary books.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open NIOS Notes</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          </div>
        )}

        {/* Tab 4: Other Exam Links */}
        {linkTab === 'other' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fade-in">
            <a
              href="https://www.exampyq.com/RBI-Grade-B/Questions/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-755 hover:border-teal-500 transition-all flex flex-col justify-between space-y-2 group md:col-span-2"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-955 dark:text-white block group-hover:text-teal-600 transition-colors">
                  ExamPyq RBI Grade B Officer Questions Bank
                </span>
                <span className="text-3xs text-slate-400 block font-mono">www.exampyq.com</span>
                <p className="text-slate-500 dark:text-slate-455 leading-normal text-3xs">
                  Bank exam previous years question sets, solutions, and explanations for RBI Officer recruitment exams.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-extrabold text-3xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span>Open RBI Officer QBank</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
