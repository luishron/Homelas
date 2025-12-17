import * as React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CardFinance } from './card-finance';
import { CardHeader, CardContent, CardTitle } from './card';
import { cn } from '@/lib/utils';

export interface CardStatProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  valueClassName?: string;
}

export function CardStat({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  description,
  className,
  valueClassName
}: CardStatProps) {
  const accentColor =
    trend === 'up'
      ? 'hsl(var(--success))'
      : trend === 'down'
        ? 'hsl(var(--destructive))'
        : 'hsl(var(--primary))';

  return (
    <CardFinance
      variant="elevated"
      accentPosition="left"
      accentColor={accentColor}
      className={className}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>

          {/* Icon with background */}
          {icon && (
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200',
                {
                  'bg-success/10 text-success': trend === 'up',
                  'bg-destructive/10 text-destructive': trend === 'down',
                  'bg-primary/10 text-primary': trend === 'neutral'
                }
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Main value */}
        <div
          className={cn(
            'text-3xl font-bold font-mono tabular-nums tracking-tight',
            valueClassName
          )}
        >
          {value}
        </div>

        {/* Change indicator */}
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              {
                'text-success': trend === 'up',
                'text-destructive': trend === 'down',
                'text-muted-foreground': trend === 'neutral'
              }
            )}
          >
            {trend === 'up' && <TrendingUp className="h-4 w-4" />}
            {trend === 'down' && <TrendingDown className="h-4 w-4" />}
            <span>
              {change > 0 ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground">
              vs mes anterior
            </span>
          </div>
        )}

        {/* Optional description */}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </CardFinance>
  );
}
