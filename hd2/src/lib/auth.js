import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { app } from "@/app/firebase";
import { cert } from "firebase-admin/app";

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
    allowDangerousEmailAccountLinking: true,
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
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY,
    }),
  }),
});
