'use client';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Bell, User, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { user } = useAuth();
  const { language, changeLanguage, t, dir } = useLanguage();

  const roleLabels = {
    admin: t('admin'),
    supervisor: t('supervisor'),
    operator: t('operator')
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4" dir={dir}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('systemTitle')}</h1>
          <p className="text-sm text-gray-600">{t('welcome')}، {user?.name}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                {language === 'ur' ? 'اردو' : 'English'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => changeLanguage('ur')}
                className={language === 'ur' ? 'bg-gray-100 font-semibold' : ''}
              >
                🇵🇰 اردو (Urdu)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => changeLanguage('en')}
                className={language === 'en' ? 'bg-gray-100 font-semibold' : ''}
              >
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-600" />
            <div className="text-sm">
              <div className="font-medium">{user?.name}</div>
              <div className="text-gray-500">
                {roleLabels[user?.role] || user?.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
