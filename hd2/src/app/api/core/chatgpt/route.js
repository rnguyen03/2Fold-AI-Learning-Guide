import axios from 'axios';
import { NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { DB } from '@/app/firebase';

// Function to add a message to the session
export const addMessageToSession = async (sessionId, message) => {
  try {
    await addDoc(collection(DB, 'sessions', sessionId, 'messages'), message);
  } catch (e) {
    console.error("Error adding message: ", e);
  }
};

// Function to get messages for a session
export const getSessionChat = async (sessionId) => {
  try {
    const q = query(collection(DB, 'sessions', sessionId, 'messages'));
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    return messages;
  } catch (e) {
    console.error("Error getting session chat: ", e);
  }
};

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
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
