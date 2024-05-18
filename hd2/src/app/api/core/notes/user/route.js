/**
 * This file supports the following methods:
 * POST - Adds a singular Note wrt user
 * Sample Usage: axios.post("/api/core/notes/user", data)
 */

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { DB } from "@/app/firebase";
import { NextResponse } from "next/server";

// Adds a new note
export async function POST(req, res) {
  const data = await req.json();
  const { email, marker, summary, tag, title } = data; // Get the users email
  // if (!email || !marker || !summary || !tag || !title) {
  //   return new NextResponse(JSON.stringify({ err: "one of the fields of the body was empty" }), { status: 409 })
  // }

  try {
    // Get the current user
    let currentUser, currentUserData;
    const userQuery = query(
      collection(DB, "users"),
      where("email", "==", email)
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      throw new Error("That user does not exist");
    }

    userSnapshot.forEach((doc) => {
      currentUser = doc.id;
      currentUserData = doc.data();
    });

    // Add the note into the database with the current user attached
    const newNote = await addDoc(collection(DB, "notes"), {
      marker,
      summary,
      tag,
      title,
      userId: currentUser,
    });

    // Also update the current users list of notes (id)
    await updateDoc(doc(DB, "users", currentUser), {
      notes: [...currentUserData.notes, newNote.id],
    });

    // Return if done successfully
    return new NextResponse(JSON.stringify({}), { status: 201 });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ err }), { status: 400 });
  }
}
