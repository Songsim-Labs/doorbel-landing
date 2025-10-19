export interface DashboardStats {
  orders: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
    trend: {
      direction: 'up' | 'down' | 'neutral';
      value: string;
    };
  };
  riders: {
    total: number;
    active: number;
    online: number;
    offline: number;
    busy: number;
    pendingKYC: number;
    approvedKYC: number;
    rejectedKYC: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    currency: string;
    trend: {
      direction: 'up' | 'down' | 'neutral';
      value: string;
    };
  };
  payments: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    averageValue: number;
  };
}

export interface ChartData {
  date: string;
  orders: number;
  revenue: number;
  riders?: number;
}

export interface RecentActivity {
  type: 'order' | 'kyc' | 'payment' | 'rider';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed' | 'warning';
  link?: string;
}

