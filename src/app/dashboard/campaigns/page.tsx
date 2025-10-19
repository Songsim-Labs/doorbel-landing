'use client';

import { useCampaignStats, useSendLaunchAnnouncement, useConfirmUsers } from '@/hooks/queries/useCampaignQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Send,
  Users,
  Mail,
  TrendingUp,
  Target,
  CheckCircle,
  Rocket,
  Loader2,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
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
} from 'recharts';

export default function CampaignsPage() {
  const { data: statsData, isLoading } = useCampaignStats();
  const sendLaunchMutation = useSendLaunchAnnouncement();
  const confirmUsersMutation = useConfirmUsers();

  const stats = statsData || {
    total: 0,
    confirmed: 0,
    launched: 0,
    marketingOptIn: 0,
    recentSignups: [],
    cityStats: [],
    roleStats: [],
  };

  const handleSendLaunch = () => {
    if (stats.confirmed === 0) {
      return;
    }
    
    if (confirm(`Send launch announcement to ${stats.confirmed} confirmed users?`)) {
      sendLaunchMutation.mutate('confirmed');
    }
  };

  const handleConfirmUsers = () => {
    if (confirm('Confirm all pending users?')) {
      confirmUsersMutation.mutate();
    }
  };

  // Prepare chart data
  const signupTrendData = stats.recentSignups.map(item => ({
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    signups: item.count
  }));

  const cityChartData = stats.cityStats.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    total: item.count,
    confirmed: item.confirmed,
    launched: item.launched
  }));

  const roleChartData = stats.roleStats.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count
  }));

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground">Create and manage marketing campaigns for your waitlist</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/dashboard/campaigns/builder">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All waitlist users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Email verified users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Launched</CardTitle>
            <Rocket className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.launched}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing Opt-in</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.marketingOptIn}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.marketingOptIn / stats.total) * 100) : 0}% opt-in rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your waitlist and launch status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Confirm Pending Users</h3>
              <p className="text-sm text-muted-foreground">
                Bulk confirm all pending users ({stats.total - stats.confirmed - stats.launched} users)
              </p>
            </div>
            <Button 
              onClick={handleConfirmUsers} 
              disabled={confirmUsersMutation.isPending || (stats.total - stats.confirmed - stats.launched) === 0}
              variant="outline"
            >
              {confirmUsersMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm All
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
            <div>
              <h3 className="font-semibold">Send Launch Announcement</h3>
              <p className="text-sm text-muted-foreground">
                Notify all confirmed users that DoorBel is now live ({stats.confirmed} users)
              </p>
            </div>
            <Button 
              onClick={handleSendLaunch} 
              disabled={sendLaunchMutation.isPending || stats.confirmed === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {sendLaunchMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Send Launch
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Signup Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Signup Trend (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : signupTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={signupTrendData}>
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
                  <Area 
                    type="monotone" 
                    dataKey="signups" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No signup data available
              </div>
            )}
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
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : roleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No role data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* City Analytics */}
      {cityChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              City Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={cityChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="total" fill="#22c55e" name="Total Signups" />
                <Bar dataKey="confirmed" fill="#3b82f6" name="Confirmed" />
                <Bar dataKey="launched" fill="#f59e0b" name="Launched" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

