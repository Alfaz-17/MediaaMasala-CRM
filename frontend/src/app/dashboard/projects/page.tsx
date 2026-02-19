"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Calendar, User } from "lucide-react"
import { PermissionGuard } from "@/components/permission-guard"
import { useQuery } from "@tanstack/react-query"
import { ManagementFilters } from "@/components/dashboard/management-filters"

interface Project {
  id: number
  name: string
  description: string
  status: string
  leadId?: string
  lead?: {
    name: string
    company?: string
  }
  createdAt: string
}

export default function ProjectsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Filter State
  const [selectedDeptId, setSelectedDeptId] = useState<string>("all")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [isRecursive, setIsRecursive] = useState<boolean>(false)

  const { data: projects = [], isLoading, isFetching } = useQuery<Project[]>({
    queryKey: ["projects", session?.user?.email, selectedDeptId, selectedEmployeeId, isRecursive],
    queryFn: async () => {
      let endpoint = "/projects?"
      if (selectedDeptId !== 'all') endpoint += `departmentId=${selectedDeptId}&`
      if (selectedEmployeeId !== 'all') {
          endpoint += `employeeId=${selectedEmployeeId}&`
          if (isRecursive) endpoint += `recursive=true&`
      }
      return await apiClient.get(endpoint)
    },
    enabled: status === "authenticated",
  })

  if (isLoading) {
    return <div className="p-8 animate-pulse text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Loading Projects...</div>
  }

  return (
    <PermissionGuard module="projects" action="view">
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/40">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
            <p className="text-muted-foreground text-xs font-medium mt-1">View all your active projects here.</p>
          </div>

          <div className="flex items-center gap-3">
             <ManagementFilters 
                module="projects"
                selectedDept={selectedDeptId}
                setSelectedDept={setSelectedDeptId}
                selectedEmp={selectedEmployeeId}
                setSelectedEmp={(id, recursive) => {
                    setSelectedEmployeeId(id);
                    setIsRecursive(recursive);
                }}
                isRecursive={isRecursive}
             />
          </div>
        </div>

        {projects.length === 0 ? (
          <Card className="border-dashed py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary opacity-60" />
              </div>
              <h3 className="text-sm font-bold text-foreground">No projects yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                {selectedEmployeeId !== "all" 
                    ? "No projects found for the selected user." 
                    : "Win a sale to start your first project."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-300 ${isFetching && !isLoading ? 'opacity-60 pointer-events-none relative' : ''}`}>
             
             {isFetching && !isLoading && (
                <div className="absolute inset-0 z-50 flex items-start justify-center pt-24">
                   <div className="bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-primary/20 flex items-center gap-2">
                     <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Updating...</span>
                   </div>
                </div>
              )}

            {projects.map((project) => (
              <Card key={project.id} className="group hover:border-primary/40 transition-all cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm" onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-primary tracking-widest">Project Info</p>
                        <CardTitle className="text-sm font-bold line-clamp-1">{project.name}</CardTitle>
                     </div>
                     <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter border-primary/20 bg-primary/10 text-primary">
                        {project.status}
                     </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
                  <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed">
                    {project.description || "No project notes found."}
                  </p>
                  
                  <div className="pt-4 border-t border-border/20 flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded bg-muted/40 flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                          {project.lead?.name?.[0] || "C"}
                        </div>
                        <span className="text-[10px] font-semibold text-foreground/70">{project.lead?.company || project.lead?.name || "Client"}</span>
                     </div>
                     <div className="flex items-center gap-1 text-muted-foreground/40">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[8px] font-bold uppercase">{new Date(project.createdAt).toLocaleDateString()}</span>
                     </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PermissionGuard>
  )
}
