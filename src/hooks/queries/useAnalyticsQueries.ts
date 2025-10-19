'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type PeriodType = 'today' | 'week' | 'month' | 'year';

// Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  platform: (period: PeriodType) => [...analyticsKeys.all, 'platform', period] as const,
  revenue: (period: PeriodType) => [...analyticsKeys.all, 'revenue', period] as const,
  riders: () => [...analyticsKeys.all, 'riders'] as const,
  customers: () => [...analyticsKeys.all, 'customers'] as const,
};

// Platform Analytics Query
export function useAnalytics(period: PeriodType = 'week') {
  return useQuery({
    queryKey: analyticsKeys.platform(period),
    queryFn: () => apiClient.getAnalytics(period),
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Revenue Analytics Query
export function useRevenueAnalytics(period: PeriodType = 'week') {
  return useQuery({
    queryKey: analyticsKeys.revenue(period),
    queryFn: () => apiClient.getRevenueAnalytics(period),
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Rider Analytics Query
export function useRiderAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.riders(),
    queryFn: () => apiClient.getRiderAnalytics(),
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Customer Analytics Query
export function useCustomerAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.customers(),
    queryFn: () => apiClient.getCustomerAnalytics(),
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

