'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { StatusBadge } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProductions } from '@/lib/hooks/useProductions';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function OperatorDashboard() {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const { productions, loading, fetchProductions } = useProductions();
  const [activeTab, setActiveTab] = useState('all');
  const [summary, setSummary] = useState({ totalProductions: 0, totalWeight: 0, byShift: {} });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shiftNames = {
    morning: 'صبح',
    evening: 'شام',
    night: 'رات',
  };

  // Fetch only productions for this operator when user is available
  useEffect(() => {
    if (user && user.role === 'operator') {
      fetchProductions({ operatorId: user._id });
    }
  }, [user]);

  // Update summary
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
    <ProtectedRoute allowedRoles={['operator']}>
      <DashboardLayout>
        <div className="p-4 md:p-6 space-y-4 md:space-y-6" dir={dir}>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t('operatorDashboard')}</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">{t('welcome')}، {user?.name}</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">میری پروڈکشن</CardTitle>
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

            {/* My Productions */}
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
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
