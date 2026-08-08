'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/mockDb';
import { Calendar, Clock, CheckSquare, ListTodo, AlertTriangle, Sparkles } from 'lucide-react';

export const PlannerView: React.FC = () => {
  const { studyPlan, generateStudyPlan, dailyTasks, toggleTaskComplete, profile } = useApp();

  if (!profile) return null;

  const getSubjectName = (subId: string) => {
    return SUBJECTS.find(s => s.id === subId)?.name || subId;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 to-blue-950 p-8 rounded-3xl border border-blue-800 text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-blue-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>AI Dynamic Allocation Active</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">AI Study Planner</h1>
          <p className="text-blue-105 text-blue-200 text-sm max-w-md">
            Your study sessions automatically prioritize weak subjects like {profile.weakSubjects[0] ? getSubjectName(profile.weakSubjects[0]) : 'Medicine'} and reduce load on mastered topics.
          </p>
        </div>

        {!studyPlan && (
          <button
            onClick={generateStudyPlan}
            className="px-6 py-3.5 bg-white text-blue-900 hover:bg-blue-50 rounded-2xl text-xs font-extrabold shadow-lg active:scale-95 transition-all flex items-center space-x-2 shrink-0 animate-bounce-slow"
          >
            <span>Compile AI Planner</span>
            <Sparkles className="w-4 h-4 text-blue-900 fill-current" />
          </button>
        )}
      </div>

      {!studyPlan ? (
        // Empty state asking user to generate plan
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-850 dark:text-white">Generate Study Calendar</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Click compile to generate a custom 120-day daily task list configured with your strength/weakness profile.
          </p>
          <button
            onClick={generateStudyPlan}
            className="w-full py-3.5 bg-blue-650 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Generate AI Study Plan
          </button>
        </div>
      ) : (
        // Plan & Tasks panels
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Daily Schedule block */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Active Daily Schedule</h3>
            </div>

            <div className="relative border-l border-slate-200 dark:border-slate-800 pl-6 ml-3 space-y-8 py-2">
              {Object.entries(studyPlan.dailySchedule).map(([time, value]) => {
                const subName = getSubjectName(value.subjectId);
                return (
                  <div key={time} className="relative">
                    {/* timeline bullet node */}
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                    
                    <div className="space-y-1">
                      <span className="block text-2xs font-extrabold tracking-wider text-slate-400 uppercase">
                        {time}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">
                        {value.task}
                      </h4>
                      {value.subjectId !== 'general' && (
                        <span className="inline-block text-4xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded">
                          {subName} • {value.topicId}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly objectives & checklists */}
          <div className="space-y-6">
            {/* Weekly objectives */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-2 text-teal-650 dark:text-teal-400 mb-4 border-b pb-2 border-slate-100 dark:border-slate-800">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-sm">Weekly Objectives</h3>
              </div>
              <ul className="space-y-3">
                {studyPlan.weeklyObjectives.map((obj, index) => (
                  <li key={index} className="text-xs text-slate-650 dark:text-slate-400 flex items-start space-x-2.5 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-3xs shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Checklist trigger */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-2 text-blue-500 mb-4 border-b pb-2 border-slate-100 dark:border-slate-800">
                <ListTodo className="w-5 h-5" />
                <h3 className="font-bold text-sm">Active Tasks Checklists</h3>
              </div>
              <div className="space-y-3">
                {dailyTasks.map((task) => {
                  const isCompleted = task.completedCount >= task.targetCount;
                  return (
                    <div 
                      key={task.id}
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`flex items-center space-x-3 p-3 border rounded-2xl cursor-pointer transition-all ${
                        isCompleted 
                          ? 'border-slate-100 bg-slate-50/50 dark:bg-slate-950/20 opacity-60' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 dark:border-slate-700 bg-transparent'
                      }`}>
                        {isCompleted && <span className="text-3xs font-black text-white">✓</span>}
                      </div>
                      <span className={`text-2xs font-bold truncate leading-relaxed ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-350'
                      }`}>
                        {task.taskType === 'mcq' && `Practice ${task.targetCount} MCQs`}
                        {task.taskType === 'revision' && `Review mistakes for ${task.topicId}`}
                        {task.taskType === 'flashcard' && `Review ${task.targetCount} cards`}
                        {task.taskType === 'quiz' && `Solve daily challenge`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
