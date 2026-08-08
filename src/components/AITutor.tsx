'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AILearningMode, SupportedLanguage, Question } from '../types/database';
import { TOPICS, QUESTIONS, SUBJECTS } from '../data/mockDb';
import { 
  Sparkles, Volume2, VolumeX, Mic, Send, RefreshCcw, 
  HelpCircle, BookOpen, Layers, Zap, Stethoscope, Table, 
  HelpCircle as QuestionIcon, Brain, ShieldAlert, CheckCircle2,
  Sliders, Image as ImageIcon, ArrowRight, Play
} from 'lucide-react';

interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  mode: AILearningMode;
  text: string;
  language: SupportedLanguage;
  generatedQuiz?: Question[];
  imageAttachment?: string;
  timestamp: string;
}

export const AITutor: React.FC = () => {
  const { 
    isVoiceSpeaking, speakText, stopSpeaking, speechRate, 
    setSpeechRate, profile, addAttempt, navigateToTopic 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [learningMode, setLearningMode] = useState<AILearningMode>('FMGE');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('english');
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  
  // Active quiz state
  const [activeQuizQuestionIndex, setActiveQuizQuestionIndex] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      mode: 'FMGE',
      language: 'english',
      text: `Hello Dr. ${profile?.name || 'Aspirant'}! I am your free **FMGE AI Teacher**. 
      
Ask me to explain any topic from zero, review exam traps, give mnemonics, generate custom quizzes, or analyze clinical ECGs and images.

Try asking:
* *"Explain Nephrotic vs Nephritic Syndrome"*
* *"Teach me ECG localization of STEMI"*
* *"Give me high yield mnemonics for Brachial Plexus injuries"*
* *"Explain Preeclampsia and MgSO4 in Gujarati or Hindi"*`,
      timestamp: 'Ready'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // AI Content Generator Simulation with deep medical intelligence
  const generateAIResponse = (query: string, mode: AILearningMode, lang: SupportedLanguage, hasImage: boolean) => {
    const qLower = query.toLowerCase();

    // Match with database topics
    const matchedTopic = TOPICS.find(t => 
      qLower.includes(t.name.toLowerCase()) || 
      qLower.includes(t.id.toLowerCase()) ||
      (t.tags && t.tags.some(tag => qLower.includes(tag.toLowerCase()))) ||
      qLower.includes(t.systemName.toLowerCase())
    ) || TOPICS[0];

    // Language prefix translation helper
    let langGreeting = '';
    if (lang === 'hindi') {
      langGreeting = `[Hindi / Hinglish Mode]\nनमस्ते! आइए **${matchedTopic.name}** को FMGE परीक्षा के दृष्टिकोण से समझें:\n\n`;
    } else if (lang === 'gujarati') {
      langGreeting = `[Gujarati Mode]\nનમસ્તે! ચાલો **${matchedTopic.name}** વિષે FMGE માટે અગત્યના મુદ્દા સમજીએ:\n\n`;
    } else if (lang === 'hinglish') {
      langGreeting = `[Hinglish Mode]\nHey! Let's understand **${matchedTopic.name}** in clear Hinglish for FMGE exam:\n\n`;
    }

    let bodyContent = '';

    switch (mode) {
      case 'SIMPLE':
        bodyContent = `### 🍼 Simple Step-by-Step Explanation (From Scratch)
**Core Concept of ${matchedTopic.name}**:
Imagine the body as a balanced ecosystem. In this condition, the physiological regulatory mechanism fails:
1. **What is happening?** The underlying pathology causes altered tissue perfusion and organ dysfunction.
2. **Why does the patient present with symptoms?** Loss of membrane integrity or biochemical pathway disruption triggers classic clinical signs.
3. **What is the gold standard fix?** First stabilize vitals, then administer targeted first-line pharmacological or surgical therapy.`;
        break;

      case 'RAPID REVISION':
        bodyContent = `### ⚡ 2-Minute Rapid Revision Summary
* **Target Subject**: ${matchedTopic.subjectId.toUpperCase()} • ${matchedTopic.systemName}
* **Exam Frequency**: Tested in almost every recent FMGE & NExT session.
* **Must-Know Triad**: Classic presentation, specific diagnostic criteria, and first-line Drug of Choice (DOC).
* **High Yield Takeaway**: ${matchedTopic.highYieldNotes.slice(0, 220)}...`;
        break;

      case 'CLINICAL':
        bodyContent = `### 🩺 Clinical Vignette & Patient Case Breakdown
**Patient Presentation**:
A 52-year-old patient presents to the emergency room with acute symptoms. 
* **Vitals**: BP 88/54 mmHg, HR 50 bpm, JVP elevated.
* **Clinical Clues**: Look closely at the reciprocal changes and preload dependency.
* **Next Best Step**: Always confirm hemodynamics before ordering invasive tests or giving nitrates.`;
        break;

      case 'MEMORY':
        bodyContent = `### 🧠 High-Yield Mnemonics & Memory Tricks
${matchedTopic.mnemonics && matchedTopic.mnemonics.length > 0 
  ? matchedTopic.mnemonics.map(m => `* **Mnemonic**: *${m}*`).join('\n')
  : `* **Mnemonic**: *"Remember the ABCs of ${matchedTopic.name}"* -> Anatomy, Biochemical marker, and Clinical DOC!`
}
* **Common Trap**: ${matchedTopic.commonTraps ? matchedTopic.commonTraps[0] : 'Avoid confusing acute management with long-term maintenance!'}`;
        break;

      case 'COMPARE':
        bodyContent = `### ⚖️ Comparison Table: Differential Diagnosis
| Parameter | Primary Condition | Mimic / Differential |
| :--- | :--- | :--- |
| **Pathology** | Typical acute presentation | Alternative chronic etiology |
| **Biomarker** | Specific antibodies / elevation | Normal or non-specific |
| **First-Line DOC** | Targeted agent of choice | Supportive / Alternative therapy |
| **Prognosis** | Rapid recovery if caught early | Requires long-term monitoring |`;
        break;

      case 'ORAL/VIVA STYLE':
        bodyContent = `### 🎙️ Oral Viva / Socratic Question
Let me test your recall:
**Question 1**: *"What is the absolute earliest clinical sign of toxicity, and what is your immediate bedside antidote?"*

*(Think for 5 seconds, then ask me to reveal the answer or tap "Quiz Me" below!)*`;
        break;

      case 'MCQ':
        bodyContent = `### 📝 Learning Through Option Elimination
When tackling questions on **${matchedTopic.name}**:
1. **Eliminate Rule-Outs**: Rule out medications that cause hypotension if the patient is already in shock.
2. **Key Clue**: Identify whether the question asks for the *initial* investigation vs *gold standard*.
3. **Trap**: Don't select invasive treatments before basic ABC resuscitation!`;
        break;

      case 'TEACH ME':
      case 'FMGE':
      default:
        bodyContent = `${matchedTopic.highYieldNotes}

### 🎯 Common FMGE Traps to Avoid
${matchedTopic.commonTraps ? matchedTopic.commonTraps.map(t => `* ⚠️ **Trap Alert**: ${t}`).join('\n') : '* ⚠️ Pay special attention to contraindicated drugs!'}

### 💡 Clinical Pearl
${matchedTopic.clinicalPearls || 'Master the first-line diagnostic investigation and drug of choice for the exam.'}`;
        break;
    }

    if (hasImage) {
      bodyContent = `### 👁️ Simulated Medical Image & Vision Analysis
* **Identified Structure / Finding**: High-density opacity with air bronchograms / ECG rhythm abnormality consistent with acute pathology.
* **Key Radiologic / Clinical Marker**: Homogeneous consolidation with characteristic anatomical borders.
* **Correlated FMGE Entity**: ${matchedTopic.name}.

${bodyContent}`;
    }

    return `${langGreeting}${bodyContent}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() && !uploadedImagePreview) return;

    const userText = inputQuery || 'Analyze this clinical image for FMGE';
    const userMsg: AIMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      mode: learningMode,
      language: selectedLanguage,
      text: userText,
      imageAttachment: uploadedImagePreview || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    const hadImage = !!uploadedImagePreview;
    setUploadedImagePreview(null);
    setIsGenerating(true);

    // Call API / simulate intelligent response
    setTimeout(() => {
      const generatedText = generateAIResponse(userText, learningMode, selectedLanguage, hadImage);
      
      const aiMsg: AIMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        mode: learningMode,
        language: selectedLanguage,
        text: generatedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsGenerating(false);

      // Auto speech synthesis if requested
      if (isVoiceSpeaking) {
        speakText(generatedText, selectedLanguage);
      }
    }, 850);
  };

  const handleQuizMe = (msgIndex: number) => {
    const targetMsg = messages[msgIndex];
    if (!targetMsg) return;

    // Pick 5 relevant questions from bank
    const generated5Questions = QUESTIONS.slice(0, 5);
    setMessages(prev => 
      prev.map((m, idx) => idx === msgIndex ? { ...m, generatedQuiz: generated5Questions } : m)
    );
    setActiveQuizQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleSimulateImageUpload = () => {
    // Simulated clinical image for ECG / CXR / Fundus
    setUploadedImagePreview('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=500&q=80');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-4 animate-fade-in">
      
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Learning Mode Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-2xs font-extrabold uppercase text-slate-400 shrink-0">Mode:</span>
          {(['FMGE', 'SIMPLE', 'RAPID REVISION', 'CLINICAL', 'MEMORY', 'COMPARE', 'ORAL/VIVA STYLE', 'MCQ', 'TEACH ME'] as AILearningMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setLearningMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                learningMode === mode
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Language & Voice Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <select
            value={selectedLanguage}
            onChange={(e: any) => setSelectedLanguage(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="english">English</option>
            <option value="hinglish">Hinglish</option>
            <option value="hindi">Hindi</option>
            <option value="gujarati">Gujarati</option>
          </select>

          {/* Voice AI Audio Toggle */}
          <button
            onClick={() => {
              if (isVoiceSpeaking) {
                stopSpeaking();
              } else {
                const lastAiMsg = messages.filter(m => m.sender === 'ai').slice(-1)[0];
                if (lastAiMsg) speakText(lastAiMsg.text, selectedLanguage);
              }
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isVoiceSpeaking 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20'
            }`}
            title="Read AI explanation aloud with Voice AI"
          >
            {isVoiceSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isVoiceSpeaking ? 'Stop Voice' : 'Voice AI'}</span>
          </button>
        </div>

      </div>

      {/* Safety Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl flex items-center justify-between text-2xs text-amber-800 dark:text-amber-200 shrink-0">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Educational AI Guard</strong>: Designed strictly for FMGE & NExT medical exam preparation. Not intended for direct clinical patient diagnosis.
          </span>
        </div>
        <span className="font-extrabold uppercase bg-amber-500/20 px-2 py-0.5 rounded">Free Unlimited AI</span>
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-2 text-2xs text-slate-400 mb-1 px-1">
              <span className="font-bold">{msg.sender === 'user' ? 'You (Dr. Candidate)' : 'FMGE AI Teacher'}</span>
              <span>•</span>
              <span className="uppercase text-3xs font-extrabold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                {msg.mode}
              </span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            <div
              className={`p-5 rounded-3xl max-w-3xl leading-relaxed text-sm shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100 rounded-tl-none'
              }`}
            >
              {/* Attached Image if any */}
              {msg.imageAttachment && (
                <div className="mb-3 rounded-2xl overflow-hidden border border-white/20 max-w-xs">
                  <img src={msg.imageAttachment} alt="Uploaded clinical image" className="w-full h-auto" />
                  <span className="text-3xs block p-1.5 bg-black/60 text-white font-bold">
                    Clinical Image Submitted
                  </span>
                </div>
              )}

              {/* Formatted Markdown Content */}
              <div className="prose dark:prose-invert prose-sm max-w-none whitespace-pre-wrap">
                {msg.text}
              </div>

              {/* AI Teacher Interactive Action Strip */}
              {msg.sender === 'ai' && idx > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => speakText(msg.text, msg.language)}
                      className="text-2xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center space-x-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <button
                      onClick={() => handleQuizMe(idx)}
                      className="text-2xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Quiz Me (5 MCQs)</span>
                    </button>
                  </div>
                  <span className="text-3xs text-slate-400 font-mono">FMGE Master RAG Core</span>
                </div>
              )}
            </div>

            {/* Generated Quiz Drill Widget attached to message */}
            {msg.generatedQuiz && msg.generatedQuiz.length > 0 && (
              <div className="mt-4 w-full max-w-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-3xl p-6 space-y-4 animate-scale-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xs font-black uppercase px-2.5 py-1 rounded-full bg-indigo-600 text-white">
                      Instant AI Concept Drill
                    </span>
                    <span className="text-xs text-indigo-900 dark:text-indigo-200 font-bold">
                      Question {(activeQuizQuestionIndex || 0) + 1} of {msg.generatedQuiz.length}
                    </span>
                  </div>
                  <span className="text-2xs font-extrabold text-indigo-600 dark:text-indigo-400">
                    AI Generated FMGE-Style
                  </span>
                </div>

                {/* Active Question Text */}
                {(() => {
                  const q = msg.generatedQuiz[activeQuizQuestionIndex || 0];
                  return (
                    <div className="space-y-4">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {q.questionText}
                      </p>

                      {/* 4 Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOption === optIdx;
                          const isCorrect = optIdx === q.correctAnswerIndex;
                          let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                          
                          if (showExplanation) {
                            if (isCorrect) btnStyle = 'bg-emerald-500 text-white border-emerald-600';
                            else if (isSelected && !isCorrect) btnStyle = 'bg-rose-500 text-white border-rose-600';
                          } else if (isSelected) {
                            btnStyle = 'bg-indigo-600 text-white border-indigo-600';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={showExplanation}
                              onClick={() => {
                                setSelectedOption(optIdx);
                                setShowExplanation(true);
                                addAttempt(q.id, optIdx, isCorrect, 15);
                              }}
                              className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold flex items-center space-x-3 transition-all ${btnStyle}`}
                            >
                              <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-black text-2xs shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Reveal */}
                      {showExplanation && (
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                          <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Correct Answer: Option {String.fromCharCode(65 + q.correctAnswerIndex)}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {q.explanation}
                          </p>
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-2xs text-amber-800 dark:text-amber-300 font-bold">
                            💡 High Yield Point: {q.highYieldPoint}
                          </div>

                          {/* Next Question / Finish */}
                          <div className="pt-2 flex justify-end">
                            {(activeQuizQuestionIndex || 0) < msg.generatedQuiz.length - 1 ? (
                              <button
                                onClick={() => {
                                  setActiveQuizQuestionIndex(prev => (prev || 0) + 1);
                                  setSelectedOption(null);
                                  setShowExplanation(false);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md"
                              >
                                <span>Next Question</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setActiveQuizQuestionIndex(null)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
                              >
                                Drill Complete (+50 XP)
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 max-w-sm">
            <Sparkles className="w-5 h-5 text-teal-500 animate-spin" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              FMGE AI Teacher is formulating high-yield response...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer & Clinical Attachment */}
      <div className="space-y-2 shrink-0">
        
        {/* Uploaded image preview tag */}
        {uploadedImagePreview && (
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl flex items-center justify-between max-w-sm text-xs font-bold">
            <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400">
              <ImageIcon className="w-4 h-4" />
              <span>Clinical Image Attached (ECG / X-Ray)</span>
            </div>
            <button
              onClick={() => setUploadedImagePreview(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Remove
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          
          {/* Clinical Image Upload button simulation */}
          <button
            type="button"
            onClick={handleSimulateImageUpload}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500 transition-all shrink-0"
            title="Upload ECG, Chest X-Ray or Histopathology image for AI analysis"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI Teacher anything... e.g. 'Explain nephrotic syndrome' or 'Teach me autonomic pharmacology'"
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-teal-500 transition-all shadow-sm"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() && !uploadedImagePreview}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white p-3.5 rounded-2xl shadow-lg shadow-teal-600/20 transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>

    </div>
  );
};
