"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
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
  ResponsiveContainer 
} from "recharts";
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Mail,
  Send,
  Target,
  BarChart3,
  Truck,
  Rocket,
  Package,
  CreditCard,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from "lucide-react";
import adminApi from "@/lib/admin/admin-api";

interface DashboardStats {
  total: number;
  confirmed: number;
  launched: number;
  marketingOptIn: number;
  byCity: string[];
  byRole: string[];
  byStatus: string[];
}

interface DashboardData {
  stats: DashboardStats;
  recentSignups: Array<{ _id: string; count: number }>;
  cityStats: Array<{ _id: string; count: number; confirmed: number; launched: number }>;
  roleStats: Array<{ _id: string; count: number }>;
}

interface SystemMetrics {
  totalOrders: number;
  activeRiders: number;
  totalRevenue: number;
  completionRate: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
}

interface ActivityLogItem {
  _id: string;
  timestamp: string;
  category: string;
  eventType?: string;
  action?: string;
  status?: string;
  message?: string;
  userId?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [auxStats, setAuxStats] = useState<{ pendingOrders: number; failedTransactions: number } | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityLogItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch waitlist data
      const waitlistResponse = await fetch('/api/campaigns');
      const waitlistData = await waitlistResponse.json();
      setDashboardData(waitlistData);
      setStats(waitlistData.stats);
      // Fetch real system metrics from backend via admin API client
      try {
        const [orderStats, riderStats, paymentStats] = await Promise.all([
          adminApi.getOrderStats(),
          adminApi.getRiderStats(),
          adminApi.getPaymentStats(),
        ]);

        const realSystemMetrics: SystemMetrics = {
          totalOrders: orderStats.totalOrders || 0,
          activeRiders: riderStats.activeRiders || 0,
          totalRevenue: orderStats.totalRevenue || 0,
          completionRate: orderStats.completionRate || 0,
          averageDeliveryTime: riderStats.averageDeliveryTime || 0,
          customerSatisfaction: riderStats.averageRating || 0,
        };
        setSystemMetrics(realSystemMetrics);

        // Store auxiliary stats for UI cards
        setAuxStats({
          pendingOrders: orderStats.pendingOrders || 0,
          failedTransactions: paymentStats.failedTransactions || 0,
        });

        // Fetch recent activity logs (behind feature flag until backend route exists)
        if (process.env.NEXT_PUBLIC_ENABLE_ACTIVITY === 'true') {
          try {
            const activity = await adminApi.getRecentActivity(10);
            setRecentActivity(activity);
          } catch {
            setRecentActivity([]);
          }
        } else {
          setRecentActivity([]);
        }
      } catch (apiError) {
        console.error('Error fetching backend data:', apiError);
        setSystemMetrics({
          totalOrders: 0,
          activeRiders: 0,
          totalRevenue: 0,
          completionRate: 0,
          averageDeliveryTime: 0,
          customerSatisfaction: 0,
        });
        setAuxStats({ pendingOrders: 0, failedTransactions: 0 });
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading dashboard data</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const signupTrendData = dashboardData?.recentSignups.map(item => ({
    date: item._id,
    signups: item.count
  })) || [];

  const cityChartData = dashboardData?.cityStats.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    total: item.count,
    confirmed: item.confirmed,
    launched: item.launched
  })) || [];

  const roleChartData = dashboardData?.roleStats.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count
  })) || [];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with DoorBel today.</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-green-600">Operational</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-blue-600">{systemMetrics?.activeRiders || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{auxStats?.pendingOrders || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-red-600">{auxStats?.failedTransactions || 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics?.totalOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Riders</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics?.activeRiders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₵{systemMetrics?.totalRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics?.completionRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Waitlist Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Signups</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.confirmed || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Launched</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.launched || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Marketing Opt-in</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.marketingOptIn || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="launch">Launch</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity && recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((log) => (
                      <div key={log._id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {log.action || log.eventType || log.category}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {log.message || log.status || ''}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No recent activity available.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Delivery Time</span>
                    <span className="text-sm font-medium">{systemMetrics?.averageDeliveryTime || 0} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <span className="text-sm font-medium">{systemMetrics?.customerSatisfaction || 0}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order Success Rate</span>
                    <span className="text-sm font-medium">{systemMetrics?.completionRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="text-sm font-medium">₵{systemMetrics?.totalRevenue?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Signup Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Signup Trend (Last 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={signupTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="signups" 
                        stroke="#22c55e" 
                        fill="#22c55e" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Role Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Role Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roleChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roleChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* City Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  City Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={cityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#22c55e" name="Total Signups" />
                    <Bar dataKey="confirmed" fill="#3b82f6" name="Confirmed" />
                    <Bar dataKey="launched" fill="#f59e0b" name="Launched" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Marketing Campaign */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Send Marketing Email
                  </CardTitle>
                  <CardDescription>
                    Send targeted marketing emails to your waitlist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarketingCampaignForm />
                </CardContent>
              </Card>

              {/* Audience Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Audience Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Addressable</span>
                      <Badge variant="secondary">{stats.total}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Marketing Opt-in</span>
                      <Badge variant="secondary">{stats.marketingOptIn}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Confirmed Users</span>
                      <Badge variant="secondary">{stats.confirmed}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <Badge variant="secondary">
                        {((stats.confirmed / stats.total) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="launch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="h-5 w-5 mr-2" />
                  Launch Management
                </CardTitle>
                <CardDescription>
                  Manage app launches and notify users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LaunchManagementForm stats={stats} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}

// Marketing Campaign Form Component
function MarketingCampaignForm() {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    targetCities: [] as string[],
    targetRoles: [] as string[],
    targetStatus: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string; stats?: { sent?: number; failed?: number; total?: number } } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'marketing',
          subject: formData.subject,
          content: formData.content,
          templateId: 'marketing',
          targetAudience: {
            cities: formData.targetCities,
            roles: formData.targetRoles,
            status: formData.targetStatus
          }
        })
      });

       const data = await response.json();
       if (!response.ok) {
         setResult({ error: data.message || 'Failed to send campaign' });
       } else {
         setResult(data);
       }
     } catch {
       setResult({ error: 'Failed to send campaign' });
     } finally {
       setIsSubmitting(false);
     }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter email subject"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          rows={4}
          placeholder="Enter email content"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Cities</label>
          <select
            multiple
            value={formData.targetCities}
            onChange={(e) => setFormData({ 
              ...formData, 
              targetCities: Array.from(e.target.selectedOptions, option => option.value) 
            })}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="accra">Accra</option>
            <option value="kumasi">Kumasi</option>
            <option value="takoradi">Takoradi</option>
            <option value="tamale">Tamale</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Roles</label>
          <select
            multiple
            value={formData.targetRoles}
            onChange={(e) => setFormData({ 
              ...formData, 
              targetRoles: Array.from(e.target.selectedOptions, option => option.value) 
            })}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="customer">Customer</option>
            <option value="rider">Rider</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            multiple
            value={formData.targetStatus}
            onChange={(e) => setFormData({ 
              ...formData, 
              targetStatus: Array.from(e.target.selectedOptions, option => option.value) 
            })}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="launched">Launched</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Sending...' : 'Send Campaign'}
      </Button>

      {result && (
        <div className={`p-3 rounded-md ${
          result.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
           ) : (
             <div>
               <p className="text-green-600">Campaign sent successfully!</p>
               <p className="text-sm text-gray-600">
                 Sent: {result.stats?.sent || 0} | Failed: {result.stats?.failed || 0}
               </p>
             </div>
           )}
        </div>
      )}
    </form>
  );
}

// Launch Management Form Component
function LaunchManagementForm({ stats }: { stats: DashboardStats }) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string; stats?: { sent?: number; failed?: number; total?: number } } | null>(null);

  const handleLaunch = async () => {
    setIsLaunching(true);
    setResult(null);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'launch',
          isLaunch: true,
          targetAudience: {
            status: ['confirmed']
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setResult({ error: data.message || 'Failed to send launch announcement' });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ error: 'Failed to send launch announcement' });
    } finally {
      setIsLaunching(false);
    }
  };

  const handleLaunchUpdate = async () => {
    setIsLaunching(true);
    setResult(null);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'launch',
          isLaunch: true,
          targetAudience: {
            status: ['launched']
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setResult({ error: data.message || 'Failed to send launch update' });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ error: 'Failed to send launch update' });
    } finally {
      setIsLaunching(false);
    }
  };

  const handleConfirmUsers = async () => {
    setIsLaunching(true);
    setResult(null);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'confirm',
          targetAudience: {
            status: ['pending']
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setResult({ error: data.message || 'Failed to confirm users' });
      } else {
        setResult(data);
        // Refresh the page to update stats
        window.location.reload();
      }
    } catch {
      setResult({ error: 'Failed to confirm users' });
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="font-semibold text-yellow-800">Launch Announcement</h3>
        <p className="text-sm text-yellow-700 mt-1">
          Send launch announcements to all confirmed users. This will notify them that DoorBel is now live in their city.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Launch New Users</p>
            <p className="text-sm text-gray-600">
              {stats.confirmed} confirmed users will receive launch notifications
            </p>
            {stats.confirmed === 0 && stats.launched > 0 && (
              <p className="text-sm text-yellow-600 mt-1">
                ⚠️ All users have already been launched. No confirmed users available.
              </p>
            )}
          </div>
          <Button 
            onClick={handleLaunch} 
            disabled={isLaunching || stats.confirmed === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLaunching ? 'Launching...' : 'Send Launch Announcement'}
          </Button>
        </div>

        {stats.launched > 0 && (
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium">Send Update to Launched Users</p>
              <p className="text-sm text-gray-600">
                {stats.launched} launched users will receive update notifications
              </p>
            </div>
            <Button 
              onClick={() => handleLaunchUpdate()}
              disabled={isLaunching}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              {isLaunching ? 'Sending...' : 'Send Update'}
            </Button>
          </div>
        )}

        {stats.total > 0 && stats.confirmed === 0 && (
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium">Confirm Users for Launch</p>
              <p className="text-sm text-gray-600">
                Confirm pending users to make them eligible for launch
              </p>
            </div>
            <Button 
              onClick={() => handleConfirmUsers()}
              disabled={isLaunching}
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              {isLaunching ? 'Confirming...' : 'Confirm All Users'}
            </Button>
          </div>
        )}
      </div>

      {result && (
        <div className={`p-3 rounded-md ${
          result.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
        }`}>
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
           ) : (
             <div>
               <p className="text-green-600">Launch announcement sent successfully!</p>
               <p className="text-sm text-gray-600">
                 Sent: {result.stats?.sent || 0} | Failed: {result.stats?.failed || 0}
               </p>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
