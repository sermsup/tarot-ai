import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // Replace with your OpenAI API key
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ result: 'OpenAI API key not set.' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a tarot reading assistant. Answer in both English and Thai.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1200,
        temperature: 0.8,
      }),
    });
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'No prediction.';
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ result: 'Error contacting OpenAI.' }, { status: 500 });
  }
}
