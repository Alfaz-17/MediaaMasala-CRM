"use client"

import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ViewType = "grid" | "list"

interface ViewToggleProps {
  view: ViewType
  onViewChange: (view: ViewType) => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="sm"
        className={`h-8 px-3 ${view === "grid" ? "bg-card shadow-sm" : ""}`}
        onClick={() => onViewChange("grid")}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        <span className="text-xs font-medium">Grid</span>
      </Button>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="sm"
        className={`h-8 px-3 ${view === "list" ? "bg-card shadow-sm" : ""}`}
        onClick={() => onViewChange("list")}
      >
        <List className="h-4 w-4 mr-2" />
        <span className="text-xs font-medium">List</span>
      </Button>
    </div>
  )
}
