export type Difficulty = 'easy' | 'medium' | 'hard' | 'challenge';

export type QuestionType =
  | 'single'
  | 'clinical'
  | 'image'
  | 'video'
  | 'diagnosis'
  | 'investigation'
  | 'treatment'
  | 'doc'
  | 'mechanism'
  | 'side_effect'
  | 'anatomy'
  | 'pathology'
  | 'radiology'
  | 'microbiology'
  | 'dermatology'
  | 'ophthalmology'
  | 'ent'
  | 'rapid'
  | 'tf'
  | 'assertion';

export type MistakeCategory =
  | 'concept'
  | 'memory'
  | 'misread'
  | 'silly'
  | 'guess';

export type LearningStyle =
  | 'video'
  | 'reading'
  | 'mcq'
  | 'flashcard'
  | 'clinical'
  | 'mixed';

export type ResourceType =
  | 'VIDEO'
  | 'ARTICLE'
  | 'PDF'
  | 'WEBSITE'
  | 'IMAGE'
  | 'LECTURE'
  | 'GUIDELINE'
  | 'QUESTION'
  | 'FLASHCARD'
  | 'CHEAT_SHEET'
  | 'PYQ_PAPER';

export type ContentSourceLabel =
  | 'ORIGINAL FMGE MASTER'
  | 'OPEN LICENSE'
  | 'PUBLIC DOMAIN'
  | 'OFFICIAL SOURCE'
  | 'EXTERNAL FREE RESOURCE'
  | 'USER CREATED'
  | 'AI GENERATED'
  | 'VERIFIED PYQ';

export type AILearningMode =
  | 'SIMPLE'
  | 'FMGE'
  | 'RAPID REVISION'
  | 'CLINICAL'
  | 'MCQ'
  | 'MEMORY'
  | 'COMPARE'
  | 'ORAL/VIVA STYLE'
  | 'TEACH ME';

export type SupportedLanguage = 'english' | 'hinglish' | 'hindi' | 'gujarati';

export interface UserProfile {
  id: string;
  name: string;
  attemptNumber: number;
  previousScore: number | null; // null for first-time candidates
  targetExam: string; // e.g. "December 2026", "June 2027"
  studyHoursPerDay: number;
  strongSubjects: string[];
  weakSubjects: string[];
  learningStyle: LearningStyle;
  currentLevel: 'beginner' | 'intermediate' | 'repeater' | 'revision';
  preferredLanguage: SupportedLanguage;
  streak: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  xp: number;
  level: number;
  badges: string[];
  estimatedScoreRange: [number, number]; // [min, max]
  onboarded: boolean;
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
}

export interface Subject {
  id: string;
  name: string;
  shortName?: string;
  category: 'pre-clinical' | 'para-clinical' | 'clinical';
  systems: string[]; // List of system names
  weightage: number; // approximate marks in FMGE (out of 300)
  icon?: string;
  description?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  systemName: string;
  name: string;
  highYieldNotes: string; // MD formatting
  mnemonics?: string[];
  commonTraps?: string[];
  clinicalPearls?: string;
  tags?: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string; // e.g. "YouTube", "WHO", "NBEMS", "PubMed", "CDC", "NMC"
  sourceType: 'YOUTUBE' | 'OFFICIAL' | 'PUBMED' | 'OPEN_ACCESS' | 'ORIGINAL' | 'PDF';
  subjectId: string;
  systemName: string;
  topicId: string;
  resourceType: ResourceType;
  language: SupportedLanguage | 'english';
  difficulty: Difficulty;
  license: ContentSourceLabel;
  isFree: boolean;
  isVerified: boolean;
  thumbnail?: string;
  duration?: string; // e.g. "18 mins" or "12 pages"
  author: string;
  publishedDate: string;
  lastChecked: string;
  embedId?: string; // YouTube video ID or embed key
  keyPoints?: string[];
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  systemName: string;
  type: QuestionType;
  difficulty: Difficulty;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  whyOtherOptionsWrong: string[]; // Explanations for each option index
  highYieldPoint: string;
  memoryTrick?: string;
  isAiGenerated: boolean;
  imagePath?: string; // Optional path/URL for image questions
  imageUrl?: string; // Alias for imagePath — explicit URL for image-based questions
  videoUrl?: string; // Optional path/URL for video questions
  source?: string; // e.g. "FMGE Dec 2023 Official PYQ" or "FMGE-style AI Question"
  isVerifiedPyq: boolean;
  examName?: 'FMGE' | 'NEET PG' | 'INI-CET'; // Identifies the specific exam for PYQs
  pyqYear?: number;
  pyqSession?: 'June' | 'December' | 'May' | 'November'; // INI-CET has May/Nov
  clinicalContext?: {
    age?: number;
    gender?: string;
    vitals?: string;
  };
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string; // ISO string
  mistakeCategory?: MistakeCategory; // Concept, Memory, Misread, Silly, Guess
  subjectId?: string;
  topicId?: string;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  topicId: string;
  systemName?: string;
  front: string;
  back: string;
  cloze?: boolean;
  imagePath?: string;
  difficulty: 'easy' | 'good' | 'hard' | 'again';
  intervalDays: number; // SuperMemo-2 interval
  easeFactor: number;
  nextReviewDate: string; // YYYY-MM-DD
  repetitions: number;
  lastReviewed?: string;
}

export interface ClinicalCaseStep {
  stepNumber: number;
  stageName: 'Diagnosis' | 'Investigation' | 'Treatment' | 'Complications & Prognosis';
  prompt: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  clinicalPearls: string;
}

export interface ClinicalCase {
  id: string;
  subjectId: string;
  topicId: string;
  title: string;
  systemName: string;
  difficulty: Difficulty;
  patientVignette: {
    age: number;
    gender: 'male' | 'female' | 'other';
    chiefComplaint: string;
    historyOfPresentIllness: string;
    vitals: { bp: string; hr: number; temp: string; rr: number; spo2: string };
    physicalExam: string;
  };
  steps: ClinicalCaseStep[];
  takeawayMessage: string;
}

export interface ImageQuestionItem {
  id: string;
  title: string;
  category: 'Radiology' | 'Pathology' | 'Dermatology' | 'Ophthalmology' | 'ENT' | 'Anatomy' | 'Microbiology' | 'Histology';
  subjectId: string;
  systemName: string;
  topicId: string;
  imageUrl: string;
  description: string;
  highYieldFinding: string;
  question: Question;
}

export interface DailyTask {
  id: string;
  subjectId: string;
  topicId: string;
  taskType: 'mcq' | 'note' | 'flashcard' | 'revision' | 'quiz' | 'case' | 'pyq';
  targetCount: number;
  completedCount: number;
  durationMinutes: number;
  title: string;
}

export interface StudyPlan {
  id: string;
  createdAt: string;
  targetExamDate: string;
  durationDays: number;
  dailySchedule: {
    [timeBlock: string]: {
      task: string;
      subjectId: string;
      topicId: string;
      type: string;
      estimatedMinutes: number;
    };
  };
  weeklyObjectives: string[];
  subjectAllocation: { [subjectId: string]: number }; // percentage or hours
}

export interface GrandTest {
  id: string;
  title: string;
  description: string;
  questionCount: number; // 50, 100, 150, 300
  durationMinutes: number; // e.g. 150 mins
  isSimulation: boolean; // true for 300-Q complete FMGE simulation
  subjectsIncluded: string[];
  questions: Question[];
}

export interface GrandTestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  totalQuestions: number;
  score: number; // correct count
  percentage: number;
  passed: boolean; // FMGE cutoff is 150/300 (50%)
  timeSpentSeconds: number;
  timestamp: string;
  answers: { [questionId: string]: { selectedIndex: number; isCorrect: boolean; timeSpent: number } };
  subjectBreakdown: {
    [subjectId: string]: { total: number; correct: number; percentage: number };
  };
  mistakeAnalysis: {
    concept: number;
    memory: number;
    misread: number;
    silly: number;
    guess: number;
  };
  aiRecommendations: string[];
  weakTopicsIdentified: string[];
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorLevel: number;
  subjectId: string;
  topicName?: string;
  title: string;
  content: string;
  timestamp: string;
  upvotes: number;
  tags: string[];
  isSolved: boolean;
  comments: {
    id: string;
    authorName: string;
    authorLevel: number;
    content: string;
    timestamp: string;
    isVerifiedDoctor?: boolean;
    upvotes: number;
  }[];
}

export interface FeatureFlags {
  FREE_AI_TUTOR: boolean;
  COMMUNITY_MODERATION: boolean;
  VOICE_AI_ENABLED: boolean;
  BETA_SIMULATOR: boolean;
}

export interface OfficialExamInfo {
  examName: string;
  conductingBody: string;
  officialWebsite: string;
  upcomingDate: string;
  eligibilityCriteria: string[];
  paperPattern: {
    totalMarks: number;
    totalQuestions: number;
    parts: string;
    durationMinutes: number;
    negativeMarking: boolean;
    passingCutoff: string;
  };
  subjectWeightageTable: { subject: string; marks: number; category: string }[];
  importantDocuments: string[];
  officialBulletins: { title: string; date: string; url: string; isImportant: boolean }[];
  disclaimer: string;
}
