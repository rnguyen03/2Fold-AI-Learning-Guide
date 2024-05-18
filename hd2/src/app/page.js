"use server";
import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import Navbar from "@/components/navigation";
import MyDropzone from "@/components/dropFile";

export default async function Home() {
  const session = await auth();

  return (
    <>


    
    <Navbar/>
    <MyDropzone/>
    <main className="flex flex-col gapy-y-4 justify-center items-center px-12">
      <h1>Welcome to the homepage!</h1>
      <p>User is {!session?.user && "NOT"} logged in</p>
      <Link className="bg-slate-400 rounded-3xl px-4 py-2" href="/auth/sign-in">
        Go Login
      </Link>
      {session?.user && (
        <>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="bg-red-400 rounded-3xl px-4 py-2" type="submit">
              Sign Out
            </button>
          </form>
        </>
      )}
    </main>
    </>
  );
}



