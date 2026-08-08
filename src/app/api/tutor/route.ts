import { NextRequest, NextResponse } from 'next/server';
import { generateAIExtension, AIServiceRequest } from '../../../utils/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as AIServiceRequest;
    
    if (!body || !body.topic) {
      return NextResponse.json({ error: 'Missing topic in request body.' }, { status: 400 });
    }

    const aiResponse = await generateAIExtension(body);
    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error('API Error in AI Tutor route:', error);
    return NextResponse.json({ error: 'Internal server error processing AI tutor request.' }, { status: 500 });
  }
}
