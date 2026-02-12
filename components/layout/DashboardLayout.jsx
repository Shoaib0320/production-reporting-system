'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto fixed left-0 top-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content - with left margin for fixed sidebar */}
      <div className="flex-1 flex flex-col h-screen lg:ml-64">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
