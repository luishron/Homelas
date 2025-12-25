'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { getRelativeDateLabel, formatDateTime } from '@/lib/utils/date-grouping';

/**
 * TimelineGroup - Componente estilo Wise para agrupar transacciones por fecha
 *
 * Features:
 * - Sticky header con fecha/label ("Today", "Yesterday", "Dec 20")
 * - Separador visual entre grupos
 * - Animación de entrada por grupo
 * - Totales por grupo opcionales
 * - Soporte para scroll infinito
 */

export interface TimelineGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label del grupo ("Hoy", "Ayer", "Mar 8") */
  label: string;
  /** Fecha del grupo (para formato automático) */
  date?: Date;
  /** Usar date para generar label automáticamente */
  autoLabel?: boolean;
  /** Items del grupo (generalmente TransactionItems) */
  children: React.ReactNode;
  /** Mostrar total del grupo */
  showTotal?: boolean;
  /** Total calculado */
  total?: number;
  /** Símbolo de moneda */
  currency?: string;
  /** Header sticky */
  sticky?: boolean;
  /** Mostrar separador superior */
  showDivider?: boolean;
  /** Índice de animación (para stagger) */
  animationIndex?: number;
}

export function TimelineGroup({
  label,
  date,
  autoLabel = false,
  children,
  showTotal = false,
  total = 0,
  currency = '$',
  sticky = true,
  showDivider = true,
  animationIndex = 0,
  className,
  ...props
}: TimelineGroupProps) {
  // Generar label automático si se proporciona fecha
  const displayLabel = React.useMemo(() => {
    if (autoLabel && date) {
      return getRelativeDateLabel(date);
    }
    return label;
  }, [autoLabel, date, label]);

  // Formatear total
  const formattedTotal = React.useMemo(() => {
    if (!showTotal) return null;

    const formatted = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(total));

    const sign = total > 0 ? '+' : total < 0 ? '-' : '';
    const colorClass = total > 0 ? 'text-success' : total < 0 ? 'text-destructive' : 'text-muted-foreground';

    return (
      <span className={cn('font-semibold text-sm tabular-nums', colorClass)}>
        {sign}
        {currency}
        {formatted}
      </span>
    );
  }, [showTotal, total, currency]);

  // Contar items
  const itemCount = React.Children.count(children);

  return (
    <div
      className={cn(
        'timeline-group',
        'animate-fade-in-up',
        className
      )}
      style={{
        animationDelay: `${animationIndex * 50}ms`,
      }}
      {...props}
    >
      {/* Divider superior */}
      {showDivider && <div className="border-t border-border" />}

      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between gap-4 py-3 px-1 bg-background/95 backdrop-blur-sm z-10',
          sticky && 'sticky top-0'
        )}
      >
        {/* Label y contador */}
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground">{displayLabel}</h3>
          <span className="text-xs text-muted-foreground">({itemCount})</span>
        </div>

        {/* Total */}
        {formattedTotal}
      </div>

      {/* Items */}
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
}

/**
 * TimelineGroupSkeleton - Loading state
 */
export function TimelineGroupSkeleton({ itemCount = 3 }: { itemCount?: number }) {
  return (
    <div className="timeline-group">
      {/* Header skeleton */}
      <div className="flex items-center justify-between py-3 px-1">
        <div className="h-4 bg-muted rounded w-24 animate-pulse" />
        <div className="h-4 bg-muted rounded w-16 animate-pulse" />
      </div>

      {/* Items skeleton */}
      <div className="space-y-0">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 border-b border-border"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
            </div>
            <div className="h-5 bg-muted rounded w-20 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * TimelineContainer - Contenedor para múltiples TimelineGroups
 */
export interface TimelineContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Espaciado entre grupos */
  spacing?: 'sm' | 'md' | 'lg';
}

export function TimelineContainer({
  children,
  spacing = 'md',
  className,
  ...props
}: TimelineContainerProps) {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return (
    <div className={cn(spacingClasses[spacing], className)} {...props}>
      {children}
    </div>
  );
}

/**
 * EmptyTimeline - Estado vacío
 */
export interface EmptyTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyTimeline({
  title = 'No hay transacciones',
  description = 'Cuando tengas transacciones, aparecerán aquí',
  icon,
  action,
  className,
  ...props
}: EmptyTimelineProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 text-muted-foreground opacity-50">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}

      {/* Action */}
      {action}
    </div>
  );
}
