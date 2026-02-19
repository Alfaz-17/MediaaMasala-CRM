"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { usePermissions } from "@/hooks/use-permissions"
import { Users, LayoutGrid } from "lucide-react"

import { HierarchySelector } from "@/components/dashboard/hierarchy-selector"

interface ManagementFiltersProps {
  selectedDept: string
  setSelectedDept: (id: string) => void
  selectedEmp: string
  setSelectedEmp: (id: string, recursive: boolean) => void
  isRecursive: boolean
  module: string
}

export function ManagementFilters({ 
  selectedDept, 
  setSelectedDept, 
  selectedEmp, 
  setSelectedEmp,
  isRecursive,
  module
}: ManagementFiltersProps) {
  const { role, permissions } = usePermissions()
  
  // Find current module scope
  const modulePerm = permissions.find((p: any) => p.module === module && p.action === 'view')
  const scope = role === 'ADMIN' ? 'all' : (modulePerm?.scope || 'own')

  const isAdmin = role === 'ADMIN'
  const isManager = scope === 'department' || scope === 'team' || isAdmin

  // Fetch departments - Only for Admin
  const { data: departments = [] } = useQuery({
    queryKey: ["admin-departments"],
    queryFn: () => apiClient.get("/admin/departments"),
    enabled: isAdmin
  })

  if (!isManager) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isAdmin && (
        <div className="relative min-w-[140px]">
          <LayoutGrid className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 h-3.5 w-3.5" />
          <select
            value={selectedDept}
            onChange={(e) => { 
                setSelectedDept(e.target.value); 
                setSelectedEmp("all", false); 
            }}
            className="flex h-9 w-full rounded-lg border border-border/40 bg-card pl-8 pr-3 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer shadow-sm transition-all hover:border-primary/30"
          >
            <option value="all">All Departments</option>
            {Array.isArray(departments) && departments.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[8px]">▼</div>
        </div>
      )}

      <HierarchySelector 
        selectedId={selectedEmp}
        onSelect={setSelectedEmp}
        isRecursive={isRecursive}
      />
    </div>
  )
}
