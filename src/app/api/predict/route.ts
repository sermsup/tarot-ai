// /src/app/api/predict/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not set.');
    return NextResponse.json({ result: 'OpenAI API key not set.' }, { status: 500 });
  }

  try {
    console.log('Prompt sent to OpenAI:', prompt);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a tarot reading assistant. All prediction and Tarot Card interpretations in Thai language only.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });
    const data = await response.json();
    console.log('OpenAI API response:', JSON.stringify(data));
    const result = data.choices?.[0]?.message?.content || 'No prediction.';
    return NextResponse.json({ result });
  } catch (e) {
    console.error('Error contacting OpenAI:', e);
    return NextResponse.json({ result: 'Error contacting OpenAI.' }, { status: 500 });
  }
}
