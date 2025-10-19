'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RevenueChart } from '@/components/admin/analytics/RevenueChart';
import { RiderLeaderboard } from '@/components/admin/analytics/RiderLeaderboard';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, RefreshCw } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { 
  useAnalytics, 
  useRevenueAnalytics, 
  useRiderAnalytics, 
  useCustomerAnalytics 
} from '@/hooks/queries/useAnalyticsQueries';
import { useSupportStats } from '@/hooks/queries/useSupportQueries';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type PeriodType = 'today' | 'week' | 'month' | 'year';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<PeriodType>('week');

  // Fetch analytics data with React Query
  const { 
    data: platformAnalytics, 
    isLoading: platformLoading,
    refetch: refetchPlatform
  } = useAnalytics(period);
  
  const { 
    data: revenueAnalytics, 
    isLoading: revenueLoading,
    refetch: refetchRevenue
  } = useRevenueAnalytics(period);
  
  const { 
    data: riderAnalytics, 
    isLoading: riderLoading,
    refetch: refetchRiders
  } = useRiderAnalytics();
  
  const { 
    data: customerAnalytics, 
    isLoading: customerLoading,
    refetch: refetchCustomers
  } = useCustomerAnalytics();

  const {
    data: supportStats,
    isLoading: supportLoading,
    refetch: refetchSupport
  } = useSupportStats();

  const loading = platformLoading || revenueLoading || riderLoading || customerLoading || supportLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refetchPlatform(),
      refetchRevenue(),
      refetchRiders(),
      refetchCustomers(),
      refetchSupport()
    ]);
    toast.success('Analytics data refreshed successfully');
  };

  // Calculate derived data for charts
  const revenueData = revenueAnalytics?.dailyTrend?.map((item: any) => ({
    date: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: item.revenue || 0,
    orders: item.orders || 0,
  })) || [];

  const deliveryTypeData = revenueAnalytics?.byDeliveryType?.map((item: any, index: number) => ({
    name: item._id === 'standard' ? 'Standard' : 'Express',
    value: item.totalRevenue || 0,
    color: index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
  })) || [];

  const paymentMethodData = revenueAnalytics?.byPaymentMethod?.map((item: any, index: number) => ({
    name: item._id === 'mobile_money' ? 'Mobile Money' : 'Card',
    value: item.totalRevenue || 0,
    color: index === 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))',
  })) || [];

  const vehicleTypeData = riderAnalytics?.byVehicleType?.map((item: any) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    count: item.count || 0,
  })) || [];

  const topRiders = riderAnalytics?.topRiders?.map((rider: any) => ({
    _id: rider._id,
    name: rider.name,
    orders: rider.successfulOrderCount,
    rating: rider.rating,
    earnings: 0, // This would need to be calculated from payment data
  })) || [];

  const averageDeliveryTimeData = topRiders.slice(0, 5).map((rider: any) => ({
    rider: rider.name.split(' ')[0],
    time: Math.floor((riderAnalytics?.deliveryMetrics?.averageTime || 0) / 60000), // Convert ms to minutes
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive platform analytics and business insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`GHS ${(platformAnalytics?.overview?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          trend={{
            direction: platformAnalytics?.trends?.revenueTrendDirection || 'neutral',
            value: `${Math.abs(platformAnalytics?.trends?.revenueTrend || 0).toFixed(1)}%`
          }}
          subtitle="vs last period"
          iconColor="text-emerald-600"
        />
        <StatsCard
          title="Avg Order Value"
          value={`GHS ${(platformAnalytics?.overview?.averageOrderValue || 0).toFixed(2)}`}
          icon={ShoppingBag}
          trend={{
            direction: 'neutral',
            value: ''
          }}
          subtitle="per order"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Active Riders"
          value={platformAnalytics?.overview?.activeRiders?.toString() || '0'}
          icon={Users}
          trend={{
            direction: 'neutral',
            value: ''
          }}
          subtitle={`of ${platformAnalytics?.overview?.totalRiders || 0} total`}
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Order Growth"
          value={`${(platformAnalytics?.trends?.orderTrend || 0).toFixed(1)}%`}
          icon={TrendingUp}
          trend={{
            direction: platformAnalytics?.trends?.orderTrendDirection || 'neutral',
            value: `${Math.abs(platformAnalytics?.trends?.orderTrend || 0).toFixed(1)}%`
          }}
          subtitle="vs last period"
          iconColor="text-orange-600"
        />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="riders">Riders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueChart data={revenueData} />

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Delivery Type</CardTitle>
                  <CardDescription>Distribution of revenue by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deliveryTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deliveryTypeData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Payment Method</CardTitle>
                  <CardDescription>Payment method distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Rider Analytics */}
        <TabsContent value="riders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <RiderLeaderboard riders={topRiders} />

            <Card>
              <CardHeader>
                <CardTitle>Average Delivery Time</CardTitle>
                <CardDescription>Top 5 riders by delivery speed (minutes)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={averageDeliveryTimeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="rider" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="time" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Type Distribution</CardTitle>
              <CardDescription>Active riders by vehicle type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vehicleTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Analytics */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Customer behavior metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Customers</span>
                  <span className="text-2xl font-bold text-primary">{customerAnalytics?.summary?.totalCustomers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Customers</span>
                  <span className="text-2xl font-bold text-green-600">{customerAnalytics?.summary?.activeCustomers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Retention Rate</span>
                  <span className="text-2xl font-bold text-blue-600">{customerAnalytics?.summary?.retentionRate || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New This Month</span>
                  <span className="text-2xl font-bold">{customerAnalytics?.summary?.newCustomersLastMonth || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>By order count and spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerAnalytics?.topCustomers?.slice(0, 5).map((customer: any, index: number) => (
                    <div key={customer._id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.orderCount} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">GHS {customer.totalSpent.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Avg: GHS {customer.averageOrderValue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )) || <p className="text-sm text-muted-foreground">No customer data available</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geographic Analytics */}
        {/* Support Analytics */}
        <TabsContent value="support" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Volume</CardTitle>
                <CardDescription>Total support tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{supportStats?.totalTickets || 0}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {supportStats?.openTickets || 0} open, {supportStats?.unassignedTickets || 0} unassigned
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Average first response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.floor(supportStats?.avgFirstResponseTime || 0)} min</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Resolution: {Math.floor(supportStats?.avgResolutionTime || 0)} min
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction</CardTitle>
                <CardDescription>Customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{supportStats?.satisfactionScore?.toFixed(1) || 0}/5 ⭐</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {supportStats?.resolutionRate?.toFixed(1) || 0}% resolution rate
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tickets by Status</CardTitle>
                <CardDescription>Current ticket distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(supportStats?.byStatus || {}).map(([status, count]) => ({
                        name: status.replace('_', ' '),
                        value: count,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {Object.entries(supportStats?.byStatus || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tickets by Category</CardTitle>
                <CardDescription>Issue type breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(supportStats?.byCategory || {}).map(([category, count]) => ({
                      category: category.replace(/_/g, ' '),
                      count,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="category" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Orders by region (coming soon)</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-semibold mb-2">Interactive Map Coming Soon</p>
                <p className="text-sm">
                  Geographic distribution of orders and delivery coverage will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
