"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useState } from "react"
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  FileText,
  Briefcase,
  ShoppingBag,
  Calendar,
  Activity,
  Layers,
  Menu,
  X
} from "lucide-react"
import { usePermissions } from "@/hooks/use-permissions"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Providers } from "@/components/providers"

interface LayoutShellProps {
  children: ReactNode
}

function SidebarContent({ pathname, filteredNav, canSeeSettings, isAdmin, handleLogout, user, role }: any) {
  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] dark:bg-[#020617] relative">
      {/* Mobile Close Button (Top Right) */}
      {/* Mobile Close Button (Top Right) - REMOVED (SheetContent has built-in close) */}

      {/* Sidebar Header / Branding */}
      <div className="h-20 flex items-center px-6 border-b border-border/40 bg-[#FFFFFF] dark:bg-[#020617]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white h-10 w-10 rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none text-slate-900 dark:text-white">Media Masala</span>
            <span className="text-[10px] text-indigo-500/80 font-bold uppercase tracking-[0.2em] mt-1">Enterprise CRM</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-8 space-y-10 overflow-y-auto custom-scrollbar">
        {/* Main Section */}
        <div className="space-y-1.5">
          <div className="px-3 mb-4">
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Main Navigation</p>
          </div>
          {filteredNav.map((item: any) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`h-[20px] w-[20px] transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Admin Section */}
        {canSeeSettings && (
          <div className="space-y-1.5 pt-4 border-t border-border/30">
            <div className="px-3 mb-4">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">{isAdmin ? "System Admin" : "Management"}</p>
            </div>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                pathname.startsWith("/dashboard/settings")
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Settings className={`h-[20px] w-[20px] ${pathname.startsWith("/dashboard/settings") ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
              <span>Settings</span>
            </Link>
          </div>
        )}
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-4 bg-white dark:bg-slate-950 border-t border-border/40">
         <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 mb-3 border border-border/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-600/20">
                {user?.email?.[0].toUpperCase() || "U"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">
                  {user?.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {role || "Team Member"}
                </span>
              </div>
            </div>
         </div>
         
         <button 
           onClick={handleLogout}
           className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 group"
         >
           <div className="flex items-center gap-3">
             <LogOut className="h-[18px] w-[18px] transition-transform group-hover:-translate-x-0.5" />
             <span>Sign Out</span>
           </div>
           <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
         </button>
      </div>
    </div>
  )
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { isAdmin, hasModule, role } = usePermissions()
  const user = session?.user as any
  
  if (pathname.startsWith("/auth")) {
    return <>{children}</>
  }
  
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, module: "dashboard" },
    { href: "/dashboard/portfolio", label: "Portfolio", icon: Layers, module: "projects" },
    { href: "/dashboard/leads", label: "Leads", icon: Users, module: "leads" },
    { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare, module: "tasks" },
    { href: "/dashboard/eod", label: "EOD Reports", icon: FileText, module: "eod" },
    { href: "/dashboard/attendance", label: "Attendance", icon: CheckSquare, module: "attendance" },
    { href: "/dashboard/attendance/leaves", label: "Leaves", icon: Calendar, module: "attendance" },
    { href: "/dashboard/reports", label: "Reports", icon: FileText, module: "reports" },
    { href: "/dashboard/logs", label: "System Logs", icon: Activity, module: "reports" },
  ]

  const filteredNav = navItems.filter(item => {
    if (item.href === "/dashboard") return true
    return hasModule(item.module)
  })

  const canSeeSettings = isAdmin || hasModule("employees")

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {}
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-sidebar-border hidden lg:flex flex-col z-30 shadow-xl shadow-slate-200/50">
        <SidebarContent 
          pathname={pathname} 
          filteredNav={filteredNav} 
          canSeeSettings={canSeeSettings} 
          isAdmin={isAdmin} 
          handleLogout={handleLogout}
          user={user}
          role={role}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border/50 bg-[#FFFFFF] dark:bg-[#020617] sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6">
           <div className="flex items-center gap-3">
             <Sheet>
               <SheetTrigger asChild>
                 <div className="relative group lg:hidden">
                   <div className="absolute -inset-1.5 bg-indigo-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <Button variant="ghost" size="icon" className="relative h-11 w-11 border-2 border-indigo-600/10 bg-white dark:bg-slate-950 shadow-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-90 rounded-xl flex items-center justify-center">
                     <Menu className="h-6 w-6 text-indigo-600" strokeWidth={2.5} />
                     <span className="sr-only">Toggle Menu</span>
                   </Button>
                 </div>
               </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[260px] border-0 shadow-2xl bg-[#FFFFFF] dark:bg-[#020617] ring-0 outline-none">
                  <SidebarContent 
                    pathname={pathname} 
                    filteredNav={filteredNav} 
                    canSeeSettings={canSeeSettings} 
                    isAdmin={isAdmin} 
                    handleLogout={handleLogout}
                    user={user}
                    role={role}
                  />
                </SheetContent>
             </Sheet>

             <div className="lg:hidden flex items-center gap-3 ml-2 mr-2">
               <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white h-9 w-9 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/20 shadow-indigo-500 border border-white/20">
                 M
               </div>
               <div className="flex flex-col">
                 <span className="font-bold text-[14px] tracking-tight text-slate-900 dark:text-white leading-none">Media Masala</span>
                 <span className="text-[9px] text-indigo-500/80 font-bold uppercase tracking-wider mt-1 hidden xs:block">Enterprise CRM</span>
               </div>
             </div>

             <div className="hidden sm:flex items-center gap-2">
               <div className="text-muted-foreground/40 font-medium text-[10px] uppercase tracking-widest px-1">App</div>
               <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
               <span className="text-foreground font-semibold text-xs capitalize tracking-tight">
                 {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
               </span>
             </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-border/40 bg-muted/30 shadow-xs cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-[9px]">
                  {user?.email?.[0].toUpperCase() || "U"}
                </div>
                <div className="flex flex-col max-w-[100px]">
                  <span className="text-[10px] font-semibold leading-tight truncate">{user?.email?.split('@')[0]}</span>
                  <span className="text-[8px] text-muted-foreground/60 font-medium uppercase tracking-tighter">{role || user?.role}</span>
                </div>
              </div>
           </div>
        </header>

        <main className="p-4 lg:p-6 max-w-7xl w-full mx-auto animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  )
}


export default function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <LayoutShell>{children}</LayoutShell>
    </Providers>
  )
}
