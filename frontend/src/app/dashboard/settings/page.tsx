"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

const SETTINGS_CARDS = [
  {
    title: "Departments",
    description: "Manage organization departments and teams.",
    href: "/dashboard/settings/departments",
    icon: "🏢",
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Roles",
    description: "Define job roles and access levels.",
    href: "/dashboard/settings/roles",
    icon: "🛡️",
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Employees",
    description: "Onboard staff and link them to roles/departments.",
    href: "/dashboard/settings/employees",
    icon: "👥",
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Permission Settings",
    description: "Fine-tune what each role can see and do.",
    href: "/dashboard/settings/permission-matrix",
    icon: "🕸️",
    color: "bg-amber-50 text-amber-600"
  }
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user as any

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-3xl font-black text-gray-900">Access Denied</h1>
        <p className="text-gray-500 max-w-sm mt-2 font-medium">
          Only administrators can access system settings. Please contact your manager if you believe you should have access.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">System Settings</h1>
        <p className="text-muted-foreground text-xs font-medium mt-1">Manage settings and who can see what.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SETTINGS_CARDS.map((card) => (
          <Link key={card.href} href={card.href} className="group">
            <Card className="rounded-xl border border-border/40 shadow-xs overflow-hidden h-full bg-card">
              <CardHeader className="p-6">
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-2xl mb-4 shadow-xs`}>
                  {card.icon}
                </div>
                <CardTitle className="text-base font-semibold tracking-tight">{card.title}</CardTitle>
                <CardDescription className="text-muted-foreground/60 font-medium text-[11px] leading-relaxed mt-1">{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary opacity-80">
                  <span>Configure</span>
                  <span>→</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}





