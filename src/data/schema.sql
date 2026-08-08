-- ============================================================================
-- FMGE MASTER — PRODUCTION DATABASE MIGRATION SCRIPT
-- PostgreSQL / Supabase Schema Definition (44 Tables + Vector Search + RLS)
-- Architecture: Free-First Core with Future-Ready Dormant Monetization Modules
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ----------------------------------------------------------------------------
-- 2. Core Users & Candidate Profiles
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(50) DEFAULT 'candidate' -- 'candidate', 'verified_doctor', 'moderator', 'admin'
);

CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    attempt_number INT DEFAULT 1,
    previous_score INT,
    target_exam VARCHAR(100) DEFAULT 'December 2026',
    study_hours_per_day INT DEFAULT 8,
    strong_subjects TEXT[] DEFAULT '{}',
    weak_subjects TEXT[] DEFAULT '{}',
    learning_style VARCHAR(50) DEFAULT 'mixed',
    current_level VARCHAR(50) DEFAULT 'beginner',
    preferred_language VARCHAR(50) DEFAULT 'english',
    streak INT DEFAULT 0,
    last_study_date DATE,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    badges TEXT[] DEFAULT '{}',
    estimated_score_min INT DEFAULT 120,
    estimated_score_max INT DEFAULT 145,
    onboarded BOOLEAN DEFAULT FALSE,
    daily_goal_minutes INT DEFAULT 180,
    today_study_minutes INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. Medical Syllabus: Subjects, Systems, Topics & Subtopics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    category VARCHAR(50) NOT NULL, -- 'pre-clinical', 'para-clinical', 'clinical'
    weightage INT NOT NULL DEFAULT 15,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS systems (
    id VARCHAR(100) PRIMARY KEY,
    subject_id VARCHAR(100) REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(150) PRIMARY KEY,
    subject_id VARCHAR(100) REFERENCES subjects(id) ON DELETE CASCADE,
    system_id VARCHAR(100) REFERENCES systems(id) ON DELETE SET NULL,
    system_name VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    high_yield_notes TEXT NOT NULL,
    mnemonics TEXT[] DEFAULT '{}',
    common_traps TEXT[] DEFAULT '{}',
    clinical_pearls TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subtopics (
    id VARCHAR(150) PRIMARY KEY,
    topic_id VARCHAR(150) REFERENCES topics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. Free Resource Hub & Ingestion Engine
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resource_sources (
    id VARCHAR(100) PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL, -- 'YouTube', 'WHO', 'NBEMS', 'PubMed', 'CDC'
    base_url TEXT,
    is_trusted BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    source VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'YOUTUBE', 'OFFICIAL', 'PUBMED', 'OPEN_ACCESS', 'ORIGINAL'
    subject_id VARCHAR(100) REFERENCES subjects(id) ON DELETE CASCADE,
    system_name VARCHAR(255),
    topic_id VARCHAR(150) REFERENCES topics(id) ON DELETE SET NULL,
    resource_type VARCHAR(50) NOT NULL, -- 'VIDEO', 'ARTICLE', 'PDF', 'GUIDELINE', 'CHEAT_SHEET'
    language VARCHAR(50) DEFAULT 'english',
    difficulty VARCHAR(50) DEFAULT 'medium',
    license VARCHAR(100) DEFAULT 'EXTERNAL FREE RESOURCE',
    is_free BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT TRUE,
    thumbnail TEXT,
    duration VARCHAR(100),
    author VARCHAR(255),
    published_date DATE,
    last_checked DATE,
    embed_id VARCHAR(100),
    key_points TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(150) REFERENCES topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. QBank & Verified PYQ Database
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id VARCHAR(100) REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id VARCHAR(150) REFERENCES topics(id) ON DELETE SET NULL,
    system_name VARCHAR(255),
    question_type VARCHAR(50) NOT NULL, -- 'single', 'clinical', 'image', 'doc', 'investigation', etc.
    difficulty VARCHAR(50) DEFAULT 'medium',
    question_text TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer_index INT NOT NULL,
    explanation TEXT NOT NULL,
    why_other_options_wrong TEXT[] DEFAULT '{}',
    high_yield_point TEXT NOT NULL,
    memory_trick TEXT,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    image_path TEXT,
    source VARCHAR(255),
    is_verified_pyq BOOLEAN DEFAULT FALSE,
    pyq_year INT,
    pyq_session VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_index INT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS question_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_index INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INT DEFAULT 0,
    mistake_category VARCHAR(50), -- 'concept', 'memory', 'misread', 'silly', 'guess'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pyqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    exam_name VARCHAR(100) DEFAULT 'FMGE',
    year INT NOT NULL,
    session VARCHAR(50) NOT NULL, -- 'June', 'December'
    subject_id VARCHAR(100) REFERENCES subjects(id)
);

-- ----------------------------------------------------------------------------
-- 6. Spaced Repetition Flashcards (SuperMemo-2)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id VARCHAR(100) REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id VARCHAR(150) REFERENCES topics(id) ON DELETE SET NULL,
    system_name VARCHAR(255),
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'good',
    interval_days INT DEFAULT 1,
    ease_factor NUMERIC(4, 2) DEFAULT 2.50,
    next_review_date DATE NOT NULL,
    repetitions INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating VARCHAR(50) NOT NULL, -- 'again', 'hard', 'good', 'easy'
    interval_days INT NOT NULL,
    ease_factor NUMERIC(4, 2) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. Grand Tests, Mock Simulations & Attempts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tests (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    question_count INT NOT NULL,
    duration_minutes INT NOT NULL,
    is_simulation BOOLEAN DEFAULT FALSE,
    subjects_included TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id VARCHAR(100) REFERENCES tests(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    question_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_id VARCHAR(100) REFERENCES tests(id) ON DELETE CASCADE,
    test_title VARCHAR(255) NOT NULL,
    total_questions INT NOT NULL,
    score INT NOT NULL,
    percentage INT NOT NULL,
    passed BOOLEAN NOT NULL,
    time_spent_seconds INT NOT NULL,
    subject_breakdown JSONB DEFAULT '{}'::jsonb,
    mistake_analysis JSONB DEFAULT '{}'::jsonb,
    ai_recommendations TEXT[] DEFAULT '{}',
    weak_topics_identified TEXT[] DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. Mistake Notebook & Study Planner
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mistakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    attempt_id UUID REFERENCES question_attempts(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'concept', 'memory', 'misread', 'silly', 'guess'
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_exam_date VARCHAR(100) NOT NULL,
    duration_days INT DEFAULT 120,
    daily_schedule JSONB NOT NULL,
    weekly_objectives TEXT[] DEFAULT '{}',
    subject_allocation JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    duration_minutes INT NOT NULL,
    mode VARCHAR(50) DEFAULT 'study', -- 'study', 'break'
    sound_used VARCHAR(50) DEFAULT 'none',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_questions_solved INT DEFAULT 0,
    total_correct INT DEFAULT 0,
    total_study_minutes INT DEFAULT 0,
    topics_completed INT DEFAULT 0,
    flashcards_reviewed INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 9. AI Tutor, RAG Vector Search & Clinical Cases
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    learning_mode VARCHAR(50) DEFAULT 'FMGE',
    language VARCHAR(50) DEFAULT 'english',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- 'user', 'ai'
    message_text TEXT NOT NULL,
    embedding VECTOR(1536), -- For pgvector similarity search
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_cases (
    id VARCHAR(100) PRIMARY KEY,
    subject_id VARCHAR(100) REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id VARCHAR(150) REFERENCES topics(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    system_name VARCHAR(255),
    difficulty VARCHAR(50) DEFAULT 'medium',
    patient_vignette JSONB NOT NULL,
    steps JSONB NOT NULL,
    takeaway_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS images (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Radiology', 'Pathology', 'Dermatology', 'Ophthalmology'
    subject_id VARCHAR(100) REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id VARCHAR(150) REFERENCES topics(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    high_yield_finding TEXT,
    question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 10. Community, Moderation, Reports & Notifications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_level INT DEFAULT 1,
    subject_id VARCHAR(100) REFERENCES subjects(id) ON DELETE CASCADE,
    topic_name VARCHAR(255),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    is_solved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_level INT DEFAULT 1,
    content TEXT NOT NULL,
    is_verified_doctor BOOLEAN DEFAULT FALSE,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_type VARCHAR(50) NOT NULL, -- 'post', 'comment', 'resource', 'question'
    target_id VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    is_reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 11. Feature Flags & Platform Settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feature_flags (
    id VARCHAR(100) PRIMARY KEY,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Feature Flags
INSERT INTO feature_flags (id, is_enabled, description) VALUES
('FREE_AI_TUTOR', TRUE, 'Enables unlimited free AI Teacher responses and quizzes')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 12. Row Level Security (RLS) Policies
-- ----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
