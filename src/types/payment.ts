export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type TransactionType = 'order' | 'refund' | 'payment' | 'transfer';

export interface Transaction {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  order?: {
    _id: string;
    orderNumber: string;
  };
  type: TransactionType;
  amount: number;
  currency: string;
  payment?: string;
  reference: string;
  externalReference?: string;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  order: string;
  customer: string;
  rider: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'mobile_money' | 'card';
  refernce: string;
  paystackResponse?: Record<string, unknown>;
  breakdown: {
    subtotal: number;
    platformFee: number;
    riderEarnings: number;
  };
  escrow?: {
    isEscrowed: boolean;
    releaseDate?: string;
    details?: unknown;
  };
  metadata: Record<string, unknown>;
  paidAt?: string;
  failedAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
  todayRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  averagePaymentValue: number;
}

export interface PaymentFilters {
  status?: string[];
  type?: TransactionType[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

