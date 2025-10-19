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

export type NotificationType = 'order_update' | 'payment' | 'system' | 'kyc' | 'promotion';
export type DeliveryStatus = 'sent' | 'failed' | 'delivered';
export type NotificationChannel = 'push' | 'email' | 'sms';

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  channels: NotificationChannel[];
  deliveryStatus: {
    push?: DeliveryStatus;
    email?: DeliveryStatus;
    sms?: DeliveryStatus;
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

