"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getSessionChat, addMessageToSession } from '@/app/api/core/chatgpt/route'; // Ensure correct import path

export default function ChatGPT() {
  const [prompt, setPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [sessionId, setSessionId] = useState(uuidv4());

  useEffect(() => {
    // Fetch chat messages for the current session when the component mounts
    const fetchChatMessages = async () => {
      const messages = await getSessionChat(sessionId);
      setChatMessages(messages);
    };
    fetchChatMessages();
  }, [sessionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Pressed the button!");

    const userMessage = { role: 'user', content: prompt };
    setChatMessages([...chatMessages, userMessage]);
    setPrompt('');

    try {
      const res = await axios.post('/api/core/chatgpt', { prompt });
      console.log("Response data:", res.data);
      const botMessage = { role: 'assistant', content: res.data.response.choices[0].message.content };
      setChatMessages([...chatMessages, userMessage, botMessage]);

      // Save both user and bot messages to the session
      await addMessageToSession(sessionId, userMessage);
      await addMessageToSession(sessionId, botMessage);
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = { role: 'assistant', content: 'An error occurred while fetching the response.' };
      setChatMessages([...chatMessages, userMessage, errorMessage]);
      await addMessageToSession(sessionId, errorMessage);
    }
  };

  return (
    <div>
      <div>
        {chatMessages.map((message, index) => (
          <div key={index} className={message.role}>
            <strong>{message.role === 'user' ? 'You' : 'Bot'}:</strong> <p>{message.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
          cols="50"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
