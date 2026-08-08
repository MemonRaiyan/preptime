'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/mockDb';
import { 
  Users, MessageSquare, ThumbsUp, Send, Sparkles, 
  ShieldCheck, AlertCircle, Plus, CheckCircle2 
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { communityPosts, addCommunityPost, addCommunityComment, upvotePost, profile } = useApp();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('medicine');
  
  // Commenting state
  const [activeCommentingPostId, setActiveCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');

  const filteredPosts = communityPosts.filter(p => 
    selectedSubjectFilter === 'all' || p.subjectId === selectedSubjectFilter
  );

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addCommunityPost({
      authorName: profile?.name || 'Dr. Candidate',
      authorLevel: profile?.level || 1,
      subjectId: newSubject,
      title: newTitle,
      content: newContent,
      tags: ['FMGE', 'HighYield', newSubject],
      isSolved: false
    });

    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addCommunityComment(postId, {
      authorName: profile?.name || 'Dr. Candidate',
      authorLevel: profile?.level || 1,
      content: commentText
    });

    setCommentText('');
    setActiveCommentingPostId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-300">
            <Users className="w-3.5 h-3.5" />
            <span>Peer Doubt Solver & Study Groups</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            FMGE Aspirant Community
          </h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            Discuss difficult questions, share exam mnemonics, connect with study partners, and clarify clinical doubts with fellow doctors.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-teal-600" />
          <span>Post a Medical Doubt</span>
        </button>
      </div>

      {/* Moderation Safety Disclaimer (Section 30) */}
      <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl flex items-center justify-between text-2xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
          <span>
            Strictly moderated against medical misinformation, copyrighted questions, and promotional spam.
          </span>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setSelectedSubjectFilter('all')}
          className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-all ${
            selectedSubjectFilter === 'all'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Topics ({communityPosts.length})
        </button>

        {SUBJECTS.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubjectFilter(s.id)}
            className={`px-4 py-2 rounded-2xl whitespace-nowrap transition-all ${
              selectedSubjectFilter === s.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black text-xs flex items-center justify-center">
                  Dr
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {post.authorName}
                  </div>
                  <span className="text-3xs text-slate-400">Level {post.authorLevel} • {post.timestamp}</span>
                </div>
              </div>

              <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded bg-teal-500/10 text-teal-600">
                {post.subjectId}
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {post.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {post.content}
            </p>

            {/* Post actions */}
            <div className="flex items-center space-x-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => upvotePost(post.id)}
                className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-600 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.upvotes} Upvotes</span>
              </button>

              <button
                onClick={() => setActiveCommentingPostId(activeCommentingPostId === post.id ? null : post.id)}
                className="flex items-center space-x-1.5 text-teal-600 dark:text-teal-400"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments.length} Answers</span>
              </button>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {post.comments.map(c => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-2xs font-bold text-slate-700 dark:text-slate-300">
                      <span>{c.authorName} (Level {c.authorLevel})</span>
                      <span className="text-slate-400 font-normal">{c.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Form */}
            {activeCommentingPostId === post.id && (
              <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a clear medical explanation or answer..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Reply
                </button>
              </form>
            )}

          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-4 animate-scale-up">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Ask a Doubt or Share FMGE Tip
            </h3>

            <form onSubmit={handlePostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                >
                  {SUBJECTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Title / Question *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Differentiating Erb vs Klumpke Palsy deformity"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Details *</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide background, options you are confused between, or specific clinical details..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-bold shadow-md"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
