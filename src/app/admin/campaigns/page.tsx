"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Mail, 
  Plus, 
  Send, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  FileText,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  type: 'marketing' | 'launch' | 'welcome' | 'update';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  targetAudience: {
    cities?: string[];
    roles?: string[];
    status?: string[];
  };
  sentCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
  templateId: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doorbel-api.onrender.com';
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) {
        setCampaigns([]);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.data?.campaigns || []);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'scheduled':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'sending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Sending</Badge>;
      case 'sent':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'welcome':
        return <Badge variant="outline" className="border-green-200 text-green-700">Welcome</Badge>;
      case 'launch':
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Launch</Badge>;
      case 'marketing':
        return <Badge variant="outline" className="border-purple-200 text-purple-700">Marketing</Badge>;
      case 'update':
        return <Badge variant="outline" className="border-orange-200 text-orange-700">Update</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getFilteredCampaigns = () => {
    switch (activeTab) {
      case 'draft':
        return campaigns.filter(c => c.status === 'draft');
      case 'scheduled':
        return campaigns.filter(c => c.status === 'scheduled');
      case 'sent':
        return campaigns.filter(c => c.status === 'sent');
      case 'failed':
        return campaigns.filter(c => c.status === 'failed');
      default:
        return campaigns;
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

  const calculateOpenRate = (openCount: number, sentCount: number): string => {
    if (sentCount === 0) return '0.0';
    return ((openCount / sentCount) * 100).toFixed(1);
  };

  const calculateClickRate = (clickCount: number, sentCount: number): string => {
    if (sentCount === 0) return '0.0';
    return ((clickCount / sentCount) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  const filteredCampaigns = getFilteredCampaigns();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-gray-600">Create, manage, and track your email campaigns</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button asChild>
            <Link href="/admin/campaigns/builder">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.reduce((sum, c) => sum + c.sentCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.length > 0 
                    ? `${(
                        campaigns.reduce((sum, c) => sum + Number(calculateOpenRate(c.openCount, c.sentCount)), 0) / campaigns.length
                      ).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.length > 0 
                    ? `${(
                        campaigns.reduce((sum, c) => sum + Number(calculateClickRate(c.clickCount, c.sentCount)), 0) / campaigns.length
                      ).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.subject}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(campaign.type)}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {campaign.targetAudience.cities && (
                          <div className="flex items-center mb-1">
                            <Target className="h-3 w-3 mr-1 text-gray-400" />
                            {campaign.targetAudience.cities.join(', ')}
                          </div>
                        )}
                        {campaign.targetAudience.roles && (
                          <div className="flex items-center mb-1">
                            <Users className="h-3 w-3 mr-1 text-gray-400" />
                            {campaign.targetAudience.roles.join(', ')}
                          </div>
                        )}
                        {campaign.targetAudience.status && (
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-gray-400" />
                            {campaign.targetAudience.status.join(', ')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.status === 'sent' ? (
                        <div className="text-sm">
                          <div className="flex items-center justify-between">
                            <span>Sent:</span>
                            <span className="font-medium">{campaign.sentCount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Opens:</span>
                            <span className="font-medium">{calculateOpenRate(campaign.openCount, campaign.sentCount)}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Clicks:</span>
                            <span className="font-medium">{calculateClickRate(campaign.clickCount, campaign.sentCount)}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not sent</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {formatDate(campaign.createdAt)}
                      </div>
                      {campaign.scheduledAt && (
                        <div className="flex items-center text-sm text-blue-600 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Scheduled: {formatDate(campaign.scheduledAt)}
                        </div>
                      )}
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
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {campaign.status === 'draft' && (
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Send Now
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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
