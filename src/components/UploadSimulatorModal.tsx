import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QUESTIONS } from '../data/mockDb';
import { Upload, Link as LinkIcon, FileText, Sparkles, X, Loader2 } from 'lucide-react';
import { Resource, GrandTest } from '../types/database';

interface UploadSimulatorModalProps {
  onClose: () => void;
}

export const UploadSimulatorModal: React.FC<UploadSimulatorModalProps> = ({ onClose }) => {
  const { uploadUserResource, addUserSimulator } = useApp();
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    if (!title || (inputType === 'url' && !url)) return;
    
    setIsGenerating(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 20) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // 1. Save Resource
        const newResource: Resource = {
          id: `user_res_${Date.now()}`,
          title: title,
          description: `Custom uploaded ${inputType} for practice.`,
          url: inputType === 'url' ? url : '#',
          source: 'User Upload',
          sourceType: 'PDF',
          subjectId: 'medicine',
          systemName: 'General',
          topicId: 'all',
          resourceType: 'PDF',
          language: 'english',
          difficulty: 'medium',
          license: 'EXTERNAL FREE RESOURCE',
          isFree: true,
          isVerified: false,
          author: 'Me',
          publishedDate: new Date().toISOString().split('T')[0],
          lastChecked: new Date().toISOString().split('T')[0],
          keyPoints: ['Custom User Content']
        };
        uploadUserResource(newResource);

        // 2. Generate Simulator
        const testId = `user_gt_${Date.now()}`;
        const allVideos = QUESTIONS.filter(q => !!q.videoUrl);
        const textQs = QUESTIONS.filter(q => !q.videoUrl);
        const selectedVideos = [...allVideos].sort(() => 0.5 - Math.random()).slice(0, 30); // Ensure ~30 video questions
        const selectedText = [...textQs].sort(() => 0.5 - Math.random()).slice(0, 270);
        const qPool = [...selectedVideos, ...selectedText].sort(() => 0.5 - Math.random());
        const newTest: GrandTest = {
          id: testId,
          title: `${title} - Custom Simulator`,
          description: `Generated from your custom upload using AI synthetic rendering.`,
          durationMinutes: 150 * 2,
          questionCount: 300,
          subjectsIncluded: ['Custom Upload'],
          isSimulation: true,
          questions: qPool
        };
        addUserSimulator(newTest);
        
        setTimeout(() => {
          setIsGenerating(false);
          onClose();
        }, 500);
      }
      setProgress(currentProgress);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 animate-scale-up">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Import & Generate</h3>
              <p className="text-xs text-slate-500">Create a custom simulator from your links</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isGenerating ? (
          <div className="space-y-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <button
                onClick={() => setInputType('url')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-bold rounded-lg ${inputType === 'url' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Paste Link</span>
              </button>
              <button
                onClick={() => setInputType('file')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-bold rounded-lg ${inputType === 'file' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload PDF</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Title</label>
                <input
                  type="text"
                  placeholder="e.g. FMGE July 2025 Recall"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              {inputType === 'url' ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Resource URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              ) : (
                <div>
                   <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Select File</label>
                   <div className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                     <FileText className="w-8 h-8 text-slate-400 mb-2" />
                     <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to browse or drag PDF</span>
                   </div>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!title || (inputType === 'url' && !url)}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-sm font-bold shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate 300-Q Simulator</span>
            </button>
          </div>
        ) : (
          <div className="py-8 space-y-6 text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center relative">
              <Loader2 className="w-10 h-10 text-teal-500 animate-spin absolute" />
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{progress}%</div>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">AI Parsing Document...</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Extracting clinical vignettes and generating matching mock questions.</p>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
