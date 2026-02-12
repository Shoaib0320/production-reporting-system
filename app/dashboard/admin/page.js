'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SummaryCard from '@/components/shared/SummaryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { API } from '@/lib/api';
import { Activity, BarChart, Users, Cog, ArrowUpRight, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { toast } from 'sonner';

// Recharts import karein (npm install recharts)
import { BarChart as ReBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t, dir } = useLanguage();
  const [summary, setSummary] = useState(null);

  // Chart ke liye sample data (Jab API integration ho to yahan dynamic data dalien)
  const chartData = [
    { name: 'Mon', value: 3200 },
    { name: 'Tue', value: 4500 },
    { name: 'Wed', value: 2800 },
    { name: 'Thu', value: 5100 },
    { name: 'Fri', value: 3900 },
    { name: 'Sat', value: 4800 },
    { name: 'Sun', value: 3500 },
  ];

  const pieData = [
    { name: 'Operational', value: 12, color: '#00A3E1' },
    { name: 'Maintenance', value: 2, color: '#EF4444' },
    { name: 'Idle', value: 1, color: '#F59E0B' },
  ];

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

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-8 animate-in fade-in duration-700" dir={dir}>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('adminDashboard')}</h1>
              <p className="text-gray-500 mt-1 font-medium">{t('welcome')}، <span className="text-[#00A3E1]">{user?.name}</span></p>
            </div>
            <Button variant="outline" className="rounded-xl font-bold border-2 bg-white" onClick={fetchSummary}>
               ڈیٹا اپڈیٹ کریں
            </Button>
          </div>

          {/* Top Summary Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard title={t('totalProductions')} value={summary?.totalProductions || "45,200"} icon={<Activity />} color="blue" />
            <SummaryCard title={t('totalWeight')} value={(summary?.totalWeight || 14.2).toFixed(1)} unit="Tons" icon={<BarChart />} color="emerald" />
            <SummaryCard title={t('totalUsers')} value={summary?.totalOperators || 84} icon={<Users />} color="purple" />
            <SummaryCard title={t('todayYield')} value="94%" icon={<TrendingUp />} color="orange" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Bar Chart (Production Trends) */}
            <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
              <CardHeader className="px-8 pt-8 flex flex-row justify-between items-center">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <TrendingUp className="text-[#00A3E1] h-5 w-5" />
                  پیداوار کا رجحان (Weekly)
                </CardTitle>
                <div className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">+12% اضافہ</div>
              </CardHeader>
              <CardContent className="h-[350px] pt-4 pr-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBar data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#00A3E1" radius={[10, 10, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#007BB5' : '#00A3E1'} fillOpacity={index === 3 ? 1 : 0.4} />
                      ))}
                    </Bar>
                  </ReBar>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Donut Chart (Machine Status) */}
            <Card className="border-none shadow-sm rounded-[32px] bg-white">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <PieChartIcon className="text-[#00A3E1] h-5 w-5" />
                  مشینوں کی صورتحال
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-[250px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-gray-800">15</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total Units</span>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="w-full space-y-3 mt-4 px-4">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                        <span className="text-sm font-bold text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Footer Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'پروڈکشن ریکارڈز', link: '/dashboard/admin/productions', icon: Activity, color: 'blue' },
              { label: 'یوزر مینجمنٹ', link: '/dashboard/admin/users', icon: Users, color: 'purple' },
              { label: 'سسٹم سیٹنگز', link: '/dashboard/admin/machines', icon: Cog, color: 'orange' }
            ].map((item, i) => (
              <Link href={item.link} key={i}>
                <Card className="border-none shadow-sm rounded-2xl p-4 hover:ring-2 ring-blue-100 transition-all flex items-center justify-between group bg-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                      <item.icon className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <span className="font-bold text-gray-700">{item.label}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500" />
                </Card>
              </Link>
            ))}
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}