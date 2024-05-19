"use client"

import React, { useState } from 'react';
import { queryNotesByTag,finalizePrompt } from '@/app/promptEng';

export default function PromptComponent(){
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await finalizePrompt(message);
      setResponse(result);
      setError('');
    } catch (error) {
      console.error('Error submitting prompt:', error);
      setError('An error occurred while fetching the response.');
      setResponse('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          rows="4"
          cols="50"
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};
