'use client';

import React, { useState } from 'react';
import { 
  Zap, Calendar, Clock, AlertTriangle, FileText, CheckCircle, 
  HelpCircle, ShieldCheck, Info, MapPin, ClipboardList 
} from 'lucide-react';

export const SpecialRevisionView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'60min' | 'last30' | 'last7' | 'checklist'>('60min');

  // Checklist states
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    'doc1': false,
    'doc2': false,
    'doc3': false,
    'doc4': false,
    'rule1': false,
    'rule2': false,
  });

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Mock High Yield data for 60 Minute Revision
  const rapidData = [
    { disease: 'Eclampsia', doc: 'Magnesium Sulfate (MgSO4)', mechanism: 'Blocks calcium influx, membrane stabilizer', sign: 'Hyperreflexia, seizure', trap: 'Do NOT give Valproate or Diazepam first line.' },
    { disease: 'Organophosphate Poisoning', doc: 'Atropine + Pralidoxime (2-PAM)', mechanism: 'Muscarinic blocker + AChE reactivator', sign: 'Salivation, pinpoint pupil (miosis)', trap: 'Atropine doesn\'t reverse muscle weakness; oximes do.' },
    { disease: 'Minimal Change Disease', doc: 'Prednisolone (Corticosteroids)', mechanism: 'Immunosuppressive, stabilizes podocyte membrane', sign: 'Puffy eyes, massive proteinuria', trap: 'Biopsy is NOT required for initial treatment in children.' },
    { disease: 'Anaphylactic Shock', doc: 'Adrenaline (1:1000 IM)', mechanism: 'Alpha-1 (pressor), Beta-1 (inotrope), Beta-2 (bronchodilator)', sign: 'Stridor, urticaria, hypotension', trap: 'Do NOT give subcutaneous adrenaline; IM (thigh) is DOC.' },
    { disease: 'Plasmodium vivax malaria', doc: 'Chloroquine + Primaquine', mechanism: 'Heme polymerase inhibitor + hypnozoiticidal', sign: 'Chills, fever spikes, splenomegaly', trap: 'Always screen for G6PD deficiency before giving Primaquine!' }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Selector Subtabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3 justify-between items-center">
        <div className="flex space-x-2">
          {[
            { id: '60min', label: '60-Min Revision', icon: Zap },
            { id: 'last30', label: 'Last 30 Days', icon: Calendar },
            { id: 'last7', label: 'Last 7 Days', icon: Clock },
            { id: 'checklist', label: 'Exam Day Checklist', icon: ClipboardList }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-3xs sm:text-2xs font-extrabold uppercase tracking-wide transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace view displays */}
      {activeSubTab === '60min' && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">60-Minute FMGE High Yields</h3>
            <p className="text-2xs text-slate-400">Review critical Drugs of Choice, Mechanisms, and typical MCQ traps before entering the test arena.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-150">
                  <th className="p-4">Medical Condition</th>
                  <th className="p-4">Drug of Choice</th>
                  <th className="p-4">Mechanism / Key Finding</th>
                  <th className="p-4 text-rose-500">Typical MCQ Trap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rapidData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="p-4 font-bold text-slate-850 dark:text-slate-200">{row.disease}</td>
                    <td className="p-4 font-semibold text-teal-650 dark:text-teal-400">{row.doc}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 leading-relaxed">{row.mechanism}</td>
                    <td className="p-4 text-rose-600 dark:text-rose-400 bg-rose-500/5 leading-relaxed font-semibold italic">{row.trap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'last30' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Calendar className="w-12 h-12 text-teal-500 mx-auto fill-teal-500/10" />
            <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">Final 30 Days Dashboard Active</h3>
            <p className="text-xs text-slate-500">Focus shifts to retention, PYQs, and Grand Tests. Limit new reading material.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
              <span className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">Recommended Routine</span>
              <ul className="list-disc pl-5 text-2xs text-slate-600 dark:text-slate-450 space-y-2 leading-relaxed">
                <li>Attempt 1 Grand Test (300 Qs) every Wednesday & Sunday.</li>
                <li>Devote 2 hours daily to reviewing Mistake Notebook.</li>
                <li>Complete 50 Spaced-Repetition flashcards morning and night.</li>
              </ul>
            </div>

            <div className="p-4 bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 rounded-2xl">
              <span className="block text-2xs font-extrabold uppercase text-teal-650 dark:text-teal-400 mb-1">Focus Checklist</span>
              <ul className="list-disc pl-5 text-2xs text-teal-800 dark:text-teal-400 space-y-2 leading-relaxed font-semibold">
                <li>Microbiology organism charts & gram stain trees</li>
                <li>Pharmacology drug of choices & receptor bindings</li>
                <li>Community Medicine health indictors & vaccine cycles</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'last7' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Clock className="w-12 h-12 text-rose-500 mx-auto fill-rose-500/10" />
            <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">Final 7 Days Protocol</h3>
            <p className="text-xs text-slate-500">Zero new theories. Active recall and physical preparation only.</p>
          </div>

          <div className="p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-800 dark:text-rose-400 text-xs leading-relaxed flex items-start space-x-3 font-semibold">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
            <span>
              CRITICAL: Do NOT attempt full 300-question Grand Tests within 3 days of the actual exam. It causes brain fatigue. Review only the Mistake Notebook, image slides, and high-yield pharmacology charts.
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-extrabold text-2xs uppercase tracking-wider text-slate-400">Immediate Action Items</h4>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
              <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
              <span className="text-2xs font-semibold text-slate-700 dark:text-slate-350">Review 100% of Mistake Notebook categories.</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl">
              <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
              <span className="text-2xs font-semibold text-slate-700 dark:text-slate-350">Practice the complete Image Bank gallery once.</span>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'checklist' && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">Official Exam Checklist</h3>
            <p className="text-2xs text-slate-450 dark:text-slate-455 text-slate-500">Ensure all documents are arranged. Link to official source: <a href="https://natboard.edu.in" target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">NBEMS portal</a>.</p>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            
            {/* Documents Check list */}
            <div className="space-y-3">
              <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400">Required Documents</span>
              
              {[
                { id: 'doc1', label: 'Admit Card with recent passport size photograph pasted.' },
                { id: 'doc2', label: 'Primary Medical Qualification certificate (original / copy).' },
                { id: 'doc3', label: 'Valid Govt Photo ID (Aadhar Card / PAN Card / Passport).' },
                { id: 'doc4', label: 'Eligibility Certificate issued by National Medical Commission (NMC).' }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    checklist[item.id] ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300 dark:border-slate-700 bg-transparent'
                  }`}>
                    {checklist[item.id] && <span className="text-3xs font-black text-white">✓</span>}
                  </div>
                  <span className={`text-2xs font-semibold ${checklist[item.id] ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-350'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* General exam day instructions */}
            <div className="p-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>NBEMS Reporting Instructions</span>
              </div>
              <ul className="list-disc pl-5 text-3xs text-slate-600 dark:text-slate-350 space-y-1.5 leading-relaxed font-normal">
                <li>Reporting time: Session 1 closes at 08:30 AM; Session 2 closes at 01:30 PM.</li>
                <li>Biometric verification and face tracking are mandatory before entry.</li>
                <li>No stationery items, calculators, pens, wristwatches, or electronics are allowed inside.</li>
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
