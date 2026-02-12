'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">پروڈکشن رپورٹنگ سسٹم</h1>
          <p className="text-sm text-gray-600">خوش آمدید، {user?.name}</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-600" />
            <div className="text-sm">
              <div className="font-medium">{user?.name}</div>
              <div className="text-gray-500">
                {user?.role === 'admin' && 'ایڈمن'}
                {user?.role === 'operator' && 'آپریٹر'}
                {user?.role === 'supervisor' && 'سپروائزر'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
