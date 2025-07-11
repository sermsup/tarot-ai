 import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",       // Use JWT session
    maxAge: 5 * 60,       // Session valid for 5 minutes
  },
  jwt: {
    maxAge: 5 * 60,       // JWT token valid for 5 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

