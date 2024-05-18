"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import GoogleButton from "./GoogleButton";

export default function SignInOutButton() {
  const { data: session, status } = useSession();

  return (
    <>
      {session?.user ? (
        <>
          <form
            action={() => {
              signOut();
            }}
          >
            <button
              className="bg-red-400 rounded-3xl px-4 py-2 whitespace-nowrap"
              type="submit"
            >
              Sign Out
            </button>
          </form>
        </>
      ) : (
        <>
          <GoogleButton />
        </>
      )}
    </>
  );
}
