"use client";

import { useEffect, useRef } from 'react';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';

const SimpleMDEEditor = () => {
  const textareaRef = useRef(null);
  const simpleMdeRef = useRef(null); // Use useRef to store SimpleMDE instance

  useEffect(() => {
    if (textareaRef.current && !simpleMdeRef.current) {
      simpleMdeRef.current = new SimpleMDE({ element: textareaRef.current });
    }

    // Cleanup on unmount
    return () => {
      if (simpleMdeRef.current) {
        simpleMdeRef.current.toTextArea();
        simpleMdeRef.current = null;
      }
    };
  }, []);

  return (
    <textarea ref={textareaRef}></textarea>
  );
};

export default SimpleMDEEditor;
