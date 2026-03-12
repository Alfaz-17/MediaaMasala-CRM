import { useState, useMemo } from "react"

export type SortDirection = "asc" | "desc" | null

export interface SortConfig {
  key: string
  direction: SortDirection
}

interface UseDataTableOptions<T> {
  data: T[]
  pageSize?: number
  initialSort?: SortConfig
  searchFields?: (keyof T)[]
  searchTerm?: string
}

export function useDataTable<T>({
  data,
  pageSize: initialPageSize = 10,
  initialSort = { key: "", direction: null },
  searchFields = [],
  searchTerm = ""
}: UseDataTableOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort)

  const handleSort = (key: string) => {
    let direction: SortDirection = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null
    }
    setSortConfig({ key, direction })
    setCurrentPage(1) // Reset to first page when sorting
  }

  const filteredData = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) return data

    const lowerTerm = searchTerm.toLowerCase()
    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(lowerTerm)
      })
    })
  }, [data, searchTerm, searchFields])

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData

    return [...filteredData].sort((a: any, b: any) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === bValue) return 0
      
      const comparison = aValue < bValue ? -1 : 1
      return sortConfig.direction === "asc" ? comparison : -comparison
    })
  }, [filteredData, sortConfig])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    sortConfig,
    handleSort,
    sortedData,
    filteredData,
    paginatedData,
    totalPages,
    totalItems: filteredData.length
  }
}
