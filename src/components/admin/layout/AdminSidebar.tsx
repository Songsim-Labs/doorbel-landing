"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  Package, 
  Truck, 
  CreditCard, 
  BarChart3, 
  Settings, 
  X,
  ChevronDown,
  ChevronRight,
  Home,
  UserCheck,
  FileText,
  Bell
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: MenuItem[];
}

const navigation: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Waitlist',
    href: '/admin/waitlist',
    icon: Users,
    badge: 'New',
    children: [
      {
        name: 'All Users',
        href: '/admin/waitlist',
        icon: Users,
      },
      {
        name: 'Analytics',
        href: '/admin/waitlist/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    name: 'Campaigns',
    href: '/admin/campaigns',
    icon: Mail,
    children: [
      {
        name: 'All Campaigns',
        href: '/admin/campaigns',
        icon: Mail,
      },
      {
        name: 'Campaign Builder',
        href: '/admin/campaigns/builder',
        icon: FileText,
      },
      {
        name: 'Templates',
        href: '/admin/campaigns/templates',
        icon: FileText,
      },
      {
        name: 'Analytics',
        href: '/admin/campaigns/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: Package,
  },
  {
    name: 'Riders',
    href: '/admin/riders',
    icon: Truck,
    children: [
      {
        name: 'All Riders',
        href: '/admin/riders',
        icon: Truck,
      },
      {
        name: 'KYC Verification',
        href: '/admin/riders/kyc',
        icon: UserCheck,
      },
      {
        name: 'Performance',
        href: '/admin/riders/performance',
        icon: BarChart3,
      },
    ],
  },
  {
    name: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand current section
  useEffect(() => {
    const currentSection = navigation.find(item => 
      pathname.startsWith(item.href) && item.children
    );
    if (currentSection) {
      setExpandedItems(prev => 
        prev.includes(currentSection.name) ? prev : [...prev, currentSection.name]
      );
    }
  }, [pathname]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const active = isActive(item.href);

    return (
      <div key={item.name}>
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
            level === 0 ? "mx-2" : "mx-4",
            active
              ? "bg-green-100 text-green-700"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.name);
            }
          }}
        >
          <div className="flex items-center">
            <item.icon className={cn("h-5 w-5", level > 0 && "h-4 w-4")} />
            <Link 
              href={item.href} 
              className={cn("ml-3", level > 0 && "ml-2")}
              onClick={(e) => {
                if (hasChildren) {
                  e.preventDefault();
                }
              }}
            >
              {item.name}
            </Link>
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Image
                src="/icon.png"
                alt="DoorBel Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">DoorBel</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {/* Quick Actions */}
            <div className="px-3 mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quick Actions
              </h3>
            </div>
            
            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <Home className="h-5 w-5" />
                <span className="ml-3">Back to Site</span>
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="px-3 mt-6 mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Management
              </h3>
            </div>
            
            <div className="space-y-1">
              {navigation.map((item) => renderMenuItem(item))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@doorbel.org
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
