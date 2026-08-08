export type Difficulty = 'easy' | 'medium' | 'hard' | 'challenge';

export type QuestionType =
  | 'single'
  | 'clinical'
  | 'image'
  | 'assertion'
  | 'match'
  | 'rapid'
  | 'tf';

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
  preferredLanguage: 'english' | 'hinglish' | 'hindi' | 'gujarati';
  streak: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  xp: number;
  level: number;
  badges: string[];
  estimatedScoreRange: [number, number]; // [min, max]
  onboarded: boolean;
}

export interface Subject {
  id: string;
  name: string;
  category: 'pre-clinical' | 'para-clinical' | 'clinical';
  systems: string[]; // List of system names
}

export interface Topic {
  id: string;
  subjectId: string;
  systemName: string;
  name: string;
  highYieldNotes: string; // MD formatting
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
  whyOtherOptionsWrong: string[]; // Matching indexes of options
  highYieldPoint: string;
  memoryTrick?: string;
  isAiGenerated: boolean;
  imagePath?: string; // Optional path for image-based questions
  source?: string; // e.g. "FMGE 2023 PYQ" or "AI Practice Engine"
  isVerifiedPyq: boolean;
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string; // ISO string
  mistakeCategory?: MistakeCategory; // If incorrect, user/AI can categorize it
}

export interface Flashcard {
  id: string;
  subjectId: string;
  topicId: string;
  front: string;
  back: string;
  cloze?: boolean;
  imagePath?: string;
  difficulty: 'easy' | 'good' | 'hard' | 'again';
  intervalDays: number; // For spaced repetition algorithm
  easeFactor: number;
  nextReviewDate: string; // YYYY-MM-DD
}

export interface ClinicalCaseStep {
  title: string;
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
  patientVignette: {
    age: number;
    gender: 'male' | 'female' | 'other';
    chiefComplaint: string;
    vitals: { bp: string; hr: number; temp: string; rr: number };
  };
  steps: ClinicalCaseStep[]; // Diagnoses, Investigations, Treatment, Complications
}

export interface DailyTask {
  id: string;
  subjectId: string;
  topicId: string;
  taskType: 'mcq' | 'note' | 'flashcard' | 'revision' | 'quiz';
  targetCount: number;
  completedCount: number;
  durationMinutes: number;
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
    };
  };
  weeklyObjectives: string[];
}

export interface CommunityPost {
  id: string;
  authorName: string;
  subjectId: string;
  content: string;
  timestamp: string;
  upvotes: number;
  comments: {
    id: string;
    authorName: string;
    content: string;
    timestamp: string;
  }[];
}
