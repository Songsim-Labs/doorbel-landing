import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/types/order';
import { KYCStatus } from '@/types/rider';

interface StatusBadgeProps {
  status: OrderStatus | KYCStatus | string;
  type?: 'order' | 'kyc' | 'payment' | 'rider' | 'ticket';
  className?: string;
}

const statusConfig = {
  // Order statuses
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  placed: { label: 'Placed', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  assigned: { label: 'Assigned', className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100' },
  accepted: { label: 'Accepted', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
  pickup: { label: 'At Pickup', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  transit: { label: 'In Transit', className: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100' },
  delivered: { label: 'Delivered', className: 'bg-teal-100 text-teal-800 hover:bg-teal-100' },
  confirmed: { label: 'Confirmed', className: 'bg-lime-100 text-lime-800 hover:bg-lime-100' },
  paid: { label: 'Paid', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  
  // KYC/Payment statuses
  approved: { label: 'Approved', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  refunded: { label: 'Refunded', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
  
  // Rider statuses
  online: { label: 'Online', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  offline: { label: 'Offline', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
  busy: { label: 'Busy', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  unavailable: { label: 'Unavailable', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  
  // Support ticket statuses
  open: { label: 'Open', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  in_progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  awaiting_response: { label: 'Awaiting Response', className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || {
    label: status,
    className: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border-0',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

