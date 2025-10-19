'use client';

import { useState } from 'react';
import {
  useSupportTickets,
  useSupportStats,
} from '@/hooks/queries/useSupportQueries';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { Ticket, TicketFilters, TicketStatus, TicketPriority } from '@/types/support';
import { DataTable } from '@/components/admin/DataTable';
import { StatsCard } from '@/components/admin/StatsCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LifeBuoy,
  Clock,
  CheckCircle2,
  Eye,
  Search,
  Filter,
  X,
  Download,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { exportTickets } from '@/lib/export-utils';
import { formatDistanceToNow } from 'date-fns';

export default function SupportPage() {
  useQueryInvalidation();

  const [filters, setFilters] = useState<TicketFilters>({});
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useSupportTickets(filters, page, 20);
  const { data: stats, isLoading: statsLoading } = useSupportStats();
  const tickets = data?.tickets || [];
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
      if (tickets.length === 0) {
        toast.error('No tickets to export');
        return;
      }
      exportTickets(tickets);
      toast.success(`Exported ${tickets.length} tickets to CSV`);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to export tickets');
    }
  };

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'ticketNumber',
      header: 'Ticket #',
      cell: ({ row }) => (
        <Link 
          href={`/dashboard/support/${row.original._id}`}
          className="font-mono text-sm font-medium text-primary hover:underline"
        >
          #{row.original.ticketNumber}
        </Link>
      ),
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.user.avatar?.url} />
            <AvatarFallback>
              {row.original.user.firstName[0]}{row.original.user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">
              {row.original.user.firstName} {row.original.user.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{row.original.user.phone}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-medium text-sm truncate">{row.original.subject}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {row.original.category.replace(/_/g, ' ')}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const colors = {
          low: 'bg-gray-100 text-gray-800',
          medium: 'bg-blue-100 text-blue-800',
          high: 'bg-orange-100 text-orange-800',
          urgent: 'bg-red-100 text-red-800',
        };
        return (
          <Badge variant="outline" className={colors[row.original.priority]}>
            {row.original.priority.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} type="ticket" />,
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned',
      cell: ({ row }) =>
        row.original.assignedTo ? (
          <div className="text-sm">
            {row.original.assignedTo.firstName} {row.original.assignedTo.lastName}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Unassigned</span>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
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
          asChild
        >
          <Link href={`/dashboard/support/${row.original._id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">Manage customer and rider support requests</p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={tickets.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tickets"
          value={stats?.totalTickets || 0}
          icon={LifeBuoy}
          subtitle={`${stats?.openTickets || 0} open`}
          isLoading={statsLoading}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Unassigned"
          value={stats?.unassignedTickets || 0}
          icon={UserCheck}
          subtitle="Need assignment"
          isLoading={statsLoading}
          iconColor="text-orange-600"
        />
        <StatsCard
          title="Avg Response Time"
          value={`${Math.floor(stats?.avgFirstResponseTime || 0)} min`}
          icon={Clock}
          isLoading={statsLoading}
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Resolution Rate"
          value={`${stats?.resolutionRate?.toFixed(1) || 0}%`}
          icon={CheckCircle2}
          subtitle={`${stats?.satisfactionScore?.toFixed(1) || 0}/5 satisfaction`}
          isLoading={statsLoading}
          iconColor="text-green-600"
        />
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
                    placeholder="Search tickets..."
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
                    status: value === 'all' ? undefined : [value as TicketStatus],
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="awaiting_response">Awaiting Response</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.priority?.[0] || 'all'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    priority: value === 'all' ? undefined : [value as TicketPriority],
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} className="gap-2">
                <Filter className="h-4 w-4" />
                Apply
              </Button>

              {(filters.status || filters.priority || searchQuery) && (
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
        data={tickets}
        pagination={pagination}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}

