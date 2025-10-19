export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000',
  apiVersion: 'v1',
  
  // Pagination defaults
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  
  // Refresh intervals
  statsRefreshInterval: 30000, // 30 seconds
  ordersRefreshInterval: 10000, // 10 seconds
  
  // WebSocket events
  wsEvents: {
    orderStatusUpdate: 'order_status_update',
    newOrder: 'new_order_available',
    orderAssigned: 'order_assigned',
    orderCancelled: 'order_cancelled',
    kycSubmitted: 'kyc_submitted',
    paymentCompleted: 'payment_completed',
  },
  
  // Order status colors
  orderStatusColors: {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    placed: 'bg-blue-100 text-blue-800 border-blue-300',
    assigned: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    accepted: 'bg-purple-100 text-purple-800 border-purple-300',
    pickup: 'bg-orange-100 text-orange-800 border-orange-300',
    transit: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    delivered: 'bg-teal-100 text-teal-800 border-teal-300',
    confirmed: 'bg-lime-100 text-lime-800 border-lime-300',
    paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  },
  
  // KYC status colors
  kycStatusColors: {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  },
  
  // Payment status colors
  paymentStatusColors: {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
  },
};

export default config;

