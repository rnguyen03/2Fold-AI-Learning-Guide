"use client";

import { useEffect, useRef, useState } from "react";
import SimpleMDE from "simplemde";
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

import "@/app/globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const SimpleMDEEditor = ({ noteId, title, content, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState(false);
  const [success, setSuccess] = useState(null);
  const textareaRef = useRef(null);
  const simpleMdeRef = useRef(null); // Use useRef to store SimpleMDE instance
  const [editorTitle, setEditorTitle] = useState(title);
  const [editorContent, setEditorContent] = useState(content);
  const { data: session } = useSession();

  useEffect(() => {
    setEditorTitle(title);
    setEditorContent(content);

    if (simpleMdeRef.current) {
      simpleMdeRef.current.value(content);
    }

    if (textareaRef.current && !simpleMdeRef.current) {
      simpleMdeRef.current = new SimpleMDE({
        element: textareaRef.current,
        initialValue: content,
        spellChecker: false,
      });

      simpleMdeRef.current.codemirror.on("change", () => {
        setEditorContent(simpleMdeRef.current.value());
      });
    }

    // Cleanup on unmount
    return () => {
      if (simpleMdeRef.current) {
        simpleMdeRef.current.toTextArea();
        simpleMdeRef.current = null;
      }
    };
  }, [title, content]);

  const handleSave = async () => {
    // Prepare the prompt for GPT summarization
    const prompt = `Please briefly summarize the following content:\n\n${editorContent}`;
    const tags = `Please encapsulate the following content into a maximum of five words\n ${editorContent}`

    // Call gpt to summarize the content
    setIsLoading(true);
    setToast(true);
    setSaving("Saving your note...");
    const res = await axios.post("/api/core/chatgpt", { prompt });
    const tag = `Please encapsulate the folowing contents into a maximum of five words\n ${content}`
    const tagline = await axios.post('/api/core/chatgpt', { tag });
    const summary = res.data.response.choices[0].message.content;
    const tagus = tagline.data.response.choices[0].message.content;


    const noteData = {
      title: editorTitle,
      content: editorContent,
      marker: "Crane",
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

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(false);
      }, 3000);
    }
  }, [toast]);

  return (
    <div>
      <div class="toast toast-top toast-center">
        {Boolean(toast) && Boolean(success) && (
          <div class="alert alert-success">
            <span>{success}</span>
          </div>
        )}
        {Boolean(toast) && Boolean(saving) && (
          <div class="alert alert-info">
            <span>{saving}</span>
          </div>
        )}
      </div>
      <input
        type="text"
        value={editorTitle}
        onChange={(e) => setEditorTitle(e.target.value)}
        placeholder="Note Title"
        className="input input-bordered w-full mb-2"
      />
      <textarea ref={textareaRef} />
      <div className="flex justify-between" role="group">
        <button onClick={onSave} className="btn btn-error mt-2">
          <FontAwesomeIcon icon={faXmark} />
          Cancel
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
  );
};

export default SimpleMDEEditor;
