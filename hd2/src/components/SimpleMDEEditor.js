"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "simplemde/dist/simplemde.min.css";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { DB } from "@/app/firebase"; // Ensure correct import path
import { useSession } from "next-auth/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import "@/app/globals.css";

const ANIMALS = ["Crane", "Rabbit", "Ox", "Tiger", "Mouse"];

// const SimpleMDE = dynamic(() => import("simplemde"), {
//   ssr: false,
//   loading: () => <p>Loading editor...</p>,
// });

function TabButton({ btnValue, activeTab, onClick }) {
  return (
    <button
      onClick={onClick}
      value={btnValue}
      className={`join-item btn ${activeTab === btnValue ? "btn-active" : ""}`}
    >
      {btnValue}
    </button>
  );
}

const SimpleMDEEditor = ({ noteId, title, content, onSave, pet }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [companion, setCompanion] = useState(pet ?? "");
  const [toast, setToast] = useState(false);
  const [saving, setSaving] = useState(null);
  const [success, setSuccess] = useState(null);
  const textareaRef = useRef(null);
  const simpleMdeRef = useRef(null); // Use useRef to store SimpleMDE instance
  const [editorTitle, setEditorTitle] = useState(title);
  const [editorContent, setEditorContent] = useState(content);
  const [isSetup, setIsSetup] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setEditorTitle(title);
    setEditorContent(content);

    if (simpleMdeRef?.current) {
      simpleMdeRef?.current?.value(content);
    }

    const initializeEditor = async () => {
      if (textareaRef.current && !simpleMdeRef.current) {
        const SimpleMDE = (await import("simplemde")).default;
        simpleMdeRef.current = new SimpleMDE({
          element: textareaRef.current,
          initialValue: content,
          spellChecker: false,
        });

        simpleMdeRef.current.codemirror.on("change", () => {
          setEditorContent(simpleMdeRef.current.value());
        });
      } else if (simpleMdeRef.current) {
        simpleMdeRef.current.value(content);
      }
      setIsSetup(true);
      const elem = document.getElementById("editor-ide");
      elem.style.display = "none";
    };

    if (typeof window !== "undefined" && !isSetup) {
      initializeEditor();
    }

    // Cleanup on unmount
    return () => {
      if (simpleMdeRef.current) {
        simpleMdeRef.current?.toTextArea();
        simpleMdeRef.current = null;
      }
    };
  }, [title, content, isSetup]);

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
      }, 3000);
    }
  }, [toast]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/core/notes/${noteId}`);
      onSave();
      setToast(true);
      setSuccess("Successfully deleted your note!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Prepare the prompt for GPT summarization
    const prompt = `Please briefly summarize the following content:\n\n${editorContent}`;
    const tagsPrompt = `Please encapsulate the following content into a maximum of five words\n ${editorContent}`;

    // Call gpt to summarize the content
    setIsLoading(true);
    setToast(true);
    setSaving("Saving your note...");
    const res = await axios.post("/api/core/chatgpt", { prompt });
    const tagline = await axios.post("/api/core/chatgpt", {
      prompt: tagsPrompt,
    });
    const summary = res.data.response.choices[0].message.content;
    const tagus = tagline.data.response.choices[0].message.content;

    const noteData = {
      title: editorTitle,
      content: editorContent,
      marker: companion,
      summary: summary,
      tag: tagus,
    };

    if (noteId) {
      // Update existing note

      await updateDoc(doc(DB, "notes", noteId), noteData);
    } else {
      // Create new note

      const newNoteRef = await addDoc(collection(DB, "notes"), noteData);

      noteData.id = newNoteRef.id;

      // Fetch the current user's data
      const email = session?.user?.email;
      const userQuery = query(
        collection(DB, "users"),
        where("email", "==", email)
      );
      const userSnapshot = await getDocs(userQuery);
      let currentUser;
      let currentUserData;
      userSnapshot.forEach((doc) => {
        currentUser = doc.id;
        currentUserData = doc.data();
      });

      // Update user's notes array
      await updateDoc(doc(DB, "users", currentUser), {
        notes: [...currentUserData.notes, newNoteRef.id],
      });
    }

    onSave();
    setIsLoading(false);
    setToast(true);
    setSuccess("Successfully saved your note!");
  };

  const handleCompanionChange = (e) => {
    if (typeof window !== "undefined") {
      setCompanion(e.target.value);
    }
  };

  const handleOpenCompanionModal = () => {
    if (typeof window !== "undefined") {
      document.getElementById("companionModal").showModal();
    }
  };

  return (
    <>
      <div className={`flex flex-col gap-y-2 ${isLoading ? "opacity-50" : ""}`}>
        <div className="toast toast-top toast-center">
          {Boolean(toast) && Boolean(success) && (
            <div className="alert alert-success">
              <span>{success}</span>
            </div>
          )}
          {Boolean(toast) && Boolean(saving) && (
            <div className="alert alert-info">
              <span>{saving}</span>
            </div>
          )}
        </div>
        <button
          disabled={isLoading}
          onClick={handleDelete}
          className="btn btn-error max-w-[30%]"
        >
          <FontAwesomeIcon icon={faTrashCan} /> Delete
        </button>
        <input
          type="text"
          value={editorTitle}
          onChange={(e) => setEditorTitle(e.target.value)}
          placeholder="Note Title"
          className="input input-bordered w-full mb-2"
        />
        <textarea id="editor-ide" ref={textareaRef} />
        <div className="flex justify-between" role="group">
          <button
            disabled={isLoading}
            onClick={onSave}
            className="btn btn-error mt-2"
          >
            <FontAwesomeIcon icon={faXmark} />
            Cancel
          </button>
          <button
            onClick={handleOpenCompanionModal}
            className="btn btn-accent mt-2"
          >
            Select Your Companion
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn btn-primary mt-2"
          >
            Save Note
          </button>
        </div>
      </div>

      <dialog id="companionModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Select Your <strong>Study Companion</strong>
          </h3>

          <div className="join">
            {ANIMALS.map((animal) => (
              <TabButton
                key={animal}
                btnValue={animal}
                activeTab={companion}
                onClick={handleCompanionChange}
              />
            ))}
          </div>

          <div className="modal-action">
            <form method="dialog" className="w-full flex justify-between">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-error">Cancel</button>
              <button className="btn btn-success">Confirm</button>
            </form>
          </div>
        </div>
        {/* click outside close */}
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
};

export default SimpleMDEEditor;
