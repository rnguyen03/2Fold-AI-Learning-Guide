import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    query,
    where,
  } from "firebase/firestore";
  import { NextResponse } from "next/server";
  import { DB } from "@/app/firebase"; // Adjust the path to your firebase configuration
  import { auth } from "@/lib/auth";
  
  export async function POST(req, res) {
    const data = await req.json();
    const { noteId } = data;
    const session = await auth();
    const email = session?.user?.email;
  
    console.log("noteId: ", noteId);
  
    if (!noteId) {
      return new NextResponse(JSON.stringify({ err: "one of the fields of the body was empty" }), { status: 409 });
    }
  
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
  
      // Check if the noteId is already in the user's notes array
      if (!currentUserData.notes.includes(noteId)) {
        // Update the current user's list of notes (id)
        await updateDoc(doc(DB, "users", currentUser), {
          notes: [...currentUserData.notes, noteId],
        });
      }
  
      // Return if done successfully
      return new NextResponse(JSON.stringify({}), { status: 201 });
    } catch (err) {
      console.error(err);
      return new NextResponse(JSON.stringify({ err }), { status: 400 });
    }
  }
  