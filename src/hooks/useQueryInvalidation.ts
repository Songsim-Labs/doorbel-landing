'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { config } from '@/lib/config';
import { orderKeys } from './queries/useOrderQueries';
import { riderKeys, kycKeys } from './queries/useRiderQueries';
import { statsKeys } from './queries/useStatsQueries';
import { supportKeys } from './queries/useSupportQueries';

/**
 * Hook to handle WebSocket events and invalidate relevant queries
 * This replaces manual refetching with smart query invalidation
 */
export function useQueryInvalidation() {
  const queryClient = useQueryClient();
  const { on, off } = useWebSocket();

  useEffect(() => {
    // Order status update handler
    const handleOrderStatusUpdate = () => {
      // Invalidate all order-related queries
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statsKeys.orderStats() });
      queryClient.invalidateQueries({ queryKey: statsKeys.dashboard() });
    };

    // New order handler
    const handleNewOrder = () => {
      // Invalidate order lists and stats
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statsKeys.orderStats() });
      queryClient.invalidateQueries({ queryKey: statsKeys.dashboard() });
    };

    // KYC submission handler
    const handleKYCSubmitted = () => {
      // Invalidate KYC lists and rider stats
      queryClient.invalidateQueries({ queryKey: kycKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statsKeys.riderStats() });
      queryClient.invalidateQueries({ queryKey: statsKeys.dashboard() });
    };

    // Payment completed handler
    const handlePaymentCompleted = () => {
      // Invalidate payment stats and dashboard
      queryClient.invalidateQueries({ queryKey: statsKeys.paymentStats() });
      queryClient.invalidateQueries({ queryKey: statsKeys.dashboard() });
      // Also invalidate orders as payment status may have changed
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    };

    // Rider status update handler
    const handleRiderStatusUpdate = () => {
      // Invalidate rider lists and stats
      queryClient.invalidateQueries({ queryKey: riderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statsKeys.riderStats() });
      queryClient.invalidateQueries({ queryKey: statsKeys.dashboard() });
    };

    // Support ticket handlers
    const handleNewTicketCreated = () => {
      // Invalidate ticket lists and support stats
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
    };

    const handleTicketResponse = (data: any) => {
      // Invalidate specific ticket and lists
      if (data.ticketId) {
        queryClient.invalidateQueries({ queryKey: supportKeys.ticketDetail(data.ticketId) });
      }
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
    };

    const handleTicketStatusUpdate = (data: any) => {
      // Invalidate specific ticket, lists, and stats
      if (data.ticketId) {
        queryClient.invalidateQueries({ queryKey: supportKeys.ticketDetail(data.ticketId) });
      }
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
    };

    const handleTicketUserResponse = () => {
      // User responded to ticket - invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
    };

    // Register WebSocket event listeners
    on(config.wsEvents.orderStatusUpdate, handleOrderStatusUpdate);
    on(config.wsEvents.newOrder, handleNewOrder);
    on('kyc_submitted', handleKYCSubmitted);
    on(config.wsEvents.paymentCompleted, handlePaymentCompleted);
    on('rider_status_update', handleRiderStatusUpdate);
    on('new_ticket_created', handleNewTicketCreated);
    on('ticket_response', handleTicketResponse);
    on('ticket_status_update', handleTicketStatusUpdate);
    on('ticket_user_response', handleTicketUserResponse);

    // Cleanup on unmount
    return () => {
      off(config.wsEvents.orderStatusUpdate, handleOrderStatusUpdate);
      off(config.wsEvents.newOrder, handleNewOrder);
      off('kyc_submitted', handleKYCSubmitted);
      off(config.wsEvents.paymentCompleted, handlePaymentCompleted);
      off('rider_status_update', handleRiderStatusUpdate);
      off('new_ticket_created', handleNewTicketCreated);
      off('ticket_response', handleTicketResponse);
      off('ticket_status_update', handleTicketStatusUpdate);
      off('ticket_user_response', handleTicketUserResponse);
    };
  }, [queryClient, on, off]);
}

