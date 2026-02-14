"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { AccessDenied } from "@/components/access-denied"
import { ReactNode } from "react"

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
  const { hasModule, hasPermission, isAdmin } = usePermissions()

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
