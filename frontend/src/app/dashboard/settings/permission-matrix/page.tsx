"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import React from "react"

interface Role {
  id: number
  name: string
  code: string
  departmentId: number | null
}

interface Department {
  id: number
  name: string
  code: string
}

interface Permission {
  id: number
  module: string
  action: string
  scopeType: string
  description: string
}

export default function PermissionMatrixPage() {
  const { data: session } = useSession()
  const [roles, setRoles] = useState<Role[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDeptId, setSelectedDeptId] = useState<string>("all")
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [matrix, setMatrix] = useState<Record<number, number[]>>({}) // { roleId: [permIds] }
  const [loading, setLoading] = useState(true)
  const [savingRoleId, setSavingRoleId] = useState<number | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get("/admin/permissions-matrix")
      
      setRoles(data.roles)
      setPermissions(data.permissions)
      setMatrix(data.matrix)
      
      // Fetch departments separately as they are not part of the matrix endpoint but needed for filter
      const deptsData = await apiClient.get("/admin/departments")
      setDepartments(deptsData)
    } catch (err) {
      console.error("Error fetching matrix data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) fetchData()
  }, [session])

  const togglePermission = (roleId: number, permId: number) => {
    setMatrix(prev => {
      const currentPerms = prev[roleId] || []
      const newPerms = currentPerms.includes(permId)
        ? currentPerms.filter(id => id !== permId)
        : [...currentPerms, permId]
      return { ...prev, [roleId]: newPerms }
    })
  }

  const saveRolePermissions = async (roleId: number) => {
    setSavingRoleId(roleId)
    try {
      await apiClient.post(`/admin/roles/${roleId}/permissions/sync`, { 
        permissionIds: matrix[roleId] 
      })
      alert("Permissions successfully updated for " + roles.find(r => r.id === roleId)?.name)
    } catch (err: any) {
      console.error("Error saving perms:", err)
      alert(err.message || "Failed to save permissions")
    } finally {
      setSavingRoleId(null)
    }
  }

  // Filter roles based on selected department
  const filteredRoles = roles.filter(role => 
    selectedDeptId === "all" || role.departmentId === parseInt(selectedDeptId)
  )

  // Group permissions by module and action
  // Result: { module: { action: [Permission records with different scopeTypes] } }
  const groupedMatrix = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = {}
    if (!acc[perm.module][perm.action]) acc[perm.module][perm.action] = []
    acc[perm.module][perm.action].push(perm)
    return acc
  }, {} as Record<string, Record<string, Permission[]>>)

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">App Permissions</h1>
          <p className="text-muted-foreground text-xs font-medium mt-1">Define exactly what each job role can see and do in the system.</p>
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Filter Dept:</Label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="h-9 rounded-lg border border-border/40 bg-card px-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none min-w-[160px] text-center"
          >
            <option value="all">🌐 All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id.toString()}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/40">
              <th className="p-6 text-left min-w-[320px]">
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-1">Module & Action</span>
              </th>
              {filteredRoles.map(role => (
                <th key={role.id} className="p-6 text-center min-w-[180px] border-l border-border/10">
                  <div className="space-y-4">
                    <p className="font-bold text-xs text-foreground tracking-tight px-2">{role.name}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-[9px] font-bold uppercase tracking-widest rounded-lg px-4 border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
                      disabled={savingRoleId === role.id}
                      onClick={() => saveRolePermissions(role.id)}
                    >
                      {savingRoleId === role.id ? "Saving..." : "Save Role"}
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {Object.entries(groupedMatrix).map(([module, actions]) => (
              <React.Fragment key={module}>
                <tr className="bg-primary/[0.03]">
                  <td colSpan={filteredRoles.length + 1} className="px-6 py-3 font-black text-[10px] text-primary uppercase tracking-[0.2em] bg-primary/10 border-y border-border/20">
                    <div className="flex items-center gap-2">
                       <span className="opacity-70 text-xs">📂</span>
                       <span>{module} System</span>
                    </div>
                  </td>
                </tr>
                {Object.entries(actions).map(([action, perms]) => (
                  <tr key={action} className="group hover:bg-muted/20 transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground/90 text-[13px] tracking-tight mb-1 capitalize">
                          {action.replace('-', ' ')} {module}
                        </span>
                        <span className="text-[9px] text-muted-foreground/50 font-medium leading-relaxed">
                          Determines visibility scope for {action}ing record data.
                        </span>
                      </div>
                    </td>
                    {filteredRoles.map(role => {
                      const activePermIdForRole = matrix[role.id]?.find(mId => perms.some(p => p.id === mId))
                      
                      return (
                        <td key={role.id} className="p-6 text-center border-l border-border/10">
                          <div className="flex flex-col items-center gap-3">
                            <select
                              className="w-full max-w-[140px] text-[10px] font-bold bg-muted/40 border-border/30 rounded-md p-1.5 focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer appearance-none text-center"
                              value={activePermIdForRole || ""}
                              onChange={(e) => {
                                const newId = parseInt(e.target.value)
                                // Remove old ID for this module/action and add new one
                                setMatrix(prev => {
                                  const otherPerms = prev[role.id]?.filter(id => !perms.some(p => p.id === id)) || []
                                  const newPerms = newId ? [...otherPerms, newId] : otherPerms
                                  return { ...prev, [role.id]: newPerms }
                                })
                              }}
                            >
                              <option value="">🚫 No Access</option>
                              {perms.map(p => (
                                <option key={p.id} value={p.id} className="font-bold">
                                  {p.scopeType.toUpperCase()}
                                </option>
                              ))}
                            </select>
                            {activePermIdForRole && (
                              <Badge className="h-[14px] text-[7px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-600 border-none shadow-none">
                                ENABLED
                              </Badge>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredRoles.length === 0 && (
        <div className="p-20 text-center bg-muted/10 rounded-2xl border-2 border-dashed border-border/40">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">No roles found for this department induction.</p>
        </div>
      )}

      <div className="flex justify-between items-center px-6 py-4 bg-muted/20 rounded-xl border border-border/30">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Disabled</span>
           </div>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-widest opacity-60 flex items-center gap-2">
           <span className="text-xs">⚠️</span> Remember to save changes for each role individually
        </p>
      </div>
    </div>
  )
}
