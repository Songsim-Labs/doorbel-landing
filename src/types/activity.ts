export type ActivityType = 
  | 'login'
  | 'logout'
  | 'order_created'
  | 'order_cancelled'
  | 'order_completed'
  | 'kyc_approved'
  | 'kyc_rejected'
  | 'payment_processed'
  | 'payment_refunded'
  | 'rider_activated'
  | 'rider_deactivated'
  | 'settings_updated'
  | 'admin_created'
  | 'admin_deleted';

export type ActivityStatus = 'success' | 'pending' | 'failed' | 'warning';

export interface ActivityLog {
  _id: string;
  type: ActivityType;
  admin: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  title: string;
  description: string;
  status: ActivityStatus;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  createdAt: string;
}

export interface ActivityFilters {
  type?: ActivityType[];
  status?: ActivityStatus[];
  adminId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

