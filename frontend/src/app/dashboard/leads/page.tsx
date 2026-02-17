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
  Mail, 
  Phone, 
  Building, 
  MoreHorizontal, 
  Filter 
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

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  source: string
  status: string
  owner?: { firstName: string; lastName: string }
  createdAt: string
}

// Map LeadStatus to Badge variants
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'New': return 'warning'
    case 'Not_Responded': return 'secondary'
    case 'Wrong_Contact': return 'destructive'
    case 'Follow_Up': return 'info'
    case 'Prospect': return 'outline' // Default Shadcn style
    case 'Hot_Prospect': return 'warning'
    case 'Proposal_Sent': return 'info'
    case 'Closing': return 'success'
    case 'Won': return 'success'
    case 'Lost': return 'destructive'
    default: return 'outline'
  }
}

function LeadsSkeleton({ view }: { view: ViewType }) {
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-1.5 rounded-lg border border-border/40">
        <Skeleton className="h-10 w-full md:w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      {view === "list" ? (
        <div className="border border-border/40 rounded-lg overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-border/10">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border/40">
              <CardHeader className="pb-3 border-b border-border/30 bg-muted/10">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-16 mt-2" />
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-between pt-3 border-t border-border/30">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

import { ManagementFilters } from "@/components/dashboard/management-filters"

export default function LeadsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<ViewType>("list")
  const { hasPermission, isLoading: permissionsLoading } = usePermissions()
  const [selectedDeptId, setSelectedDeptId] = useState<string>("all")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const { data: leads = [], isLoading, error: queryError } = useQuery<Lead[]>({
    queryKey: ["leads", session?.user?.email, selectedDeptId, selectedEmployeeId],
    queryFn: async () => {
      let endpoint = "/leads?"
      if (selectedDeptId !== 'all') endpoint += `departmentId=${selectedDeptId}&`
      if (selectedEmployeeId !== 'all') endpoint += `ownerId=${selectedEmployeeId}&`
      
      const data = await apiClient.get(endpoint)
      return Array.isArray(data) ? data : (data.leads || [])
    },
    enabled: status === "authenticated",
  })

  const canCreate = hasPermission("leads", "create")
  const canDelete = hasPermission("leads", "delete")
  const canEdit = hasPermission("leads", "edit")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete lead: ${name}?`)) return
    
    try {
      await apiClient.delete(`/leads/${id}`)
      router.refresh()
    } catch (err: any) {
      alert(err.message || "Deletion failed")
    }
  }

  const filteredLeads = useMemo(() => {
    let filtered = leads;

    if (selectedStatus !== "all") {
        filtered = filtered.filter(l => l.status === selectedStatus)
    }

    return filtered.filter(lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [leads, searchQuery, selectedStatus])

  if (status === "loading" || isLoading || permissionsLoading) {
    return (
      <PermissionGuard module="leads" action="view">
        <div className="max-w-7xl mx-auto">
          <LeadsSkeleton view={view} />
        </div>
      </PermissionGuard>
    )
  }

  return (
    <PermissionGuard module="leads" action="view">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-7xl mx-auto">
        {/* Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/40">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Leads Management</h1>
            <p className="text-muted-foreground text-[13px] font-medium leading-relaxed">View and track all leads across the company.</p>
          </div>
          
          <div className="flex items-center gap-3">
             {canCreate && (
               <Button onClick={() => router.push("/dashboard/leads/new")} className="rounded-lg h-9 font-semibold text-xs px-4 shadow-sm border border-primary/20">
                 <Plus className="mr-2 h-3.5 w-3.5" /> Add Lead
               </Button>
             )}
          </div>
        </div>

        {/* Minimalist Controller Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 w-full">
             {/* Status Filter */}
             <div className="relative min-w-[140px]">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-border/40 bg-background pl-3 pr-8 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer shadow-sm hover:border-primary/30 transition-all font-sans"
                >
                    <option value="all">All Status</option>
                    <option value="New">New</option>
                    <option value="Not_Responded">Not Responded</option>
                    <option value="Wrong_Contact">Wrong Contact</option>
                    <option value="Follow_Up">Follow Up</option>
                    <option value="Prospect">Prospect</option>
                    <option value="Hot_Prospect">Hot Prospect</option>
                    <option value="Proposal_Sent">Proposal Sent</option>
                    <option value="Closing">Closing</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[9px]">▼</div>
             </div>

             {/* Dynamic Management Filters */}
             <ManagementFilters 
                module="leads"
                selectedDept={selectedDeptId}
                setSelectedDept={setSelectedDeptId}
                selectedEmp={selectedEmployeeId}
                setSelectedEmp={setSelectedEmployeeId}
             />
            
            <div className="relative flex-1 group min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 h-3.5 w-3.5 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search leads..." 
                  className="pl-9 h-9 bg-background border border-border/40 focus:ring-primary/40 rounded-lg text-xs font-medium placeholder:text-muted-foreground/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ViewToggle view={view} onViewChange={setView} />
            <div className="h-4 w-px bg-border/40 mx-1" />
            <Button variant="ghost" size="sm" className="h-9 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground" onClick={() => {setSearchQuery(""); setSelectedEmployeeId("all"); setSelectedStatus("all")}}>
              Reset
            </Button>
          </div>
        </div>

        {/* Error state */}
        {queryError && (
          <div className="bg-destructive/5 border border-destructive/20 text-destructive text-center py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest" role="alert">
            Error: {(queryError as any).message || "Failed to fetch leads"}
          </div>
        )}

        {/* Main Content Area */}
        {filteredLeads.length > 0 ? (
          view === "list" ? (
            <div className="bg-background rounded-lg border border-border/40 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/40">
                      <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em]">Name</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em]">Company</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em]">Source</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em]">Status</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="group hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[13px] text-foreground tracking-tight hover:text-primary cursor-pointer transition-colors" onClick={() => router.push(`/dashboard/leads/${lead.id}`)}>{lead.name}</span>
                            <span className="text-[10px] font-medium text-muted-foreground/50 mt-0.5">{lead.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[12px] font-medium text-muted-foreground">
                          {lead.company || <span className="opacity-20">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-primary/20 transition-transform group-hover:scale-125 duration-300" />
                             <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                               {lead.source.replace("_", " ")}
                             </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={getStatusVariant(lead.status)} className="font-bold text-[9px] uppercase tracking-[0.15em] py-0.5 px-3 rounded-full shadow-xs border-none cursor-default">
                            {lead.status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-[10px] font-bold uppercase tracking-widest px-2.5 rounded-md hover:bg-muted"
                              onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                            >
                              Details
                            </Button>
                            {canDelete && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-[10px] font-bold uppercase tracking-widest px-2.5 text-destructive/60 hover:text-destructive hover:bg-destructive/5 rounded-md"
                                onClick={() => handleDelete(lead.id, lead.name)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 @container/leads">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="shadow-xs bg-linear-to-t from-primary/5 to-card group border-border/40 rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-border/30 bg-muted/10 relative">
                    <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-semibold tracking-tight">{lead.name}</CardTitle>
                        <Badge variant={getStatusVariant(lead.status)} className="font-semibold text-[9px] uppercase tracking-wider rounded-md border-none shadow-sm">
                          {lead.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/30 shadow-sm rounded-md">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/30">
                        <Mail className="h-3 w-3 text-primary/40" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-foreground/80 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/30">
                        <Building className="h-3 w-3 text-primary/40" />
                        <span className="uppercase text-[9px] font-bold tracking-wider">{lead.company || "Person"}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border/30 flex items-center justify-between">
                      <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">Owner</span>
                         <span className="text-[10px] font-semibold text-foreground tracking-tight">
                          {lead.owner ? `${lead.owner.firstName}` : "Unassigned"}
                         </span>
                      </div>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="px-0 h-auto text-primary font-semibold text-[10px]"
                        onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                      >
                        View Details →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <div className="bg-card rounded-xl border border-border/40 border-dashed py-24 text-center shadow-inner mt-4">
            <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
               <Filter className="h-6 w-6 text-muted-foreground/20" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">No leads found</h3>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2 text-xs leading-relaxed">
              {searchQuery ? "No leads match your search query." : "You haven't added any leads yet."}
            </p>
            {!searchQuery && canCreate && (
              <Button 
                onClick={() => router.push("/dashboard/leads/new")} 
                className="mt-6 shadow-lg shadow-primary/10 h-10 px-6 font-semibold text-xs rounded-lg"
              >
                <Plus className="mr-2 h-3.5 w-3.5" /> Add Lead
              </Button>
            )}
          </div>
        )}

        {/* Registry Manifest Footer */}
        {filteredLeads.length > 0 && (
          <div className="flex items-center justify-between py-6 border-t border-border/40 mt-8">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest opacity-50">
              List Information: <span className="text-foreground/70 font-bold tabular-nums">{filteredLeads.length} Items</span>
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
