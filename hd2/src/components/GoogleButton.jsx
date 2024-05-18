"use client";

import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";

export default function GoogleButton() {
  return (
    <form
      className=""
      key={"google"}
      action={() => {
        signIn("google", { redirectTo: "/" });
      }}
    >
      <button className="btn" type="submit">
        <span>Sign in</span>
        <FontAwesomeIcon icon={faArrowRightToBracket} />
      </button>
    </form>
  );
}
