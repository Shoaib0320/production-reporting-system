'use client';

import { useState, useEffect, cloneElement } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { StatusBadge } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionForm from '@/components/forms/ProductionForm';
import { useProductions } from '@/lib/hooks/useProductions';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Plus, Trash2, Edit, Box, Weight, Sunrise, Sunset, Moon } from 'lucide-react';
import LoadingState from '@/components/shared/LoadingState';
import SummaryCard from '@/components/shared/SummaryCard';

export default function AdminProductionsPage() {
    const { t, dir } = useLanguage();
    const { productions, loading, fetchProductions, deleteProduction } = useProductions();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduction, setEditingProduction] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [summary, setSummary] = useState({ total: 0, totalWeight: 0, byShift: {} });

    useEffect(() => { fetchProductions(); }, []);

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

    const columns = [
        { key: 'date', header: 'تاریخ', accessor: (row) => new Date(row.date).toLocaleDateString('ur-PK'), sortable: true },
        { key: 'machineId', header: 'مشین', accessor: (row) => row.machineId?.name || '-', filterable: true },
        { key: 'productName', header: 'پروڈکٹ', filterable: true },
        { key: 'totalPieces', header: 'پیسز', cell: (val) => <span className="font-bold text-[#00A3E1]">{val?.toLocaleString() || 0}</span> },
        { key: 'totalWeight', header: 'وزن (کلو)', accessor: (row) => `${(row.totalWeight || 0).toFixed(2)} kg` },
        { key: 'operatorId', header: 'آپریٹر', accessor: (row) => row.operatorId?.name || row.operatorName || '-' },
        {
            key: 'shift',
            header: 'شفٹ',
            cell: (v) => <StatusBadge status={v} labels={{ morning: 'صبح', evening: 'شام', night: 'رات' }} />
        },
    ];

    const filteredProductions = productions.filter(p => activeTab === 'all' || p.shift === activeTab);

    const rowActions = (row) => (
        <div className="flex gap-1 justify-end">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-blue-600 hover:bg-blue-50" 
                onClick={() => { 
                    setEditingProduction(row); 
                    setIsFormOpen(true); 
                }}
            >
                <Edit className="h-4 w-4" />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-500 hover:bg-red-50" 
                onClick={() => {
                    if (confirm('کیا آپ واقعی یہ ریکارڈ حذف کرنا چاہتے ہیں؟')) {
                        deleteProduction(row._id);
                    }
                }}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const handleDelete = async (id) => {
        if (confirm('کیا آپ واقعی یہ ریکارڈ حذف کرنا چاہتے ہیں؟')) {
            await deleteProduction(id);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
                <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen font-sans" dir={dir}>

                    {/* TOP HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                                <Box className="text-[#00A3E1] h-8 w-8" />
                                {t('productionManagement')}
                            </h1>
                            <p className="text-gray-400 mt-1 font-medium italic">Production History & Records</p>
                        </div>

                        {/* FIXED: Dialog with proper accessibility */}
                        <Dialog open={isFormOpen} onOpenChange={(open) => { 
                            setIsFormOpen(open); 
                            if (!open) setEditingProduction(null); 
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#00A3E1] hover:bg-[#0089bd] rounded-xl px-6 h-12 shadow-lg shadow-blue-100 font-bold transition-all hover:scale-105 active:scale-95">
                                    <Plus className="ml-2 h-5 w-5" />
                                    نئی پروڈکشن داخل کریں
                                </Button>
                            </DialogTrigger>
                            
                            <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-3xl max-h-[90vh] rounded-2xl sm:rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
                                {/* FIXED: Added DialogTitle for accessibility (visually hidden) */}
                                <DialogHeader className="sr-only">
                                    <DialogTitle>
                                        {editingProduction ? 'پروڈکشن میں ترمیم کریں' : 'نئی پروڈکشن شامل کریں'}
                                    </DialogTitle>
                                </DialogHeader>
                                
                                <div className="max-h-[90vh] overflow-y-auto p-6">
                                    <ProductionForm 
                                        initialData={editingProduction} 
                                        isEdit={!!editingProduction} 
                                        onSuccess={() => { 
                                            setIsFormOpen(false); 
                                            fetchProductions(); 
                                        }} 
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* QUICK SUMMARY CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SummaryCard title="کل پروڈکشن" value={summary.total} icon={<Box />} color="blue" />
                        <SummaryCard title="کل وزن (کلو)" value={summary.totalWeight.toFixed(2)} unit="kg" icon={<Weight />} color="emerald" />
                        <SummaryCard title="صبح شفٹ" value={summary.byShift.morning || 0} icon={<Sunrise />} color="orange" />
                        <SummaryCard title="شام شفٹ" value={summary.byShift.evening || 0} icon={<Sunset />} color="purple" />
                    </div>

                    {/* MAIN DATA SECTION */}
                    <Card className="rounded-[32px] border-none shadow-xl shadow-gray-200/50 overflow-hidden bg-white">
                        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                                <TabsList className="bg-gray-100/80 p-1 rounded-xl h-11">
                                    <TabsTrigger value="all" className="rounded-lg px-6 font-bold text-xs uppercase tracking-wider">All</TabsTrigger>
                                    <TabsTrigger value="morning" className="rounded-lg px-6 font-bold text-xs uppercase tracking-wider">Morning</TabsTrigger>
                                    <TabsTrigger value="evening" className="rounded-lg px-6 font-bold text-xs uppercase tracking-wider">Evening</TabsTrigger>
                                    <TabsTrigger value="night" className="rounded-lg px-6 font-bold text-xs uppercase tracking-wider">Night</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div className="text-gray-400 font-bold text-xs tracking-widest uppercase">
                                Showing {filteredProductions.length} Records
                            </div>
                        </div>
                        <CardContent className="p-0">
                            {loading ? <LoadingState message="Loading productions..." /> : (
                                <DataTable 
                                    data={filteredProductions} 
                                    columns={columns} 
                                    rowActions={rowActions}
                                    emptyMessage="کوئی پروڈکشن ریکارڈ نہیں ملا"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
