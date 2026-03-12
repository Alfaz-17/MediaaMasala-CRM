import { Button } from "./button"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react"

interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function DataTablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: DataTablePaginationProps) {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return (
      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest opacity-50">
          Showing <span className="text-foreground/70 font-bold">{totalItems}</span> items
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-border/40 mt-4">
      <div className="flex-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest opacity-50">
        Showing <span className="text-foreground/70 font-bold">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to{" "}
        <span className="text-foreground/70 font-bold">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
        <span className="text-foreground/70 font-bold">{totalItems}</span> records
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mr-4">
          Page {currentPage} of {totalPages}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex rounded-lg border-border/50"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-border/50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-border/50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex rounded-lg border-border/50"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
