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
    <div className="space-y-4">
      {/* Search and Actions Bar */}
      <div className="flex items-center justify-between gap-4" dir="rtl">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="تلاش کریں..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pr-10"
            />
          </div>
        )}
        {exportable && (
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="ml-2 h-4 w-4" />
            ایکسپورٹ
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold">
                  <div className="flex items-center gap-2">
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="hover:bg-gray-200 p-1 rounded"
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
                      className="mt-2 h-8 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-12"></TableHead>}
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
                      <TableCell key={col.key}>
                        {col.cell ? col.cell(value, row) : value}
                      </TableCell>
                    );
                  })}
                  {rowActions && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between" dir="rtl">
          <div className="text-sm text-gray-600">
            صفحہ {currentPage} از {totalPages} - کل {sortedData.length} ریکارڈ
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
              if (pageNum > totalPages) return null;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
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
