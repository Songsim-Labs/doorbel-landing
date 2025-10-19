'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Ticket, TicketFilters, CannedResponse } from '@/types/support';
import { toast } from 'sonner';

// Query Keys
export const supportKeys = {
  all: ['support'] as const,
  tickets: () => [...supportKeys.all, 'tickets'] as const,
  ticketsList: (filters?: TicketFilters, page?: number, limit?: number) =>
    [...supportKeys.tickets(), { filters, page, limit }] as const,
  ticketDetails: () => [...supportKeys.all, 'ticket-detail'] as const,
  ticketDetail: (id: string) => [...supportKeys.ticketDetails(), id] as const,
  stats: () => [...supportKeys.all, 'stats'] as const,
  cannedResponses: () => [...supportKeys.all, 'canned-responses'] as const,
  cannedResponsesByCategory: (category?: string) =>
    [...supportKeys.cannedResponses(), category] as const,
};

// Support Tickets List Query
export function useSupportTickets(
  filters?: TicketFilters,
  page: number = 1,
  limit: number = 20
) {
  return useQuery({
    queryKey: supportKeys.ticketsList(filters, page, limit),
    queryFn: () => apiClient.getSupportTickets(filters, page, limit),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Single Ticket Query
export function useTicket(ticketId: string | null) {
  return useQuery({
    queryKey: supportKeys.ticketDetail(ticketId || ''),
    queryFn: () => apiClient.getTicketById(ticketId!),
    enabled: !!ticketId,
    staleTime: 5 * 1000, // 5 seconds for real-time feel
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Support Stats Query
export function useSupportStats() {
  return useQuery({
    queryKey: supportKeys.stats(),
    queryFn: () => apiClient.getSupportStats(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Canned Responses Query
export function useCannedResponses(category?: string) {
  return useQuery({
    queryKey: supportKeys.cannedResponsesByCategory(category),
    queryFn: () => apiClient.getCannedResponses(category),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Assign Ticket Mutation
export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, adminId }: { ticketId: string; adminId: string }) =>
      apiClient.assignTicket(ticketId, adminId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.ticketDetail(data._id) });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
      toast.success('Ticket assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign ticket');
    },
  });
}

// Update Ticket Priority Mutation
export function useUpdateTicketPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, priority }: { ticketId: string; priority: string }) =>
      apiClient.updateTicketPriority(ticketId, priority),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.ticketDetail(data._id) });
      toast.success('Priority updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update priority');
    },
  });
}

// Update Ticket Status Mutation
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: string }) =>
      apiClient.updateTicketStatus(ticketId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.ticketDetail(data._id) });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
      toast.success('Status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
}

// Respond to Ticket Mutation
export function useRespondToTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      message,
      attachments,
      isInternal,
      cannedResponseId,
    }: {
      ticketId: string;
      message: string;
      attachments?: any[];
      isInternal?: boolean;
      cannedResponseId?: string;
    }) => apiClient.respondToTicket(ticketId, message, attachments, isInternal, cannedResponseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.ticketDetail(variables.ticketId) });
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      toast.success('Response sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send response');
    },
  });
}

// Create Canned Response Mutation
export function useCreateCannedResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; content: string; category: string; shortcut: string }) =>
      apiClient.createCannedResponse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.cannedResponses() });
      toast.success('Canned response created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create canned response');
    },
  });
}

// Update Canned Response Mutation
export function useUpdateCannedResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ responseId, data }: { responseId: string; data: Partial<CannedResponse> }) =>
      apiClient.updateCannedResponse(responseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.cannedResponses() });
      toast.success('Canned response updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update canned response');
    },
  });
}

// Delete Canned Response Mutation
export function useDeleteCannedResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responseId: string) => apiClient.deleteCannedResponse(responseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.cannedResponses() });
      toast.success('Canned response deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete canned response');
    },
  });
}

