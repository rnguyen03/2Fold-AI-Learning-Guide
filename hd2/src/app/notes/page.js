"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SimpleMDEEditor from "@/components/SimpleMDEEditor";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import ChatGPT from "@/components/ChatGPT";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [sessionId, setSessionId] = useState(uuidv4());
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchNotes = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await axios.get(
        `/api/core/notes/user/${session.user.email}`
      );
      setNotes(response.data);
      console.log("Search params:", searchParams.get("noteId"));
      if (searchParams.has("noteId")) {
        const noteId = searchParams.get("noteId");
        console.log("Note ID from search params:", noteId);
        setSelectedNote(response.data.find((note) => note.id === noteId));
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleNoteClick = async (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    setSelectedNote(note);
  };

  const handleSave = async () => {
    await fetchNotes();
    const updatedNote = notes.find((note) => note.id === selectedNote.id);
    setSelectedNote(updatedNote);
  };

  const handleCreateNewNote = () => {
    setSelectedNote({ id: null, title: "", content: "" });
  };

  useEffect(() => {
    fetchNotes();
  }, [session]);
  console.log(selectedNote)
  return (
    <main className="z-10 flex flex-col gap-y-4 justify-center items-center h-content">
      <PanelGroup autoSaveId="persistence" direction="horizontal">
        <Panel defaultSize={30} minSize={20}>
          <button
            onClick={handleCreateNewNote}
            className="btn btn-primary mb-2"
          >
            Create New Note
          </button>
          <ul>
            {notes.map((note) => (
              <li key={note.id} onClick={() => handleNoteClick(note.id)}>
                {note.title}
              </li>
            ))}
          </ul>
        </Panel>
        <PanelResizeHandle />
        <Panel className="p-2" minSize={30}>
          {Boolean(selectedNote) && (
            <SimpleMDEEditor
              key={selectedNote.id} // Adding a key here to force re-render
              noteId={selectedNote.id}
              title={selectedNote.title}
              content={selectedNote.content}
              onSave={handleSave}
            />
          )}
        </Panel>
        <PanelResizeHandle />
        <Panel className="h-full" defaultSize={30} minSize={20}>
          <ChatGPT sessionId={sessionId} />
        </Panel>
      </PanelGroup>
    </main>
  );
}
