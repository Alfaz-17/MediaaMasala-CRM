"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { 
  ChevronRight, 
  ChevronDown, 
  Users, 
  User, 
  Check,
  Search
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface EmployeeNode {
  id: number
  firstName: string
  lastName: string
  role: { name: string; code: string }
  department: { name: string; code: string }
  children: EmployeeNode[]
}

interface HierarchySelectorProps {
  selectedId: string
  onSelect: (id: string, isRecursive: boolean) => void
  isRecursive: boolean
}

export function HierarchySelector({ 
  selectedId, 
  onSelect, 
  isRecursive 
}: HierarchySelectorProps) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [search, setSearch] = useState("")

  const { data: hierarchy = [], isLoading } = useQuery<EmployeeNode[]>({
    queryKey: ["employee-hierarchy"],
    queryFn: () => apiClient.get("/admin/hierarchy-tree")
  })

  // Auto-expand the selected path or first level
  useEffect(() => {
    if (hierarchy.length > 0) {
      setExpanded(prev => ({ ...prev, [hierarchy[0].id]: true }))
    }
  }, [hierarchy])

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const findEmployee = (nodes: EmployeeNode[], id: number): EmployeeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      const child = findEmployee(node.children, id)
      if (child) return child
    }
    return null
  }

  const selectedEmployee = selectedId === 'all' ? null : findEmployee(hierarchy, Number(selectedId))

  const renderNode = (node: EmployeeNode, depth: number = 0) => {
    const hasChildren = node.children.length > 0
    const isExpanded = expanded[node.id]
    const isSelected = selectedId === String(node.id)

    // Basic search filtering
    const matchesSearch = 
      node.firstName.toLowerCase().includes(search.toLowerCase()) ||
      node.lastName.toLowerCase().includes(search.toLowerCase()) ||
      node.role.name.toLowerCase().includes(search.toLowerCase())

    if (search && !matchesSearch && !node.children.some(c => findEmployee([c], Number(selectedId)))) {
        // This is a simple recursive check for search, can be improved
    }

    return (
      <div key={node.id} className="space-y-1">
        <div 
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group",
            isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
          )}
          style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
          onClick={() => {
            onSelect(String(node.id), isRecursive)
            setOpen(false)
          }}
        >
          <div 
            onClick={(e) => hasChildren && toggleExpand(node.id, e)}
            className={cn(
                "p-0.5 rounded-sm hover:bg-muted transition-colors opacity-40 group-hover:opacity-100",
                !hasChildren && "invisible"
            )}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </div>
          
          {hasChildren ? <Users className="h-3.5 w-3.5 opacity-60" /> : <User className="h-3.5 w-3.5 opacity-60" />}
          
          <div className="flex flex-col flex-1 truncate">
            <span className="text-[11px] font-bold tracking-tight truncate">
                {node.firstName} {node.lastName}
            </span>
            <span className="text-[9px] opacity-50 uppercase tracking-widest font-black leading-none">
                {node.role.name}
            </span>
          </div>

          {isSelected && <Check className="h-3 w-3" />}
        </div>

        {hasChildren && isExpanded && (
          <div className="transition-all animate-in fade-in slide-in-from-top-1 duration-200">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={open}
          className="h-9 min-w-[200px] justify-between px-3 bg-card border-border/40 rounded-lg shadow-sm hover:border-primary/30 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
            <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Viewer</span>
                <span className="text-[11px] font-bold text-foreground truncate max-w-[120px]">
                    {selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "Personal View"}
                </span>
            </div>
          </div>
          <ChevronDown className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-opacity" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px] p-0 rounded-xl shadow-2xl border-border/40 bg-card overflow-hidden" align="start">
        <div className="p-3 border-b border-border/10 bg-muted/5">
            <div className="relative group">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                <Input 
                    placeholder="Find team member..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 pl-8 text-[11px] bg-background border-border/20 rounded-lg focus-visible:ring-primary/20"
                />
            </div>
        </div>
        
        <div className="max-h-[350px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border/20">
          <div 
             className={cn(
                "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all mb-1",
                selectedId === 'all' ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-muted-foreground"
             )}
             onClick={() => {
                onSelect('all', isRecursive)
                setOpen(false)
             }}
          >
             <LayoutGrid className="h-3.5 w-3.5 opacity-60" />
             <span className="text-[11px] font-black uppercase tracking-widest">Company Dashboard</span>
             {selectedId === 'all' && <Check className="ml-auto h-3 w-3" />}
          </div>

          <div className="h-px bg-border/10 my-2 mx-2" />

          {isLoading ? (
            <div className="p-4 text-center space-y-2">
                <div className="h-3 w-24 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-3 w-32 bg-muted animate-pulse rounded mx-auto" />
            </div>
          ) : (
            hierarchy.map(node => renderNode(node))
          )}
        </div>

        {/* Recursive Toggle */}
        <div className="p-2 border-t border-border/10 bg-muted/10">
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group transition-colors">
                <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">Recursive View</span>
                    <span className="text-[9px] text-muted-foreground/60 font-medium">Show team's entire downline data</span>
                </div>
                <div 
                    role="switch"
                    aria-checked={isRecursive}
                    className={cn(
                        "relative h-4.5 w-9 rounded-full transition-colors outline-none ring-offset-background",
                        isRecursive ? "bg-primary" : "bg-muted"
                    )}
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelect(selectedId, !isRecursive)
                    }}
                >
                    <div className={cn(
                        "pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-lg ring-0 transition-transform",
                        isRecursive ? "translate-x-4" : "translate-x-1"
                    )} />
                </div>
            </label>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { LayoutGrid } from "lucide-react"
