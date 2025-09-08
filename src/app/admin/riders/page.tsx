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
  Truck, 
  Search, 
  Filter, 
  Eye, 
  MapPin, 
  Star,
  User,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Award
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  kycStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
  totalDeliveries: number;
  completedDeliveries: number;
  averageDeliveryTime: number;
  totalEarnings: number;
  vehicleInfo: {
    type: string;
    make: string;
    model: string;
    plateNumber: string;
  };
  documents: {
    driverLicense: boolean;
    vehicleRegistration: boolean;
    insurance: boolean;
  };
  joinedDate: string;
  lastActiveDate?: string;
  isOnline: boolean;
}

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [filteredRiders, setFilteredRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kycFilter, setKycFilter] = useState<string>("all");

  useEffect(() => {
    fetchRiders();
  }, []);

  useEffect(() => {
    filterRiders();
  }, [riders, searchQuery, statusFilter, kycFilter]);

  const fetchRiders = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doorbel-api.onrender.com';
      const token = localStorage.getItem('adminToken');

      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/riders`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setRiders(data.data?.riders || []);
            return;
          }
        } catch (apiError) {
          console.error('Error fetching riders from backend:', apiError);
        }
      }

      // Fallback to mock data if API fails or no token
      const mockRiders: Rider[] = [
        {
          _id: "1",
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike@example.com",
          phone: "+233241234567",
          city: "accra",
          status: "active",
          kycStatus: "approved",
          rating: 4.8,
          totalDeliveries: 156,
          completedDeliveries: 152,
          averageDeliveryTime: 25,
          totalEarnings: 2340,
          vehicleInfo: {
            type: "motorcycle",
            make: "Honda",
            model: "CG 125",
            plateNumber: "GR-1234-20"
          },
          documents: {
            driverLicense: true,
            vehicleRegistration: true,
            insurance: true
          },
          joinedDate: "2024-01-10T08:00:00Z",
          lastActiveDate: "2024-01-17T16:30:00Z",
          isOnline: true
        },
        {
          _id: "2",
          firstName: "Sarah",
          lastName: "Wilson",
          email: "sarah@example.com",
          phone: "+233241234568",
          city: "kumasi",
          status: "active",
          kycStatus: "approved",
          rating: 4.6,
          totalDeliveries: 89,
          completedDeliveries: 87,
          averageDeliveryTime: 28,
          totalEarnings: 1456,
          vehicleInfo: {
            type: "bicycle",
            make: "Giant",
            model: "Escape 3",
            plateNumber: "N/A"
          },
          documents: {
            driverLicense: false,
            vehicleRegistration: true,
            insurance: true
          },
          joinedDate: "2024-01-12T10:15:00Z",
          lastActiveDate: "2024-01-17T15:45:00Z",
          isOnline: false
        },
        {
          _id: "3",
          firstName: "David",
          lastName: "Brown",
          email: "david@example.com",
          phone: "+233241234569",
          city: "accra",
          status: "pending",
          kycStatus: "pending",
          rating: 0,
          totalDeliveries: 0,
          completedDeliveries: 0,
          averageDeliveryTime: 0,
          totalEarnings: 0,
          vehicleInfo: {
            type: "motorcycle",
            make: "Yamaha",
            model: "YZF-R3",
            plateNumber: "GR-5678-20"
          },
          documents: {
            driverLicense: true,
            vehicleRegistration: false,
            insurance: false
          },
          joinedDate: "2024-01-16T14:20:00Z",
          isOnline: false
        }
      ];
      
      setRiders(mockRiders);
    } catch (error) {
      console.error('Error fetching riders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRiders = () => {
    let filtered = riders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(rider => 
        rider.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.phone.includes(searchQuery) ||
        rider.vehicleInfo.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(rider => rider.status === statusFilter);
    }

    // KYC filter
    if (kycFilter !== "all") {
      filtered = filtered.filter(rider => rider.kycStatus === kycFilter);
    }

    setFilteredRiders(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getKYCStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-700">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-green-200 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
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

  const getCompletionRate = (completed: number, total: number) => {
    if (total === 0) return 0;
    return ((completed / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading riders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rider Management</h1>
          <p className="text-gray-600">Manage and monitor your delivery riders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline">
            <Truck className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Riders</p>
                <p className="text-2xl font-bold text-gray-900">{riders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Riders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {riders.filter(r => r.status === 'active').length}
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
                <p className="text-sm font-medium text-gray-600">Pending KYC</p>
                <p className="text-2xl font-bold text-gray-900">
                  {riders.filter(r => r.kycStatus === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {riders.length > 0 ? 
                    (riders.reduce((sum, r) => sum + r.rating, 0) / riders.length).toFixed(1) 
                    : '0.0'
                  }
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
                  placeholder="Search riders..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">KYC Status</label>
              <Select value={kycFilter} onValueChange={setKycFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All KYC</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="accra">Accra</SelectItem>
                  <SelectItem value="kumasi">Kumasi</SelectItem>
                  <SelectItem value="takoradi">Takoradi</SelectItem>
                  <SelectItem value="tamale">Tamale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Riders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riders ({filteredRiders.length})</CardTitle>
          <CardDescription>
            Manage and monitor your delivery riders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rider</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRiders.map((rider) => (
                  <TableRow key={rider._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{rider.firstName} {rider.lastName}</p>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${rider.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className="text-sm text-gray-500">
                              {rider.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {rider.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {rider.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {rider.city.charAt(0).toUpperCase() + rider.city.slice(1)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium capitalize">{rider.vehicleInfo.type}</p>
                        <p className="text-gray-500">{rider.vehicleInfo.make} {rider.vehicleInfo.model}</p>
                        <p className="text-gray-500">{rider.vehicleInfo.plateNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(rider.status)}</TableCell>
                    <TableCell>{getKYCStatusBadge(rider.kycStatus)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center justify-between">
                          <span>Rating:</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="font-medium">{rider.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Deliveries:</span>
                          <span className="font-medium">{rider.completedDeliveries}/{rider.totalDeliveries}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Success:</span>
                          <span className="font-medium">{getCompletionRate(rider.completedDeliveries, rider.totalDeliveries)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Avg Time:</span>
                          <span className="font-medium">{rider.averageDeliveryTime}min</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">₵{rider.totalEarnings}</p>
                        <p className="text-gray-500">Total earned</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {formatDate(rider.joinedDate)}
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
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Award className="h-4 w-4 mr-2" />
                            KYC Review
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Performance
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
