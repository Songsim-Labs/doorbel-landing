'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Transaction, PaymentFilters, PaymentStats } from '@/types/payment';
import { DataTable } from '@/components/admin/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { StatsCard } from '@/components/admin/StatsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, Download, Search, Filter, X, DollarSign, TrendingUp, CreditCard, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { exportPayments } from '@/lib/export-utils';
import Link from 'next/link';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchPayments();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);
  
  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getPayments(filters, page, 20);
      setPayments(data.payments);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      const data = await apiClient.getPaymentStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch payment stats:', error);
    }
  };
  
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
      if (payments.length === 0) {
        toast.error('No payments to export');
        return;
      }
      exportPayments(payments);
      toast.success(`Exported ${payments.length} payments to CSV`);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to export payments');
    }
  };
  
  const successRate = stats
    ? ((stats.successfulPayments / stats.totalPayments) * 100).toFixed(1)
    : 0;
  
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'reference',
      header: 'Reference',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.reference}</div>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Order',
      cell: ({ row }) => {
        const order = row.original.order;
        return order ? (
          <div className="font-mono text-sm font-medium">{order.orderNumber}</div>
        ) : (
          <span className="text-muted-foreground text-sm">N/A</span>
        );
      },
    },
    {
      accessorKey: 'user',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.user.firstName} {row.original.user.lastName}
          </div>
          <div className="text-xs text-muted-foreground">{row.original.user.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="font-semibold text-primary">
          {row.original.currency} {row.original.amount.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <div className="capitalize text-sm">{row.original.type}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} type="payment" />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
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
          onClick={() => setSelectedPayment(row.original)}
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
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Track all payment transactions and payouts</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/payments/failed">
            <Button variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Failed Transactions
              {stats?.failedPayments ? (
                <Badge variant="secondary" className="ml-2">
                  {stats.failedPayments}
                </Badge>
              ) : null}
            </Button>
          </Link>
          <Button variant="outline" onClick={handleExport} disabled={payments.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`GHS ${(stats?.totalRevenue || 0).toFixed(2)}`}
          icon={DollarSign}
          subtitle="All time"
          isLoading={!stats}
          iconColor="text-emerald-600"
        />
        <StatsCard
          title="Today's Revenue"
          value={`GHS ${(stats?.todayRevenue || 0).toFixed(2)}`}
          icon={TrendingUp}
          subtitle="Last 24 hours"
          isLoading={!stats}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={CreditCard}
          subtitle={`${stats?.successfulPayments || 0} successful`}
          isLoading={!stats}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Failed Payments"
          value={stats?.failedPayments || 0}
          icon={AlertTriangle}
          subtitle="Requires attention"
          isLoading={!stats}
          iconColor="text-red-600"
        />
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
                    placeholder="Search by reference, order number..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <Select
                value={filters.status?.[0] || 'all'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    status: value === 'all' ? undefined : [value],
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.type?.[0] || 'all'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    type: value === 'all' ? undefined : [value as 'order' | 'refund' | 'payment' | 'transfer'],
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleSearch} className="gap-2">
                <Filter className="h-4 w-4" />
                Apply
              </Button>
              
              {(filters.status || filters.type || searchQuery) && (
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
        data={payments}
        pagination={pagination}
        onPageChange={setPage}
        isLoading={isLoading}
      />
      
      {/* Payment Details Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogDescription>
                  Reference: {selectedPayment.reference}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Customer</Label>
                    <p className="text-sm font-medium">
                      {selectedPayment.user.firstName} {selectedPayment.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedPayment.user.email}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Order</Label>
                    <p className="text-sm font-medium font-mono">
                      {selectedPayment.order?.orderNumber || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <p className="text-lg font-bold text-primary">
                      {selectedPayment.currency} {selectedPayment.amount.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <p className="text-sm font-medium capitalize">{selectedPayment.type}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <StatusBadge status={selectedPayment.status} type="payment" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <p className="text-sm font-medium">
                      {new Date(selectedPayment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {selectedPayment.externalReference && (
                  <>
                    <Separator />
                    <div>
                      <Label>External Reference</Label>
                      <p className="text-sm font-mono mt-1">{selectedPayment.externalReference}</p>
                    </div>
                  </>
                )}
                
                {selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <Label className="mb-3 block">Metadata</Label>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(selectedPayment.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className || ''}`}>{children}</label>;
}

