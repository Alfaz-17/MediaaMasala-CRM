"use client"

export const dynamic = 'force-dynamic'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  MoreHorizontal, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Briefcase,
  Package,
  ShoppingBag
} from "lucide-react"
import { ViewToggle, ViewType } from "@/components/dashboard/view-toggle"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { usePermissions } from "@/hooks/use-permissions"
import { PermissionGuard } from "@/components/permission-guard"

interface Task {
  id: string
  title: string
  description?: string
  priority: 'High' | 'Medium' | 'Low'
  status: string
  dueDate: string
  assignee?: { firstName: string; lastName: string }
  lead?: { name: string; id: string }
  project?: { name: string; id: number }
  product?: { name: string; id: number }
  createdAt: string
}

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case 'High': return 'destructive'
    case 'Medium': return 'warning'
    case 'Low': return 'success'
    default: return 'outline'
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Completed': return 'success'
    case 'In Progress': return 'info'
    case 'Pending': return 'warning'
    case 'Cancelled': return 'secondary'
    default: return 'outline'
  }
}

function TasksSkeleton({ view }: { view: ViewType }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-1.5 rounded-xl border border-border/40 shadow-xs">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-9 flex-1 max-w-md" />
        <Skeleton className="h-9 w-32" />
      </div>

      {view === "list" ? (
        <div className="bg-card rounded-xl border border-border/40 shadow-xs overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-border/10">
              <div className="space-y-2">
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border/40 rounded-xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/30 bg-muted/10">
                <Skeleton className="h-5 w-40" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="pt-3 border-t border-border/30 flex items-center justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TasksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('all')
  const [view, setView] = useState<ViewType>("list")
  const { hasPermission } = usePermissions()
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")

  const { data: tasks = [], isLoading, error: queryError } = useQuery<Task[]>({
    queryKey: ["tasks", activeTab, session?.user?.email],
    queryFn: async () => {
      const endpoint = activeTab === 'my' ? "/tasks?filter=my" : "/tasks"
      const data = await apiClient.get(endpoint)
      return Array.isArray(data) ? data : (data.tasks || [])
    },
    enabled: status === "authenticated",
  })

  const canCreate = hasPermission("tasks", "create")
  const canDelete = hasPermission("tasks", "delete")
  const canEdit = hasPermission("tasks", "edit")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete task: ${title}?`)) return
    
    try {
      await apiClient.delete(`/tasks/${id}`)
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Deletion failed")
    }
  }

  // Compute unique employees for filter
  const uniqueEmployees = Array.from(new Set(tasks.map(t => t.assignee?.firstName + " " + t.assignee?.lastName + "|" + t.assignee?.firstName)))
    .map(e => {
       return e.split("|")[0]
    })
    .filter((value, index, self) => self.indexOf(value) === index && value.trim() !== "undefined undefined")

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by employee
    if (selectedEmployeeId !== "all") {
        filtered = filtered.filter(t => `${t.assignee?.firstName} ${t.assignee?.lastName}` === selectedEmployeeId)
    }

    // Filter by status
    if (selectedStatus !== "all") {
        filtered = filtered.filter(t => t.status === selectedStatus)
    }

    // Filter by priority
    if (selectedPriority !== "all") {
        filtered = filtered.filter(t => t.priority === selectedPriority)
    }

    return filtered.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.lead?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [tasks, searchQuery, selectedEmployeeId, selectedStatus, selectedPriority])

  if (status === "loading" || isLoading) return (
    <PermissionGuard module="tasks" action="view">
      <div className="max-w-7xl mx-auto">
        <TasksSkeleton view={view} />
      </div>
    </PermissionGuard>
  )

  return (
    <PermissionGuard module="tasks" action="view">
      <div className="space-y-6 animate-in fade-in duration-700 max-w-7xl mx-auto">
        {/* Header section - Modern SaaS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Tasks</h1>
            <p className="text-muted-foreground text-xs font-medium mt-1">Manage and track your tasks.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end px-4 border-r border-border/50">
               <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-none">Status</span>
               <span className="text-xs font-semibold text-foreground mt-1 tabular-nums">{filteredTasks.length} Tasks</span>
             </div>
             {canCreate && (
               <Button onClick={() => router.push("/dashboard/tasks/new")} className="shadow-lg shadow-primary/10 rounded-lg h-9 font-semibold text-xs px-4">
                 <Plus className="mr-2 h-3.5 w-3.5" /> Add Task
               </Button>
             )}
          </div>
        </div>

        {/* Controller Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-1.5 rounded-xl border border-border/40 shadow-xs">
          <div className="flex gap-2">
            <div className="flex bg-muted/30 p-1 rounded-lg border border-border/20">
                <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all ${activeTab === 'all' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/60'}`}
                >
                Global
                </button>
                <button 
                onClick={() => setActiveTab('my')}
                className={`px-4 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all ${activeTab === 'my' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/60'}`}
                >
                My Stack
                </button>
            </div>
          
            {/* Employee Filter - Only show if we have multiple people */}
            {uniqueEmployees.length > 1 && (
                <div className="relative min-w-[140px]">
                    <select
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-border/40 bg-card px-3 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="all">All Assignees</option>
                        {uniqueEmployees.map((name) => (
                        <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[8px]">▼</div>
                </div>
            )}

            {/* Status Filter */}
            <div className="relative min-w-[120px]">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-border/40 bg-card px-3 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer shadow-sm"
                >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[8px]">▼</div>
            </div>

            {/* Priority Filter */}
            <div className="relative min-w-[110px]">
                <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-border/40 bg-card px-3 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer shadow-sm"
                >
                    <option value="all">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[8px]">▼</div>
            </div>
          </div>

          <div className="relative flex-1 group max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30 h-3.5 w-3.5 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-10 h-9 bg-transparent border-none focus-visible:ring-0 text-xs font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 px-2">
            <ViewToggle view={view} onViewChange={setView} />
            <div className="h-4 w-[1px] bg-border/40 mx-2" />
            <Button variant="ghost" size="sm" className="h-9 px-3 text-xs font-semibold text-muted-foreground" onClick={() => {setSearchQuery(""); setSelectedEmployeeId("all"); setSelectedStatus("all"); setSelectedPriority("all")}}>
              Reset
            </Button>
          </div>
        </div>

        {queryError && (
          <div className="bg-destructive/5 border border-destructive/20 text-destructive text-center py-3 rounded-lg font-semibold text-[11px]" role="alert">
            Error: {(queryError as any).message || "Failed to fetch tasks"}
          </div>
        )}

        {/* Main Content Area */}
        {filteredTasks.length > 0 ? (
          view === "list" ? (
            <div className="bg-card rounded-xl border border-border/40 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/30 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                      <th className="px-6 py-3">Task</th>
                      <th className="px-6 py-3">Priority</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Due Date</th>
                      <th className="px-6 py-3">Assigned To</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filteredTasks.map((task) => {
                      const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed'
                      return (
                        <tr key={task.id} className="group border-b border-border/10">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm text-foreground tracking-tight underline-offset-4 decoration-primary/30 cursor-pointer" onClick={() => router.push(`/dashboard/tasks/${task.id}`)}>
                                {task.title}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                {task.lead && (
                                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors" onClick={() => router.push(`/dashboard/leads/${task.lead?.id}`)}>
                                    <div className="h-1 w-1 rounded-full bg-primary/60" />
                                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">{task.lead.name}</span>
                                  </div>
                                )}
                                {task.project && (
                                  <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => router.push(`/dashboard/portfolio?tab=projects`)}>
                                    <div className="h-1 w-1 rounded-full bg-indigo-500/60" />
                                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">{task.project.name}</span>
                                  </div>
                                )}
                                {task.product && (
                                  <div className="flex items-center gap-1 cursor-pointer hover:text-amber-500 transition-colors" onClick={() => router.push(`/dashboard/portfolio?tab=products`)}>
                                    <div className="h-1 w-1 rounded-full bg-amber-500/60" />
                                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">{task.product.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getPriorityVariant(task.priority)} className="font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md border-none shadow-sm">
                              {task.priority}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusVariant(task.status)} className="font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md border-none shadow-sm">
                              {task.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className={`text-[11px] font-semibold tabular-nums ${isOverdue ? "text-destructive" : "text-foreground/80"}`}>
                                {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                               <div className="w-7 h-7 rounded-md bg-muted border border-border/40 flex items-center justify-center text-[10px] font-bold text-foreground/70 shadow-xs">
                                 {task.assignee ? task.assignee.firstName.charAt(0) : "!"}
                               </div>
                               <span className="text-[10px] font-medium text-muted-foreground/60 uppercase">
                                 {task.assignee ? `${task.assignee.firstName}` : "Unassigned"}
                               </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1.5 opacity-60">
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="h-7 text-[10px] font-semibold px-3 rounded-md border border-border/40"
                                onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                              >
                                View
                              </Button>
                              {canDelete && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 text-[10px] font-semibold px-3 text-destructive hover:bg-destructive/10 rounded-md"
                                  onClick={() => handleDelete(task.id, task.title)}
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 @container/tasks">
              {filteredTasks.map((task) => {
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed'
                return (
                  <Card key={task.id} className="shadow-xs bg-linear-to-t from-primary/5 to-card group border-border/40 rounded-xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/30 bg-muted/10 relative">
                      <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-1.5">
                          <CardTitle className="text-base font-semibold tracking-tight leading-none">{task.title}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant={getPriorityVariant(task.priority)} className="text-[8px] font-semibold uppercase tracking-wider rounded-md border-none shadow-sm">
                              {task.priority}
                            </Badge>
                            <Badge variant={getStatusVariant(task.status)} className="text-[8px] font-semibold uppercase tracking-wider rounded-md border-none shadow-sm">
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/30 shadow-sm rounded-md">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                      {task.description && (
                        <p className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed opacity-80">
                          {task.description}
                        </p>
                      )}
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/30 ${isOverdue ? "bg-destructive/5 text-destructive border-destructive/20" : "bg-muted/30 text-muted-foreground"}`}>
                          <Clock className={`h-3 w-3 ${isOverdue ? "animate-pulse" : "opacity-30"}`} />
                          <span className="text-[9px] font-bold uppercase tracking-wider tabular-nums">
                            Due Date: {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {task.lead && (
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 cursor-pointer hover:bg-primary/10 transition-all" onClick={() => router.push(`/dashboard/leads/${task.lead?.id}`)}>
                              <ShoppingBag className="h-3 w-3 opacity-40" />
                              <span className="text-[9px] font-bold uppercase tracking-wider truncate">
                                {task.lead.name}
                              </span>
                            </div>
                          )}
                          {task.project && (
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-indigo-500 bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10 cursor-pointer hover:bg-indigo-500/10 transition-all" onClick={() => router.push(`/dashboard/portfolio?tab=projects`)}>
                              <Briefcase className="h-3 w-3 opacity-40" />
                              <span className="text-[9px] font-bold uppercase tracking-wider truncate">
                                {task.project.name}
                              </span>
                            </div>
                          )}
                          {task.product && (
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-500 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10 cursor-pointer hover:bg-amber-500/10 transition-all" onClick={() => router.push(`/dashboard/portfolio?tab=products`)}>
                              <Package className="h-3 w-3 opacity-40" />
                              <span className="text-[9px] font-bold uppercase tracking-wider truncate">
                                {task.product.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border/30 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
                          <div className="h-6 w-6 rounded-md bg-muted border border-border/30 flex items-center justify-center text-[9px] font-bold shadow-xs">
                            {task.assignee ? task.assignee.firstName.charAt(0) : "!"}
                          </div>
                          <span className="text-[9px] font-bold uppercase text-foreground/50">
                            {task.assignee ? `${task.assignee.firstName}` : "Unassigned"}
                          </span>
                        </div>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="px-0 h-auto text-primary font-semibold text-[10px] hover:no-underline"
                          onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                        >
                          Details →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )
        ) : (
          <div className="bg-card rounded-xl border border-border/40 border-dashed py-24 text-center shadow-inner mt-4">
            <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="h-6 w-6 text-muted-foreground/20" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">No tasks found</h3>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2 text-xs leading-relaxed">
              {searchQuery ? "No tasks match your search query." : "You've completed all your tasks!"}
            </p>
            {!searchQuery && canCreate && (
              <Button 
                onClick={() => router.push("/dashboard/tasks/new")} 
                className="mt-6 shadow-lg shadow-primary/10 h-10 px-6 font-semibold text-xs rounded-lg"
              >
                <Plus className="mr-2 h-3.5 w-3.5" /> Add Task
              </Button>
            )}
          </div>
        )}

        {/* Registry Manifest Footer */}
        {!isLoading && filteredTasks.length > 0 && (
          <div className="flex items-center justify-between py-6 border-t border-border/40 mt-8">
             <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest opacity-50">
              Total Tasks: <span className="text-foreground/70 font-bold tabular-nums">{filteredTasks.length} Items</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 px-3 font-semibold text-[9px] rounded-lg border-border/50" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="h-9 px-3 font-semibold text-[9px] rounded-lg border-border/50" disabled>Next</Button>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  )
}
