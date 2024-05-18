"use client";

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
      <button
        className="bg-slate-400 rounded-3xl py-2 px-4 whitespace-nowrap"
        type="submit"
      >
        <span>Sign in with Google</span>
      </button>
    </form>
  );
}
