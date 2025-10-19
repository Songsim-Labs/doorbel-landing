'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Rider, RiderFilters, KYC, KYCStatus } from '@/types/rider';
import { toast } from 'sonner';

// Query Keys
export const riderKeys = {
  all: ['riders'] as const,
  lists: () => [...riderKeys.all, 'list'] as const,
  list: (filters?: RiderFilters, page?: number, limit?: number) =>
    [...riderKeys.lists(), { filters, page, limit }] as const,
  details: () => [...riderKeys.all, 'detail'] as const,
  detail: (id: string) => [...riderKeys.details(), id] as const,
};

export const kycKeys = {
  all: ['kyc'] as const,
  lists: () => [...kycKeys.all, 'list'] as const,
  list: (page?: number, limit?: number, status?: KYCStatus) =>
    [...kycKeys.lists(), { page, limit, status }] as const,
  details: () => [...kycKeys.all, 'detail'] as const,
  detail: (id: string) => [...kycKeys.details(), id] as const,
};

// Riders List Query
export function useRiders(
  filters?: RiderFilters,
  page: number = 1,
  limit: number = 20
) {
  return useQuery({
    queryKey: riderKeys.list(filters, page, limit),
    queryFn: () => apiClient.getRiders(filters, page, limit),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Single Rider Query
export function useRider(riderId: string | null) {
  return useQuery({
    queryKey: riderKeys.detail(riderId || ''),
    queryFn: () => apiClient.getRiderById(riderId!),
    enabled: !!riderId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// KYC List Query
export function useKYCs(
  page: number = 1,
  limit: number = 20,
  status?: KYCStatus
) {
  return useQuery({
    queryKey: kycKeys.list(page, limit, status),
    queryFn: () => apiClient.getAllKYC(page, limit, status),
    staleTime: 20 * 1000, // 20 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Single KYC Query
export function useKYC(kycId: string | null) {
  return useQuery({
    queryKey: kycKeys.detail(kycId || ''),
    queryFn: () => apiClient.getKYCById(kycId!),
    enabled: !!kycId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Approve KYC Mutation
export function useApproveKYC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (kycId: string) => apiClient.approveKYC(kycId),
    onSuccess: (data) => {
      // Invalidate KYC lists
      queryClient.invalidateQueries({ queryKey: kycKeys.lists() });
      // Invalidate the specific KYC detail
      queryClient.invalidateQueries({ queryKey: kycKeys.detail(data._id) });
      // Invalidate rider stats
      queryClient.invalidateQueries({ queryKey: ['stats', 'riders'] });
      
      toast.success('KYC approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve KYC');
    },
  });
}

// Reject KYC Mutation
export function useRejectKYC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ kycId, reason }: { kycId: string; reason: string }) =>
      apiClient.rejectKYC(kycId, reason),
    onSuccess: (data) => {
      // Invalidate KYC lists
      queryClient.invalidateQueries({ queryKey: kycKeys.lists() });
      // Invalidate the specific KYC detail
      queryClient.invalidateQueries({ queryKey: kycKeys.detail(data._id) });
      // Invalidate rider stats
      queryClient.invalidateQueries({ queryKey: ['stats', 'riders'] });
      
      toast.success('KYC rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject KYC');
    },
  });
}

