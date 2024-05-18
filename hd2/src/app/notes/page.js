"use client";

import { useState, useEffect } from 'react';
import { createNote, getUserNotes, getNoteById, updateNote } from '../api/core/notes/route'; // Ensure correct import path
import SimpleMDEEditor from '@/components/SimpleMDEEditor';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import ChatGPT from '@/components/ChatGPT';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const userId = 'exampleUserId'; // Replace with the actual user ID

  const fetchNotes = async () => {
    const userNotes = await getUserNotes(userId);
    setNotes(userNotes);
  };

  const handleNoteClick = async (noteId) => {
    const note = await getNoteById(noteId);
    setSelectedNote(note);
  };

  const handleSave = async () => {
    await fetchNotes();
    // Keep the current note selected
    const updatedNote = await getNoteById(selectedNote.id);
    setSelectedNote(updatedNote);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <PanelGroup autoSaveId="persistence" direction="horizontal">
      <Panel defaultSize={30} minSize={20}>
        <ul>
          {notes.map((note) => (
            <li key={note.id} onClick={() => handleNoteClick(note.id)}>
              {note.title}
            </li>
          ))}
        </ul>
      </Panel>
      <PanelResizeHandle />
      <Panel minSize={30}>
        {selectedNote && (
          <SimpleMDEEditor
            noteId={selectedNote.id}
            title={selectedNote.title}
            content={selectedNote.content}
            onSave={handleSave}
          />
        )}
      </Panel>
      <PanelResizeHandle />
      <Panel defaultSize={30} minSize={20}>
        <ChatGPT />
      </Panel>
    </PanelGroup>
  );
}
