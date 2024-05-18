"use server";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <main className="flex flex-col gapy-y-4 justify-center items-center px-12">
        <h1>Welcome to the homepage!</h1>
        <p>User is {!session?.user && "NOT"} logged in</p>
      </main>
    </>
  );
}
