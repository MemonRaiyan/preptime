'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBJECTS } from '../data/mockDb';
import { 
  Users, MessageSquare, Heart, ShieldAlert, Send, 
  CheckCircle, PlusCircle, AlertCircle, Info 
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { profile } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newPostText, setNewPostText] = useState<string>('');
  
  // Mock posts data
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      author: 'Dr. Neha Patel',
      category: 'anatomy',
      content: 'Is Middle Cerebral Artery (MCA) considered part of the Circle of Willis? I saw a mock question counting it, but my textbook says no.',
      likes: 12,
      commentsCount: 3,
      replies: [
        { author: 'Dr. Rohan S.', content: 'Absolutely not! MCA is NOT part of the Circle of Willis. Typical FMGE exam trap. Only ACA, PCA, anterior communicating, and posterior communicating are part of it.' }
      ],
      moderationStatus: 'approved'
    },
    {
      id: 'p2',
      author: 'Dr. Amit Shah',
      category: 'pharmacology',
      content: 'What is the absolute best mnemonic to remember the Pritchard Regimen dosages for Magnesium Sulfate in eclampsia?',
      likes: 8,
      commentsCount: 1,
      replies: [
        { author: 'Dr. Pooja Gupta', content: 'Remember 4g IV loading dose, then 5g IM in each buttock (total 10g IM). Maintenance is 5g IM every 4 hours. Mnemonic: "4-5-4" (4 IV, 5 IM loading, 4hr maintenance).' }
      ],
      moderationStatus: 'approved'
    }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    // AI Moderation check simulated locally:
    const lowerText = newPostText.toLowerCase();
    const hasPiracy = lowerText.includes('marrow pdf') || lowerText.includes('prepladder crack') || lowerText.includes('pirated');
    const hasSpam = lowerText.includes('buy bitcoin') || lowerText.includes('make money');

    let modStatus = 'approved';
    if (hasPiracy || hasSpam) {
      modStatus = 'flagged';
      alert('AI Moderator Warning: Your post contains words that violate the community guidelines (pirated content or spam). Post blocked.');
      return;
    }

    const newPost = {
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      author: profile?.name || 'Dr. Candidate',
      category: activeCategory === 'all' ? 'medicine' : activeCategory,
      content: newPostText,
      likes: 0,
      commentsCount: 0,
      replies: [],
      moderationStatus: modStatus
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const handleLike = (id: string) => {
    setPosts(prev => 
      prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p)
    );
  };

  const getSubjectName = (subId: string) => {
    return SUBJECTS.find(s => s.id === subId)?.name || subId;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
      
      {/* Category selector sidebar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit space-y-6">
        <div>
          <h3 className="font-bold text-sm text-slate-850 dark:text-white mb-2">Subject Forums</h3>
          <p className="text-4xs text-slate-400 font-bold uppercase tracking-wider">Discuss doubts subject-wise</p>
        </div>

        <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-teal-500/10 border border-teal-500/30 text-teal-650'
                : 'hover:bg-slate-50 text-slate-650'
            }`}
          >
            All Discussions
          </button>
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveCategory(sub.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all truncate flex items-center justify-between ${
                activeCategory === sub.id
                  ? 'bg-teal-500/10 border border-teal-500/30 text-teal-650'
                  : 'hover:bg-slate-50 text-slate-650'
              }`}
            >
              <span>{sub.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main thread area */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Create post box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 mb-2">
            <PlusCircle className="w-5 h-5" />
            <span className="font-bold text-sm">Post a Medical Doubt</span>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3">
            <textarea
              placeholder="Type your doubt or high-yield concept review..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="w-full h-24 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-teal-500 focus:outline-none dark:text-white text-xs md:text-sm"
            />
            <div className="flex justify-between items-center">
              <span className="text-4xs text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>AI Moderator Active (Spam/Copyright guard)</span>
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center space-x-1.5"
              >
                <span>Submit Query</span>
                <Send className="w-3 h-3 text-teal-650 dark:text-teal-400" />
              </button>
            </div>
          </form>
        </div>

        {/* Discussions List */}
        <div className="space-y-4">
          {posts
            .filter(p => activeCategory === 'all' || p.category === activeCategory)
            .map((post) => (
              <div 
                key={post.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Author row */}
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-2xs">
                      Dr
                    </div>
                    <div>
                      <span className="block text-2xs font-bold text-slate-850 dark:text-slate-200">{post.author}</span>
                      <span className="block text-4xs text-slate-400">FMGE Candidate</span>
                    </div>
                  </div>
                  <span className="text-4xs font-bold uppercase tracking-wider text-teal-650 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded">
                    {getSubjectName(post.category)}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-normal">
                  {post.content}
                </p>

                {/* Stats / Actions */}
                <div className="flex items-center space-x-4 text-3xs font-bold text-slate-400">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1 hover:text-rose-500 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-500/10 hover:fill-rose-500" />
                    <span>{post.likes} Likes</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{post.commentsCount} Comments</span>
                  </div>
                </div>

                {/* Replies panel */}
                {post.replies.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-850 pl-4 border-l-2 border-teal-500/30 space-y-3">
                    {post.replies.map((reply, rIdx) => (
                      <div key={rIdx} className="space-y-1.5 text-2xs">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-slate-750 dark:text-slate-300">{reply.author}</span>
                          <span className="text-4xs font-bold uppercase tracking-wider text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                            <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Verified Doctor Response</span>
                          </span>
                        </div>
                        <p className="text-slate-650 dark:text-slate-400 leading-relaxed font-normal">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};
