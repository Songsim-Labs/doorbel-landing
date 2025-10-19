import { apiClient } from './api-client';

export interface ChannelPreference {
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface NotificationPreferences {
  // Order notifications
  orderCreated: ChannelPreference;
  orderAssigned: ChannelPreference;
  orderAccepted: ChannelPreference;
  orderPickup: ChannelPreference;
  orderInTransit: ChannelPreference;
  orderDelivered: ChannelPreference;
  orderCompleted: ChannelPreference;
  orderCancelled: ChannelPreference;
  
  // Payment notifications
  paymentSuccess: ChannelPreference;
  paymentFailed: ChannelPreference;
  
  // Rider/KYC notifications
  kycApproved: ChannelPreference;
  kycRejected: ChannelPreference;
  kycSubmitted: ChannelPreference;
  
  // System notifications
  systemAlert: ChannelPreference;
  promotions: ChannelPreference;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'order_update' | 'payment' | 'system' | 'kyc' | 'promotion';
  title: string;
  message: string;
  data: Record<string, any>;
  channels: ('push' | 'email' | 'sms')[];
  deliveryStatus: {
    push?: 'sent' | 'failed' | 'delivered';
    email?: 'sent' | 'failed' | 'delivered';
    sms?: 'sent' | 'failed' | 'delivered';
  };
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserNotificationPreference {
  _id: string;
  user: string;
  preferences: NotificationPreferences;
  pushToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
  hasMorePages: boolean;
}

export const notificationApi = {
  /**
   * Get user's notifications with pagination
   */
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<PaginatedNotificationsResponse> {
    return await apiClient.getNotifications(page, limit, unreadOnly);
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    return await apiClient.getUnreadNotificationCount();
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    return await apiClient.markNotificationAsRead(notificationId);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.markAllNotificationsAsRead();
  },

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<UserNotificationPreference> {
    return await apiClient.getNotificationPreferences();
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<UserNotificationPreference> {
    return await apiClient.updateNotificationPreferences(preferences);
  },

  /**
   * Update push token (for web push if implemented)
   */
  async updatePushToken(pushToken: string): Promise<void> {
    await apiClient.updatePushToken(pushToken);
  },
};

