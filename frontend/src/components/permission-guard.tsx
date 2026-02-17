"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { AccessDenied } from "@/components/access-denied"
import { ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface PermissionGuardProps {
  module: string
  action?: string
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ 
  module, 
  action, 
  children, 
  fallback = <AccessDenied /> 
}: PermissionGuardProps) {
  const { hasModule, hasPermission, isAdmin, isLoading } = usePermissions()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 animate-in fade-in duration-500">
        <Loader2 className="h-8 w-8 text-primary animate-spin opacity-20" />
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 animate-pulse">
          Verifying Credentials
        </p>
      </div>
    )
  }

  if (isAdmin) {
    return <>{children}</>
  }

  // If action is provided, check specific permission
  if (action) {
    if (!hasPermission(module, action)) {
      return <>{fallback}</>
    }
  } 
  // Otherwise just check module access
  else {
    if (!hasModule(module)) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}
