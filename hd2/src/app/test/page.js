"use client";

import { useState, useEffect } from 'react';
import { createNote, getUserNotes, updateNote } from '../api/core/notes/route'; // Ensure correct import path

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    marker: '',
    title: '',
    tag: '',
    summary: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const userId = 'exampleUserId'; // Replace with the actual user ID

  const fetchNotes = async () => {
    const userNotes = await getUserNotes(userId);
    setNotes(userNotes);
  };

  const handleCreateNote = async () => {
    await createNote({ ...newNote, userId }); // Ensure the note is associated with the user
    setNewNote({
      marker: '',
      title: '',
      tag: '',
      summary: ''
    });
    setImageFile(null);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <input
        type="text"
        placeholder="Marker"
        value={newNote.marker}
        onChange={(e) => setNewNote({ ...newNote, marker: e.target.value })}
      />
      <input
        type="text"
        placeholder="Title"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Tag"
        value={newNote.tag}
        onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
      />
      <textarea
        placeholder="Summary"
        value={newNote.summary}
        onChange={(e) => setNewNote({ ...newNote, summary: e.target.value })}
      ></textarea>
      <button onClick={handleCreateNote}>Create Note</button>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.summary}</p>
            {/* Implement update functionality as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}
