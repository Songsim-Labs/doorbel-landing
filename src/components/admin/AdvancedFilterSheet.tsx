'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface AdvancedFilterSheetProps {
  children?: React.ReactNode;
  onApply: (filters: Record<string, unknown>) => void;
  onClear: () => void;
  filterConfig: Array<{
    key: string;
    label: string;
    type: 'text' | 'date-range' | 'number-range' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
}

export function AdvancedFilterSheet({
  children,
  onApply,
  onClear,
  filterConfig,
}: AdvancedFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  const handleApply = () => {
    const appliedFilters: Record<string, unknown> = { ...filters };
    
    // Add date range if set
    if (dateRange.from) {
      appliedFilters.dateFrom = format(dateRange.from, 'yyyy-MM-dd');
    }
    if (dateRange.to) {
      appliedFilters.dateTo = format(dateRange.to, 'yyyy-MM-dd');
    }
    
    onApply(appliedFilters);
    setOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    setDateRange({ from: undefined, to: undefined });
    onClear();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Apply multiple filters to refine your search
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {filterConfig.map((config) => (
            <div key={config.key} className="space-y-2">
              <Label htmlFor={config.key}>{config.label}</Label>
              
              {config.type === 'text' && (
                <Input
                  id={config.key}
                  value={(filters[config.key] as string) || ''}
                  onChange={(e) => setFilters({ ...filters, [config.key]: e.target.value })}
                  placeholder={`Enter ${config.label.toLowerCase()}`}
                />
              )}
              
              {config.type === 'number-range' && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={(filters[`${config.key}Min`] as number) || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, [`${config.key}Min`]: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={(filters[`${config.key}Max`] as number) || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, [`${config.key}Max`]: e.target.value })
                    }
                  />
                </div>
              )}
              
              {config.type === 'date-range' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y')} -{' '}
                            {format(dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={handleApply} className="flex-1">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

