"use client"
import React, { useState, useRef } from 'react';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
    const fileInputRef = useRef(null);

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

    return (
        <div className="container mx-auto p-5">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
                        className="hidden"
                    />
                    <input className="input input-bordered w-full" type="text" placeholder="Title" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default UploadPage;
