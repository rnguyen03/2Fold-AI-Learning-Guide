import { signIn } from "@/lib/auth";

export default function GoogleButton({ provider }) {
  return (
    <form
      className="flex flex-col"
      key={provider.id}
      action={async () => {
        "use server";
        await signIn(provider.id, { redirectTo: "/" });
      }}
    >
      <button className="bg-slate-400 rounded-3xl py-2 px-4" type="submit">
        <span>Sign in with {provider.name}</span>
      </button>
    </form>
  );
}
