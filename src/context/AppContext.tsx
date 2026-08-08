'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserProfile, QuestionAttempt, MistakeCategory, Flashcard, ClinicalCase, 
  DailyTask, StudyPlan, Resource, FeatureFlags, GrandTestAttempt, 
  SupportedLanguage, CommunityPost, GrandTest
} from '../types/database';
import { 
  FLASHCARDS, QUESTIONS, FREE_RESOURCES, DEFAULT_FEATURE_FLAGS, 
  SUBJECTS, TOPICS, SAMPLE_COMMUNITY_POSTS 
} from '../data/mockDb';

interface AppContextType {
  profile: UserProfile | null;
  onboardUser: (data: Omit<UserProfile, 'id' | 'streak' | 'lastStudyDate' | 'xp' | 'level' | 'badges' | 'estimatedScoreRange' | 'onboarded' | 'todayStudyMinutes' | 'dailyGoalMinutes'>) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  
  // Attempts & Mistake Engine
  attempts: QuestionAttempt[];
  addAttempt: (questionId: string, selectedIndex: number, isCorrect: boolean, timeSpent: number) => QuestionAttempt;
  categorizeMistake: (attemptId: string, category: MistakeCategory) => void;
  
  // Flashcards (SuperMemo-2)
  flashcards: Flashcard[];
  reviewFlashcard: (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  createFlashcard: (card: Omit<Flashcard, 'id' | 'repetitions' | 'nextReviewDate'>) => void;
  
  // Navigation & View State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Topic Hub & Deep Navigation
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;
  navigateToTopic: (subjectId: string, topicId: string) => void;
  
  // Study Planner & Tasks
  studyPlan: StudyPlan | null;
  generateStudyPlan: () => void;
  dailyTasks: DailyTask[];
  toggleTaskComplete: (taskId: string) => void;
  
  // Free Resource Hub & Ingestion
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'publishedDate' | 'lastChecked'>) => void;
  verifyResource: (id: string) => void;
  
  userUploadedResources: Resource[];
  uploadUserResource: (resource: Resource) => void;
  userGeneratedSimulators: any[];
  addUserSimulator: (simulator: any) => void;
  
  // Grand Test Simulations & Analytics
  gtAttempts: GrandTestAttempt[];
  recordGrandTestAttempt: (attempt: Omit<GrandTestAttempt, 'id' | 'timestamp'>) => GrandTestAttempt;
  
  // Global One-Search Modal
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  
  // Voice AI & Audio Tutor
  isVoiceSpeaking: boolean;
  speakText: (text: string, lang?: SupportedLanguage) => void;
  stopSpeaking: () => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  
  // Pomodoro Study Room
  pomodoroSeconds: number;
  pomodoroActive: boolean;
  pomodoroMode: 'study' | 'shortBreak' | 'longBreak';
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: (presetMinutes?: number) => void;
  todayStudyMinutes: number;
  
  // Feature Flags & Future Monetization
  featureFlags: FeatureFlags;
  toggleFeatureFlag: (flagName: keyof FeatureFlags) => void;
  
  // Community Board
  communityPosts: CommunityPost[];
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'timestamp' | 'upvotes' | 'comments'>) => void;
  addCommunityComment: (postId: string, comment: { authorName: string; authorLevel: number; content: string }) => void;
  upvotePost: (postId: string) => void;
  
  resetProgress: () => void;
  currentUserEmail: string | null;
  registerUser: (email: string, password: string, name: string) => boolean;
  loginUser: (email: string, password: string) => boolean;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PROFILE_KEY = 'fmge_master_profile_v2';
const ATTEMPTS_KEY = 'fmge_master_attempts_v2';
const FLASHCARDS_KEY = 'fmge_master_flashcards_v2';
const PLAN_KEY = 'fmge_master_plan_v2';
const TASKS_KEY = 'fmge_master_tasks_v2';
const RESOURCES_KEY = 'fmge_master_resources_v2';
const GT_KEY = 'fmge_master_gt_v2';
const FLAGS_KEY = 'fmge_master_flags_v2';
const COMMUNITY_KEY = 'fmge_master_community_v2';
const USER_UPLOADS_KEY = 'fmge_master_user_uploads_v2';
const USER_SIMULATORS_KEY = 'fmge_master_user_simulators_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [gtAttempts, setGtAttempts] = useState<GrandTestAttempt[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(SAMPLE_COMMUNITY_POSTS);
  
  const [userUploadedResources, setUserUploadedResources] = useState<Resource[]>([]);
  const [userGeneratedSimulators, setUserGeneratedSimulators] = useState<GrandTest[]>([]);
  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  
  // Deep navigation
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  
  // Voice AI
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  
  // Pomodoro
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState<boolean>(false);
  const [pomodoroMode, setPomodoroMode] = useState<'study' | 'shortBreak' | 'longBreak'>('study');
  const [todayStudyMinutes, setTodayStudyMinutes] = useState<number>(45);

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const saveUserProgress = useCallback((email: string, updates: any) => {
    try {
      const dbStr = localStorage.getItem('fmge_users_database');
      const db = dbStr ? JSON.parse(dbStr) : [];
      const userIndex = db.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userIndex !== -1) {
        db[userIndex] = {
          ...db[userIndex],
          ...updates
        };
        localStorage.setItem('fmge_users_database', JSON.stringify(db));
      }
    } catch (e) {
      console.warn('Error saving user progress', e);
    }
  }, []);

  const registerUser = (email: string, password: string, name: string): boolean => {
    try {
      const dbStr = localStorage.getItem('fmge_users_database');
      const db = dbStr ? JSON.parse(dbStr) : [];
      if (db.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        return false;
      }
      
      const newAccount = {
        email,
        passwordHash: password,
        profile: {
          id: 'usr_' + Math.random().toString(36).substring(2, 11),
          name: name,
          attemptNumber: 1,
          previousScore: null,
          targetExam: 'December 2026',
          studyHoursPerDay: 8,
          strongSubjects: ['anatomy', 'physiology'],
          weakSubjects: ['psm', 'medicine'],
          learningStyle: 'mixed',
          currentLevel: 'intermediate',
          preferredLanguage: 'english',
          streak: 1,
          lastStudyDate: new Date().toISOString().split('T')[0],
          xp: 100,
          level: 1,
          badges: ['FMGE Registered Member'],
          estimatedScoreRange: [120, 145],
          onboarded: true,
          dailyGoalMinutes: 480,
          todayStudyMinutes: 30
        },
        attempts: [],
        flashcards: FLASHCARDS,
        studyPlan: null,
        dailyTasks: [],
        gtAttempts: [],
        userUploadedResources: [],
        userGeneratedSimulators: []
      };
      
      db.push(newAccount);
      localStorage.setItem('fmge_users_database', JSON.stringify(db));
      
      // Auto login after signup
      loginUser(email, password);
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  };

  const loginUser = (email: string, password: string): boolean => {
    try {
      const dbStr = localStorage.getItem('fmge_users_database');
      const db = dbStr ? JSON.parse(dbStr) : [];
      const user = db.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password);
      if (!user) return false;
      
      setCurrentUserEmail(user.email);
      localStorage.setItem('fmge_active_user', user.email);
      
      if (user.profile) {
        setProfile(user.profile);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(user.profile));
      }
      setAttempts(user.attempts || []);
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(user.attempts || []));
      
      setFlashcards(user.flashcards || FLASHCARDS);
      localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(user.flashcards || FLASHCARDS));
      
      setStudyPlan(user.studyPlan || null);
      if (user.studyPlan) localStorage.setItem(PLAN_KEY, JSON.stringify(user.studyPlan));
      else localStorage.removeItem(PLAN_KEY);
      
      setDailyTasks(user.dailyTasks || []);
      localStorage.setItem(TASKS_KEY, JSON.stringify(user.dailyTasks || []));
      
      setGtAttempts(user.gtAttempts || []);
      localStorage.setItem(GT_KEY, JSON.stringify(user.gtAttempts || []));
      
      setUserUploadedResources(user.userUploadedResources || []);
      localStorage.setItem(USER_UPLOADS_KEY, JSON.stringify(user.userUploadedResources || []));
      
      setUserGeneratedSimulators(user.userGeneratedSimulators || []);
      localStorage.setItem(USER_SIMULATORS_KEY, JSON.stringify(user.userGeneratedSimulators || []));
      
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  };

  const logoutUser = () => {
    setCurrentUserEmail(null);
    localStorage.removeItem('fmge_active_user');
    
    // Clear all states
    setProfile(null);
    localStorage.removeItem(PROFILE_KEY);
    setAttempts([]);
    localStorage.removeItem(ATTEMPTS_KEY);
    setFlashcards(FLASHCARDS);
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(FLASHCARDS));
    setStudyPlan(null);
    localStorage.removeItem(PLAN_KEY);
    setDailyTasks([]);
    localStorage.removeItem(TASKS_KEY);
    setGtAttempts([]);
    localStorage.removeItem(GT_KEY);
    setUserUploadedResources([]);
    localStorage.removeItem(USER_UPLOADS_KEY);
    setUserGeneratedSimulators([]);
    localStorage.removeItem(USER_SIMULATORS_KEY);
  };

  // Load from local storage (with active user handling)
  useEffect(() => {
    try {
      const activeUser = localStorage.getItem('fmge_active_user');
      if (activeUser) {
        const dbStr = localStorage.getItem('fmge_users_database');
        const db = dbStr ? JSON.parse(dbStr) : [];
        const user = db.find((u: any) => u.email.toLowerCase() === activeUser.toLowerCase());
        if (user) {
          setCurrentUserEmail(user.email);
          if (user.profile) setProfile(user.profile);
          if (user.attempts) setAttempts(user.attempts);
          if (user.flashcards) setFlashcards(user.flashcards);
          if (user.studyPlan) setStudyPlan(user.studyPlan);
          if (user.dailyTasks) setDailyTasks(user.dailyTasks);
          if (user.gtAttempts) setGtAttempts(user.gtAttempts);
          if (user.userUploadedResources) setUserUploadedResources(user.userUploadedResources);
          if (user.userGeneratedSimulators) setUserGeneratedSimulators(user.userGeneratedSimulators);
          
          const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
          if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
          }
          const savedFlags = localStorage.getItem(FLAGS_KEY);
          if (savedFlags) setFeatureFlags(JSON.parse(savedFlags));
          return;
        }
      }

      // Legacy fallback
      const savedProfile = localStorage.getItem(PROFILE_KEY);
      const savedAttempts = localStorage.getItem(ATTEMPTS_KEY);
      const savedFlashcards = localStorage.getItem(FLASHCARDS_KEY);
      const savedPlan = localStorage.getItem(PLAN_KEY);
      const savedTasks = localStorage.getItem(TASKS_KEY);
      const savedResources = localStorage.getItem(RESOURCES_KEY);
      const savedGt = localStorage.getItem(GT_KEY);
      const savedFlags = localStorage.getItem(FLAGS_KEY);
      const savedCommunity = localStorage.getItem(COMMUNITY_KEY);
      const savedUserUploads = localStorage.getItem(USER_UPLOADS_KEY);
      const savedUserSimulators = localStorage.getItem(USER_SIMULATORS_KEY);
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
      if (savedUserUploads) setUserUploadedResources(JSON.parse(savedUserUploads));
      if (savedUserSimulators) setUserGeneratedSimulators(JSON.parse(savedUserSimulators));
      
      if (savedFlashcards) {
        setFlashcards(JSON.parse(savedFlashcards));
      } else {
        setFlashcards(FLASHCARDS);
      }
      
      if (savedPlan) setStudyPlan(JSON.parse(savedPlan));
      if (savedTasks) setDailyTasks(JSON.parse(savedTasks));
      
      if (savedResources) {
        setResources(JSON.parse(savedResources));
      } else {
        setResources(FREE_RESOURCES);
      }
      
      if (savedGt) setGtAttempts(JSON.parse(savedGt));
      if (savedFlags) setFeatureFlags(JSON.parse(savedFlags));
      if (savedCommunity) setCommunityPosts(JSON.parse(savedCommunity));
      
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', prefersDark);
      }
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Pomodoro Interval Timer
  useEffect(() => {
    let interval: any = null;
    if (pomodoroActive && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(prev => {
          if (prev <= 1) {
            setPomodoroActive(false);
            if (pomodoroMode === 'study') {
              setTodayStudyMinutes(m => m + 25);
              if (profile) {
                updateProfile({
                  xp: profile.xp + 30,
                  todayStudyMinutes: (profile.todayStudyMinutes || 0) + 25
                });
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroSeconds, pomodoroMode, profile]);

  // Persistence effects with multi-user DB synchronization
  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      if (currentUserEmail) saveUserProgress(currentUserEmail, { profile });
    }
  }, [profile, currentUserEmail, saveUserProgress]);

  useEffect(() => {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
    if (currentUserEmail) saveUserProgress(currentUserEmail, { attempts });
  }, [attempts, currentUserEmail, saveUserProgress]);

  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards));
      if (currentUserEmail) saveUserProgress(currentUserEmail, { flashcards });
    }
  }, [flashcards, currentUserEmail, saveUserProgress]);

  useEffect(() => {
    if (studyPlan) {
      localStorage.setItem(PLAN_KEY, JSON.stringify(studyPlan));
      if (currentUserEmail) saveUserProgress(currentUserEmail, { studyPlan });
    }
  }, [studyPlan, currentUserEmail, saveUserProgress]);

  useEffect(() => {
    if (dailyTasks.length > 0) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(dailyTasks));
      if (currentUserEmail) saveUserProgress(currentUserEmail, { dailyTasks });
    }
  }, [dailyTasks, currentUserEmail, saveUserProgress]);

  useEffect(() => {
    if (resources.length > 0) localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(GT_KEY, JSON.stringify(gtAttempts));
    if (currentUserEmail) saveUserProgress(currentUserEmail, { gtAttempts });
  }, [gtAttempts, currentUserEmail, saveUserProgress]);

  useEffect(() => {
    localStorage.setItem(FLAGS_KEY, JSON.stringify(featureFlags));
  }, [featureFlags]);

  useEffect(() => {
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(communityPosts));
  }, [communityPosts]);

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

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const navigateToTopic = (subjectId: string, topicId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedTopicId(topicId);
    setActiveTab('learn');
  };

  const onboardUser = (data: Omit<UserProfile, 'id' | 'streak' | 'lastStudyDate' | 'xp' | 'level' | 'badges' | 'estimatedScoreRange' | 'onboarded' | 'todayStudyMinutes' | 'dailyGoalMinutes'>) => {
    const initialScoreRange: [number, number] = data.previousScore 
      ? [Math.max(100, data.previousScore - 15), Math.min(260, data.previousScore + 25)]
      : [120, 145];

    const initialProfile: UserProfile = {
      ...data,
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      streak: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
      xp: 100, // Onboarding welcome bonus
      level: 1,
      badges: ['FMGE Aspirant', 'First Step', 'Study Kickoff'],
      estimatedScoreRange: initialScoreRange,
      onboarded: true,
      dailyGoalMinutes: data.studyHoursPerDay * 60,
      todayStudyMinutes: 30
    };
    
    setProfile(initialProfile);
    generateInitialTasks(data.weakSubjects);
    generateStudyPlanForUser(initialProfile);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const generateInitialTasks = (weakSubjects: string[]) => {
    const primaryWeak = weakSubjects[0] || 'psm';
    const secondaryWeak = weakSubjects[1] || 'medicine';
    
    const list: DailyTask[] = [
      { 
        id: 't1', 
        subjectId: primaryWeak, 
        topicId: primaryWeak === 'psm' ? 'epidemiology-study-designs' : 'myocardial-infarction', 
        taskType: 'mcq', 
        targetCount: 30, 
        completedCount: 0, 
        durationMinutes: 40,
        title: `Solve 30 High-Yield MCQs in ${SUBJECTS.find(s => s.id === primaryWeak)?.name || primaryWeak}`
      },
      { 
        id: 't2', 
        subjectId: secondaryWeak, 
        topicId: 'autonomic-drugs', 
        taskType: 'revision', 
        targetCount: 1, 
        completedCount: 0, 
        durationMinutes: 30,
        title: `Rapid Revision & Drug of Choice in ${SUBJECTS.find(s => s.id === secondaryWeak)?.name || secondaryWeak}`
      },
      { 
        id: 't3', 
        subjectId: 'obg', 
        topicId: 'preeclampsia-eclampsia', 
        taskType: 'flashcard', 
        targetCount: 20, 
        completedCount: 0, 
        durationMinutes: 15,
        title: 'Review 20 Spaced Repetition Flashcards in OBG & Pharmacology'
      },
      { 
        id: 't4', 
        subjectId: 'fmt', 
        topicId: 'thanatology-hanging', 
        taskType: 'quiz', 
        targetCount: 10, 
        completedCount: 0, 
        durationMinutes: 15,
        title: 'Daily AI Challenge: 20 Mixed Subject Questions'
      }
    ];
    setDailyTasks(list);
  };

  const generateStudyPlanForUser = (user: UserProfile) => {
    const primaryWeakName = SUBJECTS.find(s => s.id === user.weakSubjects[0])?.name || 'Community Medicine (PSM)';
    const secondaryWeakName = SUBJECTS.find(s => s.id === user.weakSubjects[1])?.name || 'General Medicine';
    
    const plan: StudyPlan = {
      id: 'plan_' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      targetExamDate: user.targetExam,
      durationDays: 150,
      dailySchedule: {
        '06:30–08:30': { 
          task: `Deep Concept Study: High-Yield Notes & Free Videos (${primaryWeakName})`, 
          subjectId: user.weakSubjects[0] || 'psm', 
          topicId: 'epidemiology-study-designs', 
          type: 'note',
          estimatedMinutes: 120
        },
        '09:00–10:30': { 
          task: `Targeted Practice: 40 Subject MCQs with Full Explanations`, 
          subjectId: user.weakSubjects[0] || 'psm', 
          topicId: 'epidemiology-study-designs', 
          type: 'mcq',
          estimatedMinutes: 90
        },
        '11:00–12:00': { 
          task: 'Mistake Notebook Analysis: Review Concept & Memory Traps', 
          subjectId: 'general', 
          topicId: 'general', 
          type: 'revision',
          estimatedMinutes: 60
        },
        '14:00–16:00': { 
          task: `Secondary Focus Block (${secondaryWeakName}) + Clinical Case Vignette`, 
          subjectId: user.weakSubjects[1] || 'medicine', 
          topicId: 'myocardial-infarction', 
          type: 'case',
          estimatedMinutes: 120
        },
        '17:30–18:30': { 
          task: 'Free Daily AI Challenge: 20 Mixed-Subject Adaptive Questions', 
          subjectId: 'general', 
          topicId: 'general', 
          type: 'quiz',
          estimatedMinutes: 60
        },
        '21:00–22:00': { 
          task: 'Spaced Repetition Flashcard Review (SuperMemo-2 Deck)', 
          subjectId: 'general', 
          topicId: 'general', 
          type: 'flashcard',
          estimatedMinutes: 60
        }
      },
      weeklyObjectives: [
        `Master high-weightage topics in ${primaryWeakName} & ${secondaryWeakName}`,
        `Complete at least 350 MCQs with error categorization in Mistake Notebook`,
        `Clear 100% of pending Anki Spaced Repetition review cards`,
        `Take the Sunday Weekly 100-Question Diagnostic Simulation`
      ],
      subjectAllocation: {
        psm: 20,
        medicine: 20,
        obg: 15,
        surgery: 15,
        pathology: 10,
        pharmacology: 10,
        anatomy: 10
      }
    };
    setStudyPlan(plan);
  };

  const generateStudyPlan = () => {
    if (profile) generateStudyPlanForUser(profile);
  };

  const addAttempt = (questionId: string, selectedIndex: number, isCorrect: boolean, timeSpent: number): QuestionAttempt => {
    const questionObj = QUESTIONS.find(q => q.id === questionId);
    const newAttempt: QuestionAttempt = {
      id: 'att_' + Math.random().toString(36).substring(2, 11),
      questionId,
      selectedOptionIndex: selectedIndex,
      isCorrect,
      timeSpentSeconds: timeSpent,
      timestamp: new Date().toISOString(),
      subjectId: questionObj?.subjectId,
      topicId: questionObj?.topicId,
      ...(!isCorrect ? { mistakeCategory: 'concept' as MistakeCategory } : {})
    };

    setAttempts(prev => [newAttempt, ...prev]);

    // Update user profile statistics & gamification
    if (profile) {
      const xpGained = isCorrect ? 15 : 4;
      const newXp = profile.xp + xpGained;
      const nextLevelThreshold = profile.level * 200;
      let newLevel = profile.level;
      const newBadges = [...profile.badges];

      if (newXp >= nextLevelThreshold) {
        newLevel += 1;
        newBadges.push(`Level ${newLevel} Clinician`);
      }

      // Check daily study streak
      const todayStr = new Date().toISOString().split('T')[0];
      let newStreak = profile.streak;

      if (profile.lastStudyDate !== todayStr) {
        const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        if (profile.lastStudyDate === yesterdayStr || profile.streak === 0) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      if (newStreak >= 7 && !newBadges.includes('7-Day Streak Master')) {
        newBadges.push('7-Day Streak Master');
      }
      if (attempts.length + 1 >= 100 && !newBadges.includes('Century MCQ Solver')) {
        newBadges.push('Century MCQ Solver');
      }

      // Calculate FMGE Readiness Score range based on cumulative accuracy & question count
      const totalCorrect = attempts.filter(a => a.isCorrect).length + (isCorrect ? 1 : 0);
      const totalQ = attempts.length + 1;
      const accuracy = totalCorrect / totalQ;
      
      // Estimated FMGE score (out of 300; passing is 150)
      const baseEstimate = Math.round(110 + accuracy * 160 + Math.min(newLevel * 2, 20));
      const minEst = Math.max(90, baseEstimate - 12);
      const maxEst = Math.min(290, baseEstimate + 10);

      updateProfile({
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastStudyDate: todayStr,
        badges: newBadges,
        estimatedScoreRange: [minEst, maxEst]
      });
    }

    // Update Daily Task counter if relevant
    if (questionObj) {
      setDailyTasks(prev => 
        prev.map(task => {
          if (task.taskType === 'mcq' && task.completedCount < task.targetCount) {
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
        const reps = card.repetitions + 1;

        // Quality score: again=0, hard=2, good=4, easy=5
        const qScore = rating === 'again' ? 0 : rating === 'hard' ? 2 : rating === 'good' ? 4 : 5;
        
        // EF calculation: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        EF = EF + (0.1 - (5 - qScore) * (0.08 + (5 - qScore) * 0.02));
        if (EF < 1.3) EF = 1.3;

        // Interval calculation
        if (rating === 'again') {
          interval = 1;
        } else if (reps === 1) {
          interval = 1;
        } else if (reps === 2) {
          interval = rating === 'hard' ? 2 : rating === 'good' ? 4 : 6;
        } else {
          interval = Math.round(interval * EF);
        }

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + interval);
        const nextReviewDate = nextDate.toISOString().split('T')[0];

        // Increment daily flashcard task
        setDailyTasks(prev => 
          prev.map(task => {
            if (task.taskType === 'flashcard' && task.completedCount < task.targetCount) {
              return { ...task, completedCount: task.completedCount + 1 };
            }
            return task;
          })
        );

        if (profile) {
          updateProfile({ xp: profile.xp + (rating === 'again' ? 2 : 5) });
        }

        return {
          ...card,
          difficulty: rating,
          intervalDays: interval,
          easeFactor: EF,
          nextReviewDate,
          repetitions: reps,
          lastReviewed: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const createFlashcard = (card: Omit<Flashcard, 'id' | 'repetitions' | 'nextReviewDate'>) => {
    const newCard: Flashcard = {
      ...card,
      id: 'fc_' + Math.random().toString(36).substring(2, 11),
      repetitions: 0,
      nextReviewDate: new Date().toISOString().split('T')[0]
    };
    setFlashcards(prev => [newCard, ...prev]);
  };

  const toggleTaskComplete = (taskId: string) => {
    setDailyTasks(prev => 
      prev.map(task => {
        if (task.id === taskId) {
          const completed = task.completedCount >= task.targetCount ? 0 : task.targetCount;
          if (completed === task.targetCount && profile) {
            updateProfile({ xp: profile.xp + 25 });
          }
          return { ...task, completedCount: completed };
        }
        return task;
      })
    );
  };

  const addResource = (res: Omit<Resource, 'id' | 'publishedDate' | 'lastChecked'>) => {
    const newRes: Resource = {
      ...res,
      id: 'res_' + Math.random().toString(36).substring(2, 11),
      publishedDate: new Date().toISOString().split('T')[0],
      lastChecked: new Date().toISOString().split('T')[0]
    };
    setResources(prev => [newRes, ...prev]);
  };

  const verifyResource = (id: string) => {
    setResources(prev => 
      prev.map(r => r.id === id ? { ...r, isVerified: true, lastChecked: new Date().toISOString().split('T')[0] } : r)
    );
  };

  const recordGrandTestAttempt = (attempt: Omit<GrandTestAttempt, 'id' | 'timestamp'>): GrandTestAttempt => {
    const fullAttempt: GrandTestAttempt = {
      ...attempt,
      id: 'gt_att_' + Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString()
    };
    setGtAttempts(prev => [fullAttempt, ...prev]);

    if (profile) {
      const bonusXp = Math.round(attempt.score * 5 + (attempt.passed ? 150 : 50));
      updateProfile({
        xp: profile.xp + bonusXp,
        badges: attempt.passed && !profile.badges.includes('FMGE Pass Qualifier (150+)') 
          ? [...profile.badges, 'FMGE Pass Qualifier (150+)'] 
          : profile.badges
      });
    }

    return fullAttempt;
  };

  // Web Speech API Voice AI Synthesis
  const speakText = useCallback((text: string, lang: SupportedLanguage = 'english') => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_\[\]()$]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    
    // Choose appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'hindi') {
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi'));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      const englishVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsVoiceSpeaking(true);
    utterance.onend = () => setIsVoiceSpeaking(false);
    utterance.onerror = () => setIsVoiceSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [speechRate]);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceSpeaking(false);
  };

  // Pomodoro actions
  const startPomodoro = () => setPomodoroActive(true);
  const pausePomodoro = () => setPomodoroActive(false);
  const resetPomodoro = (presetMinutes: number = 25) => {
    setPomodoroActive(false);
    setPomodoroSeconds(presetMinutes * 60);
    setPomodoroMode(presetMinutes >= 25 ? 'study' : 'shortBreak');
  };

  // Feature Flags
  const toggleFeatureFlag = (flagName: keyof FeatureFlags) => {
    setFeatureFlags(prev => ({ ...prev, [flagName]: !prev[flagName] }));
  };

  // Community
  const addCommunityPost = (post: Omit<CommunityPost, 'id' | 'timestamp' | 'upvotes' | 'comments'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: 'post_' + Math.random().toString(36).substring(2, 11),
      timestamp: 'Just now',
      upvotes: 1,
      comments: []
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const addCommunityComment = (postId: string, comment: { authorName: string; authorLevel: number; content: string }) => {
    setCommunityPosts(prev => 
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: 'c_' + Math.random().toString(36).substring(2, 11),
                ...comment,
                timestamp: 'Just now',
                upvotes: 0
              }
            ]
          };
        }
        return p;
      })
    );
  };

  const upvotePost = (postId: string) => {
    setCommunityPosts(prev => 
      prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p)
    );
  };

  const resetProgress = () => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(FLASHCARDS_KEY);
    localStorage.removeItem(PLAN_KEY);
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(RESOURCES_KEY);
    localStorage.removeItem(GT_KEY);
    localStorage.removeItem(FLAGS_KEY);
    localStorage.removeItem(COMMUNITY_KEY);
    
    setProfile(null);
    setAttempts([]);
    setFlashcards(FLASHCARDS);
    setStudyPlan(null);
    setDailyTasks([]);
    setResources(FREE_RESOURCES);
    setGtAttempts([]);
    setFeatureFlags(DEFAULT_FEATURE_FLAGS);
    setCommunityPosts(SAMPLE_COMMUNITY_POSTS);
    setActiveTabState('dashboard');
  };

  const uploadUserResource = (resource: Resource) => {
    const updated = [resource, ...userUploadedResources];
    setUserUploadedResources(updated);
    localStorage.setItem(USER_UPLOADS_KEY, JSON.stringify(updated));
  };

  const addUserSimulator = (simulator: GrandTest) => {
    const updated = [simulator, ...userGeneratedSimulators];
    setUserGeneratedSimulators(updated);
    localStorage.setItem(USER_SIMULATORS_KEY, JSON.stringify(updated));
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
      createFlashcard,
      activeTab,
      setActiveTab,
      theme,
      toggleTheme,
      selectedSubjectId,
      setSelectedSubjectId,
      selectedTopicId,
      setSelectedTopicId,
      navigateToTopic,
      studyPlan,
      generateStudyPlan,
      dailyTasks,
      toggleTaskComplete,
      resources,
      addResource,
      verifyResource,
      userUploadedResources,
      uploadUserResource,
      userGeneratedSimulators,
      addUserSimulator,
      gtAttempts,
      recordGrandTestAttempt,
      isSearchOpen,
      openSearch,
      closeSearch,
      isVoiceSpeaking,
      speakText,
      stopSpeaking,
      speechRate,
      setSpeechRate,
      pomodoroSeconds,
      pomodoroActive,
      pomodoroMode,
      startPomodoro,
      pausePomodoro,
      resetPomodoro,
      todayStudyMinutes,
      featureFlags,
      toggleFeatureFlag,
      communityPosts,
      addCommunityPost,
      addCommunityComment,
      upvotePost,
      resetProgress,
      currentUserEmail,
      registerUser,
      loginUser,
      logoutUser
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
