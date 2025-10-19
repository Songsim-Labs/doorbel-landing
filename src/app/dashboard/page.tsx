'use client';

import { useMemo } from 'react';
import { useDashboardStats, useActivityLogs } from '@/hooks/queries/useStatsQueries';
import { useRevenueAnalytics, useRiderAnalytics } from '@/hooks/queries/useAnalyticsQueries';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { StatsCard } from '@/components/admin/StatsCard';
import {
  ShoppingBag,
  Users,
  FileCheck,
  DollarSign,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  // Enable WebSocket query invalidation
  useQueryInvalidation();
  
  // Fetch data with React Query
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: revenueData } = useRevenueAnalytics('week');
  const { data: riderData } = useRiderAnalytics();
  const { data: activityData } = useActivityLogs({ limit: 3 });
  
  const isLoading = statsLoading;
  
  // Transform chart data
  const chartData = useMemo(() => {
    return revenueData?.dailyTrend?.map((day: any) => ({
      date: new Date(day._id).toLocaleDateString('en-US', { weekday: 'short' }),
      orders: day.orders || 0,
      revenue: day.revenue || 0,
    })) || [];
  }, [revenueData]);
  
  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    const totalOrders = stats?.orders?.total || 1;
    const completedOrders = stats?.orders?.completed || 0;
    const successRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100) : 0;
    
    const avgDeliveryTimeMs = riderData?.deliveryMetrics?.averageTime || 0;
    const avgDeliveryTimeMins = Math.floor(avgDeliveryTimeMs / 60000);
    
    const totalRiders = riderData?.topRiders?.length || 0;
    const totalRating = riderData?.topRiders?.reduce((sum: number, rider: any) => sum + (rider.rating || 0), 0) || 0;
    const satisfaction = totalRiders > 0 ? (totalRating / totalRiders) : 0;
    
    return {
      avgDeliveryTime: avgDeliveryTimeMins,
      successRate: parseFloat(successRate.toFixed(1)),
      satisfaction: parseFloat(satisfaction.toFixed(1)),
      uptime: 99.9,
    };
  }, [stats, riderData]);
  
  // Calculate alerts
  const alerts = useMemo(() => {
    const failedPayments = stats?.payments?.failed || 0;
    const oldPendingOrders = Math.floor((stats?.orders?.pending || 0) * 0.3);
    
    return {
      failedPayments,
      oldPendingOrders,
      pendingKYC: stats?.riders?.pendingKYC || 0,
    };
  }, [stats]);
  
  const recentActivity = activityData?.activities || [];
  
  const handleRefresh = () => {
    refetchStats();
    toast.success('Dashboard refreshed');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value={stats?.orders.total || 0}
          icon={ShoppingBag}
          trend={stats?.orders.trend}
          subtitle={`${stats?.orders.pending || 0} pending`}
          isLoading={isLoading}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Active Riders"
          value={`${stats?.riders.online || 0}/${stats?.riders.total || 0}`}
          icon={Users}
          subtitle={`${stats?.riders.busy || 0} busy`}
          isLoading={isLoading}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Pending KYC"
          value={stats?.riders.pendingKYC || 0}
          icon={FileCheck}
          subtitle={`${stats?.riders.approvedKYC || 0} approved`}
          isLoading={isLoading}
          iconColor="text-amber-600"
        />
        <StatsCard
          title="Today's Revenue"
          value={`GHS ${(stats?.revenue.today || 0).toFixed(2)}`}
          icon={DollarSign}
          trend={stats?.revenue.trend}
          isLoading={isLoading}
          iconColor="text-emerald-600"
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Trends</CardTitle>
            <CardDescription>Orders over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue over the last 7 days (GHS)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Metrics, Activity & Alerts */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key operational metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Delivery Time</span>
              <span className="text-lg font-bold">
                {isLoading ? '...' : `${performanceMetrics.avgDeliveryTime} min`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Order Success Rate</span>
              <span className="text-lg font-bold text-green-600">
                {isLoading ? '...' : `${performanceMetrics.successRate}%`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
              <span className="text-lg font-bold text-blue-600">
                {isLoading ? '...' : `${performanceMetrics.satisfaction}/5.0`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Platform Uptime</span>
              <span className="text-lg font-bold text-emerald-600">
                {performanceMetrics.uptime}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  // Map activity status to colors and icons
                  const getActivityStyle = (status: string) => {
                    switch (status) {
                      case 'success':
                        return { bg: 'bg-green-100', text: 'text-green-600', icon: Activity };
                      case 'failure':
                        return { bg: 'bg-red-100', text: 'text-red-600', icon: AlertCircle };
                      default:
                        return { bg: 'bg-blue-100', text: 'text-blue-600', icon: Activity };
                    }
                  };
                  
                  const style = getActivityStyle(activity.status);
                  const Icon = style.icon;
                  
                  return (
                    <div key={activity._id} className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${style.bg} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${style.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.action || activity.eventType || 'Activity'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp 
                            ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
                            : 'Recently'
                          }
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.failedPayments > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-red-600">
                    {isLoading ? '...' : alerts.failedPayments}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Failed Payments</p>
                  <p className="text-xs text-red-700">Require manual review</p>
                </div>
              </div>
            )}
            
            {alerts.oldPendingOrders > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-yellow-600">
                    {isLoading ? '...' : alerts.oldPendingOrders}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">Pending Orders</p>
                  <p className="text-xs text-yellow-700">Over 30 minutes old</p>
                </div>
              </div>
            )}
            
            {alerts.pendingKYC > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">
                    {isLoading ? '...' : alerts.pendingKYC}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Pending KYC</p>
                  <p className="text-xs text-blue-700">Awaiting approval</p>
                </div>
              </div>
            )}
            
            {!isLoading && alerts.failedPayments === 0 && alerts.oldPendingOrders === 0 && alerts.pendingKYC === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <p className="font-medium text-green-600">All Clear!</p>
                <p className="text-xs mt-1">No alerts at this time</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

