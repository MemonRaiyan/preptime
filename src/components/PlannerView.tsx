'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/mockDb';
import { 
  Calendar, CheckCircle2, Circle, Clock, Sparkles, 
  RotateCcw, Compass, ArrowRight, Target, ShieldCheck 
} from 'lucide-react';

export const PlannerView: React.FC = () => {
  const { profile, studyPlan, generateStudyPlan, dailyTasks, toggleTaskComplete, navigateToTopic } = useApp();

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>AI Adaptive Schedule Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            Personalized FMGE Study Planner
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Targeting <strong>{profile?.targetExam || 'December 2026'}</strong> based on your {profile?.studyHoursPerDay || 8} daily study hours, prioritizing your identified weak subjects ({profile?.weakSubjects?.join(', ') || 'PSM, Medicine'}).
          </p>
        </div>

        <button
          onClick={generateStudyPlan}
          className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center space-x-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Regenerate Adaptive Plan</span>
        </button>
      </div>

      {/* Today's Daily Target Checklist */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Today's Actionable Study Tasks
            </h3>
            <p className="text-2xs text-slate-400">
              Complete your daily tasks to earn bonus XP and maintain your preparation streak.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
            {dailyTasks.filter(t => t.completedCount >= t.targetCount).length} / {dailyTasks.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {dailyTasks.map((task) => {
            const isDone = task.completedCount >= task.targetCount;
            return (
              <div
                key={task.id}
                onClick={() => toggleTaskComplete(task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isDone 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 hover:border-teal-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <h4 className={`text-xs font-bold ${isDone ? 'line-through opacity-70' : ''}`}>
                      {task.title}
                    </h4>
                    <span className="text-3xs text-slate-400 font-mono">
                      Target: {task.targetCount} • Est. {task.durationMinutes} mins
                    </span>
                  </div>
                </div>

                <span className="text-3xs font-extrabold px-2 py-1 rounded bg-black/5 dark:bg-white/10 uppercase">
                  {task.taskType}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Time Block Schedule (Section 15) */}
      {studyPlan && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Master Daily Time-Block Routine</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(studyPlan.dailySchedule).map(([timeBlock, slot], idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-xl shrink-0">
                    {timeBlock}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {slot.task}
                    </h4>
                    <span className="text-3xs text-slate-400">
                      Duration: {slot.estimatedMinutes} Mins • Mode: {slot.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigateToTopic(slot.subjectId, slot.topicId)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-xl text-2xs font-bold transition-all shrink-0"
                >
                  Start Block
                </button>
              </div>
            ))}
          </div>

          {/* Weekly Objectives */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Weekly Preparation Objectives
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studyPlan.weeklyObjectives.map((obj, oIdx) => (
                <div
                  key={oIdx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2"
                >
                  <Target className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
