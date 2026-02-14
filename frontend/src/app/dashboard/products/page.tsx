"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/portfolio?tab=products")
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center animate-in fade-in zoom-in duration-500">
      <h3 className="text-xl font-bold tracking-tight">Redirecting to Portfolio...</h3>
      <p className="text-muted-foreground text-sm max-w-md">
        We have consolidated software products and client projects into a single unified view.
      </p>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <Button 
        variant="outline" 
        onClick={() => router.replace("/dashboard/portfolio?tab=products")}
        className="mt-4"
      >
        Click here if not redirected
      </Button>
    </div>
  )
}
