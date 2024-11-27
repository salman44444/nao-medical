// /pages/api/translate.js (for older Next.js versions)
// OR
// /app/api/translate/route.js (for Next.js 13+ with app directory)

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Speech Translation App',
    },
    defaultQuery: {
        model: 'meta-llama/llama-3.1-405b-instruct:free',
    },
});

export async function POST(req) {
    try {
        const { text, sourceLanguage, targetLanguage } = await req.json();
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Respond only with the translation.`,
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
            model: 'meta-llama/llama-3.1-405b-instruct:free',
        });

        return NextResponse.json({ translation: response.choices[0].message.content });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to process translation' }, { status: 500 });
    }
}
