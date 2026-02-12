'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { StatusBadge } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { API } from '@/lib/api';
import { Calendar, Download, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function SupervisorReportsPage() {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({});
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    machineId: ''
  });
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetchMachines();
    generateReport();
  }, []);

  const fetchMachines = async () => {
    try {
      const data = await API.machines.getAll();
      // Filter to supervisor's assigned machines if available
      const assignedMachines = user?.machineIds?.length 
        ? data.filter(m => user.machineIds.includes(m._id))
        : data;
      setMachines(assignedMachines);
    } catch (error) {
      console.error('Failed to fetch machines');
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const productions = await API.productions.getAll({
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...(filters.machineId && { machineId: filters.machineId })
      });

      setReportData(productions);
      
      const totalProductions = productions.length;
      const totalWeight = productions.reduce((sum, p) => sum + (p.totalWeight || 0), 0);
      const totalPieces = productions.reduce((sum, p) => sum + (p.totalPieces || 0), 0);
      const byMachine = productions.reduce((acc, p) => {
        const name = p.machineId?.name || 'Unknown';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      setSummary({
        totalProductions,
        totalWeight,
        totalPieces,
        byMachine,
        avgWeight: totalProductions > 0 ? totalWeight / totalProductions : 0
      });

      toast.success(t('saveSuccess'));
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      [t('date'), t('machine'), t('product'), t('pieces'), t('weight'), t('operator'), t('shift')].join(','),
      ...reportData.map(row => [
        new Date(row.date).toLocaleDateString(),
        row.machineId?.name || '',
        row.productName || '',
        row.totalPieces || 0,
        row.totalWeight || 0,
        row.operatorId?.name || '',
        row.shift || ''
      ].map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `supervisor_report_${filters.startDate}_${filters.endDate}.csv`;
    link.click();
  };

  const columns = [
    {
      key: 'date',
      header: t('date'),
      accessor: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true
    },
    {
      key: 'machineId',
      header: t('machine'),
      accessor: (row) => row.machineId?.name || '-',
      filterable: true
    },
    {
      key: 'productName',
      header: t('product'),
      filterable: true
    },
    {
      key: 'totalPieces',
      header: t('pieces'),
      sortable: true
    },
    {
      key: 'totalWeight',
      header: t('weightKg'),
      accessor: (row) => (row.totalWeight || 0).toFixed(2),
      sortable: true
    },
    {
      key: 'operatorId',
      header: t('operator'),
      accessor: (row) => row.operatorId?.name || '-',
      filterable: true
    },
    {
      key: 'shift',
      header: t('shift'),
      cell: (value) => {
        const labels = { 
          morning: t('morning'), 
          evening: t('evening'), 
          night: t('night') 
        };
        return <StatusBadge status={value} labels={labels} />;
      }
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['supervisor']}>
      <DashboardLayout>
        <div className="w-full overflow-hidden">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full" dir={dir}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t('reportManagement')}</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">{t('machineReport')}</p>
            </div>
            <Button onClick={exportToCSV} disabled={reportData.length === 0} className="w-full sm:w-auto">
              <Download className="ml-2 h-4 w-4" />
              {t('export')}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                {t('selectDateRange')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>{t('from')}</Label>
                    <Input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t('to')}</Label>
                    <Input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t('selectMachine')}</Label>
                    <select
                      className="w-full h-10 px-3 border rounded-md"
                      value={filters.machineId}
                      onChange={(e) => setFilters({ ...filters, machineId: e.target.value })}
                    >
                      <option value="">{t('viewAll')}</option>
                      {machines.map(m => (
                        <option key={m._id} value={m._id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button onClick={generateReport} className="mt-4" disabled={loading}>
                  <FileText className="ml-2 h-4 w-4" />
                  {loading ? t('loading') : t('generateReport')}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {t('totalProductions')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalProductions || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t('totalWeight')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(summary.totalWeight || 0).toFixed(2)} kg</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('pieces')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalPieces || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg {t('weight')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(summary.avgWeight || 0).toFixed(2)} kg</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <DataTable
                    data={reportData}
                    columns={columns}
                    searchable
                    filterable
                    exportable={false}
                    emptyMessage={t('noData')}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
