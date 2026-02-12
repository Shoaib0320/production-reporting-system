// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/lib/hooks/useAuth';
// import { useLanguage } from '@/lib/contexts/LanguageContext';
// import { Button } from '@/components/ui/button';
// import { 
//   LayoutDashboard, 
//   Settings, 
//   Users, 
//   Cog, 
//   FileText, 
//   LogOut,
//   BarChart3 
// } from 'lucide-react';

// export default function Sidebar({ onClose }) {
//   const pathname = usePathname();
//   const { user, logout } = useAuth();
//   const { t, dir } = useLanguage();

//   const menuItems = [
//     { href: '/dashboard/admin', label: t('dashboard'), icon: LayoutDashboard, roles: ['admin'] },
//     { href: '/dashboard/supervisor', label: t('dashboard'), icon: LayoutDashboard, roles: ['supervisor'] },
//     { href: '/dashboard/operator', label: t('dashboard'), icon: LayoutDashboard, roles: ['operator'] },
//     { href: '/dashboard/admin/productions', label: t('productions'), icon: BarChart3, roles: ['admin'] },
//     { href: '/dashboard/admin/machines', label: t('machines'), icon: Cog, roles: ['admin'] },
//     { href: '/dashboard/admin/users', label: t('users'), icon: Users, roles: ['admin'] },
//     { href: '/dashboard/admin/reports', label: t('reports'), icon: FileText, roles: ['admin'] },
//     { href: '/dashboard/supervisor/reports', label: t('reports'), icon: FileText, roles: ['supervisor'] },
//     { href: '/dashboard/operator/reports', label: t('reports'), icon: FileText, roles: ['operator'] },
//   ];

//   const filteredItems = menuItems.filter(item => 
//     !item.roles || item.roles.includes(user?.role)
//   );

//   const handleLinkClick = () => {
//     if (onClose) onClose();
//   };

//   return (
//     <aside className="w-full h-full bg-white flex flex-col justify-between p-4" dir={dir}>
//       <div>
//         <div className="mb-6">
//           <h2 className="text-lg md:text-xl font-bold text-gray-800">{t('systemTitle')}</h2>
//           <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
//           <div className="mt-1 text-xs text-gray-500">{t(user?.role)}</div>
//         </div>

//         <nav className="space-y-2">
//           {filteredItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = pathname === item.href;

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={handleLinkClick}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
//                 }`}
//                 aria-current={isActive ? 'page' : undefined}
//               >
//                 <Icon className="h-5 w-5" />
//                 <span className="text-sm md:text-base">{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </div>

//       <div className="mt-4">
//         <Button
//           variant="outline"
//           className="w-full justify-start gap-3"
//           onClick={logout}
//           aria-label="Logout"
//         >
//           <LogOut className="h-5 w-5" />
//           <span>{t('logout')}</span>
//         </Button>
//       </div>
//     </aside>
//   );
// }


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Cog, 
  FileText, 
  LogOut,
  BarChart3,
  ChevronLeft,
  ChevronRight
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
  ];

  const filteredItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside className="w-full h-full bg-white flex flex-col p-6 shadow-2xl lg:shadow-none" dir={dir}>
      {/* Brand Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="h-12 w-12 bg-[#00A3E1] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 rotate-3">
          <BarChart3 className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 leading-none tracking-tight">ERP PRO</h2>
          <span className="text-[10px] font-bold text-[#00A3E1] uppercase tracking-widest italic">Production System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                isActive 
                  ? 'bg-[#00A3E1] hover:bg-[#0089bd] text-white -translate-y-0.5' 
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className={`absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white shadow-sm ${dir === 'rtl' ? 'left-4' : 'right-4'}`}></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="mt-6 pt-6 border-t border-gray-50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 h-14 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 font-black transition-all group overflow-hidden"
          onClick={logout}
        >
          <div className="bg-red-50 p-2 rounded-xl group-hover:bg-red-100 transition-colors">
            <LogOut className="h-5 w-5" />
          </div>
          <span>{t('logout')}</span>
        </Button>
      </div>
    </aside>
  );
}