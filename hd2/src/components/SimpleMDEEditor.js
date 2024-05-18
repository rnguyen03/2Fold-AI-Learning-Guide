"use client";

import { useEffect, useRef, useState } from 'react';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import { updateNote } from '@/app/api/core/notes/route'; // Ensure correct import path

const SimpleMDEEditor = ({ noteId, title, content, onSave }) => {
  const textareaRef = useRef(null);
  const simpleMdeRef = useRef(null); // Use useRef to store SimpleMDE instance
  const [editorContent, setEditorContent] = useState(content);

  useEffect(() => {
    if (textareaRef.current && !simpleMdeRef.current) {
      simpleMdeRef.current = new SimpleMDE({
        element: textareaRef.current,
        initialValue: content,
        spellChecker: false,
      });

      simpleMdeRef.current.codemirror.on('change', () => {
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
  }, [content]);

  const handleSave = async () => {
    await updateNote(noteId, { title, content: editorContent });
    onSave();
  };

  return (
    <div>
      <h2>{title}</h2>
      <textarea ref={textareaRef}></textarea>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default SimpleMDEEditor;
