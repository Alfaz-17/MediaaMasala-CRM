"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, Box, MoreHorizontal, Pencil, Trash2, ListTodo, Loader2, CheckCircle2, User, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PermissionGuard } from "@/components/permission-guard"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

interface ManagerInfo {
  id: number
  firstName: string
  lastName: string
  empId: string
  role?: { name: string }
  department?: { name: string }
}

interface Product {
  id: number
  name: string
  description?: string
  category?: string
  status?: string
  createdAt: string
  productManagerId?: number | null
  productManager?: ManagerInfo | null
}

interface Employee {
  id: number
  firstName: string
  lastName: string
  empId: string
  role?: { name: string }
  department?: { name: string }
}

interface Task {
  id: string
  title: string
  status: string
  priority: string
  dueDate: string
  assignee?: { firstName: string }
  product?: { id: number }
}

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Form state managed separately for selects and rich text
  const [formProdMgrId, setFormProdMgrId] = useState<string>("")
  const [formDescription, setFormDescription] = useState<string>("")
  const [formStatus, setFormStatus] = useState<string>("Active")

  // Task Context State
  const [viewTasksProduct, setViewTasksProduct] = useState<Product | null>(null)
  const [contextTasks, setContextTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get("/products")
      setProducts(data)
    } catch (err) {
      console.error("Failed to load products:", err)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const data = await apiClient.get("/leads/employees")
      setEmployees(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load employees:", err)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchProducts()
      fetchEmployees()
    }
  }, [status])

  // Sync form state when editing a product
  useEffect(() => {
    if (editingProduct) {
      setFormProdMgrId(editingProduct.productManagerId?.toString() || "")
      setFormDescription(editingProduct.description || "")
      setFormStatus(editingProduct.status || "Active")
    } else {
      setFormProdMgrId("")
      setFormDescription("")
      setFormStatus("Active")
    }
  }, [editingProduct])

  useEffect(() => {
    if (!viewTasksProduct) return

    const fetchProductTasks = async () => {
      setLoadingTasks(true)
      try {
        const allTasks = await apiClient.get("/tasks")
        const tasks = Array.isArray(allTasks) ? allTasks : allTasks.tasks || []
        const filtered = tasks.filter((t: Task) => t.product?.id === viewTasksProduct.id)
        setContextTasks(filtered)
      } catch (err) {
        console.error("Failed to fetch product tasks:", err)
        toast.error("Could not load associated tasks")
      } finally {
        setLoadingTasks(false)
      }
    }

    fetchProductTasks()
  }, [viewTasksProduct])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get("name"),
      category: formData.get("category"),
      description: formDescription,
      status: formStatus || "Active",
      price: 0,
      productManagerId: (formProdMgrId && formProdMgrId !== "none") ? formProdMgrId : null,
    }

    try {
      if (editingProduct) {
        await apiClient.patch(`/products/${editingProduct.id}`, payload)
        toast.success("Product updated")
      } else {
        await apiClient.post("/products", payload)
        toast.success("Product created")
      }
      setIsModalOpen(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (err: any) {
      toast.error(err.message || "Failed to save product")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    setDeletingId(id)
    try {
      await apiClient.delete(`/products/${id}`)
      toast.success("Product deleted")
      fetchProducts()
    } catch (err: any) {
      toast.error("Failed to delete product")
    } finally {
      setDeletingId(null)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (status === "unauthenticated") {
    router.push("/auth/login")
    return null
  }

  return (
    <PermissionGuard module="products" action="view">
      <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Software Products</h1>
            <p className="text-muted-foreground text-sm font-medium">Manage and monitor all your digital assets.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 w-64 bg-muted/40 border-border/40 rounded-xl h-11 text-xs focus:ring-1 focus:ring-primary transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if(!open) setEditingProduct(null); }}>
              <DialogTrigger asChild>
                <Button className="shadow-lg shadow-primary/10 rounded-xl h-11 font-bold text-[11px] uppercase tracking-widest px-6 ml-2">
                  <Plus className="mr-2 h-4 w-4" /> New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'New Product'}</DialogTitle>
                    <DialogDescription>Add or update software product details here.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-6">
                    {/* Row 1: Name & Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="name" defaultValue={editingProduct?.name} required placeholder="e.g. Media Masala CRM" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category / Tech Stack</Label>
                        <Input id="category" name="category" defaultValue={editingProduct?.category} placeholder="e.g. SaaS, Mobile App" />
                      </div>
                    </div>

                    {/* Row 2: Status */}
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={formStatus} onValueChange={setFormStatus}>
                        <SelectTrigger className="h-10 text-xs rounded-lg">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Discontinued">Discontinued</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 3: Product Manager Assignment */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-primary/60" />
                        Product Manager
                      </Label>
                      <Select value={formProdMgrId} onValueChange={setFormProdMgrId}>
                        <SelectTrigger className="h-10 text-xs rounded-lg">
                          <SelectValue placeholder="Select Product Manager..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <SelectItem value="none" className="text-xs text-muted-foreground">None</SelectItem>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id.toString()} className="text-xs">
                              {emp.firstName} {emp.lastName} — {emp.role?.name || "N/A"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 3: Rich Text Description */}
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <RichTextEditor 
                        value={formDescription} 
                        onChange={setFormDescription} 
                        placeholder="Describe the product features, tech stack, requirements..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting} className="w-full sm:w-auto h-11 px-8 font-bold text-[11px] uppercase tracking-widest">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-border/40 shadow-none bg-card/40">
                <CardHeader className="pb-3">
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </CardContent>
              </Card>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card key={product.id} className="group hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Box className="w-5 h-5" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setIsModalOpen(true); }} className="cursor-pointer">
                          <Pencil className="mr-2 h-3.5 w-3.5" /> Edit details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} disabled={deletingId === product.id}>
                          {deletingId === product.id ? (
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                          )}
                          Delete product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="mt-4 text-sm font-bold tracking-tight">{product.name}</CardTitle>
                  {product.description ? (
                    <div 
                      className="line-clamp-2 text-[11px] leading-relaxed mt-1.5 text-muted-foreground prose prose-xs max-w-none [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0 [&_li]:m-0 [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs h-8 overflow-hidden" 
                      dangerouslySetInnerHTML={{ __html: product.description }} 
                    />
                  ) : (
                    <CardDescription className="line-clamp-2 text-[11px] leading-relaxed mt-1.5 h-8">
                      No description provided for this software product.
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="mt-auto pt-4 border-t border-border/30">
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[1.5rem]">
                    {product.category && (
                      <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-none rounded-md px-2">
                        {product.category}
                      </Badge>
                    )}
                    <Badge variant={product.status === "Active" ? "default" : product.status === "Draft" ? "secondary" : "destructive"} className={`text-[9px] font-bold uppercase tracking-wider rounded-md px-2 border-none ${product.status === "Active" ? "bg-green-500/10 text-green-600" : product.status === "Draft" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"}`}>
                      {product.status === "On_Hold" ? "On Hold" : product.status || "Active"}
                    </Badge>
                  </div>

                  {/* Manager Badge */}
                  <div className="space-y-1.5 mb-3">
                    {product.productManager && (
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <div className="h-5 w-5 rounded-md bg-green-500/10 flex items-center justify-center text-green-600 border border-green-500/20">
                          <Users className="h-3 w-3" />
                        </div>
                        <span className="font-semibold text-foreground/80">
                          {product.productManager.firstName} {product.productManager.lastName}
                        </span>
                        <span className="text-[8px] text-muted-foreground/50 uppercase font-bold">Product Mgr</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-[10px] h-9 font-bold uppercase tracking-widest border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all rounded-xl"
                    onClick={() => setViewTasksProduct(product)}
                  >
                    <ListTodo className="mr-2 h-3.5 w-3.5 opacity-60" /> View tasks
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted/40 flex items-center justify-center">
                 <Box className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">No software products found matching your search.</p>
              <Button variant="outline" onClick={() => setSearchQuery("")} className="text-xs h-9 rounded-xl">Clear search</Button>
            </div>
          )}
        </div>

        {/* Product Tasks Dialog */}
        <Dialog open={!!viewTasksProduct} onOpenChange={(open) => !open && setViewTasksProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
            <div className="p-6 border-b border-border/40 bg-muted/10">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <ListTodo className="w-5 h-5" />
                  </div>
                  Tasks for {viewTasksProduct?.name}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Showing {contextTasks.length} tasks associated with this product.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end mt-4">
                <Button 
                  size="sm" 
                  className="h-9 text-[10px] font-bold uppercase tracking-widest rounded-xl px-4"
                  onClick={() => {
                    router.push(`/dashboard/tasks/new?productId=${viewTasksProduct?.id}`)
                  }}
                >
                  <Plus className="mr-2 h-3.5 w-3.5" /> Add Task
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border">
              {loadingTasks ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ) : contextTasks.length > 0 ? (
                <div className="space-y-3">
                  {contextTasks.map(task => (
                    <div key={task.id} className="flex items-start justify-between p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-muted/30 transition-all group">
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{task.title}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          <Badge variant="outline" className="text-[8px] h-5 px-1.5 border-primary/20 bg-primary/5 text-primary">
                            {task.status}
                          </Badge>
                          <span className="opacity-30">•</span>
                          <span className={new Date(task.dueDate) < new Date() ? "text-destructive" : "text-muted-foreground/70"}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/10 shadow-inner">
                        {task.assignee?.firstName?.[0] || "?"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center flex flex-col items-center gap-4 text-muted-foreground">
                  <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm font-medium">No tasks found for this product.</p>
                  <p className="text-[11px] opacity-60 max-w-[240px]">This product is currently up to date with no pending actions.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  )
}
