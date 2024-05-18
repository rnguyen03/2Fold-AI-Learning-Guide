"use client"
import React, { useState, useRef } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { DB } from "@/app/firebase"; // Adjust the path to your firebase configuration
import { useSession } from "next-auth/react";
import axios from 'axios';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
    const [title, setTitle] = useState('');
    const fileInputRef = useRef(null);
    const session = useSession();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const name = file.name;
            const extension = name.slice(name.lastIndexOf('.'));
            const shortName = name.length > 10 ? name.substring(0, 7) + '...' + extension : name;
            setFileName(shortName);
            setFile(file);
        } else {
            setFileName('No file chosen');
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please choose a file to upload.');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result;
                const email = session.data.user.email;

                // Fetch user data
                const userQuery = query(collection(DB, "users"), where("email", "==", email));
                const userSnapshot = await getDocs(userQuery);
                if (userSnapshot.empty) {
                    throw new Error("That user does not exist");
                }

                let currentUser;
                let currentUserData;
                userSnapshot.forEach((doc) => {
                    currentUser = doc.id;
                    currentUserData = doc.data();
                });

                // Prepare the prompt for GPT summarization
                const prompt = `Please briefly summarize the following content:\n\n${content}`;

                // Call gpt to summarize the content
                const res = await axios.post('/api/core/chatgpt', { prompt });
                const summary = { content: res.data.response.choices[0].message.content };

                // Add note metadata and content to Firestore
                const newNoteRef = await addDoc(collection(DB, 'notes'), {
                    title: title,
                    content: content,
                    marker: 'marker',
                    tag: 'tag',
                    summary: summary,
                });

                // Update user's notes array
                await updateDoc(doc(DB, "users", currentUser), {
                    notes: [...currentUserData.notes, newNoteRef.id],
                });

                alert('File uploaded successfully!');
                setFileName('No file chosen');
                setTitle('');
                setFile(null);
            };

            reader.readAsText(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-5">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <h1 className="block text-gray-700 text-xl font-bold mb-2">Upload Your File</h1>
                <p className="mb-4">Subheading for description or instructions</p>
                <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className="btn w-full"
                        >
                            Choose File
                        </button>
                    </div>
                    <span className="text-center flex-1 mb-3">{fileName}</span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".txt,.md"
                        className="hidden"
                    />
                    <input
                        className="input input-bordered w-full"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default UploadPage;
