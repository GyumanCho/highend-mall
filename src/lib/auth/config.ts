import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Mock users for development (replace with DB lookup in production)
const MOCK_USERS = [
  {
    id: "usr-1",
    name: "Soyeon Kim",
    email: "soyeon@example.com",
    role: "customer" as const,
    tier: "GOLD" as const,
    image: null,
  },
  {
    id: "usr-2",
    name: "Minjae Lee",
    email: "minjae@example.com",
    role: "customer" as const,
    tier: "PLATINUM" as const,
    image: null,
  },
  {
    id: "usr-admin",
    name: "Admin",
    email: "admin@maison.com",
    role: "admin" as const,
    tier: "STANDARD" as const,
    image: null,
  },
] as const;

export const authConfig: NextAuthConfig = {
  providers: [
    // Credentials provider for development
    // TODO: Replace with Google + Kakao OAuth in production
    Credentials({
      name: "Demo Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "soyeon@example.com" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const user = MOCK_USERS.find((u) => u.email === email);
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const mockUser = MOCK_USERS.find((u) => u.email === user.email);
        if (mockUser) {
          token.role = mockUser.role;
          token.tier = mockUser.tier;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as Record<string, unknown>).id = token.sub;
        (session.user as unknown as Record<string, unknown>).role = token.role;
        (session.user as unknown as Record<string, unknown>).tier = token.tier;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
