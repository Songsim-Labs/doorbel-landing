'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckSquare, Download, Trash2, XCircle } from 'lucide-react';

interface BatchActionsToolbarProps {
  selectedCount: number;
  onExport?: () => void;
  onDelete?: () => void;
  onBulkUpdate?: (action: string) => void;
  onCancel?: () => void;
  actions?: Array<{
    label: string;
    value: string;
    icon?: React.ElementType;
    variant?: 'default' | 'destructive';
  }>;
}

export function BatchActionsToolbar({
  selectedCount,
  onExport,
  onDelete,
  onBulkUpdate,
  onCancel,
  actions = [],
}: BatchActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-2xl border border-primary-foreground/20 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          <span className="font-semibold">{selectedCount} selected</span>
        </div>

        <div className="h-6 w-px bg-primary-foreground/30" />

        <div className="flex items-center gap-2">
          {onExport && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}

          {actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <DropdownMenuItem
                      key={action.value}
                      onClick={() => onBulkUpdate?.(action.value)}
                      className={action.variant === 'destructive' ? 'text-destructive' : ''}
                    >
                      {Icon && <Icon className="h-4 w-4 mr-2" />}
                      {action.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}

          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="gap-2 hover:bg-primary-foreground/20"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

