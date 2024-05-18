"use client";

import { useState } from 'react';
import axios from 'axios';

export default function ChatGPT() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Pressed the button!");

    try {
      const res = await axios.post('/api/core/chatgpt', { prompt });
      console.log("Response data:", res.data);
      setResponse(res.data.response.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('An error occurred while fetching the response.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
          cols="50"
        />
        <button type="submit">Get Response</button>
      </form>
      {response && (
        <div>
          <strong>Response:</strong> <p>{response}</p>
        </div>
      )}
    </div>
  );
}
