"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken');
        const adminUser = localStorage.getItem('adminUser');

        if (!token || !adminUser) {
          setIsAuthenticated(false);
          router.push('/admin/login');
          return;
        }

        // Validate stored admin JSON
        JSON.parse(adminUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        router.push('/admin/login');
      } finally {
        // Always clear loading state to avoid spinner lock
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Redirect to login if not authenticated
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (fixed) */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Top navigation (fixed). On desktop, offset by sidebar width */}
      <div className="fixed top-0 left-0 right-0 lg:left-64 z-40">
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminRefreshToken');
            localStorage.removeItem('adminUser');
            router.push('/admin/login');
          }}
        />
      </div>

      {/* Scrollable content area. On desktop, offset by sidebar and header heights */}
      <div className="lg:ml-64 pt-16">
        {/* Breadcrumb */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <AdminBreadcrumb />
        </div>

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
