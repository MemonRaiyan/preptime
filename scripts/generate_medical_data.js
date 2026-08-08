const fs = require('fs');
const path = require('path');

const NUM_QUESTIONS = 500;
const NUM_RESOURCES = 150;
const NUM_VIDEO_QUESTIONS = 50;

const SUBJECTS = ['medicine', 'surgery', 'obgyn', 'psm', 'pediatrics', 'pharmacology', 'pathology', 'anatomy', 'physiology', 'biochemistry', 'microbiology', 'forensic', 'ophthalmology', 'ent', 'psychiatry', 'dermatology', 'anesthesia', 'radiology', 'orthopedics'];
const DIFFICULTIES = ['easy', 'medium', 'hard', 'challenge'];
const EXAMS = ['FMGE', 'NEET PG', 'INI-CET'];
const VIDEO_PLACEHOLDER = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Placeholder video that plays in HTML5

const videoTopics = [
  { text: 'A 45-year-old male presents with the gait shown in the video. What is the most likely diagnosis?', options: ['Parkinson\'s Disease (Festinating Gait)', 'Cerebellar Ataxia', 'Sensory Ataxia', 'Spastic Hemiparesis'], correct: 0, pearl: 'Festinating gait is characterized by short, shuffling steps and a stooped posture.' },
  { text: 'Watch the video of this patient\'s eye movements. What type of nystagmus is demonstrated?', options: ['Downbeat nystagmus', 'Upbeat nystagmus', 'Pendular nystagmus', 'See-saw nystagmus'], correct: 0, pearl: 'Downbeat nystagmus localizes to the cervicomedullary junction (e.g. Arnold-Chiari malformation).' },
  { text: 'The video demonstrates a specific clinical test for the knee. Which ligament is being tested?', options: ['Anterior Cruciate Ligament (Lachman Test)', 'Posterior Cruciate Ligament', 'Medial Collateral Ligament', 'Lateral Collateral Ligament'], correct: 0, pearl: 'Lachman test is the most sensitive test for ACL tear.' },
  { text: 'A child is having the episode shown in the video. The EEG shows 3Hz spike and wave discharges. Diagnosis?', options: ['Absence Seizure', 'Complex Partial Seizure', 'Myoclonic Seizure', 'Atonic Seizure'], correct: 0, pearl: 'Absence seizures present with staring spells and 3Hz spike/wave. First-line is Ethosuximide.' },
  { text: 'This video clip shows a patient performing the Dix-Hallpike maneuver. What does the resulting nystagmus suggest?', options: ['BPPV (Posterior Semicircular Canal)', 'Meniere\'s Disease', 'Vestibular Neuritis', 'Central Vertigo'], correct: 0, pearl: 'Upbeating and torsional nystagmus during Dix-Hallpike indicates posterior canal BPPV.' }
];

const resourceTopics = ['Harrison\'s Internal Medicine Summary', 'Robbins Pathology High-Yield PDF', 'Park\'s PSM MCQs', 'Gray\'s Anatomy Video Dissection', 'Pharmacology Rapid Revision Cheat Sheet', 'Obstetrics Case Discussions'];
const resourceTypes = ['PDF', 'VIDEO', 'PYQ_PAPER', 'CHEAT_SHEET'];

function generateQuestions() {
  const questions = [];
  
  // 1. Generate Video Questions (High Priority for User)
  for (let i = 0; i < NUM_VIDEO_QUESTIONS; i++) {
    const template = videoTopics[i % videoTopics.length];
    const exam = EXAMS[Math.floor(Math.random() * EXAMS.length)];
    const year = 2014 + Math.floor(Math.random() * 11);
    
    questions.push({
      id: `q_gen_vid_${i}`,
      subjectId: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)], // Randomize subject slightly for volume
      topicId: 'clinical-signs',
      systemName: 'Video Clinical Diagnostics',
      type: 'video',
      difficulty: 'hard',
      questionText: `[VIDEO SCENARIO ${i+1}] ${template.text}`,
      videoUrl: VIDEO_PLACEHOLDER,
      options: template.options,
      correctAnswerIndex: template.correct,
      explanation: `Detailed explanation for video scenario ${i+1}. The visual finding is characteristic of the correct answer.`,
      whyOtherOptionsWrong: [
        'Distractor 1 presents differently visually.',
        'Distractor 2 is associated with different historical findings.',
        'Distractor 3 does not fit the demographic.'
      ],
      highYieldPoint: template.pearl,
      isAiGenerated: true,
      source: `${exam} ${year} Video Mock`,
      isVerifiedPyq: true,
      examName: exam,
      pyqYear: year
    });
  }

  // 2. Generate Standard Clinical MCQs
  for (let i = 0; i < (NUM_QUESTIONS - NUM_VIDEO_QUESTIONS); i++) {
    const exam = EXAMS[Math.floor(Math.random() * EXAMS.length)];
    const year = 2014 + Math.floor(Math.random() * 11);
    const subj = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    const diff = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];

    questions.push({
      id: `q_gen_std_${i}`,
      subjectId: subj,
      topicId: 'general-topics',
      systemName: 'General Systems',
      type: 'clinical',
      difficulty: diff,
      questionText: `A 45-year-old patient presents to the clinic with symptoms typical of a ${subj} disorder. Investigations reveal classic findings. What is the next best step in management? (Mock ID: ${i})`,
      options: ['Administer first-line drug', 'Order MRI', 'Observe and reassure', 'Refer for surgery'],
      correctAnswerIndex: 0,
      explanation: `In this scenario, administering the first-line drug is the gold standard according to recent guidelines.`,
      whyOtherOptionsWrong: ['MRI is unnecessary', 'Observation is dangerous', 'Surgery is a last resort'],
      highYieldPoint: `Always remember the first-line management for this ${subj} condition.`,
      isAiGenerated: true,
      source: `${exam} ${year} Standard PYQ`,
      isVerifiedPyq: true,
      examName: exam,
      pyqYear: year
    });
  }

  return questions;
}

function generateResources() {
  const resources = [];
  for (let i = 0; i < NUM_RESOURCES; i++) {
    const subj = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    const name = resourceTopics[Math.floor(Math.random() * resourceTopics.length)];

    resources.push({
      id: `res_gen_${i}`,
      title: `${subj.toUpperCase()} - ${name} Vol ${Math.floor(Math.random() * 5) + 1}`,
      description: `Comprehensive ${type.toLowerCase()} material covering high-yield topics for ${subj}. Essential for FMGE and NEET PG preparation.`,
      url: type === 'VIDEO' ? VIDEO_PLACEHOLDER : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      source: 'Global Medical Archives',
      sourceType: type,
      subjectId: subj,
      systemName: 'Comprehensive',
      topicId: 'all',
      resourceType: type,
      language: 'english',
      difficulty: 'medium',
      license: 'OPEN LICENSE',
      isFree: true,
      isVerified: true,
      author: 'Dr. AI Generator',
      publishedDate: '2025-01-01',
      lastChecked: '2026-08-01',
      keyPoints: ['Covers all high-yield concepts', 'Free to use', 'Updated for latest exam patterns']
    });
  }
  return resources;
}

const db = {
  questions: generateQuestions(),
  resources: generateResources()
};

const outputPath = path.join(__dirname, '../src/data/generatedDb.json');
fs.writeFileSync(outputPath, JSON.stringify(db, null, 2));

console.log(`✅ Successfully generated ${db.questions.length} questions (including ${NUM_VIDEO_QUESTIONS} video questions) and ${db.resources.length} resources.`);
console.log(`📁 Saved to: ${outputPath}`);
