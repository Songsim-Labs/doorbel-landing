'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function AdminContainer({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="dashboard-layout flex w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block">
        <AdminSidebar />
      </aside>
      
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar />
        </SheetContent>
      </Sheet>
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden h-full">
        <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

