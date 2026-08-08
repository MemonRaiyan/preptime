'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2, Flame } from 'lucide-react';

export const StudyRoomView: React.FC = () => {
  const { 
    pomodoroSeconds, pomodoroActive, pomodoroMode, 
    startPomodoro, pausePomodoro, resetPomodoro, todayStudyMinutes, profile 
  } = useApp();

  const [activeSound, setActiveSound] = useState<string>('none');

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(100, Math.round((todayStudyMinutes / (profile?.dailyGoalMinutes || 180)) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <Clock className="w-3.5 h-3.5" />
            <span>High-Focus Study Environment</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Study Focus Room & Timer
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Eliminate distractions with timed Pomodoro cycles (25/5, 50/10, 90/15) and focus metrics that automatically track your preparation consistency.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 space-y-1">
          <span className="text-3xs font-extrabold uppercase text-teal-300">Today's Focus Time</span>
          <div className="text-3xl font-black text-white">{todayStudyMinutes} Mins</div>
          <span className="text-3xs text-slate-300">Target: {profile?.dailyGoalMinutes || 180} Mins</span>
        </div>
      </div>

      {/* Main Big Pomodoro Timer Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-14 text-center shadow-sm space-y-8">
        
        {/* Preset Selector */}
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => resetPomodoro(25)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              pomodoroSeconds === 25 * 60 
                ? 'bg-teal-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            25 / 5 Pomodoro
          </button>
          <button
            onClick={() => resetPomodoro(50)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              pomodoroSeconds === 50 * 60 
                ? 'bg-teal-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            50 / 10 Focus
          </button>
          <button
            onClick={() => resetPomodoro(90)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              pomodoroSeconds === 90 * 60 
                ? 'bg-teal-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            90 / 15 Deep Clinical
          </button>
          <button
            onClick={() => resetPomodoro(5)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              pomodoroSeconds === 5 * 60 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            5 Min Break
          </button>
        </div>

        {/* Big Digital Countdown Display */}
        <div className="space-y-2">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-slate-400">
            {pomodoroMode === 'study' ? 'Deep Study Session' : 'Restorative Break'}
          </span>
          <div className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {formatTimer(pomodoroSeconds)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {pomodoroActive ? (
            <button
              onClick={pausePomodoro}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-3xl font-black text-sm shadow-lg flex items-center space-x-2 transition-all"
            >
              <Pause className="w-5 h-5" />
              <span>Pause Focus</span>
            </button>
          ) : (
            <button
              onClick={startPomodoro}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl shadow-teal-600/20 flex items-center space-x-2 transition-all"
            >
              <Play className="w-5 h-5" />
              <span>Start Session</span>
            </button>
          )}

          <button
            onClick={() => resetPomodoro(25)}
            className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sound Simulator */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-400 block">
            Ambient Background Atmosphere
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            {(['none', 'binaural', 'rain', 'library', 'hospital_ward'] as const).map(snd => (
              <button
                key={snd}
                onClick={() => setActiveSound(snd)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  activeSound === snd
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {snd.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Daily Progress Goal Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-3">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-900 dark:text-white">Daily Study Goal Completion</span>
          <span className="text-teal-600 dark:text-teal-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
};
