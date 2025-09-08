"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  MapPin, 
  Clock,
  User,
  Truck,
  CreditCard,
  Calendar,
  MoreHorizontal,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Order {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  rider?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  pickupLocation: {
    address: string;
    city: string;
  };
  deliveryLocation: {
    address: string;
    city: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    description?: string;
  }>;
  pricing: {
    basePrice: number;
    distancePrice: number;
    totalPrice: number;
  };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  customerRating?: number;
  customerFeedback?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doorbel-api.onrender.com';
      const token = localStorage.getItem('adminToken');

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setOrders(data.data?.orders || []);
            return;
          }
        } catch (apiError) {
          console.error('Error fetching orders from backend:', apiError);
        }
      }

      // Fallback to mock data if API fails or no token
      const mockOrders: Order[] = [
        {
          _id: "1",
          orderNumber: "ORD-001234",
          status: "delivered",
          customer: {
            _id: "cust1",
            firstName: "John",
            lastName: "Doe",
            phone: "+233241234567"
          },
          rider: {
            _id: "rider1",
            firstName: "Mike",
            lastName: "Johnson",
            phone: "+233241234568"
          },
          pickupLocation: {
            address: "123 Oxford Street, Osu",
            city: "Accra"
          },
          deliveryLocation: {
            address: "456 Ring Road, Labone",
            city: "Accra"
          },
          items: [
            {
              name: "Documents",
              quantity: 1,
              description: "Legal documents"
            }
          ],
          pricing: {
            basePrice: 15,
            distancePrice: 8,
            totalPrice: 23
          },
          paymentStatus: "paid",
          createdAt: "2024-01-15T10:30:00Z",
          estimatedDeliveryTime: "2024-01-15T11:00:00Z",
          actualDeliveryTime: "2024-01-15T10:55:00Z",
          customerRating: 5,
          customerFeedback: "Excellent service!"
        },
        {
          _id: "2",
          orderNumber: "ORD-001235",
          status: "in_transit",
          customer: {
            _id: "cust2",
            firstName: "Jane",
            lastName: "Smith",
            phone: "+233241234569"
          },
          rider: {
            _id: "rider2",
            firstName: "Sarah",
            lastName: "Wilson",
            phone: "+233241234570"
          },
          pickupLocation: {
            address: "789 Airport Road, East Legon",
            city: "Accra"
          },
          deliveryLocation: {
            address: "321 Spintex Road, Tema",
            city: "Tema"
          },
          items: [
            {
              name: "Package",
              quantity: 1,
              description: "Electronics"
            }
          ],
          pricing: {
            basePrice: 20,
            distancePrice: 15,
            totalPrice: 35
          },
          paymentStatus: "paid",
          createdAt: "2024-01-16T14:20:00Z",
          estimatedDeliveryTime: "2024-01-16T15:00:00Z"
        },
        {
          _id: "3",
          orderNumber: "ORD-001236",
          status: "pending",
          customer: {
            _id: "cust3",
            firstName: "David",
            lastName: "Brown",
            phone: "+233241234571"
          },
          pickupLocation: {
            address: "654 High Street, Kumasi",
            city: "Kumasi"
          },
          deliveryLocation: {
            address: "987 Stadium Road, Kumasi",
            city: "Kumasi"
          },
          items: [
            {
              name: "Food",
              quantity: 2,
              description: "Restaurant order"
            }
          ],
          pricing: {
            basePrice: 12,
            distancePrice: 6,
            totalPrice: 18
          },
          paymentStatus: "pending",
          createdAt: "2024-01-17T12:15:00Z",
          estimatedDeliveryTime: "2024-01-17T12:45:00Z"
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery) ||
        (order.rider && order.rider.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.rider && order.rider.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'assigned':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'picked_up':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Picked Up</Badge>;
      case 'in_transit':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">In Transit</Badge>;
      case 'delivered':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-700">Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="border-green-200 text-green-700">Paid</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage all delivery orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => ['pending', 'assigned', 'picked_up', 'in_transit'].includes(o.status)).length}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  ₵{orders.reduce((sum, o) => sum + o.pricing.totalPrice, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Payment Status</label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <Input
                type="date"
                className="mt-1"
                placeholder="Select date"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>
            Manage and track delivery orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                        <p className="text-sm text-gray-500">{order.customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.rider ? (
                        <div>
                          <p className="font-medium">{order.rider.firstName} {order.rider.lastName}</p>
                          <p className="text-sm text-gray-500">{order.rider.phone}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="truncate max-w-[120px]">{order.pickupLocation.address}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="truncate max-w-[120px]">{order.deliveryLocation.address}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">₵{order.pricing.totalPrice}</p>
                        <p className="text-gray-500">Base: ₵{order.pricing.basePrice}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="h-4 w-4 mr-2" />
                            Assign Rider
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Payment Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
