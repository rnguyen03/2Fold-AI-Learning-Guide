/**
 * This file supports the following methods:
 * GET - Get all Notes wrt user
 * Sample Usage: axios.get("/api/core/notes/user/0m5lXXjgUmD61hyalKft", data)
 */

import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { DB } from "@/app/firebase";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const userEmail = params.userEmail;
  try {
    const result = [];
    let currentUser;
    let currentUserData;

    // Query user by email
    const userQuery = query(
      collection(DB, "users"),
      where("email", "==", userEmail)
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      throw new Error("That user does not exist");
    }

    // Get user data
    userSnapshot.forEach((doc) => {
      currentUser = doc.id;
      currentUserData = doc.data();
    });

    // Fetch each note using the note IDs in the user's notes array
    for (const noteId of currentUserData.notes) {
      const noteDoc = await getDoc(doc(DB, "notes", noteId));
      if (noteDoc.exists()) {
        result.push({
          id: noteDoc.id,
          ...noteDoc.data(),
        });
      }
    }

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (e) {
    console.error("Error getting notes: ", e);
    return new NextResponse(
      JSON.stringify({ error: "Error getting notes" }),
      { status: 500 }
    );
  }
}
