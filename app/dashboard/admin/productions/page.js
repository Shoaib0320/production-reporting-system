'use client';

import { useState, useEffect } from 'react';
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
import { API } from '@/lib/api';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductionsPage() {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const { productions, loading, fetchProductions, deleteProduction } = useProductions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduction, setEditingProduction] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [summary, setSummary] = useState({ total: 0, totalWeight: 0, byShift: {} });

  useEffect(() => {
    fetchProductions();
  }, []);

  useEffect(() => {
    if (productions) {
      const total = productions.length;
      const totalWeight = productions.reduce((sum, p) => sum + (p.totalWeight || 0), 0);
      const byShift = productions.reduce((acc, p) => {
        acc[p.shift] = (acc[p.shift] || 0) + 1;
        return acc;
      }, {});
      setSummary({ total, totalWeight, byShift });
    }
  }, [productions]);

  const handleDelete = async (id) => {
    if (confirm('کیا آپ واقعی اس پروڈکشن کو ڈیلیٹ کرنا چاہتے ہیں؟')) {
      try {
        await deleteProduction(id);
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleEdit = (production) => {
    setEditingProduction(production);
    setIsFormOpen(true);
  };

  const columns = [
    {
      key: 'date',
      header: 'تاریخ',
      accessor: (row) => new Date(row.date).toLocaleDateString('ur-PK'),
      sortable: true
    },
    {
      key: 'machineId',
      header: 'مشین',
      accessor: (row) => row.machineId?.name || '-',
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
      },
      filterable: true
    },
  ];

  const filteredProductions = productions.filter(p => {
    if (activeTab === 'all') return true;
    return p.shift === activeTab;
  });

  const rowActions = (row) => (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(row._id)}>
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="p-4 md:p-6 space-y-4 md:space-y-6" dir={dir}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t('productionManagement')}</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">{t('allProductions')}</p>
            </div>
              <Dialog open={isFormOpen} onOpenChange={(open) => {
                setIsFormOpen(open);
                if (!open) setEditingProduction(null);
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="ml-2 h-4 w-4" />
                    نئی پروڈکشن
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduction ? 'پروڈکشن اپڈیٹ' : 'نئی پروڈکشن داخل کریں'}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2">
                    <ProductionForm 
                      initialData={editingProduction}
                      onSuccess={() => {
                        setIsFormOpen(false);
                        setEditingProduction(null);
                        fetchProductions();
                      }} 
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">کل پروڈکشن</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">کل وزن</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalWeight.toFixed(2)} کلو</div>
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
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                  </div>
                ) : (
                  <DataTable
                    data={filteredProductions}
                    columns={columns}
                    rowActions={rowActions}
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
