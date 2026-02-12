'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import ProductionForm from '@/components/forms/ProductionForm';
import StatsCard from '@/components/shared/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProductions } from '@/lib/hooks/useProductions';
import { useAuth } from '@/lib/hooks/useAuth';
import { API } from '@/lib/api';
import { Activity, BarChart, Users, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { productions, loading, fetchProductions } = useProductions({ limit: 10 });
  const [summary, setSummary] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await API.reports.getSummary();
      setSummary(data);
    } catch (error) {
      toast.error('سمری لوڈ کرنے میں مسئلہ');
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
    morning: 'صبح',
    evening: 'شام',
    night: 'رات',
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">ایڈمن ڈیش بورڈ</h1>
                <p className="text-gray-500 mt-1">خوش آمدید، {user?.name}</p>
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
                      fetchSummary();
                    }} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <StatsCard
                title="کل پروڈکشن"
                value={summary?.totalProductions || 0}
                subtitle="آج تک"
                icon={Activity}
              />
              <StatsCard
                title="کل وزن (کلو)"
                value={(summary?.totalWeight || 0).toFixed(2)}
                subtitle="کل پیداوار"
                icon={BarChart}
              />
              <StatsCard
                title="آپریٹرز"
                value={summary?.totalOperators || 0}
                subtitle="فعال آپریٹرز"
                icon={Users}
              />
              <StatsCard
                title="مشینز"
                value={summary?.totalMachines || 0}
                subtitle="فعال مشینز"
                icon={FileText}
              />
            </div>

            {/* Recent Productions */}
            <Card>
              <CardHeader>
                <CardTitle>حالیہ پروڈکشن ریکارڈ</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>تاریخ</TableHead>
                        <TableHead>مشین</TableHead>
                        <TableHead>پروڈکٹ</TableHead>
                        <TableHead>پیسز</TableHead>
                        <TableHead>وزن</TableHead>
                        <TableHead>آپریٹر</TableHead>
                        <TableHead>شفٹ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productions.map((prod) => (
                        <TableRow key={prod._id}>
                          <TableCell>{formatDate(prod.date)}</TableCell>
                          <TableCell>{prod.machineId?.name}</TableCell>
                          <TableCell>{prod.productName}</TableCell>
                          <TableCell>{prod.totalPieces}</TableCell>
                          <TableCell>{prod.totalWeight.toFixed(2)}</TableCell>
                          <TableCell>{prod.operatorId?.name}</TableCell>
                          <TableCell>{shiftNames[prod.shift]}</TableCell>
                        </TableRow>
                      ))}
                      {productions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            کوئی پروڈکشن ریکارڈ نہیں
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
