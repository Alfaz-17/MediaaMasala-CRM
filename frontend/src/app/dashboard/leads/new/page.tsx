"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

const LEAD_SOURCES = ["Website", "Referral", "Cold_Call", "Email"]

export default function NewLeadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await apiClient.post("/leads", formData)
      toast.success("Lead created successfully")
      router.push("/dashboard/leads")
    } catch (err: any) {
      setError(err.message || "Failed to create lead")
      toast.error(err.message || "Failed to create lead")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div className="p-10 animate-pulse text-center">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
        <Link href="/dashboard/leads" className="text-muted-foreground/40">All Sales</Link>
        <span className="opacity-40">/</span>
        <span className="text-foreground/80 tracking-tight">Add Sale</span>
      </div>

      <Card className="rounded-xl border border-border/40 shadow-xs overflow-hidden bg-card">
        <CardHeader className="border-b border-border/30 pb-6 pt-8 px-10">
          <CardTitle className="text-xl font-semibold tracking-tight">Add Sale</CardTitle>
          <p className="text-xs font-medium text-muted-foreground/60 mt-1.5 leading-relaxed">Enter the information for this sale.</p>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-10 pt-8">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider animate-in shake">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider pl-1">Name *</Label>
                <Input 
                  id="name"
                  name="name" 
                  placeholder="John Doe"
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="h-10 rounded-lg border-border/40 bg-muted/5 font-medium text-xs px-4"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider pl-1">Email *</Label>
                <Input 
                  id="email"
                  name="email" 
                  type="email" 
                  placeholder="john@example.com"
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="h-10 rounded-lg border-border/40 bg-muted/5 font-medium text-xs px-4"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider pl-1">Phone</Label>
                <Input 
                  id="phone"
                  name="phone" 
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg border-border/40 bg-muted/5 font-medium text-xs px-4"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider pl-1">Company</Label>
                <Input 
                  id="company"
                  name="company" 
                  placeholder="Acme Corp"
                  value={formData.company} 
                  onChange={handleChange} 
                  className="h-10 rounded-lg border-border/40 bg-muted/5 font-medium text-xs px-4"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="source" className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider pl-1">Source *</Label>
              <div className="relative">
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-lg border border-border/40 bg-muted/5 px-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer"
                >
                  {LEAD_SOURCES.map((src) => (
                    <option key={src} value={src}>{src.replace("_", " ")}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-[8px]">▼</div>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="notes" className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider pl-1">Initial Notes / Context</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any specific details about this lead..."
                className="flex w-full rounded-lg border border-border/40 bg-muted/5 px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 bg-muted/20 p-6 px-10 border-t border-border/30 rounded-b-xl">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => router.push("/dashboard/leads")}
              className="h-9 px-6 rounded-lg text-xs font-semibold tracking-tight uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={loading}
              className="h-9 px-8 rounded-lg text-xs font-bold shadow-lg shadow-primary/10 uppercase tracking-wider"
            >
              Create Lead
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
