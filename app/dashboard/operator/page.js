'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import ProductionForm from '@/components/forms/ProductionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProductions } from '@/lib/hooks/useProductions';
import { useAuth } from '@/lib/hooks/useAuth';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function OperatorDashboard() {
  const { user } = useAuth();
  const { productions, loading, fetchProductions } = useProductions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [summary, setSummary] = useState({ totalProductions: 0, totalWeight: 0 });

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

  // Update simple summary for operator
  useEffect(() => {
    if (!productions) return;
    const totalProductions = productions.length;
    const totalWeight = productions.reduce((sum, p) => sum + (p.totalWeight || 0), 0);
    setSummary({ totalProductions, totalWeight });
  }, [productions]);

  return (
    <ProtectedRoute allowedRoles={['operator']}>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">آپریٹر ڈیش بورڈ</h1>
                <p className="text-gray-500 mt-1">خوش آمدید، {user?.name}</p>
              </div>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="ml-2 h-4 w-4" />
                    نئی پروڈکشن داخل کریں
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

            {/* My Productions */}
            <Card>
              <CardHeader>
                <CardTitle>میری پروڈکشن ریکارڈ</CardTitle>
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
                          <TableCell>{shiftNames[prod.shift]}</TableCell>
                        </TableRow>
                      ))}
                      {productions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
