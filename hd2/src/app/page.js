"use client";

import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import Navbar from "@/components/navigation";
import ChatGPT from '../components/ChatGPT';
import SimpleMDEEditor from '../components/SimpleMDEEditor'; // Correct import

export default function Home() {
  // const session = await auth();

  return (
    <>
      <main className="flex flex-col gap-y-4 justify-center items-center px-12">
        <h1>Welcome to the homepage!</h1>
        <ChatGPT />
        <SimpleMDEEditor />
      </main>
    </>
  );
}
