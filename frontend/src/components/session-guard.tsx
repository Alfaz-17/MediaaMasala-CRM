"use client"

import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"

/**
 * SessionGuard — wraps any layout that requires authentication.
 * Watches for the `error: "TokenExpired"` flag that NextAuth sets in the
 * session when the backend JWT has expired, and triggers a clean sign-out.
 */
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    if ((session as any)?.error === "TokenExpired") {
      // Token expired; sign out and redirect with the expired flag so the
      // login page can show a human-friendly banner.
      signOut({ callbackUrl: "/auth/login?error=SessionExpired" })
    }
  }, [session])

  return <>{children}</>
}
