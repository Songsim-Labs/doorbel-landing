'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  FileCheck,
  ShoppingBag,
  CreditCard,
  UserCheck,
  XCircle,
  CheckCircle2,
  Download,
  Search,
  LogIn,
  LogOut,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ActivityLog, ActivityType, ActivityStatus } from '@/types/activity';
import { cn } from '@/lib/utils';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

const activityIcons: Record<ActivityType, React.ElementType> = {
  login: LogIn,
  logout: LogOut,
  order_created: ShoppingBag,
  order_cancelled: XCircle,
  order_completed: CheckCircle2,
  kyc_approved: FileCheck,
  kyc_rejected: XCircle,
  payment_processed: CreditCard,
  payment_refunded: CreditCard,
  rider_activated: UserCheck,
  rider_deactivated: XCircle,
  settings_updated: Activity,
  admin_created: UserCheck,
  admin_deleted: XCircle,
};

const statusColors: Record<ActivityStatus, string> = {
  success: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  warning: 'bg-orange-100 text-orange-800',
};

export default function ActivityLogsPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { on, off } = useWebSocket();
  const { toast } = useToast();

  // Fetch activity logs
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (searchQuery) filters.search = searchQuery;
      if (typeFilter !== 'all') filters.type = typeFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;

      const response = await apiClient.getActivityLogs(filters);
      setActivities(response.activities || []);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch activity logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [pagination.page, searchQuery, typeFilter, statusFilter, categoryFilter]);

  useEffect(() => {
    // Listen for real-time activity updates
    const handleNewActivity = (...args: unknown[]) => {
      const activity = args[0] as ActivityLog;
      setActivities(prev => [activity, ...prev]);
    };

    on('admin_activity', handleNewActivity);

    return () => {
      off('admin_activity', handleNewActivity);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      const filters: any = {};
      
      if (searchQuery) filters.search = searchQuery;
      if (typeFilter !== 'all') filters.type = typeFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;

      // Get data and convert to CSV
      const response = await apiClient.getActivityLogs({ ...filters, limit: 10000 });
      const csvData = convertToCSV(response.activities);
      downloadCSV(csvData, 'activity-logs.csv');

      toast({
        title: 'Success',
        description: 'Activity logs exported successfully',
      });
    } catch (error: any) {
      console.error('Error exporting logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to export activity logs',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const convertToCSV = (data: any[]) => {
    const headers = ['Timestamp', 'Category', 'Event Type', 'Action', 'Status', 'User'];
    const rows = data.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.category || '',
      item.eventType || '',
      item.action || item.message || '',
      item.status || '',
      item.user ? `${item.user.firstName} ${item.user.lastName}` : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">View all administrative actions and system events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchActivities()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="verification">Verification</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                {pagination.totalCount} {pagination.totalCount === 1 ? 'activity' : 'activities'} found
              </CardDescription>
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasMore || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = activityIcons[activity.type as ActivityType] || Activity;
                  const statusKey = activity.status === 'failure' ? 'failed' : activity.status;
                  
                  return (
                    <div
                      key={activity._id}
                      className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={cn(
                          'h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0',
                          statusColors[statusKey as ActivityStatus] || 'bg-gray-100 text-gray-800'
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold">{activity.eventType || activity.category}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {activity.action || activity.message || 'No description'}
                            </p>
                          </div>
                          <Badge variant="outline" className={statusColors[statusKey as ActivityStatus] || 'bg-gray-100 text-gray-800'}>
                            {activity.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          {activity.user && (
                            <>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">
                                    {activity.user.firstName?.[0]}{activity.user.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span>
                                  {activity.user.firstName} {activity.user.lastName}
                                </span>
                              </div>
                              <span>•</span>
                            </>
                          )}
                          <span>{new Date(activity.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {activities.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No activities found</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

