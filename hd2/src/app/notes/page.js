"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SimpleMDEEditor from "@/components/SimpleMDEEditor";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import ChatGPT from "@/components/ChatGPT";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import NoteSetup from "@/components/three/NoteSetup";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchNotes = async () => {
    if (!session?.user?.email) return;

    try {
      setIsLoading(true);
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
      setIsLoading(false);
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
    setSelectedNote(null);
  };

  const handleCreateNewNote = () => {
    setSelectedNote({ id: null, title: "", content: "" });
  };

  useEffect(() => {
    fetchNotes();
  }, [session]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  console.log(selectedNote);
  return (
    <main className="z-10 flex flex-col gap-y-4 justify-center items-center h-content">
      <PanelGroup autoSaveId="persistence" direction="horizontal">
        <Panel className="rounded-2xl p-2 pr-0" defaultSize={30} minSize={25}>
          <div className=" flex justify-between items-center" role="group">
            <p className="prose-2xl font-bold text-center">Your Notes</p>
            <button onClick={handleCreateNewNote} className="btn mb-2">
              <FontAwesomeIcon icon={faPlus} />
              Create New Note
            </button>
          </div>
          <div className="divider my-0 h-0.5" />
          <ul className="menu bg-base-200 rounded-2xl">
            {!isLoading ? (
              notes.length > 0 ? (
                notes.map((note) => (
                  <li
                    tabIndex={0}
                    key={note.id}
                    onClick={() => handleNoteClick(note.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleNoteClick(note.id);
                      }
                    }}
                  >
                    <a className="prose">{note.title}</a>
                  </li>
                ))
              ) : (
                <p className="prose">No notes were found</p>
              )
            ) : (
              <>
                <span className="loading loading-dots loading-md"></span>
              </>
            )}
          </ul>
        </Panel>
        <PanelResizeHandle
          className="w-0.5 divider-horizontal bg-base-200"
          tabIndex={-1}
        />
        <Panel className="p-2" minSize={30}>
          {Boolean(selectedNote) ? (
            <SimpleMDEEditor
              key={selectedNote.id}
              noteId={selectedNote.id}
              title={selectedNote.title}
              content={selectedNote.content}
              onSave={handleSave}
            />
          ) : (
            <>
              <p className="text-xl prose">Get Started editing your notes!</p>
            </>
          )}
        </Panel>
        <PanelResizeHandle
          className="w-0.5 divider-horizontal bg-base-200 mr-0"
          tabIndex={-1}
        />
        <Panel defaultSize={30} minSize={25}>
          <PanelGroup direction="vertical">
            <Panel minSize={35}>
              <div
                className="z-20"
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <NoteSetup cursorPosition={cursorPosition} />
              </div>
            </Panel>
            <PanelResizeHandle
              tabIndex={-1}
              className="h-0.5 divider bg-base-200 mr-0"
            />
            <Panel defaultSize={65} minSize={50} className="h-full pl-0">
              <ChatGPT sessionId={sessionId} />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </main>
  );
}
