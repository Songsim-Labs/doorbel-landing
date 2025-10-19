'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/queries/useOrderQueries';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { Order, OrderFilters, OrderStatus } from '@/types/order';
import { DataTable } from '@/components/admin/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderTimeline } from '@/components/admin/OrderTimeline';
import dynamic from 'next/dynamic';
import { Eye, Download, Filter, Search, X, Map } from 'lucide-react';

const OrderMap = dynamic(
  () => import('@/components/admin/OrderMap').then(mod => mod.OrderMap),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[500px] border rounded-lg">Loading map...</div> }
);
import { toast } from 'sonner';
import { exportOrders } from '@/lib/export-utils';

export default function OrdersPage() {
  // Enable WebSocket query invalidation
  useQueryInvalidation();
  
  const [filters, setFilters] = useState<OrderFilters>({});
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch orders with React Query
  const { data, isLoading } = useOrders(filters, page, 20);
  const orders = data?.orders || [];
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
      if (orders.length === 0) {
        toast.error('No orders to export');
        return;
      }
      exportOrders(orders);
      toast.success(`Exported ${orders.length} orders to CSV`);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to export orders');
    }
  };
  
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Order #',
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium">{row.original.orderNumber}</div>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.customer.firstName} {row.original.customer.lastName}
          </div>
          <div className="text-xs text-muted-foreground">{row.original.customer.phone}</div>
        </div>
      ),
    },
    {
      accessorKey: 'rider',
      header: 'Rider',
      cell: ({ row }) => {
        const rider = row.original.rider;
        return rider ? (
          <div>
            <div className="font-medium">
              {rider.firstName} {rider.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{rider.phone}</div>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Not assigned</span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} type="order" />,
    },
    {
      accessorKey: 'pricing.totalPrice',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="font-semibold text-primary">
          GHS {row.original.pricing.totalPrice.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} type="payment" />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
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
          onClick={() => setSelectedOrder(row.original)}
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
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track all delivery orders</p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={orders.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order number, customer..."
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
                    status: value === 'all' ? undefined : [value as OrderStatus],
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.paymentStatus?.[0] || 'all'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    paymentStatus: value === 'all' ? undefined : [value as 'pending' | 'paid' | 'failed' | 'refunded' | 'escrowed'],
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleSearch} className="gap-2">
                <Filter className="h-4 w-4" />
                Apply
              </Button>
              
              {(filters.status || filters.paymentStatus || searchQuery) && (
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
        data={orders}
        pagination={pagination}
        onPageChange={setPage}
        isLoading={isLoading}
      />
      
      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  Order Details
                  <Badge variant="outline" className="font-mono">
                    {selectedOrder.orderNumber}
                  </Badge>
                  <StatusBadge status={selectedOrder.status} type="order" />
                </DialogTitle>
                <DialogDescription>
                  Created on {new Date(selectedOrder.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      <span className="font-medium">
                        {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      <span className="font-medium">{selectedOrder.customer.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="font-medium">{selectedOrder.customer.email}</span>
                    </div>
                  </div>
                </div>
                
                {/* Rider Info */}
                <div>
                  <h3 className="font-semibold mb-3">Rider Information</h3>
                  {selectedOrder.rider ? (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>{' '}
                        <span className="font-medium">
                          {selectedOrder.rider.firstName} {selectedOrder.rider.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>{' '}
                        <span className="font-medium">{selectedOrder.rider.phone}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No rider assigned yet</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Locations */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-3">Pickup Location</h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{selectedOrder.pickupLocation.address}</p>
                    <p className="text-muted-foreground">
                      GPS: {selectedOrder.pickupLocation.ghanaPostGPS}
                    </p>
                    <p className="text-muted-foreground">
                      Contact: {selectedOrder.pickupLocation.contactName}
                    </p>
                    <p className="text-muted-foreground">
                      Phone: {selectedOrder.pickupLocation.contactPhone}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Delivery Location</h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{selectedOrder.deliveryLocation.address}</p>
                    <p className="text-muted-foreground">
                      GPS: {selectedOrder.deliveryLocation.ghanaPostGPS}
                    </p>
                    <p className="text-muted-foreground">
                      Contact: {selectedOrder.deliveryLocation.contactName}
                    </p>
                    <p className="text-muted-foreground">
                      Phone: {selectedOrder.deliveryLocation.contactPhone}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Qty: {item.quantity}</p>
                        {item.weight && (
                          <p className="text-sm text-muted-foreground">{item.weight}kg</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Pricing Breakdown */}
              <div>
                <h3 className="font-semibold mb-3">Pricing Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Fee:</span>
                    <span className="font-medium">GHS {selectedOrder.pricing.breakdown.baseFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distance Fee ({selectedOrder.pricing.breakdown.distance.toFixed(1)} km):</span>
                    <span className="font-medium">GHS {selectedOrder.pricing.breakdown.distanceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Type Fee:</span>
                    <span className="font-medium">GHS {selectedOrder.pricing.breakdown.deliveryTypeFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee:</span>
                    <span className="font-medium">GHS {selectedOrder.pricing.breakdown.platformFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">
                      GHS {selectedOrder.pricing.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Timeline and Map Tabs */}
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="map">
                    <Map className="h-4 w-4 mr-2" />
                    Map
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeline" className="mt-6">
                  <OrderTimeline
                    currentStatus={selectedOrder.status}
                    timestamps={{
                      pending: selectedOrder.createdAt,
                      assigned: selectedOrder.assignedAt,
                      accepted: selectedOrder.acceptedAt,
                      pickup: selectedOrder.actualPickupTime,
                      delivered: selectedOrder.deliveredAt,
                      confirmed: selectedOrder.confirmedAt,
                      paid: selectedOrder.paidAt,
                      completed: selectedOrder.completedAt,
                      cancelled: selectedOrder.canceledAt,
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="map" className="mt-6">
                  <OrderMap
                    pickupLocation={selectedOrder.pickupLocation}
                    deliveryLocation={selectedOrder.deliveryLocation}
                    className="h-[500px]"
                  />
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-green-500 rounded-full border-2 border-white shadow" />
                      <span className="text-muted-foreground">Pickup Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-red-500 rounded-full border-2 border-white shadow" />
                      <span className="text-muted-foreground">Delivery Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-blue-500 rounded-full border-2 border-white shadow" />
                      <span className="text-muted-foreground">Rider Location</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

