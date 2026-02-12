'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { StatusBadge } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductions } from '@/lib/hooks/useProductions';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { API } from '@/lib/api';
import { Activity, BarChart, Users, FileText, ArrowRight, Cog } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const { productions, loading, fetchProductions } = useProductions({ limit: 10 });
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await API.reports.getSummary();
      setSummary(data);
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shiftNames = {
    morning: t('morning'),
    evening: t('evening'),
    night: t('night'),
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="p-4 md:p-6 space-y-4 md:space-y-6" dir={dir}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t('adminDashboard')}</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">{t('welcome')}، {user?.name}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title={t('totalProductions')}
              value={summary?.totalProductions || 0}
              subtitle={t('total')}
              icon={Activity}
            />
            <StatsCard
              title={t('totalWeight')}
              value={(summary?.totalWeight || 0).toFixed(2)}
              subtitle={t('weightKg')}
              icon={BarChart}
            />
            <StatsCard
              title={t('operator') + 'ز'}
              value={summary?.totalOperators || 0}
              subtitle={t('active')}
              icon={Users}
            />
            <StatsCard
              title={t('machines')}
              value={summary?.totalMachines || 0}
              subtitle={t('active')}
              icon={FileText}
            />
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <Link href="/dashboard/admin/productions">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">پروڈکشن مینجمنٹ</p>
                        <h3 className="text-2xl font-bold mt-1">{summary?.totalProductions || 0}</h3>
                      </div>
                      <BarChart className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex items-center mt-4 text-blue-600">
                      <span className="text-sm">مکمل دیکھیں</span>
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/dashboard/admin/machines">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">مشینز</p>
                        <h3 className="text-2xl font-bold mt-1">{summary?.totalMachines || 0}</h3>
                      </div>
                      <Cog className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex items-center mt-4 text-green-600">
                      <span className="text-sm">مکمل دیکھیں</span>
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/admin/users">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">یوزرز</p>
                        <h3 className="text-2xl font-bold mt-1">{summary?.totalOperators || 0}</h3>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="flex items-center mt-4 text-purple-600">
                      <span className="text-sm">مکمل دیکھیں</span>
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Recent Productions Preview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>حالیہ پروڈکشن ریکارڈ</CardTitle>
                  <Link href="/dashboard/admin/productions">
                    <Button variant="outline" size="sm">
                      تمام دیکھیں
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <DataTable
                    data={productions.slice(0, 5)}
                    columns={[
                      {
                        key: 'date',
                        header: 'تاریخ',
                        accessor: (row) => formatDate(row.date),
                        filterable: false,
                        sortable: false
                      },
                      {
                        key: 'machineId',
                        header: 'مشین',
                        accessor: (row) => row.machineId?.name,
                        filterable: false
                      },
                      {
                        key: 'productName',
                        header: 'پروڈکٹ',
                        filterable: false
                      },
                      {
                        key: 'totalPieces',
                        header: 'پیسز',
                        filterable: false,
                        sortable: false
                      },
                      {
                        key: 'totalWeight',
                        header: 'وزن',
                        accessor: (row) => row.totalWeight.toFixed(2),
                        filterable: false,
                        sortable: false
                      }
                    ]}
                    searchable={false}
                    filterable={false}
                    exportable={false}
                    itemsPerPage={5}
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
