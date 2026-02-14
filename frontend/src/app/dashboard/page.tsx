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
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[10px]" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[500px] rounded-[10px]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-[10px]" />
          <Skeleton className="h-48 rounded-[10px]" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { hasModule, hasPermission } = usePermissions()

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

  if (status === "loading" || statsLoading || activityLoading) {
    return <DashboardSkeleton />
  }

  const user = session?.user as any

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* Header section with Stats overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">
            {user?.email?.split('@')[0]} Dashboard
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            See your latest sales and tasks here.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end px-4 border-r border-border/50">
             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Status</span>
             <span className="text-xs font-bold text-success flex items-center gap-1.5 mt-1">
               <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse"></div>
               Operational
             </span>
           </div>
           <div className="flex flex-col items-end px-4">
             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Last Sync</span>
             <span className="text-xs font-bold text-foreground mt-1">Just now</span>
           </div>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {canViewLeads && (
          <Card className="shadow-xs bg-linear-to-t from-primary/5 to-card group border-border/40 rounded-[10px]">
             <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">All Potential Sales</CardDescription>
                <Users className="h-4 w-4 text-muted-foreground/50" />
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                  {stats?.global.totalLeads || 0}
                </div>
                <div className="mt-4">
                   <Badge variant="outline" className="gap-1 rounded-md px-1.5 py-0.5 text-[10px] bg-background font-medium border-border/50">
                      <TrendingUp className="size-3 text-success" />
                      <span className="text-success">+12.5%</span>
                   </Badge>
                </div>
             </CardContent>
          </Card>
        )}

        {canViewTasks && (
          <Card className="shadow-xs bg-linear-to-t from-blue-500/5 to-card group border-border/40 rounded-[10px]">
             <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tasks Due Today</CardDescription>
                <CheckSquare className="h-4 w-4 text-muted-foreground/50" />
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                  {stats?.global.tasksDueToday || 0}
                </div>
                <div className="mt-4 flex items-center gap-2">
                   <Badge variant="outline" className="gap-1 rounded-md px-1.5 py-0.5 text-[10px] bg-background font-medium border-border/50">
                      <Clock className="size-3 text-blue-500" />
                      <span className="text-blue-500">Active Duty</span>
                   </Badge>
                </div>
             </CardContent>
          </Card>
        )}

        {canViewTasks && (
          <Card className="shadow-xs bg-linear-to-t from-destructive/5 to-card group border-border/40 rounded-[10px]">
             <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Late Tasks</CardDescription>
                <AlertTriangle className="h-4 w-4 text-muted-foreground/50" />
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-semibold tracking-tight text-destructive tabular-nums">
                  {stats?.global.overdueTasks || 0}
                </div>
                <div className="mt-4">
                   <Badge variant="destructive" className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
                      Action Required
                   </Badge>
                </div>
             </CardContent>
          </Card>
        )}

        {canViewLeads && (
          <Card className="shadow-xs bg-primary group border-primary rounded-[10px] relative overflow-hidden">
             <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
                <CardDescription className="text-[10px] font-semibold text-primary-foreground/60 uppercase tracking-wider">Personal Pipeline</CardDescription>
                <Activity className="h-4 w-4 text-primary-foreground/40" />
             </CardHeader>
             <CardContent className="relative z-10">
                <div className="text-2xl font-semibold tracking-tight text-primary-foreground tabular-nums">
                  {stats?.personal.myLeads || 0}
                </div>
                <div className="mt-4">
                   <p className="text-[10px] font-medium text-primary-foreground/70">Working well (88%)</p>
                </div>
             </CardContent>
             <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                <Users className="h-24 w-24 text-white" />
             </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Section */}
        <Card className="lg:col-span-2 border-border/40 shadow-xs overflow-hidden flex flex-col rounded-[10px] bg-card">
          <CardHeader className="py-3 px-6 border-b border-border/40 flex flex-row items-center justify-between">
             <div>
                <CardTitle className="text-sm font-semibold text-foreground tracking-tight">Recent Updates</CardTitle>
                <CardDescription className="text-[10px] font-medium text-muted-foreground">Updating automatically</CardDescription>
             </div>
             <Button variant="outline" size="sm" className="h-8 rounded-md text-[10px] font-semibold border-border/50" onClick={() => refetchActivity()}>
               Refetch
             </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-y-auto max-h-[440px]">
            <div className="divide-y divide-border/30">
              {activities.length > 0 ? activities.map((act, idx) => (
                <div key={idx} className="flex gap-4 p-4 group relative">
                  <div className={`mt-0.5 w-9 h-9 rounded-md flex items-center justify-center shrink-0 border border-border/30 ${
                    act.type === 'LEAD' ? 'bg-primary/5 text-primary' : 'bg-blue-500/5 text-blue-500'
                  }`}>
                    {act.type === 'LEAD' ? <Users className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[13px] font-medium text-foreground leading-snug truncate">{act.message}</p>
                      <span className="text-[9px] font-semibold text-muted-foreground uppercase bg-muted/50 px-2 py-0.5 rounded opacity-40">
                        Audit
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                       <span className="text-[10px] font-bold text-muted-foreground/60">{act.user}</span>
                       <span className="text-[10px] text-muted-foreground/20 font-black">•</span>
                       <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/50">
                         <Clock className="h-3 w-3" />
                         {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center flex flex-col items-center">
                   <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                     <Activity className="h-5 w-5 text-muted-foreground/30" />
                   </div>
                   <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest">No Signals Detected</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="bg-muted/10 p-2.5 border-t border-border/40 text-center">
             {canViewLeads && (
               <Button variant="link" className="text-[10px] font-semibold text-muted-foreground h-auto p-0" onClick={() => router.push("/dashboard/leads")}>
                 See All Details →
               </Button>
             )}
          </div>
        </Card>

        {/* Sidebar Actions */}
        <div className="space-y-6">
           <Card className="border-border/40 bg-card shadow-xs rounded-[10px] overflow-hidden">
             <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold text-foreground tracking-tight whitespace-nowrap">Quick Actions</CardTitle>
                <CardDescription className="text-[10px] font-medium text-muted-foreground">Shortcuts for your work</CardDescription>
             </CardHeader>
             <CardContent className="space-y-2">
                {canCreateLeads && (
                  <Button 
                    variant="outline"
                    className="w-full justify-between h-12 rounded-lg border-border/60 group"
                    onClick={() => router.push("/dashboard/leads/new")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary">
                         <Plus className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-semibold tracking-tight">Enroll Lead</span>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-30" />
                  </Button>
                )}
                {canCreateTasks && (
                  <Button 
                    variant="outline"
                    className="w-full justify-between h-12 rounded-lg border-border/60 group"
                    onClick={() => router.push("/dashboard/tasks/new")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                         <Plus className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-semibold tracking-tight">Deploy Mission</span>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-30" />
                  </Button>
                )}
             </CardContent>
           </Card>

           <Card className="border-border/40 shadow-xs rounded-[10px] bg-card">
             <CardHeader className="pb-2 px-6">
                <CardTitle className="text-xs font-semibold text-foreground tracking-tight">Work Progress</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 px-6 pb-6">
                <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Updates Done</span>
                      <span className="text-xs font-semibold tabular-nums">94.2%</span>
                   </div>
                   <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '94.2%' }}></div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                   <div className="p-3 rounded-lg border border-border/40 bg-muted/20">
                      <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-1">My Leads</p>
                      <p className="text-xl font-semibold tracking-tight tabular-nums">{stats?.personal.myLeads || 0}</p>
                   </div>
                   <div className="p-3 rounded-lg border border-border/40 bg-muted/20">
                      <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-1">Due Today</p>
                      <p className="text-xl font-semibold tracking-tight tabular-nums text-blue-500">{stats?.personal.myTasksDueToday || 0}</p>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
