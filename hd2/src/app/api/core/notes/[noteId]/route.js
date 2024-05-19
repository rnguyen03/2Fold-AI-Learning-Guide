/**
 * This file supports the API endpoints for the following
 * GET - Gets a singular note
 * PUT - Updates a singular note
 * Sample Usage: axios.get("/api/core/notes/0m5lXXjgUmD61hyalKft")
 * Sample Usage: axios.put("/api/core/notes/0m5lXXjgUmD61hyalKft", data)
 */

import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { DB } from "@/app/firebase";

export async function GET(req, { params }) {
  const noteId = params.noteId;
  try {
    const noteRef = doc(DB, "notes", noteId);
    const noteSnap = await getDoc(noteRef);

    if (noteSnap.exists()) {
      const data = noteSnap.data();
      return new NextResponse(JSON.stringify({ ...data }), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ err: "No note exists!" }), {
        status: 409,
      });
    }
  } catch (e) {
    console.error("Error getting notes: ", e);
    return new NextResponse(JSON.stringify({ err: "No note exists!" }), {
      status: 400,
    });
  }
}

export async function PUT(req, { params }) {
  const noteId = params.noteId;

  const data = await req.json();
  const { marker, summary, tag, title } = data; // Get the users email
  // if (!email || !marker || !summary || !tag || !title) {
  //   return new NextResponse(JSON.stringify({ err: "one of the fields of the body was empty" }), { status: 409 })
  // }

  try {
    const noteRef = doc(DB, "notes", noteId);
    await updateDoc(noteRef, {
      marker,
      summary,
      tag,
      title,
    });
    return new NextResponse(JSON.stringify({}), { status: 200 });
  } catch (err) {
    console.error("Error updating note: ", err);
    return new NextResponse(JSON.stringify({ err }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const noteId = params.noteId;
  try {
    await deleteDoc(doc(DB, "notes", noteId));
    return new NextResponse(JSON.stringify({}), { status: 200 });
  } catch (e) {
    console.error("Error getting notes: ", e);
    return new NextResponse(
      JSON.stringify({ err: "Had issues deleting that note!" }),
      {
        status: 400,
      }
    );
  }
}
