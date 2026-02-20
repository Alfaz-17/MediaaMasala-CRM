"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePermissions } from "@/hooks/use-permissions"
import { 
  Box, 
  Calendar, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  Clock,
  MessageSquare,
  Loader2,
  UserCheck,
  Briefcase,
  Tag
} from "lucide-react"

interface Product {
  id: number
  name: string
  description?: string
  category?: string
  status?: string
  createdAt: string
  productManager?: {
    id: number
    firstName: string
    lastName: string
    role?: { name: string }
    department?: { name: string }
  }
  tasks: Array<{
    id: string
    title: string
    status: string
    priority: string
    dueDate: string
    assignee?: { firstName: string; lastName: string }
  }>
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const id = params.id
  const { data: session } = useSession()
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const canCreateTask = hasPermission("tasks", "create")
  const canEditProduct = hasPermission("products", "edit") || hasPermission("products", "create")
  const canDeleteProduct = hasPermission("products", "delete")

  const [deleting, setDeleting] = useState(false)

  const handleDeleteProduct = async () => {
    if (!product) return
    if (!confirm(`Are you sure you want to delete product: ${product.name}?`)) return

    setDeleting(true)
    try {
      await apiClient.delete(`/products/${product.id}`)
      router.push("/dashboard/products")
    } catch (err) {
      console.error("Error deleting product:", err)
      setDeleting(false)
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient.get(`/products/${id}`)
        setProduct(data)
      } catch (err) {
        console.error("Error fetching product:", err)
        router.push("/dashboard/products")
      } finally {
        setLoading(false)
      }
    }

    if (session && id) fetchProduct()
  }, [session, id])

  if (loading) {
    return <div className="p-8 animate-pulse text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Loading Product Details...</div>
  }

  if (!product) return null

  const statusColor = product.status === "Active"
    ? "bg-green-500/10 text-green-600"
    : product.status === "Draft"
    ? "bg-amber-500/10 text-amber-600"
    : product.status === "Discontinued"
    ? "bg-red-500/10 text-red-600"
    : "bg-primary/10 text-primary"

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit text-[10px] font-bold uppercase tracking-widest h-8 px-0 hover:bg-transparent opacity-50 hover:opacity-100 transition-opacity"
          onClick={() => router.push("/dashboard/products")}
        >
          <ArrowLeft className="h-3 w-3 mr-2" />
          Back to Products
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-tighter border-none ${statusColor}`}>
                  {product.status === "On_Hold" ? "On Hold" : product.status || "Active"}
               </Badge>
               <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Product ID: #{product.id}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground">{product.name}</h1>
            <p className="text-muted-foreground text-xs font-medium mt-1">Details and tasks for this product.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/20 bg-muted/20">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                Product Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {product.description ? (
                <div 
                  className="text-sm text-foreground/80 leading-relaxed prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="text-sm text-foreground/80 leading-relaxed">
                  No detailed description provided for this product.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/20 bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Tasks
              </CardTitle>
              <Badge variant="secondary" className="text-[9px] font-black">{product.tasks?.length || 0} Total</Badge>
            </CardHeader>
            <CardContent className="p-0">
              {!product.tasks || product.tasks.length === 0 ? (
                 <div className="p-12 text-center">
                    <p className="text-xs text-muted-foreground">No tasks linked to this product yet.</p>
                    {canCreateTask && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4 text-[10px] font-bold uppercase tracking-widest"
                        onClick={() => router.push(`/dashboard/tasks/new?productId=${product.id}`)}
                      >
                        Create First Task
                      </Button>
                    )}
                 </div>
              ) : (
                <div className="divide-y divide-border/20">
                  {product.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between cursor-pointer"
                      onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">{task.title}</p>
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-bold uppercase text-muted-foreground/50 tracking-widest">{task.priority} Priority</span>
                           <span className="text-[9px] font-bold uppercase text-muted-foreground/40">{new Date(task.dueDate).toLocaleDateString()}</span>
                           {task.assignee && (
                             <>
                               <span className="text-[9px] text-muted-foreground/30">•</span>
                               <span className="text-[9px] font-bold text-muted-foreground/50">{task.assignee.firstName} {task.assignee.lastName}</span>
                             </>
                           )}
                        </div>
                      </div>
                      <Badge className={`text-[8px] font-black uppercase tracking-tighter ${
                        task.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'
                      }`} variant="outline">
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           {/* Product Info Card */}
           <Card className="border-border/40 shadow-sm overflow-hidden border-l-4 border-l-primary/60">
             <CardHeader className="pb-3 pt-5 px-5">
               <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">Product Info</p>
               <CardTitle className="text-sm font-bold">{product.name}</CardTitle>
             </CardHeader>
             <CardContent className="px-5 pb-5 space-y-4">
                <div className="space-y-3">
                   {product.category && (
                     <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-muted-foreground/40" />
                        <span className="text-xs font-medium text-foreground/70">{product.category}</span>
                     </div>
                   )}
                   <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground/40" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Created {new Date(product.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
             </CardContent>
           </Card>

           {/* Product Manager Card */}
           {product.productManager && (
             <Card className="border-border/40 shadow-sm overflow-hidden border-l-4 border-l-green-500/60">
               <CardHeader className="pb-3 pt-5 px-5">
                 <p className="text-[9px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">Product Manager</p>
                 <CardTitle className="text-sm font-bold">{product.productManager.firstName} {product.productManager.lastName}</CardTitle>
               </CardHeader>
               <CardContent className="px-5 pb-5 space-y-3">
                 <div className="flex items-center gap-2">
                   <UserCheck className="h-3 w-3 text-green-500/60" />
                   <span className="text-xs font-medium text-foreground/70">{product.productManager.role?.name}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Briefcase className="h-3 w-3 text-muted-foreground/40" />
                   <span className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">{product.productManager.department?.name}</span>
                 </div>
               </CardContent>
             </Card>
           )}

           {/* Quick Actions */}
           <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Quick Actions</h4>
              <div className="space-y-2">
                {canCreateTask && (
                  <Button 
                    className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-9" 
                    variant="outline"
                    onClick={() => router.push(`/dashboard/tasks/new?productId=${product.id}`)}
                  >
                     Add Task
                  </Button>
                )}
                {canEditProduct && (
                  <Button 
                    className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-9" 
                    variant="outline"
                    onClick={() => router.push("/dashboard/products")}
                  >
                     Edit Product (List View)
                  </Button>
                )}
                {canDeleteProduct && (
                  <Button 
                    className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-9 text-destructive hover:bg-destructive/10 border-destructive/20" 
                    variant="outline"
                    onClick={handleDeleteProduct}
                    disabled={deleting}
                  >
                     {deleting ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
                     Delete Product
                  </Button>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
