import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { DB } from "@/app/firebase";
import { NextResponse } from "next/server";

// Function to create a new note
export const createNote = async (data) => {
  try {
    const docRef = await addDoc(collection(DB, "notes"), data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding note: ", e);
  }
};

// Function to get all notes
export const getNotes = async () => {
  try {
    const querySnapshot = await getDocs(collection(DB, "notes"));
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    return notes;
  } catch (e) {
    console.error("Error getting notes: ", e);
  }
};

// Function to get notes by user ID
export const getUserNotes = async (userId) => {
  try {
    const q = query(collection(DB, "notes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    return notes;
  } catch (e) {
    console.error("Error getting user notes: ", e);
  }
};

// Function to update a note
export const updateNote = async (docId, data) => {
  try {
    const docRef = doc(DB, "notes", docId);
    await updateDoc(docRef, data);
  } catch (e) {
    console.error("Error updating note: ", e);
  }
};

// Function to delete a note
export const deleteNote = async (docId) => {
  try {
    const docRef = doc(DB, "notes", docId);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error deleting note: ", e);
  }
};

// Function to get a single note by ID
export const getNoteById = async (noteId) => {
  try {
    const noteDoc = await getDoc(doc(DB, "notes", noteId));
    if (noteDoc.exists()) {
      return { id: noteDoc.id, ...noteDoc.data() };
    } else {
      throw new Error("Note not found");
    }
  } catch (e) {
    console.error("Error getting note: ", e);
  }
};
