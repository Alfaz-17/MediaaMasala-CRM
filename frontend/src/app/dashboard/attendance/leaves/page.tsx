"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { usePermissions } from "@/hooks/use-permissions"
import { Calendar, FileText, CheckCircle2, XCircle, Clock, Plus, Filter } from "lucide-react"
import { toast } from "sonner"
import { PermissionGuard } from "@/components/permission-guard"
import { useQuery } from "@tanstack/react-query"
import { ManagementFilters } from "@/components/dashboard/management-filters"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface LeaveRequest {
  id: number
  startDate: string
  endDate: string
  type: string
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected'
  managerNote?: string
  employee: {
    firstName: string
    lastName: string
    department: { name: string }
  }
  approvedBy?: {
    firstName: string
    lastName: string
  }
  createdAt: string
}

export default function LeavesPage() {
  const { data: session, status } = useSession()
  const { hasPermission } = usePermissions()
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const canApprove = hasPermission("attendance", "approve")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDeptId, setSelectedDeptId] = useState<string>("all")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [isRecursive, setIsRecursive] = useState<boolean>(false)

  const { data: leaves = [], isLoading, refetch } = useQuery<LeaveRequest[]>({
    queryKey: ["leaves", session?.user?.email, selectedDeptId, selectedEmployeeId, isRecursive],
    queryFn: async () => {
      let endpoint = "/leaves?"
      if (selectedDeptId !== 'all') endpoint += `departmentId=${selectedDeptId}&`
      if (selectedEmployeeId !== 'all') {
          endpoint += `employeeId=${selectedEmployeeId}&`
          if (isRecursive) endpoint += `recursive=true&`
      }
      return await apiClient.get(endpoint)
    },
    enabled: status === "authenticated",
  })

  const handleSubmitLeave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      type: formData.get("type"),
      reason: formData.get("reason"),
    }

    try {
      await apiClient.post("/leaves", payload)
      toast.success("Leave request submitted")
      setIsSubmitOpen(false)
      refetch()
    } catch (err: any) {
      toast.error(err.message || "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleApprove = async (id: number, status: 'Approved' | 'Rejected') => {
    try {
      await apiClient.patch(`/leaves/${id}/approve`, { status })
      toast.success(`Request ${status.toLowerCase()}`)
      refetch()
    } catch (err: any) {
      toast.error(err.message || "Update failed")
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'success'
      case 'Rejected': return 'destructive'
      case 'Pending': return 'warning'
      default: return 'outline'
    }
  }

  // Filter leaves by status only (emp/dept filtered by server)
  const filteredLeaves = leaves.filter(l => {
    return selectedStatus === "all" || l.status === selectedStatus
  })

  return (
    <PermissionGuard module="attendance">
      <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Leave Requests</h1>
            <p className="text-muted-foreground text-sm font-medium">Manage your time-off requests and approvals.</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <div className="relative min-w-[130px]">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-border/40 bg-card px-4 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px]">▼</div>
            </div>

            {/* Management Filters */}
            <ManagementFilters 
              module="attendance"
              selectedDept={selectedDeptId}
              setSelectedDept={setSelectedDeptId}
              selectedEmp={selectedEmployeeId}
              setSelectedEmp={(id, recursive) => {
                  setSelectedEmployeeId(id);
                  setIsRecursive(recursive);
              }}
              isRecursive={isRecursive}
            />

            <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-lg shadow-primary/10 rounded-xl h-11 font-bold text-[11px] uppercase tracking-widest px-6">
                  <Plus className="mr-2 h-4 w-4" /> Request Time Off
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card border-border/40">
                <form onSubmit={handleSubmitLeave}>
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Request Time Off</DialogTitle>
                    <DialogDescription className="text-xs">
                      Submit your leave request for management review.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Start Date</Label>
                        <Input id="startDate" name="startDate" type="date" required className="bg-muted/30 border-border/40 h-10 text-xs" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">End Date</Label>
                        <Input id="endDate" name="endDate" type="date" required className="bg-muted/30 border-border/40 h-10 text-xs" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Leave Type</Label>
                      <select id="type" name="type" required className="w-full rounded-md bg-muted/30 border border-border/40 text-xs p-2.5 outline-none focus:ring-1 focus:ring-primary">
                        <option value="">Select type...</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Personal">Personal</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reason</Label>
                      <textarea id="reason" name="reason" rows={3} required className="w-full rounded-md bg-muted/30 border border-border/40 text-xs p-3 outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="Briefly explain your request..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting} className="w-full rounded-xl font-bold uppercase tracking-widest text-[11px] h-11 shadow-lg shadow-primary/10">
                      {submitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Leave Requests Grid */}
        <div className="grid gap-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-muted/20 animate-pulse border border-border/10" />
              ))}
            </div>
          ) : filteredLeaves.length === 0 ? (
            <Card className="border-dashed py-12">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/20 mb-4" />
                <h3 className="text-sm font-bold text-muted-foreground/40 uppercase tracking-[0.4em]">No Requests</h3>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  {selectedStatus !== "all" || selectedEmployeeId !== "all" 
                    ? "No leave requests match the selected filters." 
                    : "No leave requests found."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeaves.map((leave) => (
                <Card key={leave.id} className="group border-border/40 hover:border-primary/20 transition-all overflow-hidden bg-card/50">
                  <CardHeader className="pb-3 border-b border-border/20">
                    <div className="flex items-center justify-between">
                      <Badge variant={getStatusVariant(leave.status) as any} className="text-[8px] font-black uppercase">
                        {leave.status}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground/50 uppercase">{leave.type}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-[10px]">
                        {leave.employee.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold">{leave.employee.firstName} {leave.employee.lastName}</p>
                        <p className="text-[9px] text-muted-foreground/50">{leave.employee.department.name}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3 text-muted-foreground/40" />
                      <span className="font-medium">
                        {new Date(leave.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} → {new Date(leave.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/70 italic line-clamp-2">&quot;{leave.reason}&quot;</p>
                    
                    {canApprove && leave.status === 'Pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button onClick={() => handleApprove(leave.id, 'Approved')} size="sm" className="flex-1 h-8 bg-success hover:bg-success/90">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Approve
                        </Button>
                        <Button onClick={() => handleApprove(leave.id, 'Rejected')} size="sm" variant="destructive" className="flex-1 h-8">
                          <XCircle className="mr-1 h-3 w-3" /> Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  )
}
