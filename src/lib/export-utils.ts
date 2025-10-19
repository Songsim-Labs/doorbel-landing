import { Order } from '@/types/order';
import { Rider } from '@/types/rider';
import { Transaction } from '@/types/payment';
import { KYC } from '@/types/rider';
import { Ticket } from '@/types/support';

type ExportableData = Order | Rider | Transaction | KYC | Ticket;

/**
 * Generic CSV export function
 * @param data - Array of objects to export
 * @param filename - Name of the CSV file
 * @param columns - Column configuration { key: string, label: string, formatter?: (value: any) => string }
 */
export function exportToCSV<T extends ExportableData>(
  data: T[],
  filename: string,
  columns: Array<{
    key: string;
    label: string;
    formatter?: (value: unknown, item: T) => string;
  }>
) {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Create CSV header
  const headers = columns.map(col => col.label).join(',');

  // Create CSV rows
  const rows = data.map(item => {
    return columns
      .map(col => {
        const keys = col.key.split('.');
        let value: unknown = item;
        
        // Navigate nested objects
        for (const key of keys) {
          value = value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined;
        }

        // Apply formatter if provided
        if (col.formatter) {
          return escapeCSVValue(col.formatter(value, item));
        }

        // Default formatting
        return escapeCSVValue(formatValue(value));
      })
      .join(',');
  });

  // Combine header and rows
  const csv = [headers, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Escape CSV values to handle commas, quotes, and newlines
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format value for CSV output
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Export orders to CSV
 */
export function exportOrders(orders: Order[]) {
  exportToCSV(orders, 'doorbel_orders', [
    { key: 'orderNumber', label: 'Order Number' },
    {
      key: 'customer',
      label: 'Customer Name',
      formatter: (value) => {
        const customer = value as Order['customer'];
        return `${customer?.firstName || ''} ${customer?.lastName || ''}`;
      },
    },
    {
      key: 'customer.phone',
      label: 'Customer Phone',
    },
    {
      key: 'rider',
      label: 'Rider Name',
      formatter: (value) => {
        const rider = value as Order['rider'];
        if (!rider) return 'Not Assigned';
        return `${rider.firstName} ${rider.lastName}`;
      },
    },
    { key: 'status', label: 'Status' },
    {
      key: 'pricing.totalPrice',
      label: 'Amount (GHS)',
      formatter: (value) => (value as number)?.toFixed(2) || '0.00',
    },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'deliveryType', label: 'Delivery Type' },
    {
      key: 'pickupLocation.ghanaPostGPS',
      label: 'Pickup GPS',
    },
    {
      key: 'deliveryLocation.ghanaPostGPS',
      label: 'Delivery GPS',
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      formatter: (value) => new Date(value as string).toLocaleString(),
    },
    {
      key: 'completedAt',
      label: 'Completed Date',
      formatter: (value) => value ? new Date(value as string).toLocaleString() : '',
    },
  ]);
}

/**
 * Export riders to CSV
 */
export function exportRiders(riders: Rider[]) {
  exportToCSV(riders, 'doorbel_riders', [
    {
      key: 'auth',
      label: 'Name',
      formatter: (value) => {
        const auth = value as Rider['auth'];
        return `${auth?.firstName || ''} ${auth?.lastName || ''}`;
      },
    },
    { key: 'auth.email', label: 'Email' },
    { key: 'contactPhone', label: 'Phone' },
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'vehicleNumber', label: 'Vehicle Number' },
    { key: 'licenseNumber', label: 'License Number' },
    { key: 'status', label: 'Status' },
    { key: 'kycStatus', label: 'KYC Status' },
    {
      key: 'rating',
      label: 'Rating',
      formatter: (value) => (value as number)?.toFixed(1) || '0.0',
    },
    { key: 'orderCount', label: 'Total Orders' },
    { key: 'successfulOrderCount', label: 'Successful Orders' },
    {
      key: 'isAvailable',
      label: 'Available',
      formatter: (value) => value ? 'Yes' : 'No',
    },
    {
      key: 'createdAt',
      label: 'Registered Date',
      formatter: (value) => new Date(value as string).toLocaleDateString(),
    },
  ]);
}

/**
 * Export payments to CSV
 */
export function exportPayments(payments: Transaction[]) {
  exportToCSV(payments, 'doorbel_payments', [
    { key: 'reference', label: 'Reference' },
    {
      key: 'order',
      label: 'Order Number',
      formatter: (value) => {
        const order = value as Transaction['order'];
        return order?.orderNumber || 'N/A';
      },
    },
    {
      key: 'user',
      label: 'Customer Name',
      formatter: (value) => {
        const user = value as Transaction['user'];
        return `${user?.firstName || ''} ${user?.lastName || ''}`;
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      formatter: (value, item) => {
        return `${item.currency} ${(value as number)?.toFixed(2) || '0.00'}`;
      },
    },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    {
      key: 'createdAt',
      label: 'Date',
      formatter: (value) => new Date(value as string).toLocaleString(),
    },
    { key: 'externalReference', label: 'External Reference' },
  ]);
}

/**
 * Export KYC submissions to CSV
 */
export function exportKYC(kycSubmissions: KYC[]) {
  exportToCSV(kycSubmissions, 'doorbel_kyc', [
    {
      key: 'rider',
      label: 'Rider Name',
      formatter: (value) => {
        const rider = value as KYC['rider'];
        if (typeof rider === 'object' && 'auth' in rider) {
          return `${rider.auth.firstName} ${rider.auth.lastName}`;
        }
        return 'Unknown';
      },
    },
    { key: 'idNumber', label: 'ID Number' },
    { key: 'licensePlateNumber', label: 'License Plate' },
    { key: 'status', label: 'Status' },
    { key: 'reason', label: 'Rejection Reason' },
    {
      key: 'createdAt',
      label: 'Submitted Date',
      formatter: (value) => new Date(value as string).toLocaleString(),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      formatter: (value) => new Date(value as string).toLocaleString(),
    },
  ]);
}

/**
 * Export support tickets to CSV
 */
export function exportTickets(tickets: Ticket[]) {
  exportToCSV(tickets, 'doorbel_support_tickets', [
    { key: 'ticketNumber', label: 'Ticket Number' },
    {
      key: 'user',
      label: 'User Name',
      formatter: (value) => {
        const user = value as Ticket['user'];
        return `${user.firstName} ${user.lastName}`;
      },
    },
    {
      key: 'user.phone',
      label: 'User Phone',
    },
    {
      key: 'user.email',
      label: 'User Email',
    },
    {
      key: 'userType',
      label: 'User Type',
    },
    { key: 'subject', label: 'Subject' },
    {
      key: 'category',
      label: 'Category',
      formatter: (value) => (value as string).replace(/_/g, ' '),
    },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      formatter: (value) => {
        const admin = value as Ticket['assignedTo'];
        return admin ? `${admin.firstName} ${admin.lastName}` : 'Unassigned';
      },
    },
    {
      key: 'relatedOrder',
      label: 'Related Order',
      formatter: (value) => {
        const order = value as Ticket['relatedOrder'];
        return order ? order.orderNumber : 'N/A';
      },
    },
    {
      key: 'firstResponseAt',
      label: 'First Response At',
      formatter: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
    },
    {
      key: 'resolutionTime',
      label: 'Resolution Time (min)',
      formatter: (value) => value ? Math.floor(value as number).toString() : 'N/A',
    },
    {
      key: 'satisfactionRating',
      label: 'Satisfaction Rating',
      formatter: (value) => value ? `${value}/5` : 'N/A',
    },
    {
      key: 'createdAt',
      label: 'Created At',
      formatter: (value) => new Date(value as string).toLocaleString(),
    },
    {
      key: 'resolvedAt',
      label: 'Resolved At',
      formatter: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
    },
    {
      key: 'closedAt',
      label: 'Closed At',
      formatter: (value) => value ? new Date(value as string).toLocaleString() : 'N/A',
    },
  ]);
}


