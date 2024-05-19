"use client";
import React, { useState, useRef } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { DB } from "@/app/firebase"; // Adjust the path to your firebase configuration
import { useSession } from "next-auth/react";
import axios from 'axios';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
    const [title, setTitle] = useState('');
    const [marker, setMarker] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const { data: session } = useSession();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const name = file.name;
            const extension = name.slice(name.lastIndexOf('.'));
            const shortName = name.length > 10 ? name.substring(0, 7) + '...' + extension : name;
            setFileName(shortName);
            setFile(file);
            setErrorMessage('');
        } else {
            setFileName('No file chosen');
        }
    };


    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleMarkerClick = (selectedMarker) => {
        setMarker(selectedMarker);
        setErrorMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setErrorMessage('Please choose a file to upload.');
            return;
        }

        if (!marker) {
            setErrorMessage('Please select a marker.');
            return;
        }

        if (!title.trim()) {
            setErrorMessage('Please enter a title.');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result;
                console.log("File content:", content);  // Debugging step

                const email = session.user.email;

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

                // Call GPT to summarize the content
                const res = await axios.post('/api/core/chatgpt', { prompt });
                const summary = res.data.response.choices[0].message.content;

                // Add note metadata and content to Firestore
                const newNoteRef = await addDoc(collection(DB, 'notes'), {
                    title: title,
                    content: content,
                    marker: marker,
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
                setMarker('');
                setErrorMessage('');
            };

            reader.readAsText(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            setErrorMessage('Error uploading file. Please try again.');
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
                        <div className="flex justify-center mb-4 space-x-6">
                        <div className="tooltip tooltip-bottom" data-tip="Filler text"  style={{ position: 'relative', display: 'inline-block' }}>
                        <button 
                                type="button"
                                onClick={() => handleMarkerClick('Crane')}
                                className={`btn btn-circle h-16 w-16 ${marker === 'Crane' ? 'btn-primary' : 'neutral-content'}`}>
                                <img src="/crane_icon.png" alt="Crane Icon" style={{ width: '70px', height: '70px' }} />
                        </button>
                    </div>
                    <div className="tooltip tooltip-bottom" data-tip="Filler text"  style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                            type="button"
                            onClick={() => handleMarkerClick('Ox')}
                            className={`btn btn-circle h-16 w-16 ${marker === 'Ox' ? 'btn-primary' : 'neutral-content'}`}>
                            <img src="/ox_icon.png" alt="ix_icon" style={{ width: '70px', height: '70px' }} />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleMarkerClick('Tiger')}
                        className={`btn ${marker === 'Tiger' ? 'btn-selected' : ''}`}
                    >
                        Tiger
                    </button>
                </div>
                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>

    );
};

export default UploadPage;
