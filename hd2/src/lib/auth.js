import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const providers = [Google];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  // adapter: FirestoreAdapter({
  //   credential: cert({
  //     projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
  //     clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
  //     privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY,
  //   }),
  // }),
});
