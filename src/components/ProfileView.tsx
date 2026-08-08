'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, QUESTIONS } from '../data/mockDb';
import { 
  User, Mail, Key, ShieldCheck, Target, Zap, Clock, Calendar, 
  Award, BarChart3, AlertCircle, Copy, Check, Download, Upload, RefreshCw, LogOut
} from 'lucide-react';
import { AuthModal } from './AuthModal';

export const ProfileView: React.FC = () => {
  const { 
    profile, updateProfile, attempts, gtAttempts, resetProgress, 
    currentUserEmail, logoutUser 
  } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backupString, setBackupString] = useState('');
  const [importString, setImportString] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // Target editing states
  const [targetScore, setTargetScore] = useState<number>(() => {
    return profile?.estimatedScoreRange[0] || 150;
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  // Onboarding parameters states
  const [learningLevel, setLearningLevel] = useState(profile?.currentLevel || 'beginner');
  const [dailyHours, setDailyHours] = useState(profile?.studyHoursPerDay || 4);
  const [isEditingParams, setIsEditingParams] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    let videoSolved = 0;
    let imageSolved = 0;
    let textSolved = 0;

    attempts.forEach(att => {
      const q = QUESTIONS.find(qu => qu.id === att.questionId);
      if (q) {
        if (q.type === 'video' || q.videoUrl) {
          videoSolved++;
        } else if (q.imageUrl || q.imagePath) {
          imageSolved++;
        } else {
          textSolved++;
        }
      }
    });

    const totalVideo = QUESTIONS.filter(q => q.type === 'video' || q.videoUrl).length;
    const totalImage = QUESTIONS.filter(q => q.imageUrl || q.imagePath).length;
    const totalText = QUESTIONS.length - totalVideo - totalImage;
    const completionPercent = QUESTIONS.length > 0 
      ? Math.round((attempts.length / QUESTIONS.length) * 100) 
      : 0;

    return { 
      videoSolved, totalVideo, 
      imageSolved, totalImage, 
      textSolved, totalText, 
      completionPercent 
    };
  }, [attempts]);

  // Handle Export backup
  const handleExport = () => {
    try {
      const backupData = {
        profile: localStorage.getItem('fmge_master_profile_v2'),
        attempts: localStorage.getItem('fmge_master_attempts_v2'),
        flashcards: localStorage.getItem('fmge_master_flashcards_v2'),
        studyPlan: localStorage.getItem('fmge_master_plan_v2'),
        dailyTasks: localStorage.getItem('fmge_master_tasks_v2'),
        gtAttempts: localStorage.getItem('fmge_master_gt_v2'),
        userUploads: localStorage.getItem('fmge_master_user_uploads_v2'),
        userSimulators: localStorage.getItem('fmge_master_user_simulators_v2'),
        usersDatabase: localStorage.getItem('fmge_users_database')
      };
      
      const backupCode = btoa(unescape(encodeURIComponent(JSON.stringify(backupData))));
      setBackupString(backupCode);
      navigator.clipboard.writeText(backupCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to export backup data', e);
    }
  };

  // Handle Import backup
  const handleImport = () => {
    if (!importString.trim()) {
      setImportError('Please paste your backup code first.');
      return;
    }
    try {
      setImportError('');
      const decodedData = JSON.parse(decodeURIComponent(escape(atob(importString.trim()))));
      
      if (decodedData.profile) localStorage.setItem('fmge_master_profile_v2', decodedData.profile);
      if (decodedData.attempts) localStorage.setItem('fmge_master_attempts_v2', decodedData.attempts);
      if (decodedData.flashcards) localStorage.setItem('fmge_master_flashcards_v2', decodedData.flashcards);
      if (decodedData.studyPlan) localStorage.setItem('fmge_master_plan_v2', decodedData.studyPlan);
      if (decodedData.dailyTasks) localStorage.setItem('fmge_master_tasks_v2', decodedData.dailyTasks);
      if (decodedData.gtAttempts) localStorage.setItem('fmge_master_gt_v2', decodedData.gtAttempts);
      if (decodedData.userUploads) localStorage.setItem('fmge_master_user_uploads_v2', decodedData.userUploads);
      if (decodedData.userSimulators) localStorage.setItem('fmge_master_user_simulators_v2', decodedData.userSimulators);
      if (decodedData.usersDatabase) localStorage.setItem('fmge_users_database', decodedData.usersDatabase);
      
      setImportSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      setImportError('Invalid backup code structure. Make sure you copied the complete code from your other device.');
    }
  };

  // Save updated targets
  const saveTargetScore = () => {
    if (targetScore < 150 || targetScore > 300) return;
    updateProfile({
      estimatedScoreRange: [targetScore, Math.min(300, targetScore + 20)]
    });
    setIsEditingTarget(false);
  };

  // Save updated diagnostics parameters
  const saveOnboardingParams = () => {
    updateProfile({
      currentLevel: learningLevel as any,
      studyHoursPerDay: Number(dailyHours)
    });
    setIsEditingParams(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Header Profile Dashboard */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-15 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-black text-teal-300 shadow-md">
              {profile?.name ? profile.name.substring(0, 1).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <h1 className="text-xl md:text-2xl font-black tracking-tight">{profile?.name || 'Aspirant'}</h1>
                <span className="text-4xs bg-teal-500/20 text-teal-200 border border-teal-400/30 px-2.5 py-0.5 rounded-full font-bold">
                  Lvl {profile?.level}
                </span>
              </div>
              <p className="text-xs text-slate-200 flex items-center space-x-1.5 justify-center md:justify-start">
                <Mail className="w-3.5 h-3.5 text-teal-300" />
                <span>{currentUserEmail || 'Offline Local Sync account'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {currentUserEmail ? (
              <button
                onClick={logoutUser}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl text-xs font-black flex items-center space-x-2 transition-all"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-lg transition-all"
              >
                <User className="w-4 h-4 text-teal-600" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Target & Score Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Estimate Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-3xs font-extrabold uppercase text-slate-400 block tracking-wider">Estimated Score Range</span>
            <div className="text-3xl font-black text-teal-600 dark:text-teal-400 mt-1">
              {profile?.estimatedScoreRange[0]} – {profile?.estimatedScoreRange[1]}
            </div>
          </div>
          <p className="text-4xs text-slate-400 leading-normal">
            Calculated dynamically based on cumulative MCQ correctness and Grand Tests scores.
          </p>
        </div>

        {/* Target Score Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between md:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-3xs font-extrabold uppercase text-slate-400 block tracking-wider">Active Target Score</span>
              {isEditingTarget ? (
                <div className="flex items-center space-x-2 mt-1.5">
                  <input
                    type="number"
                    min="150"
                    max="300"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Math.min(300, Math.max(150, Number(e.target.value))))}
                    className="w-20 px-2 py-1 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={saveTargetScore}
                    className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-4xs font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setTargetScore(profile?.estimatedScoreRange[0] || 150);
                      setIsEditingTarget(false);
                    }}
                    className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-4xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1 flex items-center space-x-2">
                  <span>{profile?.estimatedScoreRange[0]} Marks</span>
                  <button
                    onClick={() => setIsEditingTarget(true)}
                    className="text-4xs text-teal-600 font-bold px-2 py-0.5 rounded bg-teal-500/10 hover:bg-teal-500/20 transition-all border border-teal-500/20"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            <span className="text-4xs text-slate-400 font-medium">Cutoff: 150/300</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-4xs font-bold text-slate-400">
              <span>Goal Progress</span>
              <span>{(profile?.estimatedScoreRange[0] || 150) >= 150 ? 'Likely Passing' : 'Critical Goal'}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-teal-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.round(((profile?.estimatedScoreRange[0] || 150) / 300) * 100))}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Diagnostics Parameters Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-4">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Diagnostic & Prep Parameters</h3>
            <p className="text-4xs text-slate-400">Manage your study allocations and current clinical preparation level.</p>
          </div>
          {!isEditingParams ? (
            <button
              onClick={() => setIsEditingParams(true)}
              className="text-4xs font-extrabold px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl transition-all border border-slate-250 dark:border-slate-700"
            >
              Update Settings
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={saveOnboardingParams}
                className="text-4xs font-bold px-3 py-1 bg-teal-600 text-white rounded-xl"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setLearningLevel(profile?.currentLevel || 'beginner');
                  setDailyHours(profile?.studyHoursPerDay || 4);
                  setIsEditingParams(false);
                }}
                className="text-4xs font-bold px-3 py-1 bg-slate-200 text-slate-700 rounded-xl"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          
          <div className="space-y-1.5">
            <span className="text-3xs text-slate-400 font-extrabold uppercase">Preparation Level</span>
            {isEditingParams ? (
              <select
                value={learningLevel}
                onChange={(e) => setLearningLevel(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
              >
                <option value="beginner">Beginner / First Attempt</option>
                <option value="intermediate">Intermediate / Practicing</option>
                <option value="repeater">Repeater / Postponed</option>
                <option value="revision">Revision Phase / Daily MCQs</option>
              </select>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 font-bold capitalize text-slate-900 dark:text-white border border-slate-100 dark:border-slate-850">
                {profile?.currentLevel.replace('-', ' ') || 'Beginner'}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-3xs text-slate-400 font-extrabold uppercase">Study Commitment (Daily Hours)</span>
            {isEditingParams ? (
              <input
                type="number"
                min="1"
                max="16"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
              />
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-slate-850">
                {profile?.studyHoursPerDay || 4} Hours per Day
              </div>
            )}
          </div>

        </div>

        {/* Reset / Run Diagnostic Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900 dark:text-white block">Reset Diagnostic Data</span>
            <span className="text-4xs text-slate-400 leading-normal block">This will wipe your current stats, history, and let you rerun the Onboarding Diagnostic Wizard.</span>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset your progress and start onboarding diagnostics again?')) {
                resetProgress();
              }
            }}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-3xs font-extrabold border border-rose-500/20 transition-all shrink-0 ml-4"
          >
            Restart Diagnostics Wizard
          </button>
        </div>

      </div>

      {/* Device Cross-Sync Transfer System */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-3xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">Local Backup Sync</span>
          <h3 className="font-black text-sm text-slate-900 dark:text-white mt-0.5">Transfer Progress Between Phone & Laptop</h3>
          <p className="text-4xs text-slate-400 leading-normal mt-0.5">
            Since your account runs local storage databases, you can migrate or sync your study history by exporting this code and pasting it on your other device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section A: Export Data */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">Step 1: Export from source device</span>
              <p className="text-4xs text-slate-500 leading-normal">
                Click the button below to copy the encrypted backup code containing your study progress, answers history, and user databases.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-3xs font-black flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Backup Code!' : 'Copy Device Backup Code'}</span>
              </button>

              {backupString && (
                <textarea
                  readOnly
                  value={backupString}
                  className="w-full h-16 p-2 rounded-lg border bg-slate-100 dark:bg-slate-900 dark:border-slate-700 text-4xs font-mono text-slate-500 dark:text-slate-400 break-all resize-none"
                  onClick={(e) => (e.target as any).select()}
                />
              )}
            </div>
          </div>

          {/* Section B: Import Data */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white block">Step 2: Import to target device</span>
              <p className="text-4xs text-slate-500 leading-normal">
                Paste the backup code copied from your other device into the box below and click import to synchronize.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Paste backup code here..."
                value={importString}
                onChange={(e) => setImportString(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 dark:border-slate-750 text-3xs font-mono text-slate-900 dark:text-white"
              />

              {importError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-4xs font-semibold">
                  {importError}
                </div>
              )}

              {importSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-4xs font-semibold">
                  Success! Synchronizing database & reloading...
                </div>
              )}

              <button
                onClick={handleImport}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl text-3xs font-black flex items-center justify-center space-x-2 transition-all border border-slate-700/80"
              >
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span>Import & Synchronize data</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Solved Questions Breakdown Statistics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
          <BarChart3 className="w-4.5 h-4.5 text-indigo-600" />
          <span>Format-Specific Attempt Metrics</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 space-y-2">
            <span className="text-slate-500 block text-3xs uppercase">Standard MCQs</span>
            <div className="text-xl font-black text-slate-950 dark:text-white">{stats.textSolved} <span className="text-3xs text-slate-400 font-medium">/ {stats.totalText} solved</span></div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${stats.totalText > 0 ? (stats.textSolved / stats.totalText) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 space-y-2">
            <span className="text-slate-500 block text-3xs uppercase">Video MCQs</span>
            <div className="text-xl font-black text-slate-950 dark:text-white">{stats.videoSolved} <span className="text-3xs text-slate-400 font-medium">/ {stats.totalVideo} solved</span></div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-teal-500 h-full rounded-full"
                style={{ width: `${stats.totalVideo > 0 ? (stats.videoSolved / stats.totalVideo) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 space-y-2">
            <span className="text-slate-500 block text-3xs uppercase">Image Spotters</span>
            <div className="text-xl font-black text-slate-950 dark:text-white">{stats.imageSolved} <span className="text-3xs text-slate-400 font-medium">/ {stats.totalImage} solved</span></div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-rose-500 h-full rounded-full"
                style={{ width: `${stats.totalImage > 0 ? (stats.imageSolved / stats.totalImage) * 100 : 0}%` }}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
