'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';
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

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t, dir } = useLanguage();

  const menuItems = [
    { href: '/dashboard/admin', label: t('dashboard'), icon: LayoutDashboard, roles: ['admin'] },
    { href: '/dashboard/supervisor', label: t('dashboard'), icon: LayoutDashboard, roles: ['supervisor'] },
    { href: '/dashboard/operator', label: t('dashboard'), icon: LayoutDashboard, roles: ['operator'] },
    { href: '/dashboard/admin/productions', label: t('productions'), icon: BarChart3, roles: ['admin'] },
    { href: '/dashboard/admin/machines', label: t('machines'), icon: Cog, roles: ['admin'] },
    { href: '/dashboard/admin/users', label: t('users'), icon: Users, roles: ['admin'] },
    { href: '/dashboard/admin/reports', label: t('reports'), icon: FileText, roles: ['admin'] },
    { href: '/dashboard/supervisor/reports', label: t('reports'), icon: FileText, roles: ['supervisor'] },
    { href: '/dashboard/operator/reports', label: t('reports'), icon: FileText, roles: ['operator'] },
  ];

  const filteredItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-full h-full bg-white flex flex-col justify-between p-4" dir={dir}>
      <div>
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">{t('systemTitle')}</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
          <div className="mt-1 text-xs text-gray-500">{t(user?.role)}</div>
        </div>

        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm md:text-base">{item.label}</span>
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
          <span>{t('logout')}</span>
        </Button>
      </div>
    </aside>
  );
}
