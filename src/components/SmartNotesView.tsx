'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS, TOPICS } from '../data/mockDb';
import { Topic } from '../types/database';
import { 
  Search, BookOpen, Star, Sparkles, FileText, Video, 
  MapPin, Pill, HelpCircle, ChevronRight, Bookmark, Highlighter 
} from 'lucide-react';

export const SmartNotesView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('anatomy');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(TOPICS.find(t => t.subjectId === 'anatomy') || null);
  
  // Highlight / Bookmark states
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [highlights, setHighlights] = useState<Set<string>>(new Set());

  // Free resource hub categories toggles
  const [resourceCategory, setResourceCategory] = useState<'notes' | 'videos' | 'charts' | 'guidelines'>('notes');

  const filteredTopics = TOPICS.filter(t => 
    t.subjectId === selectedSubject && 
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.highYieldNotes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleBookmark = (topicId: string) => {
    const next = new Set(bookmarks);
    if (next.has(topicId)) {
      next.delete(topicId);
    } else {
      next.add(topicId);
    }
    setBookmarks(next);
  };

  const toggleHighlight = (topicId: string) => {
    const next = new Set(highlights);
    if (next.has(topicId)) {
      next.delete(topicId);
    } else {
      next.add(topicId);
    }
    setHighlights(next);
  };

  // Mock public domain guidelines and resource links
  const mockFreeResources = {
    videos: [
      { title: 'Anatomy: Circle of Willis & Cerebellar Blood Supply', author: 'Open-Access Medical Library', license: 'CC-BY-SA 4.0', duration: '14 min', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3139049/' },
      { title: 'Physiology: Cardiovascular Pressure Loops Tutorial', author: 'Government Health Education India', license: 'Public Domain', duration: '22 min', url: 'https://main.mohfw.gov.in/' },
      { title: 'PSM: National Immunization Schedule 2026 Core Updates', author: 'Official MHFW Guidelines', license: 'Official Gov Resource', duration: '35 min', url: 'https://main.mohfw.gov.in/sites/default/files/National%20Immunization%20Schedule.pdf' }
    ],
    charts: [
      { title: 'Antimicrobials Mechanisms of Action Poster', author: 'Original Platform Resource', license: 'Free Educational Copy', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6604941/' },
      { title: 'Microbiology Gram Stain Morphological Tree', author: 'Open-Source Diagnostics Guild', license: 'CC-BY-NC 2.0', url: 'https://www.ncbi.nlm.nih.gov/books/NBK8262/' },
      { title: 'OBG Preeclampsia Pritchard Regimen flowchart', author: 'WHO Maternal Health Guidelines', license: 'Public Access', url: 'https://www.who.int/publications/i/item/9789241548335' }
    ],
    guidelines: [
      { title: 'NBEMS Official Syllabus Outline for FMGE 2026', author: 'National Board of Examinations', license: 'Official NBEMS Document', url: 'https://natboard.edu.in' },
      { title: 'WHO Hypertension Treatment Guidelines 2025', author: 'World Health Organization', license: 'Public Domain', url: 'https://www.who.int/publications/i/item/9789240032613' }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
      
      {/* Sidebar Subject & Topic selector */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit space-y-6">
        
        {/* Search Notes input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-teal-500 focus:outline-none text-2xs md:text-xs text-slate-850 dark:text-white"
          />
        </div>

        {/* Subjects list */}
        <div>
          <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Syllabus Subjects</span>
          <div className="grid grid-cols-2 gap-2">
            {SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubject(sub.id);
                  const firstTopic = TOPICS.find(t => t.subjectId === sub.id);
                  setActiveTopic(firstTopic || null);
                }}
                className={`py-2 px-2.5 text-3xs font-extrabold rounded-lg border text-center transition-all ${
                  selectedSubject === sub.id
                    ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400'
                    : 'border-slate-100 dark:border-slate-850 bg-slate-50/30 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Topics matching selected subject list */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">High-Yield Topics</span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setActiveTopic(topic);
                  setResourceCategory('notes'); // switch back to notes view
                }}
                className={`w-full flex items-center justify-between p-2.5 border rounded-xl text-left text-3xs font-bold transition-all ${
                  activeTopic?.id === topic.id
                    ? 'border-teal-500 bg-teal-50/20 dark:bg-teal-950/10 text-teal-650'
                    : 'border-slate-100 dark:border-slate-850 bg-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{topic.name}</span>
                {bookmarks.has(topic.id) && <Bookmark className="w-3 h-3 text-teal-500 fill-current" />}
              </button>
            ))}
            {filteredTopics.length === 0 && (
              <span className="text-4xs text-slate-400 block text-center py-4">No topics found.</span>
            )}
          </div>
        </div>
      </div>

      {/* Main detail page workspace */}
      <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Toggle notes vs free resources (video hub, charts) */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 pb-4 justify-between items-center">
          <div className="flex space-x-2">
            {[
              { id: 'notes', label: 'Study Note', icon: FileText },
              { id: 'videos', label: 'Video Lecture', icon: Video },
              { id: 'charts', label: 'Drug / Micro Charts', icon: Pill },
              { id: 'guidelines', label: 'Guidelines / Syllabus', icon: BookOpen }
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setResourceCategory(cat.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-2xs font-extrabold tracking-wide uppercase transition-all ${
                    resourceCategory === cat.id
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {activeTopic && resourceCategory === 'notes' && (
            <div className="flex space-x-2">
              <button
                onClick={() => toggleHighlight(activeTopic.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  highlights.has(activeTopic.id)
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Highlighter className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleBookmark(activeTopic.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  bookmarks.has(activeTopic.id)
                    ? 'border-teal-500 bg-teal-500/10 text-teal-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>
          )}
        </div>

        {/* Content displays */}
        {resourceCategory === 'notes' ? (
          activeTopic ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 text-teal-650 dark:text-teal-400 text-4xs font-extrabold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Verified Educational Content</span>
                </div>
                <h2 className="text-2xl font-black text-slate-850 dark:text-white leading-tight">
                  {activeTopic.name}
                </h2>
              </div>

              {/* Study Note text box */}
              <div className={`p-6 rounded-3xl border transition-colors duration-300 leading-relaxed text-xs md:text-sm font-normal ${
                highlights.has(activeTopic.id)
                  ? 'bg-yellow-500/5 border-yellow-200 dark:border-yellow-900/30 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300'
              }`}>
                <p className="whitespace-pre-wrap">{activeTopic.highYieldNotes}</p>
              </div>

              {/* Smart Note Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 border-slate-100 dark:border-slate-850">
                  <span className="block text-2xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">AI Smart Query</span>
                  <p className="text-4xs text-slate-400 leading-normal mb-3">Stuck on a concept? Select text or ask AI for a quick analogy.</p>
                  <button 
                    onClick={() => setActiveTab('ai-tutor')}
                    className="py-2 px-4 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-bold rounded-xl text-3xs active:scale-95 transition-all"
                  >
                    Ask AI Tutor sandbox
                  </button>
                </div>

                <div className="p-4 bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 rounded-2xl">
                  <span className="block text-2xs font-extrabold uppercase tracking-wider text-teal-650 dark:text-teal-400 mb-1">Knowledge Check</span>
                  <p className="text-4xs text-teal-600/80 leading-normal mb-3">Ready to test what you learned? Jump to targeted questions.</p>
                  <button 
                    onClick={() => setActiveTab('practice')}
                    className="py-2 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-3xs active:scale-95 transition-all"
                  >
                    Solve Practice MCQs
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400 py-12">Select a topic from the left sidebar to start.</div>
          )
        ) : (
          // Free Resources Hub explorer
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-1">Free Resource Hub</h3>
              <p className="text-2xs text-slate-400">Public domain, government updates, and original opensource assets (₹0 budget friendly).</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
              {resourceCategory === 'videos' && mockFreeResources.videos.map((vid, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-850 dark:text-white">{vid.title}</span>
                    <span className="block text-4xs text-slate-450 dark:text-slate-455 text-slate-500 uppercase tracking-wider font-semibold">
                      Source: {vid.author} • License: {vid.license}
                    </span>
                  </div>
                  {vid.url ? (
                    <a 
                      href={vid.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-3xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-3 py-1.5 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-950/40 transition-colors shrink-0 ml-4"
                    >
                      Watch ({vid.duration})
                    </a>
                  ) : (
                    <span className="text-3xs bg-slate-200 dark:bg-slate-800 text-slate-650 px-2 py-1 rounded-md font-bold shrink-0 ml-4">
                      {vid.duration}
                    </span>
                  )}
                </div>
              ))}

              {resourceCategory === 'charts' && mockFreeResources.charts.map((chart, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-850 dark:text-white">{chart.title}</span>
                    <span className="block text-4xs text-slate-450 dark:text-slate-455 text-slate-500 uppercase tracking-wider font-semibold">
                      Source: {chart.author} • License: {chart.license}
                    </span>
                  </div>
                  {chart.url ? (
                    <a 
                      href={chart.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-3xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 hover:underline shrink-0 ml-4"
                    >
                      Open Chart
                    </a>
                  ) : (
                    <button className="text-3xs font-extrabold uppercase tracking-wider text-teal-650 hover:underline shrink-0 ml-4">
                      Download PDF
                    </button>
                  )}
                </div>
              ))}

              {resourceCategory === 'guidelines' && mockFreeResources.guidelines.map((guideline, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-slate-850 dark:text-white">{guideline.title}</span>
                    <span className="block text-4xs text-slate-450 dark:text-slate-455 text-slate-500 uppercase tracking-wider font-semibold">
                      Source: {guideline.author} • License: {guideline.license}
                    </span>
                  </div>
                  {guideline.url ? (
                    <a 
                      href={guideline.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-3xs font-extrabold uppercase tracking-wider text-teal-650 dark:text-teal-400 hover:underline shrink-0 ml-4"
                    >
                      Open Paper
                    </a>
                  ) : (
                    <button className="text-3xs font-extrabold uppercase tracking-wider text-teal-650 hover:underline shrink-0 ml-4">
                      View Document
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
