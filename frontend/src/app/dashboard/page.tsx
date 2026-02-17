"use client"

export const dynamic = 'force-dynamic'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { 
  Users, 
  CheckSquare, 
  AlertTriangle, 
  Activity, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight
} from "lucide-react"
import { usePermissions } from "@/hooks/use-permissions"

interface DashboardStats {
  global: {
    totalLeads: number
    tasksDueToday: number
    overdueTasks: number
  }
  personal: {
    myLeads: number
    myTasksDueToday: number
  }
}

interface ActivityItem {
  type: 'LEAD' | 'TASK'
  message: string
  user: string
  timestamp: string
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[500px] rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { hasModule, hasPermission, isLoading: permissionsLoading } = usePermissions()

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats", session?.user?.email],
    queryFn: () => apiClient.get("/dashboard/stats"),
    enabled: status === "authenticated",
  })

  const { data: activities = [], isLoading: activityLoading, refetch: refetchActivity } = useQuery<ActivityItem[]>({
    queryKey: ["dashboard-activity", session?.user?.email],
    queryFn: () => apiClient.get("/dashboard/activity"),
    enabled: status === "authenticated",
  })

  const canViewLeads = hasModule("leads")
  const canViewTasks = hasModule("tasks")
  const canCreateLeads = hasPermission("leads", "create")
  const canCreateTasks = hasPermission("tasks", "create")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  if (status === "loading" || statsLoading || activityLoading || permissionsLoading) {
    return <DashboardSkeleton />
  }

  const user = session?.user as any

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-7xl mx-auto">
      {/* Minimalist Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/40">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-muted-foreground text-[13px] font-medium leading-relaxed">
            Here's what's happening across your sales and tasks today.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end px-3">
             <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-none">System Status</span>
             <span className="text-[11px] font-bold text-success flex items-center gap-1.5 mt-1.5 uppercase tracking-wide">
               <div className="h-1.5 w-1.5 rounded-full bg-success"></div>
               Online
             </span>
           </div>
           <div className="h-8 w-px bg-border/40 mx-1"></div>
           <div className="flex flex-col items-start px-3">
              <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-none">Updated</span>
              <span className="text-[11px] font-bold text-foreground mt-1.5 uppercase tracking-wide">Real-time</span>
           </div>
        </div>
      </div>

      {/* Minimalist KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {canViewLeads && (
          <Card className="shadow-sm bg-background group border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300">
             <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Total Leads</CardDescription>
                <Users className="h-3.5 w-3.5 text-muted-foreground/40" />
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                  {stats?.global.totalLeads || 0}
                </div>
                <div className="mt-4">
                   <Badge variant="outline" className="gap-1 rounded-full px-2 py-0 text-[9px] bg-primary/5 font-bold border-none text-primary uppercase tracking-wider">
                      <TrendingUp className="size-2.5" />
                      <span>Progress</span>
                   </Badge>
                </div>
             </CardContent>
          </Card>
        )}

        {canViewTasks && (
          <Card className="shadow-sm bg-background group border-border/50 rounded-lg hover:border-blue-500/30 transition-all duration-300">
             <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Daily Tasks</CardDescription>
                <CheckSquare className="h-3.5 w-3.5 text-muted-foreground/40" />
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                  {stats?.global.tasksDueToday || 0}
                </div>
                <div className="mt-4 flex items-center gap-2">
                   <Badge variant="outline" className="rounded-full px-2 py-0 text-[11px] bg-blue-500/5 font-bold border-none text-blue-500 uppercase tracking-wider">
                      Active
                   </Badge>
                </div>
             </CardContent>
          </Card>
        )}

        {canViewTasks && (
          <Card className="shadow-sm bg-background group border-border/50 rounded-lg hover:border-destructive/30 transition-all duration-300">
             <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Overdue Tasks</CardDescription>
                <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground/40" />
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-destructive tabular-nums">
                  {stats?.global.overdueTasks || 0}
                </div>
                <div className="mt-4">
                   <Badge variant="destructive" className="rounded-full px-2.5 py-0 text-[9px] font-bold uppercase tracking-widest shadow-none">
                      Critical
                   </Badge>
                </div>
             </CardContent>
          </Card>
        )}

        {canViewLeads && (
          <Card className="shadow-sm bg-primary text-primary-foreground group border-primary rounded-lg relative overflow-hidden">
             <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
                <CardDescription className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest">My Pipeline</CardDescription>
                <Activity className="h-3.5 w-3.5 text-primary-foreground/40" />
             </CardHeader>
             <CardContent className="relative z-10">
                <div className="text-2xl font-semibold tracking-tight tabular-nums">
                  {stats?.personal.myLeads || 0}
                </div>
                <div className="mt-4">
                   <p className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest">In Progress</p>
                </div>
             </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Section */}
        <Card className="lg:col-span-2 border-border/40 shadow-sm overflow-hidden flex flex-col rounded-lg bg-background">
          <CardHeader className="py-4 px-6 border-b border-border/40 flex flex-row items-center justify-between">
             <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold text-foreground tracking-tight uppercase tracking-[0.05em]">Activity Stream</CardTitle>
                <CardDescription className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Recent Activity</CardDescription>
             </div>
             <Button variant="ghost" size="sm" className="h-8 rounded-md text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground" onClick={() => refetchActivity()}>
               Refresh
             </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-y-auto max-h-[440px]">
            <div className="divide-y divide-border/10">
              {activities.length > 0 ? activities.map((act, idx) => (
                <div key={idx} className="flex gap-4 p-5 group hover:bg-muted/10 transition-colors">
                  <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border/40 ${
                    act.type === 'LEAD' ? 'bg-primary/5 text-primary' : 'bg-blue-500/5 text-blue-500'
                  }`}>
                    {act.type === 'LEAD' ? <Users className="h-3.5 w-3.5" /> : <CheckSquare className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[13px] font-medium text-foreground leading-snug">{act.message}</p>
                      <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] whitespace-nowrap mt-1">
                        System
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{act.user}</span>
                       <div className="h-1 w-1 rounded-full bg-border mt-0.5" />
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                         <Clock className="h-2.5 w-2.5" />
                         {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center flex flex-col items-center">
                   <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-6 border border-border/40">
                     <Activity className="h-5 w-5 text-muted-foreground/10" />
                   </div>
                   <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">No activity found</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="bg-muted/5 p-3 border-t border-border/40 text-center">
             {canViewLeads && (
               <Button variant="link" className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest h-auto p-0 hover:text-primary transition-colors" onClick={() => router.push("/dashboard/leads")}>
                 View All Leads →
               </Button>
             )}
          </div>
        </Card>

        {/* Sidebar Actions */}
        <div className="space-y-6">
           <Card className="border-border/40 bg-background shadow-sm rounded-lg overflow-hidden">
             <CardHeader className="pb-4 pt-6 px-6">
                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Quick Actions</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2 px-4 pb-6">
                {canCreateLeads && (
                   <Button 
                     variant="outline"
                     className="w-full justify-between h-12 rounded-lg border-border/40 bg-muted/20 hover:bg-muted/40 transition-all group"
                     onClick={() => router.push("/dashboard/leads/new")}
                   >
                     <div className="flex items-center gap-3">
                       <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <Plus className="h-3.5 w-3.5" />
                       </div>
                       <span className="text-[11px] font-bold uppercase tracking-widest">Add Lead</span>
                     </div>
                     <ChevronRight className="h-3 w-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                   </Button>
                )}
                {canCreateTasks && (
                   <Button 
                     variant="outline"
                     className="w-full justify-between h-12 rounded-lg border-border/40 bg-muted/20 hover:bg-muted/40 transition-all group"
                     onClick={() => router.push("/dashboard/tasks/new")}
                   >
                     <div className="flex items-center gap-3">
                       <div className="h-7 w-7 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                          <Plus className="h-3.5 w-3.5" />
                       </div>
                       <span className="text-[11px] font-bold uppercase tracking-widest">Assign Task</span>
                     </div>
                     <ChevronRight className="h-3 w-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-blue-500" />
                   </Button>
                )}
             </CardContent>
           </Card>

           <Card className="border-border/40 shadow-sm rounded-lg bg-background overflow-hidden px-6 py-6">
              <div className="space-y-6">
                <div className="space-y-3">
                   <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">Goal Progress</span>
                      <span className="text-[11px] font-bold tabular-nums">94.2%</span>
                   </div>
                   <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '94.2%' }}></div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
                       <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1.5 leading-none">Active Leads</p>
                       <p className="text-xl font-semibold tracking-tight tabular-nums">{stats?.personal.myLeads || 0}</p>
                   </div>
                   <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
                       <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1.5 leading-none">Today's Tasks</p>
                       <p className="text-xl font-semibold tracking-tight tabular-nums text-blue-500">{stats?.personal.myTasksDueToday || 0}</p>
                   </div>
                </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
