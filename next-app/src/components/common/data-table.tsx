import React from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

export interface DataTableColumn<T = any> {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string
  className?: string
}

export interface DataTableAction<T = any> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (item: T) => void
  variant?: 'default' | 'destructive' | 'secondary'
  show?: (item: T) => boolean
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: DataTableColumn<T>[]
  title?: string
  description?: string
  searchable?: boolean
  searchPlaceholder?: string
  filterable?: boolean
  sortable?: boolean
  actions?: DataTableAction<T>[]
  bulkActions?: {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: (selectedItems: T[]) => void
    variant?: 'default' | 'destructive'
  }[]
  onRowClick?: (item: T) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
  pageSize?: number
  pagination?: boolean
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  description,
  searchable = true,
  searchPlaceholder = 'Search...',
  filterable = false,
  sortable = true,
  actions = [],
  bulkActions = [],
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className,
  pageSize = 10,
  pagination = true,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortConfig, setSortConfig] = React.useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [selectedItems, setSelectedItems] = React.useState<T[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data

    return data.filter((item) =>
      columns.some((column) => {
        if (!column.filterable) return false
        const value = column.accessorKey ? item[column.accessorKey] : ''
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      })
    )
  }, [data, searchQuery, columns])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!sortable) return

    setSortConfig((current) => {
      if (current?.key === columnId) {
        if (current.direction === 'asc') {
          return { key: columnId, direction: 'desc' }
        } else {
          return null // Remove sorting
        }
      } else {
        return { key: columnId, direction: 'asc' }
      }
    })
  }

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems([...paginatedData])
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (item: T, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, item])
    } else {
      setSelectedItems(selectedItems.filter((selected) => selected !== item))
    }
  }

  const isItemSelected = (item: T) => {
    return selectedItems.includes(item)
  }

  const isAllSelected = selectedItems.length === paginatedData.length && paginatedData.length > 0

  return (
    <Card className={cn('w-full', className)}>
      {/* Header */}
      {(title || description || searchable || bulkActions.length > 0) && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {title && <CardTitle className="text-xl">{title}</CardTitle>}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-[250px]"
                  />
                </div>
              )}
              {filterable && (
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Bulk actions */}
          {bulkActions.length > 0 && selectedItems.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-md">
              <span className="text-sm font-medium">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size="sm"
                  onClick={() => {
                    action.onClick(selectedItems)
                    setSelectedItems([])
                  }}
                >
                  {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItems([])}
              >
                Clear selection
              </Button>
            </div>
          )}
        </CardHeader>
      )}

      {/* Table */}
      <CardContent>
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {(bulkActions.length > 0 || actions.length > 0) && (
                    <TableHead className="w-12">
                      {bulkActions.length > 0 && (
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      )}
                    </TableHead>
                  )}
                  {columns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={cn(
                        column.className,
                        column.sortable && sortable && 'cursor-pointer select-none',
                        column.width && `w-[${column.width}]`
                      )}
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center gap-2">
                        {column.header}
                        {column.sortable && sortable && (
                          <div className="flex flex-col">
                            {sortConfig?.key === column.id ? (
                              sortConfig.direction === 'asc' ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )
                            ) : (
                              <ChevronsUpDown className="h-3 w-3 opacity-50" />
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {actions.length > 0 && (
                    <TableHead className="w-12">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        columns.length +
                        (bulkActions.length > 0 ? 1 : 0) +
                        (actions.length > 0 ? 1 : 0)
                      }
                      className="h-24 text-center"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow
                      key={index}
                      className={cn(
                        onRowClick && 'cursor-pointer hover:bg-muted/50',
                        isItemSelected(item) && 'bg-muted/30'
                      )}
                      onClick={() => onRowClick?.(item)}
                    >
                      {(bulkActions.length > 0 || actions.length > 0) && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {bulkActions.length > 0 && (
                            <input
                              type="checkbox"
                              checked={isItemSelected(item)}
                              onChange={(e) => handleSelectItem(item, e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          )}
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.id} className={column.className}>
                          {column.cell
                            ? column.cell(item)
                            : column.accessorKey
                            ? String(item[column.accessorKey] || '')
                            : ''}
                        </TableCell>
                      ))}
                      {actions.length > 0 && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {actions
                                .filter((action) => !action.show || action.show(item))
                                .map((action, actionIndex) => (
                                  <DropdownMenuItem
                                    key={actionIndex}
                                    onClick={() => action.onClick(item)}
                                    className={cn(
                                      action.variant === 'destructive' &&
                                        'text-destructive focus:text-destructive'
                                    )}
                                  >
                                    {action.icon && (
                                      <action.icon className="h-4 w-4 mr-2" />
                                    )}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}{' '}
                entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COMMON ACTION CONFIGURATIONS
// ============================================================================

export const commonActions = {
  view: (onClick: (item: any) => void): DataTableAction => ({
    label: 'View',
    icon: Eye,
    onClick,
  }),
  edit: (onClick: (item: any) => void): DataTableAction => ({
    label: 'Edit',
    icon: Edit,
    onClick,
  }),
  delete: (onClick: (item: any) => void): DataTableAction => ({
    label: 'Delete',
    icon: Trash2,
    onClick,
    variant: 'destructive',
  }),
}

export default DataTable