
'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DataTable({ 
  data = [], 
  columns = [], 
  searchable = true,
  filterable = true,
  exportable = true,
  onRowClick,
  rowActions,
  itemsPerPage = 10,
  emptyMessage = 'کوئی ڈیٹا موجود نہیں'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [columnFilters, setColumnFilters] = useState({});

  // Filter data based on search and column filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Global search
    if (searchTerm && searchable) {
      filtered = filtered.filter(row => {
        return columns.some(col => {
          const value = col.accessor ? col.accessor(row) : row[col.key];
          return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Column-specific filters
    Object.keys(columnFilters).forEach(key => {
      const filterValue = columnFilters[key];
      if (filterValue) {
        filtered = filtered.filter(row => {
          const col = columns.find(c => c.key === key);
          const value = col.accessor ? col.accessor(row) : row[key];
          return String(value || '').toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    return filtered;
  }, [data, searchTerm, columnFilters, columns, searchable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const col = columns.find(c => c.key === sortConfig.key);
      const aValue = col.accessor ? col.accessor(a) : a[sortConfig.key];
      const bValue = col.accessor ? col.accessor(b) : b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleColumnFilter = (key, value) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent = [
      columns.map(col => col.header).join(','),
      ...sortedData.map(row => 
        columns.map(col => {
          const value = col.accessor ? col.accessor(row) : row[col.key];
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `export_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4 w-full">
      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4" dir="rtl">
        {searchable && (
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="تلاش کریں..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pr-10 text-sm"
            />
          </div>
        )}
        {exportable && (
          <Button variant="outline" size="sm" onClick={handleExport} className="w-full sm:w-auto">
            <Download className="ml-2 h-4 w-4" />
            <span className="hidden sm:inline">ایکسپورٹ</span>
            <span className="sm:hidden">Export</span>
          </Button>
        )}
      </div>

      {/* FIXED: Table with proper width constraints */}
      <div className="w-full border rounded-lg overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {columns.map((col) => (
                    <TableHead 
                      key={col.key} 
                      className="font-semibold"
                      style={{ width: col.width || 'auto' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="truncate">{col.header}</span>
                        {col.sortable !== false && (
                          <button
                            onClick={() => handleSort(col.key)}
                            className="hover:bg-gray-200 p-1 rounded flex-shrink-0"
                          >
                            <ArrowUpDown className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      {filterable && col.filterable !== false && (
                        <Input
                          placeholder={`${col.header} فلٹر...`}
                          value={columnFilters[col.key] || ''}
                          onChange={(e) => handleColumnFilter(col.key, e.target.value)}
                          className="mt-2 h-8 text-xs w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </TableHead>
                  ))}
                  {rowActions && (
                    <TableHead className="w-20"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, idx) => (
                    <TableRow 
                      key={row._id || row.id || idx}
                      className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((col) => {
                        const value = col.accessor ? col.accessor(row) : row[col.key];
                        return (
                          <TableCell key={col.key} className="truncate">
                            {col.cell ? col.cell(value, row) : value}
                          </TableCell>
                        );
                      })}
                      {rowActions && (
                        <TableCell onClick={(e) => e.stopPropagation()} className="w-20">
                          {rowActions(row)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + (rowActions ? 1 : 0)} className="text-center py-8 text-gray-500">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3" dir="rtl">
          <div className="text-xs sm:text-sm text-gray-600">
            صفحہ {currentPage} از {totalPages} - کل {sortedData.length} ریکارڈ
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="hidden sm:flex"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for status badges
export function StatusBadge({ status, labels }) {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    morning: 'bg-blue-100 text-blue-800',
    evening: 'bg-orange-100 text-orange-800',
    night: 'bg-purple-100 text-purple-800',
  };

  return (
    <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
      {labels?.[status] || status}
    </Badge>
  );
}


