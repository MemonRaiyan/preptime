'use client';

import React from 'react';
import { PracticeArena } from './PracticeArena';
import { Video } from 'lucide-react';

export const VideoPracticeView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sky-200">
            <Video className="w-4 h-4" />
            <span>Dedicated Video QBank</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Clinical Video Diagnostics
          </h1>
          <p className="text-sm text-sky-100 leading-relaxed">
            Practice identifying clinical signs, neurological gaits, and radiological imaging through dynamic video cases. 
            This dedicated mode locks the generator to only output authentic video-based MCQs.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-2 md:p-6">
        <PracticeArena forceVideoMode={true} />
      </div>
    </div>
  );
};
