import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export function usePermissions() {
  const { data: session } = useSession()
  const user = session?.user as any
  const accessToken = user?.accessToken

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["permissions", accessToken],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (!res.ok) throw new Error("Failed to fetch permissions")
      return res.json()
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialData: user?.permissions ? { permissions: user.permissions, user: user } : undefined,
  })

  const permissions = data?.permissions || user?.permissions || []
  const role = data?.user?.role || user?.role

  const hasPermission = useCallback((module: string, action: string) => {
    if (role === 'ADMIN') return true
    if (role === 'UNASSIGNED') return false
    
    return permissions.some(
      (p: any) => p.module === module && p.action === action
    )
  }, [role, permissions])

  const hasModule = useCallback((module: string) => {
    if (role === 'ADMIN') return true
    if (role === 'UNASSIGNED') return false
    
    return permissions.some((p: any) => p.module === module)
  }, [role, permissions])

  return useMemo(() => ({
    hasPermission,
    hasModule,
    role,
    isAdmin: role === 'ADMIN',
    isUnassigned: role === 'UNASSIGNED',
    refreshPermissions: refetch,
    permissions
  }), [hasPermission, hasModule, role, refetch, permissions])
}

