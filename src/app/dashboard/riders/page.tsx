'use client';

import { useState } from 'react';
import { useRiders } from '@/hooks/queries/useRiderQueries';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { Rider, RiderFilters, RiderStatus, KYCStatus } from '@/types/rider';
import { DataTable } from '@/components/admin/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Search, Filter, X, Star, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportRiders } from '@/lib/export-utils';

export default function RidersPage() {
  // Enable WebSocket query invalidation
  useQueryInvalidation();
  
  const [filters, setFilters] = useState<RiderFilters>({});
  const [page, setPage] = useState(1);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch riders with React Query
  const { data, isLoading } = useRiders(filters, page, 20);
  const riders = data?.riders || [];
  const pagination = data?.pagination || null;
  
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
      if (riders.length === 0) {
        toast.error('No riders to export');
        return;
      }
      exportRiders(riders);
      toast.success(`Exported ${riders.length} riders to CSV`);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to export riders');
    }
  };
  
  const columns: ColumnDef<Rider>[] = [
    {
      accessorKey: 'auth',
      header: 'Rider',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.auth.avatar?.url} />
            <AvatarFallback>
              {row.original.auth.firstName[0]}{row.original.auth.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {row.original.auth.firstName} {row.original.auth.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{row.original.contactPhone}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'vehicleType',
      header: 'Vehicle',
      cell: ({ row }) => (
        <div>
          <div className="font-medium capitalize">{row.original.vehicleType}</div>
          <div className="text-xs text-muted-foreground">{row.original.vehicleNumber}</div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} type="rider" />,
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{row.original.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">
            ({row.original.totalRatings})
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'orderCount',
      header: 'Orders',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.orderCount}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.successfulOrderCount} completed
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'kycStatus',
      header: 'KYC',
      cell: ({ row }) => <StatusBadge status={row.original.kycStatus} type="kyc" />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedRider(row.original)}
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
          <h1 className="text-3xl font-bold tracking-tight">Riders</h1>
          <p className="text-muted-foreground">Manage delivery riders and their profiles</p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={riders.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, phone, email..."
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
                    status: value === 'all' ? undefined : (value as RiderStatus),
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.kycStatus || 'all'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    kycStatus: value === 'all' ? undefined : (value as KYCStatus),
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="KYC status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All KYC</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleSearch} className="gap-2">
                <Filter className="h-4 w-4" />
                Apply
              </Button>
              
              {(filters.status || filters.kycStatus || searchQuery) && (
                <Button onClick={clearFilters} variant="outline" className="gap-2">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={riders}
        pagination={pagination}
        onPageChange={setPage}
        isLoading={isLoading}
      />
      
      {/* Rider Details Dialog */}
      <Dialog open={!!selectedRider} onOpenChange={() => setSelectedRider(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRider && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedRider.auth.avatar?.url} />
                    <AvatarFallback className="text-lg">
                      {selectedRider.auth.firstName[0]}{selectedRider.auth.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">
                      {selectedRider.auth.firstName} {selectedRider.auth.lastName}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={selectedRider.status} type="rider" />
                      <StatusBadge status={selectedRider.kycStatus} type="kyc" />
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="font-medium">{selectedRider.contactEmail}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      <span className="font-medium">{selectedRider.contactPhone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Member since:</span>{' '}
                      <span className="font-medium">
                        {new Date(selectedRider.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Vehicle Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Vehicle Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>{' '}
                      <span className="font-medium capitalize">{selectedRider.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Number:</span>{' '}
                      <span className="font-medium">{selectedRider.vehicleNumber}</span>
                    </div>
                    {selectedRider.licenseNumber && (
                      <div>
                        <span className="text-muted-foreground">License:</span>{' '}
                        <span className="font-medium">{selectedRider.licenseNumber}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Performance Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Orders</span>
                      <span className="text-lg font-bold">{selectedRider.orderCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="text-lg font-bold text-green-600">
                        {selectedRider.successfulOrderCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-lg font-bold">{selectedRider.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Feedback Count</span>
                      <span className="text-lg font-bold">{selectedRider.feedbackCount}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Payout Account */}
                {selectedRider.payoutAccount && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Payout Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Provider:</span>{' '}
                        <span className="font-medium">{selectedRider.payoutAccount.mobileMoneyProvider}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Account Name:</span>{' '}
                        <span className="font-medium">{selectedRider.payoutAccount.accountName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Account Number:</span>{' '}
                        <span className="font-medium">{selectedRider.payoutAccount.accountNumber}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

