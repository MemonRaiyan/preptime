'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FeatureFlags } from '../types/database';
import { SUBJECTS, TOPICS, QUESTIONS, FREE_RESOURCES } from '../data/mockDb';
import { 
  ShieldAlert, CheckCircle2, XCircle, ToggleLeft, ToggleRight, 
  Sparkles, Layers, FileText, Award, Database, Settings 
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { featureFlags, toggleFeatureFlag, resources, verifyResource } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'flags' | 'moderation' | 'database'>('flags');

  const pendingModeration = resources.filter(r => !r.isVerified);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrator & Ecosystem Controller</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Admin Panel & Resource Moderation
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Manage application feature flags, review submitted educational resources through the AI moderation pipeline, and inspect database integrity.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveAdminTab('flags')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeAdminTab === 'flags' ? 'bg-white text-slate-900 font-black shadow-md' : 'text-white/80'
            }`}
          >
            🚩 Feature Flags
          </button>
          <button
            onClick={() => setActiveAdminTab('moderation')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeAdminTab === 'moderation' ? 'bg-white text-slate-900 font-black shadow-md' : 'text-white/80'
            }`}
          >
            🛡️ Resource Moderation
          </button>
          <button
            onClick={() => setActiveAdminTab('database')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeAdminTab === 'database' ? 'bg-white text-slate-900 font-black shadow-md' : 'text-white/80'
            }`}
          >
            🗄️ Database
          </button>
        </div>
      </div>

      {/* Tab 1: Future Monetization & Feature Flags (Sections 3 & 47) */}
      {activeAdminTab === 'flags' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Application Architecture Feature Flags
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The core application is built 100% free and open-source. Toggle these flags to test different modes of the platform.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {Object.entries(featureFlags).map(([flag, isEnabled]) => (
              <div
                key={flag}
                className="py-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {flag}
                  </div>
                  <span className="text-3xs text-slate-400">
                    {flag === 'FREE_AI_TUTOR' && 'Controls free unlimited access to the AI Teacher.'}
                    {flag === 'COMMUNITY_MODERATION' && 'Enforces strict medical fact checking in peer discussion boards.'}
                    {flag === 'VOICE_AI_ENABLED' && 'Enables Web Speech audio voice tutor synthesis.'}
                    {flag === 'BETA_SIMULATOR' && 'Enables next-generation 300Q dual-session full FMGE simulator.'}
                  </span>
                </div>

                <button
                  onClick={() => toggleFeatureFlag(flag as keyof FeatureFlags)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isEnabled
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{isEnabled ? 'ENABLED (TRUE)' : 'DISABLED (FALSE)'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Resource Moderation Pipeline (Section 40) */}
      {activeAdminTab === 'moderation' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              AI Resource Moderation Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pipeline: DISCOVERED &rarr; AI CLASSIFICATION &rarr; CHECK URL &rarr; CHECK SOURCE &rarr; CHECK LICENSE &rarr; ADMIN REVIEW &rarr; PUBLISHED.
            </p>
          </div>

          <div className="space-y-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 flex items-center justify-between"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xs font-extrabold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                      {res.license}
                    </span>
                    <span className={`text-3xs font-bold ${res.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {res.isVerified ? '✓ Published & Verified' : '⏳ In Review'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {res.title}
                  </h4>
                  <span className="text-3xs text-slate-400">
                    Source: {res.source} • {res.author}
                  </span>
                </div>

                {!res.isVerified && (
                  <button
                    onClick={() => verifyResource(res.id)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 ml-4"
                  >
                    Approve &amp; Publish
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Database & Content Metrics */}
      {activeAdminTab === 'database' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Current Content Schema Inventory
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-2xs text-slate-400 block font-bold">Total Subjects</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">19 / 19</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-2xs text-slate-400 block font-bold">Total Topics</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">{TOPICS.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-2xs text-slate-400 block font-bold">Questions in Bank</span>
              <span className="text-xl font-black text-teal-600 dark:text-teal-400">{QUESTIONS.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-2xs text-slate-400 block font-bold">Free Resources</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{resources.length}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
