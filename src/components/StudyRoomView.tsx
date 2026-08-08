'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, Flame, Users, Sparkles, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StudyRoomView: React.FC = () => {
  const { profile } = useApp();

  const [activeCycle, setActiveCycle] = useState<number>(25); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // seconds
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [focusTimeToday, setFocusTimeToday] = useState<number>(180 + 32); // mock 3h 32m study time today

  useEffect(() => {
    let interval: any;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        if (timeLeft % 60 === 0) {
          setFocusTimeToday(prev => prev + 1); // add 1 minute to daily total
        }
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      alert('Pomodoro focus cycle complete! Take a well-deserved break.');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const selectCycle = (mins: number) => {
    setActiveCycle(mins);
    setTimeLeft(mins * 60);
    setTimerRunning(false);
  };

  const handleToggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(activeCycle * 60);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatFocusTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  // Mock virtual study partners
  const activeMates = [
    { name: 'Dr. Pooja S.', subject: 'Anatomy - Inguinal Hernia', status: 'Focusing', duration: '42 min' },
    { name: 'Dr. Amit Patel', subject: 'Pharmacology - Autonomics', status: 'Short Break', duration: '5 min' },
    { name: 'Dr. Neha Shah', subject: 'OBG - Preeclampsia', status: 'Focusing', duration: '90 min' },
    { name: 'Dr. Sameer K.', subject: 'General Surgery - Appendicitis', status: 'Focusing', duration: '12 min' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      
      {/* Left panel: Pomodoro Workspace */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between text-center min-h-[420px]">
        <div className="w-full">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850 mb-6">
            <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">Pomodoro Focus Room</span>
            <div className="flex space-x-1.5">
              {[25, 50, 90].map(mins => (
                <button
                  key={mins}
                  onClick={() => selectCycle(mins)}
                  className={`px-3 py-1.5 rounded-lg border text-3xs font-extrabold transition-all ${
                    activeCycle === mins
                      ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400'
                      : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ticking clock visual */}
        <div className="my-6 relative flex items-center justify-center">
          {/* Circular dial background effect */}
          <div className="w-52 h-52 rounded-full border-4 border-slate-100 dark:border-slate-850 flex flex-col items-center justify-center">
            <Clock className="w-6 h-6 text-teal-650 mb-2 animate-pulse" />
            <span className="text-4xl font-black text-slate-850 dark:text-white tracking-tight">
              {formatTimer(timeLeft)}
            </span>
            <span className="text-4xs text-slate-400 font-extrabold uppercase mt-1">
              {timerRunning ? 'Session active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex space-x-4 w-full max-w-xs">
          <button
            onClick={handleToggleTimer}
            className={`flex-1 py-3 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5 ${
              timerRunning 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10' 
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-500/10'
            }`}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{timerRunning ? 'Pause Cycle' : 'Start Focus'}</span>
          </button>
          
          <button
            onClick={handleResetTimer}
            className="px-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-650 font-bold rounded-2xl active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right panel: Study Mates & Stats */}
      <div className="space-y-6">
        {/* Daily focus stats */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400">Total Focus Time Today</span>
            <span className="block text-xl font-black text-slate-850 dark:text-white">{formatFocusTime(focusTimeToday)}</span>
          </div>
          <Flame className="w-10 h-10 text-orange-500 fill-orange-500/10" />
        </div>

        {/* Virtual Study mates */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-teal-650 dark:text-teal-400 mb-2 border-b pb-2 border-slate-100 dark:border-slate-800">
            <Users className="w-5 h-5" />
            <h3 className="font-bold text-sm">Virtual focus room mates</h3>
          </div>

          <div className="space-y-3.5">
            {activeMates.map((mate, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="space-y-0.5">
                  <span className="block font-bold text-slate-850 dark:text-slate-200">{mate.name}</span>
                  <span className="block text-3xs text-slate-450 dark:text-slate-455 text-slate-500">{mate.subject}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-4xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    mate.status === 'Focusing' 
                      ? 'bg-teal-500/10 text-teal-650' 
                      : 'bg-yellow-500/10 text-yellow-600'
                  }`}>
                    {mate.status}
                  </span>
                  <span className="block text-4xs text-slate-400 mt-1">{mate.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
