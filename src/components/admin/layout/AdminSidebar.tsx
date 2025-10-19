'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  ShoppingBag,
  Users,
  FileCheck,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Package,
  Activity,
  Shield,
  LifeBuoy,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [pendingKYCCount, setPendingKYCCount] = useState(0);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [failedTransactionsCount, setFailedTransactionsCount] = useState(0);
  
  useEffect(() => {
    fetchBadgeCounts();
    const interval = setInterval(fetchBadgeCounts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  const fetchBadgeCounts = async () => {
    try {
      const [kycStats, supportStats, paymentStats] = await Promise.all([
        apiClient.getKYCStats(),
        apiClient.getSupportStats(),
        apiClient.getPaymentStats(),
      ]);
      setPendingKYCCount(kycStats.pending || 0);
      setOpenTicketsCount(supportStats.openTickets || 0);
      setFailedTransactionsCount(paymentStats.failedPayments || 0);
    } catch (error) {
      console.error('Failed to fetch badge counts:', error);
    }
  };
  
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: 'Orders',
      href: '/dashboard/orders',
      icon: ShoppingBag,
    },
    {
      title: 'Riders',
      href: '/dashboard/riders',
      icon: Users,
    },
    {
      title: 'KYC Approvals',
      href: '/dashboard/riders/kyc',
      icon: FileCheck,
      badge: pendingKYCCount,
    },
    {
      title: 'Payments',
      href: '/dashboard/payments',
      icon: CreditCard,
    },
    {
      title: 'Failed Transactions',
      href: '/dashboard/payments/failed',
      icon: AlertTriangle,
      badge: failedTransactionsCount,
    },
    {
      title: 'Support Tickets',
      href: '/dashboard/support',
      icon: LifeBuoy,
      badge: openTicketsCount,
    },
    {
      title: 'Waitlist',
      href: '/dashboard/waitlist',
      icon: Users,
    },
    {
      title: 'Campaigns',
      href: '/dashboard/campaigns',
      icon: Send,
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      title: 'Activity Logs',
      href: '/dashboard/activity',
      icon: Activity,
    },
    {
      title: 'Admins',
      href: '/dashboard/admins',
      icon: Shield,
    },
  ];
  
  const settingsItems: NavItem[] = [
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];
  
  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'AD';
  
  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-0">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="bg-sidebar-primary rounded-lg p-2">
          <Package className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">DoorBel</h1>
          <p className="text-xs text-sidebar-foreground/70">Admin Portal</p>
        </div>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-3 py-4">
          <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/90 hover:text-sidebar-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.title}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-sidebar-primary-foreground text-sidebar-primary text-xs px-2"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
        
        <Separator className="my-4 bg-sidebar-border" />
        
        <nav className="space-y-1">
          {settingsItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/90 hover:text-sidebar-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{item.title}</span>
              </Link>
            );
          })}
          </nav>
        </div>
      </ScrollArea>
      
      {/* User Info */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-sidebar-primary">
            <AvatarImage src={user?.avatar?.url} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

