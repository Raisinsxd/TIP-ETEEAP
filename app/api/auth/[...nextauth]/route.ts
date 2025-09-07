import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/",   // send failed sign-ins back home
    error: "/",    // any error redirects to home
  },
  callbacks: {
  async jwt({ token, account, profile }) {
    // When user signs in, attach Google profile data to token
    if (account && profile) {
      token.email = (profile as any)?.email ?? token.email;
      token.name = (profile as any)?.name ?? token.name;
      token.picture = (profile as any)?.picture ?? null;
    }
    return token;
  },

  async session({ session, token }) {
    // Expose token values in session
    if (session.user) {
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.image = token.picture as string | null;
    }
    return session;
  },

  async signIn({ profile }) {
    // If no email, redirect user back home
    if (!(profile as any)?.email) {
      return "/";
    }
    return true;
  },
},

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
