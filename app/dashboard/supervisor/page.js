"use client";

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { StatusBadge } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionForm from '@/components/forms/ProductionForm';
import { useProductions } from '@/lib/hooks/useProductions';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Plus } from 'lucide-react';

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const { productions, loading, fetchProductions, createProduction } = useProductions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [summary, setSummary] = useState({ totalProductions: 0, totalWeight: 0, byShift: {} });

  useEffect(() => {
    if (user && user.role === 'supervisor') {
      // Server will scope results to supervisor based on token; still request filter by machineIds when available
      const filters = user.machineIds && user.machineIds.length ? { machineIds: user.machineIds } : {};
      fetchProductions(filters);
    }
  }, [user]);

  useEffect(() => {
    if (!productions) return;
    const totalProductions = productions.length;
    const totalWeight = productions.reduce((sum, p) => sum + (p.totalWeight || 0), 0);
    const byShift = productions.reduce((acc, p) => {
      acc[p.shift] = (acc[p.shift] || 0) + 1;
      return acc;
    }, {});
    setSummary({ totalProductions, totalWeight, byShift });
  }, [productions]);

  return (
    <ProtectedRoute allowedRoles={["supervisor"]}>
      <DashboardLayout>
        <div className="p-4 md:p-6 space-y-4 md:space-y-6" dir={dir}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t('supervisorDashboard')}</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">{t('welcome')}، {user?.name}</p>
            </div>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="ml-2 h-4 w-4" />
                    نئی پروڈکشن
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>نئی پروڈکشن داخل کریں</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2">
                    <ProductionForm onSuccess={() => {
                      setIsFormOpen(false);
                      fetchProductions();
                    }} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

          {/* Summary Cards */}
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">کل پروڈکشن</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalProductions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">کل وزن</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalWeight.toFixed ? summary.totalWeight.toFixed(2) : summary.totalWeight} کلو</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">صبح شفٹ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.byShift.morning || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">شام شفٹ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.byShift.evening || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Productions Table with Tabs */}
            <Card>
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">تمام ({productions.length})</TabsTrigger>
                    <TabsTrigger value="morning">صبح ({summary.byShift.morning || 0})</TabsTrigger>
                    <TabsTrigger value="evening">شام ({summary.byShift.evening || 0})</TabsTrigger>
                    <TabsTrigger value="night">رات ({summary.byShift.night || 0})</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <DataTable
                    data={productions.filter(p => activeTab === 'all' || p.shift === activeTab)}
                    columns={[
                      {
                        key: 'date',
                        header: 'تاریخ',
                        accessor: (row) => new Date(row.date).toLocaleDateString('ur-PK'),
                        sortable: true
                      },
                      {
                        key: 'machineId',
                        header: 'مشین',
                        accessor: (row) => row.machineId?.name,
                        filterable: true
                      },
                      {
                        key: 'productName',
                        header: 'پروڈکٹ',
                        filterable: true
                      },
                      {
                        key: 'totalPieces',
                        header: 'پیسز',
                        sortable: true
                      },
                      {
                        key: 'totalWeight',
                        header: 'وزن (کلو)',
                        accessor: (row) => (row.totalWeight || 0).toFixed(2),
                        sortable: true
                      },
                      {
                        key: 'operatorId',
                        header: 'آپریٹر',
                        accessor: (row) => row.operatorId?.name || row.operatorName || '-',
                        filterable: true
                      },
                      {
                        key: 'shift',
                        header: 'شفٹ',
                        cell: (value) => {
                          const labels = { morning: 'صبح', evening: 'شام', night: 'رات' };
                          return <StatusBadge status={value} labels={labels} />;
                        }
                      }
                    ]}
                    searchable
                    filterable
                    exportable
                    emptyMessage="کوئی پروڈکشن ریکارڈ نہیں"
                  />
                )}
              </CardContent>
            </Card>
          </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
