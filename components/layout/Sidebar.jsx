'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Cog, 
  FileText, 
  LogOut,
  BarChart3 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { href: '/dashboard/admin', label: 'ڈیش بورڈ', icon: LayoutDashboard, roles: ['admin', 'supervisor'] },
    { href: '/dashboard/operator', label: 'آپریٹر', icon: Settings, roles: ['operator'] },
    { href: '/dashboard/admin/users', label: 'یوزرز', icon: Users, roles: ['admin'] },
    { href: '/dashboard/reports', label: 'رپورٹس', icon: FileText, roles: ['admin', 'supervisor'] },
  ];

  const filteredItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside className="w-64 bg-white border-l border-gray-200 min-h-screen p-4 flex flex-col justify-between" dir="rtl">
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">پروڈکشن سسٹم</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
          <div className="mt-1 text-xs text-gray-500">{user?.role}</div>
        </div>

        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={logout}
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
          <span>لاگ آؤٹ</span>
        </Button>
      </div>
    </aside>
  );
}
