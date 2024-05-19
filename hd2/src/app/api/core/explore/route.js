import {
    collection,
    getDocs,
    doc,
    getDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { DB } from "@/app/firebase"; // Adjust the path to your firebase configuration
import { auth } from "@/lib/auth";
import axios from 'axios';

export async function POST(req, res) {
    const data = await req.json();
    const { searchQuery } = data;
    const session = await auth();
    const email = session?.user?.email;

    if (!searchQuery) {
        return new NextResponse(JSON.stringify({ err: "one of the fields of the body was empty" }), { status: 409 });
    }

    try {
        // Query the entire notes collection
        const notesSnapshot = await getDocs(collection(DB, "notes"));
        let notesWithTags = [];

        notesSnapshot.forEach((noteDoc) => {
            const noteData = noteDoc.data();
            notesWithTags.push(`(${noteData.tag}, ${noteDoc.id})`); // Assuming each note document has a 'tag' field
        });

        // Construct the prompt for the GPT API
        const gptPrompt = `I have a collection of notes with their tags as follows: ${notesWithTags.join(', ')}. Please find five notes that are similar to the following search query: "${searchQuery}". I want the result in an array with the Note IDs comma-separated.`;

        // Call the GPT API with the constructed prompt
        const gptResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: gptPrompt }],
                max_tokens: 150,
                n: 1,
                stop: null,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const similarNoteIdsStr = gptResponse.data.choices[0].message.content.trim();

        // Split the string correctly
        const similarNoteIds = similarNoteIdsStr.replace(/[\[\]]/g, '').split(',');

        console.log("similarNotes: ", similarNoteIds);

        // Return the similar notes found by GPT
        return new NextResponse(JSON.stringify(similarNoteIds), { status: 200 });
    } catch (err) {
        console.error(err);
        return new NextResponse(JSON.stringify({ err }), { status: 400 });
    }
}
