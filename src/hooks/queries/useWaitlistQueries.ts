'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface WaitlistUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  role: 'customer' | 'rider' | 'both';
  status: 'pending' | 'confirmed' | 'launched';
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
  referralCode?: string;
  referredBy?: string;
  signupDate: string;
  confirmationDate?: string;
  launchNotificationSent?: boolean;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    source?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistFilters {
  city?: string;
  role?: string;
  status?: string;
  search?: string;
}

export interface WaitlistStats {
  total: number;
  pending: number;
  confirmed: number;
  launched: number;
  marketingOptIn: number;
  byCity: string[];
  byRole: string[];
  byStatus: string[];
}

// Query Keys
export const waitlistKeys = {
  all: ['waitlist'] as const,
  lists: () => [...waitlistKeys.all, 'list'] as const,
  list: (filters?: WaitlistFilters, page?: number, limit?: number) =>
    [...waitlistKeys.lists(), { filters, page, limit }] as const,
  stats: () => [...waitlistKeys.all, 'stats'] as const,
};

// Fetch waitlist users
export function useWaitlistUsers(
  filters?: WaitlistFilters,
  page: number = 1,
  limit: number = 20
) {
  return useQuery({
    queryKey: waitlistKeys.list(filters, page, limit),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (filters?.city) params.append('city', filters.city);
      if (filters?.role) params.append('role', filters.role);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      
      const response = await fetch(`/api/waitlist?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch waitlist users');
      }
      
      const data = await response.json();
      return {
        users: data.users as WaitlistUser[],
        pagination: data.pagination,
        stats: data.stats as WaitlistStats,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch waitlist stats
export function useWaitlistStats() {
  return useQuery({
    queryKey: waitlistKeys.stats(),
    queryFn: async () => {
      const response = await fetch('/api/waitlist?page=1&limit=1');
      if (!response.ok) {
        throw new Error('Failed to fetch waitlist stats');
      }
      
      const data = await response.json();
      return data.stats as WaitlistStats;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Update user status mutation
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'pending' | 'confirmed' | 'launched' }) => {
      // This would be an API endpoint to update individual user status
      // For now, we'll use the campaigns endpoint to bulk update
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'confirm',
          targetAudience: {
            // Filter by specific user (you'd need to add this to the API)
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate waitlist queries
      queryClient.invalidateQueries({ queryKey: waitlistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: waitlistKeys.stats() });
      
      toast.success('User status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user status');
    },
  });
}

// Send individual email mutation
export function useSendIndividualEmail() {
  return useMutation({
    mutationFn: async ({ email, subject, content }: { email: string; subject: string; content: string }) => {
      // This would be a new API endpoint for sending individual emails
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, content })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Email sent successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send email');
    },
  });
}

// Export waitlist data
export const exportWaitlistCSV = (users: WaitlistUser[]) => {
  // Create CSV content
  const headers = ['Name', 'Email', 'Phone', 'City', 'Role', 'Status', 'Marketing Opt-in', 'Signup Date', 'Referral Code'];
  const rows = users.map(user => [
    `${user.firstName} ${user.lastName}`,
    user.email,
    user.phone,
    user.city,
    user.role,
    user.status,
    user.agreeToMarketing ? 'Yes' : 'No',
    new Date(user.signupDate).toLocaleDateString(),
    user.referralCode || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `doorbel-waitlist-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

