'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatting';

/**
 * TransactionPreview - Vista compacta de transacción para CategoryCard
 *
 * Features:
 * - Diseño minimalista (1 línea)
 * - Descripción + monto
 * - Fecha relativa opcional
 */

export interface TransactionPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Descripción de la transacción */
  description: string;
  /** Monto (negativo para gastos) */
  amount: number;
  /** Fecha (opcional) */
  date?: string;
  /** Mostrar divider */
  showDivider?: boolean;
}

export function TransactionPreview({
  description,
  amount,
  date,
  showDivider = true,
  className,
  ...props
}: TransactionPreviewProps) {
  const isNegative = amount < 0;

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {showDivider && <div className="border-t border-border/50" />}

      <div className="flex items-center justify-between gap-2 py-1">
        {/* Descripción */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{description}</p>
          {date && (
            <p className="text-[10px] text-muted-foreground/70">{date}</p>
          )}
        </div>

        {/* Monto */}
        <span
          className={cn(
            'text-xs font-semibold tabular-nums',
            isNegative ? 'text-destructive' : 'text-success'
          )}
        >
          {formatCurrency(Math.abs(amount))}
        </span>
      </div>
    </div>
  );
}

/**
 * TransactionPreviewList - Contenedor para múltiples previews
 */
export interface TransactionPreviewListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Título de la sección */
  title?: string;
}

export function TransactionPreviewList({
  children,
  title = 'Transacciones Recientes',
  className,
  ...props
}: TransactionPreviewListProps) {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      {title && (
        <h4 className="text-xs font-medium text-muted-foreground mb-2">{title}</h4>
      )}
      <div className="space-y-0">{children}</div>
    </div>
  );
}

/**
 * Skeleton loading state
 */
export function TransactionPreviewSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-1">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
