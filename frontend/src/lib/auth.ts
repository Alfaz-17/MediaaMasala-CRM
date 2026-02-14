import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
          const loginUrl = apiBase.endsWith('/api') ? `${apiBase}/auth/login` : `${apiBase}/api/auth/login`

          const res = await fetch(loginUrl, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          })

          const data = await res.json()

          if (res.ok && data.user) {
            return {
              ...data.user,
              id: data.user.id,
              token: data.token,
              permissions: data.permissions
            }
          }
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {

      if (token && session.user) {
        session.user.role = token.role;
        session.user.department = token.department;
        session.user.permissions = token.permissions;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
