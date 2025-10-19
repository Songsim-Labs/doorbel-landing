import { Check, Circle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/types/order';

interface TimelineStep {
  status: OrderStatus;
  label: string;
  timestamp?: string;
}

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  timestamps?: Partial<Record<OrderStatus, string>>;
  className?: string;
}

const timelineSteps: TimelineStep[] = [
  { status: 'pending', label: 'Order Created' },
  { status: 'placed', label: 'Order Placed' },
  { status: 'assigned', label: 'Rider Assigned' },
  { status: 'accepted', label: 'Rider Accepted' },
  { status: 'pickup', label: 'At Pickup Location' },
  { status: 'transit', label: 'In Transit' },
  { status: 'delivered', label: 'Delivered' },
  { status: 'confirmed', label: 'Confirmed by Customer' },
  { status: 'paid', label: 'Payment Completed' },
  { status: 'completed', label: 'Order Completed' },
];

const statusOrder: OrderStatus[] = [
  'pending',
  'placed',
  'assigned',
  'accepted',
  'pickup',
  'transit',
  'delivered',
  'confirmed',
  'paid',
  'completed',
];

export function OrderTimeline({ currentStatus, timestamps, className }: OrderTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isCancelled = currentStatus === 'cancelled';
  
  return (
    <div className={cn('space-y-4', className)}>
      {timelineSteps.map((step, index) => {
        const isCompleted = index < currentIndex || currentStatus === step.status;
        const isCurrent = currentStatus === step.status;
        const timestamp = timestamps?.[step.status];
        
        return (
          <div key={step.status} className="flex gap-4 relative">
            {/* Connecting Line */}
            {index < timelineSteps.length - 1 && (
              <div
                className={cn(
                  'absolute left-[15px] top-8 w-0.5 h-full',
                  isCompleted ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
            
            {/* Status Icon */}
            <div className="relative">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center border-2 bg-background',
                  isCompleted
                    ? 'border-primary bg-primary text-white'
                    : isCurrent
                    ? 'border-primary text-primary'
                    : 'border-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCancelled && isCurrent ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Circle className="h-2 w-2 fill-current" />
                )}
              </div>
            </div>
            
            {/* Status Info */}
            <div className="flex-1 pb-8">
              <div
                className={cn(
                  'font-medium',
                  isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </div>
              {timestamp && (
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {isCancelled && (
        <div className="flex gap-4">
          <div className="relative">
            <div className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-red-500 bg-red-500 text-white">
              <X className="h-4 w-4" />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-medium text-red-600">Order Cancelled</div>
            {timestamps?.cancelled && (
              <div className="text-sm text-muted-foreground mt-1">
                {new Date(timestamps.cancelled).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

