'use client';

import React, { useState } from 'react';
import { QUESTIONS, SUBJECTS } from '../data/mockDb';
import { 
  ShieldCheck, FileText, CheckCircle, Clock, AlertTriangle, 
  ChevronRight, Sparkles, Star, ThumbsUp, XCircle 
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  // Mock questions pending approval
  const [adminQueue, setAdminQueue] = useState([
    {
      id: 'aq1',
      subjectId: 'medicine',
      topicId: 'myocardial-infarction',
      questionText: 'Which ECG lead placement is specific for detecting right ventricular infarction?',
      options: ['V1 and V2', 'V3R and V4R', 'V5 and V6', 'Lead I and aVL'],
      correctAnswerIndex: 1,
      explanation: 'Right ventricular infarction presents with ST elevation in right-sided chest leads, most specifically V3R and V4R. Avoid nitrate therapies.',
      status: 'pending_reviewer',
      aiValidated: true
    },
    {
      id: 'aq2',
      subjectId: 'pharmacology',
      topicId: 'autonomic-drugs',
      questionText: 'What is the primary mechanism of action of Pyridostigmine in myasthenia gravis?',
      options: ['Reversible acetylcholinesterase inhibitor', 'Irreversible acetylcholinesterase inhibitor', 'Direct cholinergic agonist', 'Muscarinic antagonist'],
      correctAnswerIndex: 0,
      explanation: 'Pyridostigmine is a carbamate that reversibly binds acetylcholinesterase, prolonging the presence of ACh in the synaptic cleft.',
      status: 'ai_validated',
      aiValidated: true
    }
  ]);

  const handleApprove = (id: string) => {
    setAdminQueue(prev => 
      prev.map(item => item.id === id ? { ...item, status: 'published' } : item)
    );
    alert('Question Status Updated: Published to active FMGE Practice Bank.');
  };

  const getSubjectName = (subId: string) => {
    return SUBJECTS.find(s => s.id === subId)?.name || subId;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight">Admin Dashboard</h2>
        <p className="text-xs text-slate-500">Quality vetting pipelines for AI generated medical exam materials.</p>
      </div>

      {/* Info notification */}
      <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-2xl text-xs text-teal-800 dark:text-teal-400 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-teal-650" />
        <div className="space-y-1 leading-normal font-normal">
          <span className="font-bold block">Medical Vetting Workflow Protocol:</span>
          <span>Never automatically publish high-stakes medical education material. The pipeline demands: **AI Generated → AI Validation → Medical Reviewer Check → Approved & Published** to ensure zero error rates.</span>
        </div>
      </div>

      {/* Approval Vetting List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-850 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
          Vetting Pipeline Queue ({adminQueue.filter(i => i.status !== 'published').length} pending)
        </h3>

        <div className="space-y-4">
          {adminQueue.map((item) => {
            const isPublished = item.status === 'published';
            return (
              <div 
                key={item.id}
                className={`p-5 border rounded-2xl space-y-4 transition-all ${
                  isPublished 
                    ? 'border-slate-100 bg-slate-50/40 dark:bg-slate-950/10 opacity-60' 
                    : 'border-slate-200 dark:border-slate-800 bg-transparent'
                }`}
              >
                {/* top row */}
                <div className="flex justify-between items-center text-3xs font-extrabold tracking-wide uppercase">
                  <span className="text-teal-650">{getSubjectName(item.subjectId)}</span>
                  
                  {/* Status badges */}
                  <div className="flex space-x-2">
                    {item.aiValidated && (
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 px-2 py-0.5 rounded">
                        ✓ AI VALIDATED
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded ${
                      isPublished 
                        ? 'bg-slate-150 text-slate-500' 
                        : item.status === 'pending_reviewer'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600'
                        : 'bg-blue-500/10 border border-blue-500/30 text-blue-650'
                    }`}>
                      {isPublished ? 'PUBLISHED' : item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* question core */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">
                    {item.questionText}
                  </p>
                  <ul className="list-disc pl-5 text-4xs text-slate-500 dark:text-slate-400 space-y-1">
                    {item.options.map((opt, oIdx) => (
                      <li key={oIdx} className={oIdx === item.correctAnswerIndex ? 'font-bold text-slate-700 dark:text-slate-200' : ''}>
                        {opt} {oIdx === item.correctAnswerIndex ? '(Correct)' : ''}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* action footer */}
                {!isPublished && (
                  <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-850">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-3xs font-bold shadow-md active:scale-95 transition-all flex items-center space-x-1.5"
                    >
                      <ThumbsUp className="w-3 h-3 text-teal-650 dark:text-teal-400" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
