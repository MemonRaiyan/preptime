'use client';

import React from 'react';
import { GrandTestSimulator } from './GrandTestSimulator';
import { Award } from 'lucide-react';

export const PYQPapersView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-indigo-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-200">
            <Award className="w-4 h-4" />
            <span>Complete PYQ Archive</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Official Exam Papers
          </h1>
          <p className="text-sm text-teal-100 leading-relaxed">
            Practice authentic full-length past year question papers for FMGE, NEET PG, and INI-CET. 
            Experience the exact exam environment with timed sessions and immediate AI feedback.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-2 md:p-6">
        <GrandTestSimulator pyqArchiveMode={true} />
      </div>
    </div>
  );
};
