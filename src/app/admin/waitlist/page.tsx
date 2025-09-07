"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Download,
  Search,
  Mail,
  Phone,
  Calendar,
  UserCheck
} from "lucide-react";

interface WaitlistUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  status: string;
  referralCode: string;
  signupDate: string;
  agreeToMarketing: boolean;
}

interface Stats {
  total: number;
  byCity: string[];
  byRole: string[];
  byStatus: string[];
}

export default function AdminWaitlistPage() {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, byCity: [], byRole: [], byStatus: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(cityFilter && cityFilter !== 'all' && { city: cityFilter }),
        ...(roleFilter && roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/waitlist?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setStats(data.stats);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, cityFilter, roleFilter, statusFilter]);

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'City', 'Role', 'Status', 'Referral Code', 'Signup Date', 'Marketing'],
      ...filteredUsers.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.phone,
        user.city,
        user.role,
        user.status,
        user.referralCode,
        new Date(user.signupDate).toLocaleDateString(),
        user.agreeToMarketing ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doorbel-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCityStats = () => {
    const cityCounts = stats.byCity.reduce((acc: any, city: string) => {
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});
    return cityCounts;
  };

  const getRoleStats = () => {
    const roleCounts = stats.byRole.reduce((acc: any, role: string) => {
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    return roleCounts;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">DoorBel Waitlist Admin</h1>
              <p className="text-gray-600">Manage and monitor waitlist signups</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link href="/admin/dashboard">📊 Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/waitlist">👥 Users</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Signups</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cities</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(getCityStats()).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(user => {
                      const signupDate = new Date(user.signupDate);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return signupDate > weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.byStatus.filter((status: string) => status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All cities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All cities</SelectItem>
                        <SelectItem value="accra">Accra</SelectItem>
                        <SelectItem value="kumasi">Kumasi</SelectItem>
                        <SelectItem value="takoradi">Takoradi</SelectItem>
                        <SelectItem value="tamale">Tamale</SelectItem>
                        <SelectItem value="cape-coast">Cape Coast</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="rider">Rider</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="launched">Launched</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Waitlist Users</CardTitle>
                  <CardDescription>
                    {filteredUsers.length} users found
                  </CardDescription>
                </div>
                <Button onClick={exportToCSV} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Referral Code</TableHead>
                          <TableHead>Signup Date</TableHead>
                          <TableHead>Marketing</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                {user.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                {user.phone}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{user.city}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.status === 'confirmed' ? 'default' : 'secondary'}
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {user.referralCode}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                {new Date(user.signupDate).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.agreeToMarketing ? 'default' : 'secondary'}>
                                {user.agreeToMarketing ? 'Yes' : 'No'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Signups by City</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(getCityStats()).map(([city, count]) => (
                      <div key={city} className="flex items-center justify-between">
                        <span className="capitalize">{city}</span>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Role Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Signups by Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(getRoleStats()).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <span className="capitalize">{role}</span>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
