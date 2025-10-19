'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Order, OrderFilters } from '@/types/order';
import { toast } from 'sonner';

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: OrderFilters, page?: number, limit?: number) =>
    [...orderKeys.lists(), { filters, page, limit }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Orders List Query
export function useOrders(
  filters?: OrderFilters,
  page: number = 1,
  limit: number = 20
) {
  return useQuery({
    queryKey: orderKeys.list(filters, page, limit),
    queryFn: () => apiClient.getOrders(filters, page, limit),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Single Order Query
export function useOrder(orderId: string | null) {
  return useQuery({
    queryKey: orderKeys.detail(orderId || ''),
    queryFn: () => apiClient.getOrderById(orderId!),
    enabled: !!orderId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Cancel Order Mutation
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      apiClient.cancelOrder(orderId, reason),
    onSuccess: (data) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      // Invalidate the specific order detail
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data._id) });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      
      toast.success('Order cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    },
  });
}

