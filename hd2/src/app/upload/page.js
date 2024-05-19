"use client";
import React, { useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { DB } from "@/app/firebase"; // Adjust the path to your firebase configuration
import { useSession } from "next-auth/react";
import axios from "axios";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [title, setTitle] = useState("");
  const [marker, setMarker] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const { data: session } = useSession();
  const [markerDescription, setMarkerDescription] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const name = file.name;
      const extension = name.slice(name.lastIndexOf("."));
      const shortName =
        name.length > 10 ? name.substring(0, 7) + "..." + extension : name;
      setFileName(shortName);
      setFile(file);
      setErrorMessage("");
    } else {
      setFileName("No file chosen");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleMarkerClick = (selectedMarker) => {
    setMarker(selectedMarker);
    setErrorMessage("");
    switch (selectedMarker) {
      case "Crane":
        setMarkerDescription(
          "Crane: Represents your understanding as creative."
        );
        break;
      case "Ox":
        setMarkerDescription(
          "Ox: Represents your understanding as foundational."
        );
        break;
      case "Tiger":
        setMarkerDescription(
          "Tiger: Represents your understanding as knowledgeable."
        );
        break;
      case "Rat":
        setMarkerDescription(
          "Rat: Represents your understanding as courageous."
        );
        break;
      case "Rabbit":
        setMarkerDescription(
          "Rabbit: Represents your understanding as fearful."
        );
        break;
      default:
        setMarkerDescription("");
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage("Please choose a file to upload.");
      return;
    }

    if (!marker) {
      setErrorMessage("Please select a marker.");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Please enter a title.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result;
        console.log("File content:", content); // Debugging step

        const email = session.user.email;

        // Fetch user data
        const userQuery = query(
          collection(DB, "users"),
          where("email", "==", email)
        );
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

        const tag = `Please encapsulate the folowing contents into a maximum of five words\n ${content}`;
        const tagline = await axios.post("/api/core/chatgpt", { tag });
        // Call GPT to summarize the content
        const res = await axios.post("/api/core/chatgpt", { prompt });

        const summary = res.data.response.choices[0].message.content;
        const tagus = tagline.data.response.choices[0].message.content;

        // Add note metadata and content to Firestore
        const newNoteRef = await addDoc(collection(DB, "notes"), {
          title: title,
          content: content,
          marker: marker,
          tag: tagus,
          summary: summary,
        });

        // Update user's notes array
        await updateDoc(doc(DB, "users", currentUser), {
          notes: [...currentUserData.notes, newNoteRef.id],
        });

        alert("File uploaded successfully!");
        setFileName("No file chosen");
        setTitle("");
        setFile(null);
        setMarker("");
        setErrorMessage("");
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-5">
      <form
        className="bg-base-300 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <h1 className="block prose text-xl font-bold mb-2">Upload Your File</h1>
        <p className="mb-4 prose">Give it a title and select your companion!</p>
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
          <span className="text-center flex-1 mb-3 prose">{fileName}</span>
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
          <div
            className="tooltip tooltip-top"
            data-tip="Creative"
            style={{ position: "relative", display: "inline-block" }}
          >
            <button
              type="button"
              onClick={() => handleMarkerClick("Crane")}
              className={`btn btn-circle h-16 w-16 ${
                marker === "Crane" ? "btn-primary" : "neutral-content"
              }`}
            >
              <img
                src="/crane.png"
                alt="Crane Icon"
                style={{ width: "70px", height: "70px" }}
              />
            </button>
          </div>
          <div
            className="tooltip tooltip-top"
            data-tip="Foundational"
            style={{ position: "relative", display: "inline-block" }}
          >
            <button
              type="button"
              onClick={() => handleMarkerClick("Ox")}
              className={`btn btn-circle h-16 w-16 ${
                marker === "Ox" ? "btn-primary" : "neutral-content"
              }`}
            >
              <img
                src="/ox.png"
                alt="ox"
                style={{ width: "70px", height: "70px" }}
              />
            </button>
          </div>
          <div
            className="tooltip tooltip-top"
            data-tip="Knowledgeable"
            style={{ position: "relative", display: "inline-block" }}
          >
            <button
              type="button"
              onClick={() => handleMarkerClick("Tiger")}
              className={`btn btn-circle h-16 w-16 ${
                marker === "Tiger" ? "btn-primary" : "neutral-content"
              }`}
            >
              <img
                src="/tiger.png"
                alt="ix_icon"
                style={{ width: "70px", height: "70px" }}
              />
            </button>
          </div>

          <div
            className="tooltip tooltip-top"
            data-tip="Courageous"
            style={{ position: "relative", display: "inline-block" }}
          >
            <button
              type="button"
              onClick={() => handleMarkerClick("Rat")}
              className={`btn btn-circle h-16 w-16 ${
                marker === "Rat" ? "btn-primary" : "neutral-content"
              }`}
            >
              <img
                src="/rat.png"
                alt="rabbit"
                style={{ width: "70px", height: "70px" }}
              />
            </button>
          </div>

          <div
            className="tooltip tooltip-top"
            data-tip="Fearful"
            style={{ position: "relative", display: "inline-block" }}
          >
            <button
              type="button"
              onClick={() => handleMarkerClick("Rabbit")}
              className={`btn btn-circle h-16 w-16 ${
                marker === "Rabbit" ? "btn-primary" : "neutral-content"
              }`}
            >
              <img
                src="/rabbit.png"
                alt="rabbit"
                style={{ width: "70px", height: "70px" }}
              />
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-2 text-center">
          {markerDescription}
        </p>
        <button type="submit" className="btn btn-primary ">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
