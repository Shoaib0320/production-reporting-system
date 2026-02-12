'use client';

import { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  Download,
  FilterX
} from 'lucide-react';
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

  // 1. Filter Logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (searchTerm && searchable) {
      filtered = filtered.filter(row => {
        return columns.some(col => {
          const value = col.accessor ? col.accessor(row) : row[col.key];
          return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

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

  // 2. Sort Logic
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

  // 3. Pagination Logic
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

  const resetFilters = () => {
    setColumnFilters({});
    setSearchTerm('');
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
    link.download = `production_report_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      
      {/* --- Top Search & Export Bar --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4" dir="rtl">
        <div className="flex items-center gap-2 w-full md:w-auto">
          {searchable && (
            <div className="relative w-full md:w-80 group">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#00A3E1] transition-colors" />
              <Input
                placeholder="تلاش کریں..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pr-10 h-11 rounded-xl border-2 border-gray-200 focus:border-[#00A3E1] focus:ring-4 focus:ring-[#00A3E1]/5 bg-white shadow-sm transition-all"
              />
            </div>
          )}
          {(searchTerm || Object.keys(columnFilters).length > 0) && (
            <Button variant="ghost" size="icon" onClick={resetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl">
              <FilterX className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {exportable && (
          <Button 
            variant="outline" 
            onClick={handleExport} 
            className="w-full md:w-auto h-11 rounded-xl border-2 border-gray-200 hover:bg-gray-50 gap-2 font-bold transition-all active:scale-95"
          >
            <Download className="h-4 w-4 text-[#00A3E1]" />
            ایکسپورٹ ڈیٹا
          </Button>
        )}
      </div>

      {/* --- Responsive Table Container --- */}
      <div className="relative rounded-2xl border-2 border-gray-100 bg-white shadow-sm overflow-hidden">
        {/* Horizontal Scroll logic here */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
          <Table className="min-w-[900px] w-full border-collapse" dir="rtl">
            <TableHeader className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b-2 border-gray-100">
                {columns.map((col) => (
                  <TableHead 
                    key={col.key} 
                    className="h-20 text-gray-700 font-black text-[11px] uppercase tracking-wider text-right px-4"
                    style={{ width: col.width || 'auto' }}
                  >
                    <div className="flex flex-col gap-2">
                      <div 
                        className={`flex items-center gap-2 group transition-colors ${col.sortable !== false ? 'cursor-pointer hover:text-[#00A3E1]' : ''}`}
                        onClick={() => col.sortable !== false && handleSort(col.key)}
                      >
                        <span>{col.header}</span>
                        {col.sortable !== false && (
                          <ArrowUpDown className={`h-3 w-3 ${sortConfig.key === col.key ? 'text-[#00A3E1]' : 'text-gray-300'}`} />
                        )}
                      </div>
                      
                      {filterable && col.filterable !== false && (
                        <input
                          placeholder="فلٹر..."
                          value={columnFilters[col.key] || ''}
                          onChange={(e) => handleColumnFilter(col.key, e.target.value)}
                          className="h-8 w-full bg-white border border-gray-200 rounded-lg px-2 text-[10px] font-medium focus:ring-2 focus:ring-[#00A3E1]/20 focus:border-[#00A3E1] outline-none transition-all placeholder:font-normal"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
                {rowActions && <TableHead className="w-16 bg-gray-50/80"></TableHead>}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <TableRow 
                    key={row._id || row.id || idx}
                    className={`
                      group border-b border-gray-50 transition-colors
                      ${onRowClick ? "cursor-pointer hover:bg-[#00A3E1]/5" : ""}
                      ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                    `}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => {
                      const value = col.accessor ? col.accessor(row) : row[col.key];
                      return (
                        <TableCell key={col.key} className="py-4 px-4 text-sm text-gray-600 font-semibold">
                          {col.cell ? col.cell(value, row) : (
                            <span className="truncate block max-w-[200px] group-hover:text-gray-900 transition-colors">{value || '-'}</span>
                          )}
                        </TableCell>
                      );
                    })}
                    {rowActions && (
                      <TableCell onClick={(e) => e.stopPropagation()} className="py-4 px-4 text-left">
                        <div className="flex justify-end">{rowActions(row)}</div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + (rowActions ? 1 : 0)} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="p-4 bg-gray-50 rounded-full">
                        <Search className="h-8 w-8 opacity-20" />
                      </div>
                      <p className="font-bold text-sm uppercase tracking-widest">{emptyMessage}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4 pt-2" dir="rtl">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            کل ریکارڈز: <span className="text-[#00A3E1]">{sortedData.length}</span> — صفحہ {currentPage} از {totalPages}
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-2 border-gray-100 hover:border-[#00A3E1]/30"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <div className="flex gap-1.5">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) pageNum = i + 1;
                else if (currentPage === 1) pageNum = i + 1;
                else if (currentPage === totalPages) pageNum = totalPages - 2 + i;
                else pageNum = currentPage - 1 + i;

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    className={`h-10 w-10 rounded-xl font-bold text-xs transition-all ${
                      currentPage === pageNum 
                        ? 'bg-[#00A3E1] hover:bg-[#0089bd] shadow-lg shadow-blue-100' 
                        : 'border-2 border-gray-100 text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-2 border-gray-100 hover:border-[#00A3E1]/30"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/** * StatusBadge Component
 * Isay aap apne columns mein use kar sakte hain
 */
export function StatusBadge({ status, labels }) {
  const colors = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
    paid: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    overdue: 'bg-rose-100 text-rose-700 border-rose-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    morning: 'bg-sky-100 text-sky-700 border-sky-200',
    evening: 'bg-orange-100 text-orange-700 border-orange-200',
    night: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  return (
    <Badge variant="outline" className={`rounded-lg px-2.5 py-0.5 font-bold text-[10px] uppercase border ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels?.[status] || status}
    </Badge>
  );
}

