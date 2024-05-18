// src/app/api/core/chatgpt/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        prompt: prompt,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log(response.data);

    return new NextResponse(JSON.stringify({ response: response.data }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching response:', error);
    console.log(error.response?.data);

    return new NextResponse(
      JSON.stringify({ error: 'Error fetching response from OpenAI' }),
      { status: 500 }
    );
  }
}
