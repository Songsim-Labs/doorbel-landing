export type OrderStatus =
  | 'pending'
  | 'placed'
  | 'assigned'
  | 'accepted'
  | 'pickup'
  | 'transit'
  | 'delivered'
  | 'confirmed'
  | 'paid'
  | 'completed'
  | 'cancelled';

export type DeliveryType = 'standard' | 'express';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'escrowed';
export type PaymentMethod = 'mobile_money' | 'card';
export type AssignmentType = 'auto' | 'manual';

export interface IOrderLocation {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  ghanaPostGPS: string;
  contactName: string;
  contactPhone: string;
  instruction?: string;
}

export interface IOrderItem {
  name: string;
  description?: string;
  quantity: number;
  weight?: number;
  specialInstructions?: string;
}

export interface IOrderPricing {
  basePrice: number;
  distancePrice: number;
  deliveryTypePrice: number;
  totalPrice: number;
  currency: string;
  deliveryFee: number;
  serviceFee: number;
  breakdown: {
    distance: number;
    baseFee: number;
    distanceFee: number;
    deliveryTypeFee: number;
    platformFee: number;
  };
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  rider?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  pickupLocation: IOrderLocation;
  deliveryLocation: IOrderLocation;
  estimatedDeliveryTime: string;
  deliveryType: DeliveryType;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  status: OrderStatus;
  pricing: IOrderPricing;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  assignmentType: AssignmentType;
  assignedAt?: string;
  acceptedAt?: string;
  customerRating?: number;
  customerFeedback?: string;
  riderRating?: number;
  riderFeedback?: string;
  cancelationReason?: string;
  canceledBy?: string;
  canceledAt?: string;
  deliveredAt?: string;
  confirmedAt?: string;
  paidAt?: string;
  completedAt?: string;
  deliveryProof?: {
    photo: string;
    notes: string;
    timestamp: string;
    completedBy: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  deliveryType?: DeliveryType[];
  paymentStatus?: PaymentStatus[];
  paymentMethod?: PaymentMethod[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface OrderStats {
  totalOrders: number;
  statusBreakdown: Record<string, number>;
  deliveryTypeBreakdown: Record<string, number>;
  revenueStats: {
    totalRevenue: number;
    averageOrderValue: number;
    minOrderValue: number;
    maxOrderValue: number;
  };
  timeStats: {
    avgDeliveryTime: number;
    avgPickupTime: number;
  };
  ratingStats: {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: Record<string, number>;
  };
}

