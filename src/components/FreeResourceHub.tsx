'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Resource, ResourceType, ContentSourceLabel, SupportedLanguage } from '../types/database';
import { SUBJECTS, TOPICS } from '../data/mockDb';
import { 
  Video, FileText, Globe, BookOpen, ExternalLink, Filter, 
  CheckCircle2, Sparkles, Plus, Search, ShieldCheck, Clock, 
  Award, Play, ArrowRight, X, AlertCircle, Share2, Bookmark
} from 'lucide-react';

export const FreeResourceHub: React.FC = () => {
  const { resources, addResource, verifyResource, setActiveTab, navigateToTopic } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'useful' | 'newest' | 'shortest'>('useful');
  
  // Active viewing modal
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  
  // Ingestion Simulator modal
  const [showIngestionModal, setShowIngestionModal] = useState<boolean>(false);
  const [ingestUrl, setIngestUrl] = useState<string>('');
  const [ingestTitle, setIngestTitle] = useState<string>('');
  const [ingestAuthor, setIngestAuthor] = useState<string>('');
  const [ingestSubject, setIngestSubject] = useState<string>('medicine');
  const [ingestType, setIngestType] = useState<ResourceType>('VIDEO');
  const [ingestLanguage, setIngestLanguage] = useState<SupportedLanguage>('english');
  const [ingestLicense, setIngestLicense] = useState<ContentSourceLabel>('EXTERNAL FREE RESOURCE');
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [ingestSuccess, setIngestSuccess] = useState<boolean>(false);

  // Filtered and sorted resources
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      if (verifiedOnly && !res.isVerified) return false;
      if (selectedSubject !== 'all' && res.subjectId !== selectedSubject) return false;
      if (selectedType !== 'all' && res.resourceType !== selectedType) return false;
      if (selectedLanguage !== 'all' && res.language !== selectedLanguage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          res.title.toLowerCase().includes(q) ||
          res.description.toLowerCase().includes(q) ||
          res.source.toLowerCase().includes(q) ||
          res.author.toLowerCase().includes(q) ||
          res.systemName.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      if (sortBy === 'shortest') return (parseInt(a.duration || '0') || 0) - (parseInt(b.duration || '0') || 0);
      return (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0);
    });
  }, [resources, verifiedOnly, selectedSubject, selectedType, selectedLanguage, searchQuery, sortBy]);

  // Handle ingestion submission
  const handleIngestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingestUrl.trim() || !ingestTitle.trim()) return;

    setIsIngesting(true);

    setTimeout(() => {
      const subjectObj = SUBJECTS.find(s => s.id === ingestSubject);
      const systemName = subjectObj?.systems[0] || 'Clinical Core';

      addResource({
        title: ingestTitle,
        description: `Verified educational open-access resource submitted by candidate community for ${subjectObj?.name}.`,
        url: ingestUrl,
        source: ingestUrl.includes('youtube') ? 'YouTube Open Edu' : ingestUrl.includes('who.int') ? 'WHO Official' : 'Open Medical Access',
        sourceType: ingestUrl.includes('youtube') ? 'YOUTUBE' : 'OPEN_ACCESS',
        subjectId: ingestSubject,
        systemName: systemName,
        topicId: `${ingestSubject}-core-topic`,
        resourceType: ingestType,
        language: ingestLanguage,
        difficulty: 'medium',
        license: ingestLicense,
        isFree: true,
        isVerified: true,
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
        duration: ingestType === 'VIDEO' ? '18 mins' : '8 pages',
        author: ingestAuthor || 'Verified Medical Educator',
        keyPoints: [
          'Master exam-oriented concepts from this free source',
          'Review high-yield clinical pointers and diagnostic steps',
          'Practice corresponding MCQs on FMGE Master'
        ]
      });

      setIsIngesting(false);
      setIngestSuccess(true);
      setTimeout(() => {
        setIngestSuccess(false);
        setShowIngestionModal(false);
        setIngestUrl('');
        setIngestTitle('');
        setIngestAuthor('');
      }, 1200);
    }, 900);
  };

  const getSourceBadgeColor = (license: ContentSourceLabel) => {
    switch (license) {
      case 'OFFICIAL SOURCE':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'OPEN LICENSE':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'PUBLIC DOMAIN':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'VERIFIED PYQ':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free & Legally Open Educational Ecosystem</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            FMGE Free Resource Hub
          </h1>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed">
            Stop searching across disjointed websites. We discover, classify, verify, and link legitimate public educational resources from YouTube, WHO, CDC, PubMed, and official guidelines — completely free.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setShowIngestionModal(true)}
              className="bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 text-teal-600" />
              <span>Submit Free Resource for AI Ingestion</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/30 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all"
            >
              Ask AI to Recommend Resources
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search free resources by topic, e.g. 'ECG', 'Preeclampsia', 'Brachial Plexus', 'NRP'..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-teal-500 transition-all"
          />
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs font-bold">
          
          {/* Subject Filter */}
          <div>
            <label className="text-2xs text-slate-400 block mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="all">All 19 Subjects</option>
              {SUBJECTS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.weightage}M)</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-2xs text-slate-400 block mb-1">Resource Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="all">All Types</option>
              <option value="PYQ_PAPER">📚 PYQ Question Papers</option>
              <option value="VIDEO">📺 Video Lectures</option>
              <option value="GUIDELINE">📋 Official Guidelines</option>
              <option value="ARTICLE">📄 Research / Articles</option>
              <option value="PDF">📑 Open PDFs</option>
              <option value="CHEAT_SHEET">⚡ Cheat Sheets</option>
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="text-2xs text-slate-400 block mb-1">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="all">All Languages</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="hinglish">Hinglish</option>
              <option value="gujarati">Gujarati</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-2xs text-slate-400 block mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="useful">Most Useful / Verified</option>
              <option value="newest">Newest Added</option>
              <option value="shortest">Shortest Duration</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setVerifiedOnly(prev => !prev)}
              className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                verifiedOnly 
                  ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Only</span>
            </button>
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Available Free Resources ({filteredResources.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any resource to view official embeds, take notes, or generate targeted AI quizzes.
          </p>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const subject = SUBJECTS.find(s => s.id === res.subjectId);
          return (
            <div
              key={res.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-500/50 transition-all flex flex-col group"
            >
              {/* Media Thumbnail header */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={res.thumbnail || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80'}
                  alt={res.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {/* Play / View Overlay badge */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className={`text-3xs font-extrabold px-2.5 py-1 rounded-full border backdrop-blur-md ${getSourceBadgeColor(res.license)}`}>
                    {res.license}
                  </span>
                  {res.isVerified && (
                    <span className="bg-emerald-500 text-white text-3xs font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Duration badge */}
                {res.duration && (
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-3xs font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{res.duration}</span>
                  </div>
                )}
                
                {/* Subject tag */}
                <div className="absolute bottom-3 left-3 text-2xs font-extrabold text-teal-400 bg-slate-950/80 px-2 py-0.5 rounded">
                  {subject?.name || res.subjectId} • {res.systemName}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-2xs text-slate-400">
                    <span>Source: <strong className="text-slate-700 dark:text-slate-300">{res.source}</strong></span>
                    <span>By: <strong className="text-slate-700 dark:text-slate-300">{res.author}</strong></span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => setActiveResource(res)}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-teal-600/10 transition-all"
                    >
                      {res.resourceType === 'VIDEO' ? <Play className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                      <span>Open Learning Hub</span>
                    </button>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
                      title="Open in external official tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Resource Detail Viewer Modal */}
      {activeResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <span className={`text-2xs font-extrabold px-2.5 py-1 rounded-full border ${getSourceBadgeColor(activeResource.license)}`}>
                  {activeResource.license}
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                  {activeResource.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveResource(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Media Embed or Direct Link Callout */}
              {activeResource.embedId ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeResource.embedId}`}
                    title={activeResource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-2xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Official External Document & Guideline
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {activeResource.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Verified Source: {activeResource.source} ({activeResource.author})
                    </p>
                  </div>
                  <a
                    href={activeResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all shrink-0"
                  >
                    <span>Open Official Document</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Description & High-Yield Key Points */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Resource Overview & Syllabus Association
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeResource.description}
                </p>

                {activeResource.keyPoints && activeResource.keyPoints.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-750 space-y-2">
                    <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block">
                      High-Yield Learning Checkpoints
                    </span>
                    <ul className="space-y-1.5">
                      {activeResource.keyPoints.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Connected FMGE Actions (Section 25 Integration) */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="font-bold text-sm text-teal-900 dark:text-teal-100">
                    Connect with AI & Practice Arena
                  </h4>
                  <p className="text-xs text-teal-700 dark:text-teal-300">
                    Generate instant 5 MCQs on this concept or jump to full topic notes.
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setActiveResource(null);
                      setActiveTab('ai-tutor');
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor</span>
                  </button>
                  <button
                    onClick={() => {
                      const subId = activeResource.subjectId;
                      const topId = activeResource.topicId;
                      setActiveResource(null);
                      navigateToTopic(subId, topId);
                    }}
                    className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    View Topic Page
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-2xs text-slate-400">
              <span>Last verified: {activeResource.lastChecked} • License: {activeResource.license}</span>
              <button
                onClick={() => setActiveResource(null)}
                className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-1.5 rounded-xl font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Resource Ingestion Pipeline Modal (Section 5 & 40) */}
      {showIngestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Submit Free Educational Resource
                  </h3>
                  <p className="text-2xs text-slate-400">
                    AI pipeline will classify subject, verify URL & license status.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIngestionModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {ingestSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Resource Ingested & Classified!</h4>
                <p className="text-xs text-slate-400">
                  Added to the free resource hub with verified open content tag.
                </p>
              </div>
            ) : (
              <form onSubmit={handleIngestSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Resource URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={ingestUrl}
                    onChange={(e) => setIngestUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://who.int/..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={ingestTitle}
                    onChange={(e) => setIngestTitle(e.target.value)}
                    placeholder="e.g. ECG Localization of Myocardial Infarction"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Author / Channel / Body
                    </label>
                    <input
                      type="text"
                      value={ingestAuthor}
                      onChange={(e) => setIngestAuthor(e.target.value)}
                      placeholder="e.g. WHO / Open Anatomy"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      FMGE Subject
                    </label>
                    <select
                      value={ingestSubject}
                      onChange={(e) => setIngestSubject(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    >
                      {SUBJECTS.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Type
                    </label>
                    <select
                      value={ingestType}
                      onChange={(e: any) => setIngestType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="VIDEO">Video Lecture</option>
                      <option value="GUIDELINE">Official Guideline</option>
                      <option value="ARTICLE">Article / Paper</option>
                      <option value="PDF">Open PDF</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Content License Label
                    </label>
                    <select
                      value={ingestLicense}
                      onChange={(e: any) => setIngestLicense(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    >
                      <option value="EXTERNAL FREE RESOURCE">External Free Resource</option>
                      <option value="OPEN LICENSE">Open License</option>
                      <option value="OFFICIAL SOURCE">Official Source</option>
                      <option value="PUBLIC DOMAIN">Public Domain</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-2xs text-slate-500 leading-normal flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    FMGE Master indexes only legitimately free and open educational resources. Do not submit links to pirated course material or proprietary paid coaching content.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isIngesting}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  {isIngesting ? (
                    <span>Running AI Classification Pipeline...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Process & Publish to Free Hub</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
