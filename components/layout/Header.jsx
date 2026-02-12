'use client';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Bell, User, Globe, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { language, changeLanguage, t, dir } = useLanguage();

  const roleLabels = {
    admin: t('admin'),
    supervisor: t('supervisor'),
    operator: t('operator')
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4" dir={dir}>
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="hidden md:block">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t('systemTitle')}</h1>
          <p className="text-xs md:text-sm text-gray-600">{t('welcome')}، {user?.name}</p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'ur' ? 'اردو' : 'English'}</span>
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

          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-600" />
            <div className="text-sm">
              <div className="font-medium">{user?.name}</div>
              <div className="text-gray-500">
                {roleLabels[user?.role] || user?.role}
              </div>
            </div>
          </div>
          
          {/* Mobile User Icon */}
          <div className="md:hidden flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <User className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
