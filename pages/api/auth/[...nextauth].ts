import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    session({ session, token, user }: any) {
      return session; // The return type will match the one returned in `useSession()`
    },
  },
};

export default NextAuth(authOptions);
