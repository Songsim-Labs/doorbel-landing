'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { DashboardStats } from '@/types/stats';
import { OrderStats } from '@/types/order';
import { RiderStats } from '@/types/rider';
import { PaymentStats } from '@/types/payment';

// Query Keys
export const statsKeys = {
  all: ['stats'] as const,
  orderStats: () => [...statsKeys.all, 'orders'] as const,
  riderStats: () => [...statsKeys.all, 'riders'] as const,
  paymentStats: () => [...statsKeys.all, 'payments'] as const,
  dashboard: () => [...statsKeys.all, 'dashboard'] as const,
  activityLogs: (filters?: any) => [...statsKeys.all, 'activity', filters] as const,
};

// Individual Stats Queries
export function useOrderStats() {
  return useQuery({
    queryKey: statsKeys.orderStats(),
    queryFn: () => apiClient.getOrderStats(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRiderStats() {
  return useQuery({
    queryKey: statsKeys.riderStats(),
    queryFn: () => apiClient.getRiderStats(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: statsKeys.paymentStats(),
    queryFn: () => apiClient.getPaymentStats(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Combined Dashboard Stats Hook
export function useDashboardStats() {
  const orderStatsQuery = useOrderStats();
  const riderStatsQuery = useRiderStats();
  const paymentStatsQuery = usePaymentStats();

  // Combine the data
  const data: DashboardStats | undefined = 
    orderStatsQuery.data && riderStatsQuery.data && paymentStatsQuery.data
      ? {
          orders: {
            total: orderStatsQuery.data.totalOrders,
            today: 0,
            thisWeek: 0,
            thisMonth: 0,
            pending: orderStatsQuery.data.statusBreakdown.pending || 0,
            active:
              (orderStatsQuery.data.statusBreakdown.assigned || 0) +
              (orderStatsQuery.data.statusBreakdown.accepted || 0) +
              (orderStatsQuery.data.statusBreakdown.transit || 0),
            completed: orderStatsQuery.data.statusBreakdown.completed || 0,
            cancelled: orderStatsQuery.data.statusBreakdown.cancelled || 0,
            trend: { direction: 'neutral', value: '0%' },
          },
          riders: {
            total: riderStatsQuery.data.totalRiders,
            active: riderStatsQuery.data.activeRiders,
            online: riderStatsQuery.data.availableRiders,
            offline: riderStatsQuery.data.offlineRiders,
            busy: riderStatsQuery.data.busyRiders,
            pendingKYC: riderStatsQuery.data.pendingKYC,
            approvedKYC: riderStatsQuery.data.approvedKYC,
            rejectedKYC: riderStatsQuery.data.rejectedKYC,
          },
          revenue: {
            today: paymentStatsQuery.data.todayRevenue,
            thisWeek: paymentStatsQuery.data.thisWeekRevenue,
            thisMonth: paymentStatsQuery.data.thisMonthRevenue,
            total: paymentStatsQuery.data.totalRevenue,
            currency: 'GHS',
            trend: { direction: 'neutral', value: '0%' },
          },
          payments: {
            total: paymentStatsQuery.data.totalPayments,
            successful: paymentStatsQuery.data.successfulPayments,
            failed: paymentStatsQuery.data.failedPayments,
            pending: paymentStatsQuery.data.pendingPayments,
            averageValue: paymentStatsQuery.data.averagePaymentValue,
          },
        }
      : undefined;

  return {
    data,
    isLoading:
      orderStatsQuery.isLoading ||
      riderStatsQuery.isLoading ||
      paymentStatsQuery.isLoading,
    isError:
      orderStatsQuery.isError ||
      riderStatsQuery.isError ||
      paymentStatsQuery.isError,
    error:
      orderStatsQuery.error ||
      riderStatsQuery.error ||
      paymentStatsQuery.error,
    refetch: () => {
      orderStatsQuery.refetch();
      riderStatsQuery.refetch();
      paymentStatsQuery.refetch();
    },
  };
}

// Activity Logs Query
export function useActivityLogs(filters?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: statsKeys.activityLogs(filters),
    queryFn: () => apiClient.getActivityLogs(filters),
    staleTime: 20 * 1000, // 20 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 40 * 1000, // Refetch every 40 seconds in background
  });
}

