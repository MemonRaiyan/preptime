/**
 * Unified Multi-AI Router for FMGE Master
 * Automatically routes requests to the configured AI engine:
 * 1. Google Gemini (Best for medical context & free tier)
 * 2. xAI Grok (Excellent for reasoning and chat)
 * 3. OpenAI GPT (Standard fallback)
 * 4. Local Rule-Engine (Zero-cost offline fallback)
 */

export interface AIServiceRequest {
  topic: string;
  mode: 'simple' | 'fmge' | 'clinical' | 'rapid' | 'exam' | 'memory' | 'compare';
  language: string;
}

export async function generateAIExtension(req: AIServiceRequest): Promise<string> {
  const { topic, mode, language } = req;
  
  // Extract keys from environment
  const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const grokKey = process.env.GROK_API_KEY || process.env.NEXT_PUBLIC_GROK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // Construct context-rich medical prompt
  const systemPrompt = `You are an expert medical professor and FMGE exam prep coach. 
Explain the topic "${topic}" using the formatting style of "${mode}".
Target Language instruction: Explain in "${language}". If Hinglish, explain in simple Hindi-English blend keeping medical terminologies in English.
Response guidelines:
- Be highly accurate. Prevent hallucinations.
- Cite official standard treatment guidelines (e.g. WHO, Ministry of Health India, Harrison's Internal Medicine, Bailey & Love's Surgery) where appropriate.
- Provide key MCQ traps for FMGE.
- Provide 1 memory trick or mnemonic.`;

  try {
    // 1. Check for xAI Grok API Key
    if (grokKey) {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grokKey}`
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [{ role: 'user', content: systemPrompt }],
          temperature: 0.2
        })
      });
      const data = await res.json();
      return data.choices[0].message.content || 'Error reading Grok response.';
    }

    // 2. Check for Google Gemini API Key (Recommended)
    if (geminiKey) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        }
      );
      const data = await res.json();
      return data.candidates[0].content.parts[0].text || 'Error reading Gemini response.';
    }

    // 3. Check for OpenAI GPT API Key
    if (openaiKey) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: systemPrompt }],
          temperature: 0.2
        })
      });
      const data = await res.json();
      return data.choices[0].message.content || 'Error reading OpenAI response.';
    }
  } catch (error) {
    console.error('AI Routing execution failed, falling back to local database:', error);
  }

  // 4. Default Local rule-based fallback if no key is configured or API errors out
  return getLocalMedicalFallback(topic, mode, language);
}

function getLocalMedicalFallback(topic: string, mode: string, language: string): string {
  // Local rules matching (re-used from frontend layout components to maintain zero-cost offline state)
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('nephrotic') || topicLower.includes('nephritic')) {
    return `[Local Database Fallback - No API Key Found]
Nephrotic Syndrome: Characterized by Proteinuria (>3.5g/day), Hypoalbuminemia, Hyperlipidemia, and severe edema. Minimal Change Disease is the most common cause in children. Treatment involves corticosteroids.
Nephritic Syndrome: Characterized by hematuria, hypertension, oliguria, and RBC casts in urine. Post-streptococcal glomerulonephritis (PSGN) is a classic pediatric case appearing 1-2 weeks after throat/skin infections.`;
  }
  
  if (topicLower.includes('atropine') || topicLower.includes('organophosphate')) {
    return `[Local Database Fallback - No API Key Found]
Atropine blocks muscarinic acetylcholine receptors. Used as the drug of choice to dry up bronchial secretions and bradycardia in Organophosphate Poisoning. Titrate atropine until the pupils dilate, heart rate rises above 80, and the chest is clear on auscultation.`;
  }

  return `[Local Database Fallback - No API Key Found]
Concept Study for: ${topic}
To enable live custom AI explanations, mnemonics, and translations, please add a GEMINI_API_KEY or GROK_API_KEY to your env configurations.`;
}
