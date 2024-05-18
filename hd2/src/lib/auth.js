import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { app } from "@/app/firebase";

const providers = [
  Google({
    async profile(profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        image: profile.image,
        notes: [],
      };
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  adapter: FirestoreAdapter(app),
});
