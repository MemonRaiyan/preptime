'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, QuestionAttempt, MistakeCategory, Flashcard, ClinicalCase, DailyTask, StudyPlan } from '../types/database';
import { FLASHCARDS, QUESTIONS } from '../data/mockDb';

interface AppContextType {
  profile: UserProfile | null;
  onboardUser: (data: Omit<UserProfile, 'id' | 'streak' | 'lastStudyDate' | 'xp' | 'level' | 'badges' | 'estimatedScoreRange' | 'onboarded'>) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  attempts: QuestionAttempt[];
  addAttempt: (questionId: string, selectedIndex: number, isCorrect: boolean, timeSpent: number) => QuestionAttempt;
  categorizeMistake: (attemptId: string, category: MistakeCategory) => void;
  flashcards: Flashcard[];
  reviewFlashcard: (cardId: string, difficulty: 'again' | 'hard' | 'good' | 'easy') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  studyPlan: StudyPlan | null;
  generateStudyPlan: () => void;
  dailyTasks: DailyTask[];
  toggleTaskComplete: (taskId: string) => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PROFILE_KEY = 'fmge_master_profile_v1';
const ATTEMPTS_KEY = 'fmge_master_attempts_v1';
const FLASHCARDS_KEY = 'fmge_master_flashcards_v1';
const PLAN_KEY = 'fmge_master_plan_v1';
const TASKS_KEY = 'fmge_master_tasks_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem(DEFAULT_PROFILE_KEY);
    const savedAttempts = localStorage.getItem(ATTEMPTS_KEY);
    const savedFlashcards = localStorage.getItem(FLASHCARDS_KEY);
    const savedPlan = localStorage.getItem(PLAN_KEY);
    const savedTasks = localStorage.getItem(TASKS_KEY);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
    
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    } else {
      setFlashcards(FLASHCARDS);
    }
    
    if (savedPlan) setStudyPlan(JSON.parse(savedPlan));
    if (savedTasks) setDailyTasks(JSON.parse(savedTasks));
    
    // Set theme
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (profile) localStorage.setItem(DEFAULT_PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    if (flashcards.length > 0) localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    if (studyPlan) localStorage.setItem(PLAN_KEY, JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    if (dailyTasks.length > 0) localStorage.setItem(TASKS_KEY, JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onboardUser = (data: Omit<UserProfile, 'id' | 'streak' | 'lastStudyDate' | 'xp' | 'level' | 'badges' | 'estimatedScoreRange' | 'onboarded'>) => {
    const initialProfile: UserProfile = {
      ...data,
      id: 'user_' + Math.random().toString(36).substring(2, 11),
      streak: 0,
      lastStudyDate: null,
      xp: 0,
      level: 1,
      badges: ['First Step'],
      estimatedScoreRange: [120, 140], // baseline
      onboarded: true,
    };
    setProfile(initialProfile);
    generateInitialTasks(data.weakSubjects);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const generateInitialTasks = (weakSubjects: string[]) => {
    const list: DailyTask[] = [
      { id: 't1', subjectId: weakSubjects[0] || 'medicine', topicId: 'myocardial-infarction', taskType: 'mcq', targetCount: 40, completedCount: 0, durationMinutes: 45 },
      { id: 't2', subjectId: weakSubjects[1] || 'pharmacology', topicId: 'autonomic-drugs', taskType: 'revision', targetCount: 1, completedCount: 0, durationMinutes: 30 },
      { id: 't3', subjectId: 'obg', topicId: 'preeclampsia', taskType: 'flashcard', targetCount: 20, completedCount: 0, durationMinutes: 15 },
      { id: 't4', subjectId: 'pathology', topicId: 'nephrotic-syndrome', taskType: 'quiz', targetCount: 10, completedCount: 0, durationMinutes: 10 }
    ];
    setDailyTasks(list);
  };

  const generateStudyPlan = () => {
    if (!profile) return;
    const plan: StudyPlan = {
      id: 'plan_' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      targetExamDate: profile.targetExam,
      durationDays: 120,
      dailySchedule: {
        '07:00–09:00': { task: 'Concept Study: High Yield Notes', subjectId: profile.weakSubjects[0] || 'medicine', topicId: 'myocardial-infarction', type: 'note' },
        '09:30–10:30': { task: 'MCQ Practice Session (45 Questions)', subjectId: profile.weakSubjects[0] || 'medicine', topicId: 'myocardial-infarction', type: 'mcq' },
        '11:00–12:00': { task: 'Review Mistakes & Read Explanations', subjectId: 'general', topicId: 'general', type: 'revision' },
        '14:00–16:00': { task: 'Secondary Subject Study & Flashcards', subjectId: profile.weakSubjects[1] || 'pharmacology', topicId: 'autonomic-drugs', type: 'flashcard' },
        '18:00–19:00': { task: 'Daily Challenge & AI Quiz Engine', subjectId: 'general', topicId: 'general', type: 'quiz' },
        '21:00–21:30': { task: 'Spaced Repetition Flashcard Review', subjectId: 'general', topicId: 'general', type: 'revision' }
      },
      weeklyObjectives: [
        `Complete Cardiology & Nephrology fundamentals`,
        `Solve at least 250 MCQs in ${profile.weakSubjects[0] || 'General Medicine'}`,
        `Review and clear 100% of new mistakes in Mistake Notebook`,
        `Complete 1 Mini Mock Test on Sunday`
      ]
    };
    setStudyPlan(plan);
  };

  const addAttempt = (questionId: string, selectedIndex: number, isCorrect: boolean, timeSpent: number): QuestionAttempt => {
    const newAttempt: QuestionAttempt = {
      id: 'att_' + Math.random().toString(36).substring(2, 11),
      questionId,
      selectedOptionIndex: selectedIndex,
      isCorrect,
      timeSpentSeconds: timeSpent,
      timestamp: new Date().toISOString(),
      ...(isCorrect ? {} : { mistakeCategory: 'concept' }) // default categorization for mistakes
    };

    setAttempts(prev => [newAttempt, ...prev]);

    // Handle profile stats (XP, level-ups, streaks)
    if (profile) {
      const xpGained = isCorrect ? 10 : 3;
      const newXp = profile.xp + xpGained;
      const nextLevelThreshold = profile.level * 150;
      let newLevel = profile.level;
      const newBadges = [...profile.badges];

      if (newXp >= nextLevelThreshold) {
        newLevel += 1;
        newBadges.push(`Level ${newLevel} Achiever`);
      }

      // Check daily streak
      const todayStr = new Date().toISOString().split('T')[0];
      let newStreak = profile.streak;

      if (profile.lastStudyDate !== todayStr) {
        if (profile.lastStudyDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] || profile.streak === 0) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      if (newStreak >= 7 && !newBadges.includes('7-Day Fire')) {
        newBadges.push('7-Day Fire');
      }
      if (attempts.length + 1 >= 100 && !newBadges.includes('MCQ Centurion')) {
        newBadges.push('MCQ Centurion');
      }

      // Update estimated score based on cumulative accuracy
      const totalCorrect = attempts.filter(a => a.isCorrect).length + (isCorrect ? 1 : 0);
      const totalQ = attempts.length + 1;
      const accuracy = totalCorrect / totalQ;
      const estimatedScore = Math.min(290, Math.max(100, Math.round(120 + accuracy * 150 + Math.min(newLevel * 3, 30))));
      const minEst = Math.max(100, estimatedScore - 10);
      const maxEst = Math.min(300, estimatedScore + 8);

      updateProfile({
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastStudyDate: todayStr,
        badges: newBadges,
        estimatedScoreRange: [minEst, maxEst]
      });
    }

    // Update corresponding daily task count if it matches a task type
    const relatedQuestion = QUESTIONS.find(q => q.id === questionId);
    if (relatedQuestion) {
      setDailyTasks(prev => 
        prev.map(task => {
          if (task.taskType === 'mcq' && task.subjectId === relatedQuestion.subjectId && task.completedCount < task.targetCount) {
            return { ...task, completedCount: task.completedCount + 1 };
          }
          return task;
        })
      );
    }

    return newAttempt;
  };

  const categorizeMistake = (attemptId: string, category: MistakeCategory) => {
    setAttempts(prev => 
      prev.map(att => att.id === attemptId ? { ...att, mistakeCategory: category } : att)
    );
  };

  // SuperMemo-2 Spaced Repetition Algorithm
  const reviewFlashcard = (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    setFlashcards(prev => 
      prev.map(card => {
        if (card.id !== cardId) return card;

        let interval = card.intervalDays;
        let EF = card.easeFactor;

        // EF modification
        const qScore = rating === 'again' ? 0 : rating === 'hard' ? 2 : rating === 'good' ? 4 : 5;
        EF = EF + (0.1 - (5 - qScore) * (0.08 + (5 - qScore) * 0.02));
        if (EF < 1.3) EF = 1.3;

        // Interval calculation
        if (rating === 'again') {
          interval = 1;
        } else if (interval === 1) {
          interval = rating === 'hard' ? 2 : rating === 'good' ? 4 : 6;
        } else {
          interval = Math.round(interval * EF);
        }

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + interval);
        const nextReviewDate = nextDate.toISOString().split('T')[0];

        // Increment task counter if active flashcard study task exists
        setDailyTasks(prev => 
          prev.map(task => {
            if (task.taskType === 'flashcard' && task.completedCount < task.targetCount) {
              return { ...task, completedCount: task.completedCount + 1 };
            }
            return task;
          })
        );

        return {
          ...card,
          difficulty: rating,
          intervalDays: interval,
          easeFactor: EF,
          nextReviewDate
        };
      })
    );
  };

  const toggleTaskComplete = (taskId: string) => {
    setDailyTasks(prev => 
      prev.map(task => {
        if (task.id === taskId) {
          const completed = task.completedCount === task.targetCount ? 0 : task.targetCount;
          
          // Grant bonus XP on full completion
          if (completed === task.targetCount && profile) {
            updateProfile({
              xp: profile.xp + 25
            });
          }
          
          return { ...task, completedCount: completed };
        }
        return task;
      })
    );
  };

  const resetProgress = () => {
    localStorage.removeItem(DEFAULT_PROFILE_KEY);
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(FLASHCARDS_KEY);
    localStorage.removeItem(PLAN_KEY);
    localStorage.removeItem(TASKS_KEY);
    setProfile(null);
    setAttempts([]);
    setFlashcards(FLASHCARDS);
    setStudyPlan(null);
    setDailyTasks([]);
    setActiveTabState('dashboard');
  };

  return (
    <AppContext.Provider value={{
      profile,
      onboardUser,
      updateProfile,
      attempts,
      addAttempt,
      categorizeMistake,
      flashcards,
      reviewFlashcard,
      activeTab,
      setActiveTab,
      theme,
      toggleTheme,
      studyPlan,
      generateStudyPlan,
      dailyTasks,
      toggleTaskComplete,
      resetProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
