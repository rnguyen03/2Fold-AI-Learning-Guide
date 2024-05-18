/**
 * This file supports the following methods:
 * GET - Get all Notes wrt user
 * Sample Usage: axios.get("/api/core/notes/user/0m5lXXjgUmD61hyalKft", data)
 */

import { collection, getDocs, query, where } from "firebase/firestore";
import { DB } from "@/app/firebase";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const userEmail = params.userEmail;
  try {
    const result = [];
    let currentUser;
    const userQuery = query(
      collection(DB, "users"),
      where("email", "==", userEmail)
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      throw new Error("That user does not exist");
    }

    userSnapshot.forEach((doc) => {
      currentUser = doc.id;
    });

    const notesQuery = query(
      collection(DB, "notes"),
      where("userId", "==", currentUser)
    );
    const notesSnapshot = await getDocs(notesQuery);
    notesSnapshot.forEach((doc) => {
      const noteData = doc.data();

      result.push({
        id: doc.id,
        ...noteData,
      });
    });

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (e) {
    console.error("Error getting notes: ", e);
  }
}
