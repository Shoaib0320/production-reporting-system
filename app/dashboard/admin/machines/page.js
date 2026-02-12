'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable, { StatusBadge } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { API } from '@/lib/api';
import { Plus, Trash2, Edit, Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMachinesPage() {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await API.machines.getAll();
      setMachines(data);
    } catch (error) {
      toast.error('مشینز لوڈ کرنے میں مسئلہ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('کیا آپ واقعی اس مشین کو ڈیلیٹ کرنا چاہتے ہیں؟')) {
      try {
        await API.machines.delete(id);
        toast.success('مشین ڈیلیٹ ہو گئی');
        fetchMachines();
      } catch (error) {
        toast.error(error.response?.data?.error || 'ڈیلیٹ ناکام');
      }
    }
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    setIsFormOpen(true);
  };

  const handleToggleStatus = async (machine) => {
    try {
      await API.machines.update(machine._id, { 
        isActive: !machine.isActive 
      });
      toast.success('مشین اسٹیٹس اپڈیٹ ہو گیا');
      fetchMachines();
    } catch (error) {
      toast.error('اسٹیٹس اپڈیٹ ناکام');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'مشین نام',
      filterable: true,
      sortable: true
    },
    {
      key: 'code',
      header: 'کوڈ',
      filterable: true
    },
    {
      key: 'tonnage',
      header: 'ٹنج',
      sortable: true
    },
    {
      key: 'isActive',
      header: 'اسٹیٹس',
      cell: (value) => (
        <StatusBadge 
          status={value ? 'active' : 'inactive'} 
          labels={{ active: 'فعال', inactive: 'غیر فعال' }}
        />
      )
    },
    {
      key: 'location',
      header: 'لوکیشن',
      filterable: true
    }
  ];

  const rowActions = (row) => (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={(e) => {
          e.stopPropagation();
          handleToggleStatus(row);
        }}
        title={row.isActive ? 'غیر فعال کریں' : 'فعال کریں'}
      >
        {row.isActive ? <Power className="h-4 w-4 text-green-600" /> : <PowerOff className="h-4 w-4 text-gray-400" />}
      </Button>
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
              <h1 className="text-2xl md:text-3xl font-bold">{t('machineManagement')}</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">{t('machines')}</p>
            </div>
              <Dialog open={isFormOpen} onOpenChange={(open) => {
                setIsFormOpen(open);
                if (!open) setEditingMachine(null);
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="ml-2 h-4 w-4" />
                    نئی مشین
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingMachine ? 'مشین اپڈیٹ' : 'نئی مشین شامل کریں'}</DialogTitle>
                  </DialogHeader>
                  <MachineForm 
                    initialData={editingMachine}
                    onSuccess={() => {
                      setIsFormOpen(false);
                      setEditingMachine(null);
                      fetchMachines();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">کل مشینز</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{machines.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">فعال مشینز</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {machines.filter(m => m.isActive).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">غیر فعال</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-400">
                    {machines.filter(m => !m.isActive).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Machines Table */}
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <DataTable
                    data={machines}
                    columns={columns}
                    rowActions={rowActions}
                    searchable
                    filterable
                    exportable
                    emptyMessage="کوئی مشین موجود نہیں"
                  />
                )}
              </CardContent>
            </Card>
          </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Machine Form Component
function MachineForm({ initialData, onSuccess }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    code: '',
    tonnage: '',
    location: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?._id) {
        await API.machines.update(initialData._id, formData);
        toast.success('مشین اپڈیٹ ہو گئی');
      } else {
        await API.machines.create(formData);
        toast.success('مشین شامل ہو گئی');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'محفوظ کرنے میں مسئلہ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div>
        <label className="block text-sm font-medium mb-1">مشین نام *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">کوڈ *</label>
        <input
          type="text"
          required
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">ٹنج *</label>
        <input
          type="number"
          required
          value={formData.tonnage}
          onChange={(e) => setFormData({ ...formData, tonnage: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">لوکیشن</label>
        <input
          type="text"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'محفوظ ہو رہا ہے...' : (initialData ? 'اپڈیٹ کریں' : 'شامل کریں')}
      </Button>
    </form>
  );
}
