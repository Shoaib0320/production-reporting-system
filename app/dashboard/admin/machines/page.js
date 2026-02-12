
'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SummaryCard from '@/components/shared/SummaryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { API } from '@/lib/api';
import { Plus, Edit, Search, Bell, Monitor, Zap, Wrench, Activity, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

export default function AdminMachinesPage() {
  const { t, dir } = useLanguage();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sparkData = [{ v: 30 }, { v: 45 }, { v: 25 }, { v: 60 }, { v: 85 }, { v: 45 }, { v: 70 }, { v: 95 }];

  useEffect(() => { fetchMachines(); }, []);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await API.machines.getAll();
      setMachines(data);
    } catch (error) { toast.error('مشینز لوڈ کرنے میں مسئلہ'); }
    finally { setLoading(false); }
  };

  const filteredMachines = machines.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-[1300px] mx-auto space-y-8 animate-in fade-in duration-500" dir={dir}>
          
          {/* Header Section - Clean & Balanced */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-50 pb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Machine Management <span className="text-slate-300 font-normal mx-2">/</span> <span className="text-blue-600 font-medium font-urdu">مشین مینجمنٹ</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Monitor and manage factory assets efficiency.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search machines..." 
                  className="pl-11 pr-4 rounded-xl border-slate-200 bg-white h-12 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsFormOpen(true)} className="h-12 px-6 rounded-xl bg-[#00A3E1] hover:bg-blue-600 text-white font-semibold shadow-md flex items-center gap-2 transition-all">
                <Plus className="h-5 w-5" />
                <span className="text-sm">Add Machine</span>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard title="Total Units" value={machines.length} icon={<Monitor />} color="blue" />
            <SummaryCard title="Operational" value={machines.filter(m=>m.isActive).length} icon={<Activity />} color="emerald" />
            <SummaryCard title="Maintenance" value="02" icon={<Wrench />} color="orange" />
            <SummaryCard title="Avg Uptime" value="94.2%" icon={<Zap />} color="purple" />
          </div>

          {/* Machine Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
               [1,2,3].map(i => <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-[32px]"></div>)
            ) : (
              <>
                {filteredMachines.map((machine) => (
                  <Card key={machine._id} className="border border-slate-100 shadow-sm rounded-[32px] bg-white hover:shadow-md transition-all duration-300 overflow-hidden group">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                          <Monitor className="h-6 w-6 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${machine.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {machine.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800">{machine.name}</h3>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">ID: {machine.code} • {machine.location || 'Area 01'}</p>
                      </div>

                      <div className="flex justify-between items-end mb-8">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Capacity</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-900">{machine.tonnage}</span>
                            <span className="text-xs font-medium text-slate-400 uppercase">Tons</span>
                          </div>
                        </div>
                        <div className="w-24 h-10">
                           <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={sparkData}>
                               <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                                 {sparkData.map((_, i) => <Cell key={i} fill={i === 7 ? '#00A3E1' : '#E2E8F0'} />)}
                               </Bar>
                             </BarChart>
                           </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                        <Button variant="ghost" className="rounded-xl font-semibold text-slate-600 bg-slate-50 h-11 text-xs" onClick={() => { setEditingMachine(machine); setIsFormOpen(true); }}>
                          Edit / ترمیم
                        </Button>
                        <Button className="rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold h-11 text-xs border-none shadow-none">
                          Details / تفصیل
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <button onClick={() => setIsFormOpen(true)} className="border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center p-10 hover:bg-blue-50/30 transition-all group min-h-[300px]">
                  <Plus className="h-8 w-8 text-slate-300 group-hover:text-blue-500 mb-3" />
                  <p className="text-sm font-bold text-slate-400 group-hover:text-blue-600">Add New Machine</p>
                </button>
              </>
            )}
          </div>
        </div>

        {/* REFINED MODAL UI */}
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if(!open) setEditingMachine(null); }}>
          <DialogContent className="max-w-lg rounded-[24px] p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-slate-900 px-8 py-10 text-white">
               <DialogHeader>
                 <DialogTitle className="text-xl font-bold tracking-tight">
                   {editingMachine ? 'Update Machine Details' : 'Register New Asset'}
                 </DialogTitle>
                 <DialogDescription className="text-slate-400 font-medium mt-1 text-sm">
                   Enter the technical specifications below to update the system.
                 </DialogDescription>
               </DialogHeader>
            </div>
            
            <div className="p-8 bg-white">
              <MachineForm initialData={editingMachine} onSuccess={() => { setIsFormOpen(false); fetchMachines(); }} />
            </div>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function MachineForm({ initialData, onSuccess }) {
  const [formData, setFormData] = useState(initialData || { name: '', code: '', tonnage: '', location: '', isActive: true });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?._id) await API.machines.update(initialData._id, formData);
      else await API.machines.create(formData);
      toast.success('محفوظ کر لی گئی');
      onSuccess();
    } catch (error) { toast.error('Error saving machine'); }
    finally { setLoading(false); }
  };

  const inputClass = "h-12 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm";
  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block px-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-1">
          <Label className={labelClass}>Machine Name</Label>
          <Input required placeholder="Name" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} className={inputClass} />
        </div>
        <div className="space-y-1">
          <Label className={labelClass}>Asset Code</Label>
          <Input required placeholder="Code" value={formData.code} onChange={(e)=>setFormData({...formData, code:e.target.value})} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-1">
          <Label className={labelClass}>Tonnage (T)</Label>
          <Input type="number" required placeholder="00" value={formData.tonnage} onChange={(e)=>setFormData({...formData, tonnage:e.target.value})} className={inputClass} />
        </div>
        <div className="space-y-1">
          <Label className={labelClass}>Location</Label>
          <Input placeholder="Section" value={formData.location} onChange={(e)=>setFormData({...formData, location:e.target.value})} className={inputClass} />
        </div>
      </div>
      
      <div className="pt-4 flex gap-3">
        <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl font-bold text-slate-400 text-sm" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" disabled={loading} className="flex-[2] h-12 rounded-xl bg-[#00A3E1] hover:bg-blue-600 font-bold text-sm shadow-lg shadow-blue-100 transition-all">
          {loading ? 'Saving...' : (initialData ? 'Update Machine' : 'Save Machine')}
        </Button>
      </div>
    </form>
  );
}