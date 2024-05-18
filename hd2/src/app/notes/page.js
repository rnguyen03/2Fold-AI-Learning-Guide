"use client";

import { useState, useEffect } from 'react';
import { createNote, getUserNotes, getNoteById, updateNote } from '../api/core/notes/route'; // Ensure correct import path
import SimpleMDEEditor from '@/components/SimpleMDEEditor';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import ChatGPT from '@/components/ChatGPT';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [sessionId, setSessionId] = useState(uuidv4());
  const session = useSession();

  const fetchNotes = async () => {
    console.log(session);
    const email = session.data?.user?.email;
    if (!email) return;

    try {
      const response = await axios.get(`/api/core/notes/user/${email}`);
      console.log("Fetched notes:", response.data);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleNoteClick = async (noteId) => {
    const note = await getNoteById(noteId);
    console.log("Selected note:", note);
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
  }, [session]);

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
        <ChatGPT sessionId={sessionId} />
      </Panel>
    </PanelGroup>
  );
}
