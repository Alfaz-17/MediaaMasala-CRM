"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { Clock, MapPin, CheckCircle2, LogOut, Calendar as CalendarIcon, History } from "lucide-react"
import { toast } from "sonner"
import { PermissionGuard } from "@/components/permission-guard"

interface AttendanceRecord {
  id: number
  date: string
  checkIn: string
  checkOut: string | null
  status: string
  location?: string
  notes?: string
  employee?: {
    firstName: string
    lastName: string
    department: { name: string }
  }
}

export default function AttendancePage() {
  const { data: session } = useSession()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [activeRecord, setActiveRecord] = useState<AttendanceRecord | null>(null)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("")

  const fetchAttendance = async () => {
    try {
      const data = await apiClient.get("/attendance")
      setRecords(data)
      
      // Find today's active record (check-in today but no check-out)
      const today = new Date().toISOString().split('T')[0]
      const active = data.find((r: AttendanceRecord) => 
        r.date.startsWith(today) && !r.checkOut
      )
      setActiveRecord(active || null)
    } catch (err) {
      console.error("Failed to fetch attendance:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) fetchAttendance()
  }, [session])

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    try {
      await apiClient.post("/attendance/check-in", {})
      toast.success("Checked in successfully")
      fetchAttendance()
    } catch (err: any) {
      toast.error(err.message || "Check-in failed")
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleCheckOut = async () => {
    if (!activeRecord) return
    setIsCheckingOut(true)
    try {
      await apiClient.post("/attendance/check-out", {})
      toast.success("Checked out successfully")
      fetchAttendance()
    } catch (err: any) {
      toast.error(err.message || "Check-out failed")
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Compute unique employees for filter
  const uniqueEmployees = Array.from(new Set(records.map(r => r.employee?.firstName + " " + r.employee?.lastName + "|" + r.employee?.firstName)))
    .map(e => {
       return e.split("|")[0]
    })
    .filter((value, index, self) => self.indexOf(value) === index && value.trim() !== "undefined undefined")

  // Filter records by employee and date
  const filteredRecords = records.filter(r => {
    const matchesEmployee = selectedEmployeeId === "all" || `${r.employee?.firstName} ${r.employee?.lastName}` === selectedEmployeeId
    const matchesDate = !selectedDate || r.date.startsWith(selectedDate)
    return matchesEmployee && matchesDate
  })

  return (
    <PermissionGuard module="attendance">
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Attendance</h1>
          <p className="text-muted-foreground text-sm font-medium">Track your daily presence and work hours.</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex h-11 rounded-xl border border-border/40 bg-card px-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 shadow-sm cursor-pointer"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="h-11 px-3 rounded-xl border border-border/40 bg-card text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shadow-sm"
              >
                Clear
              </button>
            )}
          </div>

          {/* Employee Filter - Only show if we have multiple people */}
          {uniqueEmployees.length > 1 && (
             <div className="relative min-w-[200px]">
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-border/40 bg-card px-4 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="all">All Employees ({records.length})</option>
                  {uniqueEmployees.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px]">▼</div>
             </div>
          )}

          <div className="flex flex-col items-end px-4 border-r border-border/50">
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-none mb-1">Status</span>
             <Badge variant={activeRecord ? "success" : "secondary"} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">
               {activeRecord ? "Active" : "Logged Off"}
             </Badge>
          </div>
          
          {!activeRecord ? (
            <Button onClick={handleCheckIn} disabled={isCheckingIn} className="h-11 rounded-xl font-bold text-xs uppercase tracking-widest px-6 shadow-lg shadow-primary/10">
              <CheckCircle2 className="mr-2 h-4 w-4" /> {isCheckingIn ? "Processing..." : "Clock In"}
            </Button>
          ) : (
            <Button onClick={handleCheckOut} disabled={isCheckingOut} variant="destructive" className="h-11 rounded-xl font-bold text-xs uppercase tracking-widest px-6 shadow-lg shadow-destructive/10">
              <LogOut className="mr-2 h-4 w-4" /> {isCheckingOut ? "Processing..." : "Clock Out"}
            </Button>
          )}
        </div>
      </div>

      {/* Current Session Card */}
      {activeRecord && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Active Session
              </CardTitle>
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider border-primary/30 bg-primary/10 text-primary">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 p-4 rounded-xl border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Check-In</span>
                </div>
                <p className="text-lg font-mono font-bold text-foreground tabular-nums">
                  {new Date(activeRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="bg-card/50 p-4 rounded-xl border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Date</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {new Date(activeRecord.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            {activeRecord.location && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground/70 bg-muted/30 p-3 rounded-lg">
                <MapPin className="h-3.5 w-3.5" />
                <span className="font-medium">{activeRecord.location}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Attendance History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">History</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted/20 animate-pulse border border-border/10" />
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <Card className="border-dashed py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <h3 className="text-sm font-bold text-muted-foreground/40 uppercase tracking-[0.4em]">No Records</h3>
              <p className="text-xs text-muted-foreground/60 mt-2">
                  {selectedEmployeeId !== "all" 
                    ? `No attendance records found for ${selectedEmployeeId}.` 
                    : "Your attendance log is empty. Clock in to start tracking."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="group border-border/40 hover:border-primary/20 transition-all overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">
                        {new Date(record.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <Badge 
                      variant={record.status === 'Present' ? 'success' : record.status === 'Absent' ? 'destructive' : 'secondary'}
                      className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-sm"
                    >
                      {record.status}
                    </Badge>
                  </div>
                  {/* Show employee name if filtering all or if multiple employees exist */}
                  <div className="mt-2 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                      {record.employee?.firstName} {record.employee?.lastName}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">In</p>
                      <p className="text-sm font-mono font-bold text-foreground tabular-nums">
                        {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Out</p>
                      <p className="text-sm font-mono font-bold text-foreground tabular-nums">
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </p>
                    </div>
                  </div>
                  {record.location && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 bg-muted/20 p-2 rounded-lg">
                      <MapPin className="h-3 w-3" />
                      <span className="font-medium truncate">{record.location}</span>
                    </div>
                  )}
                  {record.notes && (
                    <p className="text-[11px] text-muted-foreground/70 italic line-clamp-2 leading-relaxed">
                      &quot;{record.notes}&quot;
                    </p>
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
