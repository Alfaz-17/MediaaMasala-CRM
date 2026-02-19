"use client"

import { useEffect, useState, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePermissions } from "@/hooks/use-permissions"
import { 
  Briefcase, 
  Calendar, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

interface Project {
  id: number
  name: string
  description: string
  status: string
  leadId?: string
  lead?: {
    id: string
    name: string
    company?: string
    email: string
  }
  tasks: Array<{
    id: string
    title: string
    status: string
    priority: string
    dueDate: string
  }>
  createdAt: string
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const { data: session } = useSession()
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const canCreateTask = hasPermission("tasks", "create")
  // Using projects:create as proxy for edit/manage since we just added edit permission or fallback to create
  const canEditProject = hasPermission("projects", "edit") || hasPermission("projects", "create")
  const canDeleteProject = hasPermission("projects", "delete")

  const [deleting, setDeleting] = useState(false)

  const handleDeleteProject = async () => {
    if (!project) return
    if (!confirm(`Are you sure you want to delete project: ${project.name}?`)) return

    setDeleting(true)
    try {
      await apiClient.delete(`/projects/${project.id}`)
      router.push("/dashboard/portfolio?tab=projects")
    } catch (err) {
      console.error("Error deleting project:", err)
      setDeleting(false)
    }
  }

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await apiClient.get(`/projects/${id}`)
        setProject(data)
      } catch (err) {
        console.error("Error fetching project:", err)
        router.push("/dashboard/portfolio?tab=projects")
      } finally {
        setLoading(false)
      }
    }

    if (session && id) fetchProject()
  }, [session, id])

  if (loading) {
    return <div className="p-8 animate-pulse text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Loading Project Details...</div>
  }

  if (!project) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit text-[10px] font-bold uppercase tracking-widest h-8 px-0 hover:bg-transparent opacity-50 hover:opacity-100 transition-opacity"
          onClick={() => router.push("/dashboard/portfolio?tab=projects")}
        >
          <ArrowLeft className="h-3 w-3 mr-2" />
          Back to Projects
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter border-primary/20 bg-primary/10 text-primary">
                  {project.status}
               </Badge>
               <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Project ID: #{project.id}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground">{project.name}</h1>
            <p className="text-muted-foreground text-xs font-medium mt-1">Details and tasks for this project.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/20 bg-muted/20">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                Project Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {project.description || "No detailed description provided for this project."}
              </p>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/20 bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Tasks
              </CardTitle>
              <Badge variant="secondary" className="text-[9px] font-black">{project.tasks.length} Total</Badge>
            </CardHeader>
            <CardContent className="p-0">
              {project.tasks.length === 0 ? (
                 <div className="p-12 text-center">
                    <p className="text-xs text-muted-foreground">No tasks linked to this project yet.</p>
                 </div>
              ) : (
                <div className="divide-y divide-border/20">
                  {project.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between cursor-pointer"
                      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">{task.title}</p>
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-bold uppercase text-muted-foreground/50 tracking-widest">{task.priority} Priority</span>
                           <span className="text-[9px] font-bold uppercase text-muted-foreground/40">{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge className={`text-[8px] font-black uppercase tracking-tighter ${
                        task.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'
                      }`} variant="outline">
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           {/* Client Card */}
           <Card className="border-border/40 shadow-sm overflow-hidden border-l-4 border-l-primary/60">
             <CardHeader className="pb-3 pt-5 px-5">
               <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">Related Sale</p>
               <CardTitle className="text-sm font-bold">{project.lead?.company || project.lead?.name || "Private Client"}</CardTitle>
             </CardHeader>
             <CardContent className="px-5 pb-5 space-y-4">
                <div className="space-y-3">
                   <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground/40" />
                      <span className="text-xs font-medium text-foreground/70">{project.lead?.name}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground/40" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Created {new Date(project.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
                
                {project.lead?.id && (
                   <Button 
                     variant="outline" 
                     className="w-full h-8 text-[9px] font-bold uppercase tracking-widest border-border/40 bg-muted/10"
                     onClick={() => router.push(`/dashboard/leads/${project.lead?.id}`)}
                   >
                     View Sale Details
                     <ExternalLink className="h-2.5 w-2.5 ml-2 opacity-50" />
                   </Button>
                )}
             </CardContent>
           </Card>

           <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Quick Actions</h4>
              <div className="space-y-2">
                {canCreateTask && (
                  <Button 
                    className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-9" 
                    variant="outline"
                    onClick={() => router.push(`/dashboard/tasks/new?projectId=${project.id}`)}
                  >
                     Add Task
                  </Button>
                )}
                {canEditProject && (
                  <Button 
                    className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-9 opacity-50 cursor-not-allowed" 
                    variant="outline"
                    disabled
                    title="Status updates coming soon"
                  >
                     Update Status (Use List View)
                  </Button>
                )}
                {canDeleteProject && (
                  <Button 
                    className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-9 text-destructive hover:bg-destructive/10 border-destructive/20" 
                    variant="outline"
                    onClick={handleDeleteProject}
                    loading={deleting}
                  >
                     Delete Project
                  </Button>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
