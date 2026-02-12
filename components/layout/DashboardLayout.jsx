'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dir } = useLanguage();

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden" dir={dir}>
      
      {/* Desktop Sidebar - Fixed positioning based on direction */}
      <aside className={`hidden lg:block w-72 bg-white border-gray-200 h-screen fixed top-0 bottom-0 z-50 transition-all ${
        dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
      }`}>
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-72 p-0 border-none">
          <Sidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ${
        dir === 'rtl' ? 'lg:mr-72' : 'lg:ml-72'
      }`}>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-6 lg:p-4">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}