"use server";

import GoogleButton from "@/components/GoogleButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-2 px-12">
      <GoogleButton provider={{ id: "google", name: "Google" }} />
    </div>
  );
}
