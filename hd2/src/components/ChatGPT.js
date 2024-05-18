"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const GPTResponse = ({ response }) => {
  return (
    <div className="chat chat-start w-full">
      <div className="chat-bubble">{response}</div>
    </div>
  );
};

const UserPrompt = ({ prompt }) => {
  return (
    <div className="chat chat-end w-full">
      <div className="chat-bubble">{prompt}</div>
    </div>
  );
};

const MessageSet = ({ msg }) => {
  return (
    <>
      <GPTResponse response={msg.response} />
      <UserPrompt prompt={msg.prompt} />
    </>
  );
};

export default function ChatGPT() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let objDiv = document.getElementById("messages-list");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post("/api/core/chatgpt", { prompt });
      const message = {
        response: res.data.response.choices[0].message.content,
        prompt,
      };

      setMessages([...messages, message]);
      setIsLoading(false);
      setPrompt("");
    } catch (error) {
      console.error("Error fetching response:", error);
      const message = {
        response: "An error occurred while fetching the response.",
        prompt,
      };
      setMessages([...messages, message]);
    }
  };

  return (
    <div className="flex h-full justify-between flex-col bg-info rounded-2xl">
      <div id="messages-list" className="overflow-y-auto">
        {messages.map((msg, index) => (
          <MessageSet key={index} msg={msg} />
        ))}
        {isLoading && (
          <span class="loading loading-dots loading-lg self-center" />
        )}
      </div>
      <form className="flex flex-col mb-2 mx-2" onSubmit={handleSubmit}>
        <label class="flex justify-center items-center">
          <input
            className="input input-bordered grow resize-none h-16 "
            placeholder="Message your Critter"
            value={prompt}
            disabled={isLoading}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className={`btn btn-circle btn-outline border-none absolute left-auto right-6`}
            type="submit"
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </label>
      </form>
    </div>
  );
}
