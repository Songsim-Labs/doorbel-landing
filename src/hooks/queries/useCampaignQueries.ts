'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  templateId: string;
  targetAudience: {
    cities?: string[];
    roles?: string[];
    status?: string[];
  };
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentCount: number;
  openCount: number;
  clickCount: number;
  createdAt: Date;
  sentAt?: Date;
}

export interface CampaignStats {
  total: number;
  confirmed: number;
  launched: number;
  marketingOptIn: number;
  recentSignups: Array<{ _id: string; count: number }>;
  cityStats: Array<{ _id: string; count: number; confirmed: number; launched: number }>;
  roleStats: Array<{ _id: string; count: number }>;
}

// Query Keys
export const campaignKeys = {
  all: ['campaigns'] as const,
  stats: () => [...campaignKeys.all, 'stats'] as const,
  templates: () => [...campaignKeys.all, 'templates'] as const,
};

// Fetch campaign stats
export function useCampaignStats() {
  return useQuery({
    queryKey: campaignKeys.stats(),
    queryFn: async () => {
      const response = await fetch('/api/campaigns');
      if (!response.ok) {
        throw new Error('Failed to fetch campaign stats');
      }
      
      return response.json() as Promise<CampaignStats>;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Send marketing campaign mutation
export function useSendCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignData: {
      type: 'marketing' | 'launch' | 'confirm';
      subject?: string;
      content?: string;
      templateId?: string;
      isLaunch?: boolean;
      targetAudience: {
        cities?: string[];
        roles?: string[];
        status?: string[];
      };
    }) => {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to send campaign');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate campaigns and waitlist queries
      queryClient.invalidateQueries({ queryKey: campaignKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      
      const stats = data.stats;
      toast.success(`Campaign sent! ${stats.sent} sent, ${stats.failed} failed`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send campaign');
    },
  });
}

// Launch announcement mutation
export function useSendLaunchAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetStatus: 'confirmed' | 'launched' = 'confirmed') => {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'launch',
          isLaunch: true,
          targetAudience: {
            status: [targetStatus]
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to send launch announcement');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: campaignKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      
      const stats = data.stats;
      toast.success(`Launch announcement sent! ${stats.sent} sent, ${stats.failed} failed`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send launch announcement');
    },
  });
}

// Confirm users mutation
export function useConfirmUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'confirm',
          targetAudience: {
            status: ['pending']
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to confirm users');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: campaignKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      
      toast.success(`Successfully confirmed ${data.stats.sent} users`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to confirm users');
    },
  });
}

