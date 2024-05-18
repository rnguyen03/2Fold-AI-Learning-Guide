"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import GoogleButton from "./GoogleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

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
              className="btn btn-ghost item whitespace-nowrap"
              type="submit"
            >
              Sign Out
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
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
