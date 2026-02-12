// 'use client';

// import { useLanguage } from '@/lib/contexts/LanguageContext';
// import { useAuth } from '@/lib/hooks/useAuth';
// import { Button } from '@/components/ui/button';
// import { Bell, User, Globe, Menu } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// export default function Header({ onMenuClick }) {
//   const { user } = useAuth();
//   const { language, changeLanguage, t, dir } = useLanguage();

//   const roleLabels = {
//     admin: t('admin'),
//     supervisor: t('supervisor'),
//     operator: t('operator')
//   };

//   return (
//     <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4" dir={dir}>
//       <div className="flex items-center justify-between">
//         {/* Mobile Menu Button */}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="lg:hidden"
//           onClick={onMenuClick}
//         >
//           <Menu className="h-6 w-6" />
//         </Button>

//         <div className="hidden md:block">
//           <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t('systemTitle')}</h1>
//           <p className="text-xs md:text-sm text-gray-600">{t('welcome')}، {user?.name}</p>
//         </div>

//         <div className="flex items-center gap-2 md:gap-4">
//           {/* Language Switcher */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="gap-2">
//                 <Globe className="h-4 w-4" />
//                 <span className="hidden sm:inline">{language === 'ur' ? 'اردو' : 'English'}</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem 
//                 onClick={() => changeLanguage('ur')}
//                 className={language === 'ur' ? 'bg-gray-100 font-semibold' : ''}
//               >
//                 🇵🇰 اردو (Urdu)
//               </DropdownMenuItem>
//               <DropdownMenuItem 
//                 onClick={() => changeLanguage('en')}
//                 className={language === 'en' ? 'bg-gray-100 font-semibold' : ''}
//               >
//                 🇬🇧 English
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <Button variant="ghost" size="icon" className="hidden md:flex">
//             <Bell className="h-5 w-5" />
//           </Button>
          
//           <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
//             <User className="h-5 w-5 text-gray-600" />
//             <div className="text-sm">
//               <div className="font-medium">{user?.name}</div>
//               <div className="text-gray-500">
//                 {roleLabels[user?.role] || user?.role}
//               </div>
//             </div>
//           </div>
          
//           {/* Mobile User Icon */}
//           <div className="md:hidden flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
//             <User className="h-5 w-5 text-gray-600" />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

'use client';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Bell, User, Globe, Menu, ChevronDown, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { language, changeLanguage, t, dir } = useLanguage();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-xl border-b border-gray-100 h-16 sm:h-20 flex items-center shrink-0 px-4 md:px-8" dir={dir}>
      <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto">
        
        {/* Left Side: Mobile Menu & Breadcrumb-like text */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-gray-100 rounded-xl shrink-0"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
          
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              {t('systemTitle')}
            </h1>
          </div>
        </div>

        {/* Right Side: Language, Notif, User */}
        <div className="flex items-center gap-3 md:gap-6">
          
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-2 rounded-2xl border-2 border-gray-50 bg-white/50 hover:bg-white shadow-sm px-4">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-black uppercase tracking-widest">{language}</span>
                <ChevronDown className="h-3 w-3 opacity-30" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-48 rounded-2xl p-2 shadow-2xl border-gray-100">
              <DropdownMenuItem onClick={() => changeLanguage('ur')} className="rounded-xl py-3 gap-3 cursor-pointer font-bold">
                <span className="text-xl">🇵🇰</span> اردو (Urdu)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('en')} className="rounded-xl py-3 gap-3 cursor-pointer font-bold">
                <span className="text-xl">🇬🇧</span> English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-gray-50/50 text-gray-500 relative hidden md:flex hover:bg-white border-2 border-transparent hover:border-blue-100 transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white animate-pulse"></span>
          </Button>

          {/* User Profile Section */}
          <div className="flex items-center gap-3 pl-4 border-l-2 border-gray-50">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-900 leading-none mb-1">{user?.name}</p>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                {t(user?.role)}
              </p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-gradient-to-tr from-[#00A3E1] to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 border-2 border-white ring-1 ring-blue-50 transition-transform hover:scale-105 cursor-pointer">
              <User className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}