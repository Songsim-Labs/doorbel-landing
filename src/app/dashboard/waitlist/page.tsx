'use client';

import { useState } from 'react';
import { useWaitlistUsers, useWaitlistStats, exportWaitlistCSV, WaitlistUser, WaitlistFilters } from '@/hooks/queries/useWaitlistQueries';
import { DataTable } from '@/components/admin/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Download, 
  Mail, 
  UserCheck, 
  Clock,
  MapPin,
  Eye,
  Send,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useSendCampaign, useConfirmUsers, useSendLaunchAnnouncement } from '@/hooks/queries/useCampaignQueries';

export default function WaitlistManagementPage() {
  const [filters, setFilters] = useState<WaitlistFilters>({});
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<WaitlistUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch data with React Query
  const { data, isLoading } = useWaitlistUsers(filters, page, 20);
  const { data: statsData } = useWaitlistStats();
  
  const users = data?.users || [];
  const pagination = data?.pagination || null;
  const stats = statsData || data?.stats || {
    total: 0,
    pending: 0,
    confirmed: 0,
    launched: 0,
    marketingOptIn: 0,
    byCity: [],
    byRole: [],
    byStatus: []
  };

  // Mutations
  const sendCampaignMutation = useSendCampaign();
  const confirmUsersMutation = useConfirmUsers();
  const sendLaunchMutation = useSendLaunchAnnouncement();
  
  const handleSearch = () => {
    setFilters({ ...filters, search: searchQuery });
    setPage(1);
  };
  
  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPage(1);
  };
  
  const handleExport = () => {
    try {
      if (users.length === 0) {
        toast.error('No users to export');
        return;
      }
      exportWaitlistCSV(users);
      toast.success(`Exported ${users.length} users to CSV`);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to export users');
    }
  };

  const handleConfirmAll = () => {
    if (stats.pending === 0) {
      toast.error('No pending users to confirm');
      return;
    }
    
    if (confirm(`Confirm ${stats.pending} pending users?`)) {
      confirmUsersMutation.mutate();
    }
  };

  const handleSendLaunch = () => {
    if (stats.confirmed === 0) {
      toast.error('No confirmed users to launch');
      return;
    }
    
    if (confirm(`Send launch announcement to ${stats.confirmed} confirmed users?`)) {
      sendLaunchMutation.mutate('confirmed');
    }
  };
  
  const columns: ColumnDef<WaitlistUser>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </div>
          {row.original.referralCode && (
            <div className="text-xs text-muted-foreground font-mono">
              Ref: {row.original.referralCode}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-sm">{row.original.email}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="text-sm font-mono">{row.original.phone}</div>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => (
        <div className="flex items-center text-sm">
          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
          {row.original.city.charAt(0).toUpperCase() + row.original.city.slice(1)}
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const roleColors = {
          customer: 'bg-blue-100 text-blue-700 border-blue-200',
          rider: 'bg-green-100 text-green-700 border-green-200',
          both: 'bg-purple-100 text-purple-700 border-purple-200',
        };
        return (
          <Badge variant="outline" className={roleColors[row.original.role]}>
            {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
          launched: 'bg-green-100 text-green-800 border-green-300',
        };
        return (
          <Badge variant="outline" className={statusColors[row.original.status]}>
            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'agreeToMarketing',
      header: 'Marketing',
      cell: ({ row }) => (
        row.original.agreeToMarketing ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-gray-400" />
        )
      ),
    },
    {
      accessorKey: 'signupDate',
      header: 'Signup Date',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.signupDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedUser(row.original)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Waitlist Management</h1>
          <p className="text-muted-foreground">Manage and track your waitlist users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={users.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleConfirmAll} disabled={stats.pending === 0 || confirmUsersMutation.isPending}>
            <UserCheck className="h-4 w-4 mr-2" />
            Confirm All Pending
          </Button>
          <Button onClick={handleSendLaunch} disabled={stats.confirmed === 0 || sendLaunchMutation.isPending} className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4 mr-2" />
            Send Launch
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing Opt-in</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.marketingOptIn}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    status: value === 'all' ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="launched">Launched</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.role || 'all'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    role: value === 'all' ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="rider">Rider</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.city || 'all'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    city: value === 'all' ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="accra">Accra</SelectItem>
                  <SelectItem value="kumasi">Kumasi</SelectItem>
                  <SelectItem value="takoradi">Takoradi</SelectItem>
                  <SelectItem value="tamale">Tamale</SelectItem>
                  <SelectItem value="cape-coast">Cape Coast</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
              {(filters.status || filters.role || filters.city || filters.search) && (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Waitlist Users ({users.length})</CardTitle>
          <CardDescription>
            View and manage all waitlist signups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            pagination={pagination}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage waitlist user information
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium font-mono">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{selectedUser.city.charAt(0).toUpperCase() + selectedUser.city.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant="outline">
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline">
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Referral Info */}
              {selectedUser.referralCode && (
                <div>
                  <h3 className="font-semibold mb-3">Referral Information</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Referral Code</p>
                    <p className="text-2xl font-mono font-bold text-green-700">{selectedUser.referralCode}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div>
                <h3 className="font-semibold mb-3">Important Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Signup Date</p>
                    <p className="font-medium">{new Date(selectedUser.signupDate).toLocaleString()}</p>
                  </div>
                  {selectedUser.confirmationDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmation Date</p>
                      <p className="font-medium">{new Date(selectedUser.confirmationDate).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="font-semibold mb-3">Preferences</h3>
                <div className="flex gap-3">
                  <Badge variant={selectedUser.agreeToTerms ? "default" : "secondary"}>
                    {selectedUser.agreeToTerms ? '✓' : '✗'} Terms Accepted
                  </Badge>
                  <Badge variant={selectedUser.agreeToMarketing ? "default" : "secondary"}>
                    {selectedUser.agreeToMarketing ? '✓' : '✗'} Marketing Opt-in
                  </Badge>
                </div>
              </div>

              {/* Metadata */}
              {selectedUser.metadata && (
                <div>
                  <h3 className="font-semibold mb-3">Metadata</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedUser.metadata.ipAddress && (
                      <div>
                        <p className="text-muted-foreground">IP Address</p>
                        <p className="font-mono">{selectedUser.metadata.ipAddress}</p>
                      </div>
                    )}
                    {selectedUser.metadata.source && (
                      <div>
                        <p className="text-muted-foreground">Source</p>
                        <p>{selectedUser.metadata.source}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}