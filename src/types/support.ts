export type TicketCategory =
  | 'order_issue'
  | 'payment_issue'
  | 'account_issue'
  | 'kyc_issue'
  | 'general_inquiry';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'awaiting_response'
  | 'resolved'
  | 'closed';

export interface TicketAttachment {
  url: string;
  public_id: string;
  filename: string;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: 'customer' | 'rider';
    avatar?: {
      url: string;
      public_id: string;
    };
  };
  userType: 'customer' | 'rider';
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  relatedOrder?: {
    _id: string;
    orderNumber: string;
    status: string;
  };
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: {
      url: string;
    };
  };
  attachments: TicketAttachment[];
  tags: string[];
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  resolutionTime?: number;
  satisfactionRating?: number;
  satisfactionFeedback?: string;
  metadata?: {
    ip?: string;
    device?: string;
    appVersion?: string;
    userAgent?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  _id: string;
  ticket: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: string;
    avatar?: {
      url: string;
    };
  };
  senderType: 'user' | 'admin';
  message: string;
  attachments: TicketAttachment[];
  isInternal: boolean;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CannedResponse {
  _id: string;
  title: string;
  content: string;
  category: string;
  shortcut: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  assignedTo?: string;
  userType?: 'customer' | 'rider';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SupportStats {
  totalTickets: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  avgFirstResponseTime: number;
  avgResolutionTime: number;
  resolutionRate: number;
  satisfactionScore: number;
  ticketsToday: number;
  ticketsThisWeek: number;
  ticketsThisMonth: number;
  openTickets: number;
  unassignedTickets: number;
}

export interface TicketDetails {
  ticket: Ticket;
  messages: TicketMessage[];
}

