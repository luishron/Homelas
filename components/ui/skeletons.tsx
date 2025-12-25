/**
 * Skeletons - Loading states para todas las vistas
 *
 * Componentes de skeleton minimalistas estilo Wise para feedback visual
 * durante la carga de datos.
 */

import { cn } from '@/lib/utils';

/**
 * Skeleton base - Componente base reutilizable
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/50', className)}
      {...props}
    />
  );
}

/**
 * TransactionItemSkeleton - Skeleton para items de transacción
 */
export function TransactionItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border animate-pulse">
      {/* Icon */}
      <Skeleton className="h-10 w-10 rounded-lg shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Amount */}
      <Skeleton className="h-5 w-20 shrink-0" />
    </div>
  );
}

/**
 * TransactionListSkeleton - Skeleton para lista completa de transacciones
 */
export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <TransactionItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * TimelineGroupSkeleton - Skeleton para grupos de timeline
 */
export function TimelineGroupSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-3">
          {/* Group header */}
          <div className="flex items-center justify-between py-2 px-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Group items */}
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, itemIndex) => (
              <TransactionItemSkeleton key={itemIndex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * CategoryCardSkeleton - Skeleton para cards de categorías
 */
export function CategoryCardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4 space-y-4 animate-pulse">
      {/* Icon y título */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>

      {/* Progress bar */}
      <Skeleton className="h-2 w-full rounded-full" />

      {/* Stats */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Mini chart */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

/**
 * CategoryGridSkeleton - Skeleton para grid de categorías
 */
export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * KPICardSkeleton - Skeleton para KPI cards del dashboard
 */
export function KPICardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>

      {/* Amount */}
      <Skeleton className="h-8 w-40" />

      {/* Subtitle */}
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

/**
 * KPIGridSkeleton - Skeleton para grid de KPIs
 */
export function KPIGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * SearchBarSkeleton - Skeleton para barra de búsqueda
 */
export function SearchBarSkeleton() {
  return (
    <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-border animate-pulse">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 flex-1" />
    </div>
  );
}

/**
 * FilterBarSkeleton - Skeleton para barra de filtros
 */
export function FilterBarSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-full shrink-0" />
      ))}
    </div>
  );
}

/**
 * TableRowSkeleton - Skeleton para filas de tabla
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

/**
 * TableSkeleton - Skeleton para tabla completa
 */
export function TableSkeleton({
  rows = 5,
  columns = 5
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

/**
 * CardSkeleton - Skeleton genérico para cards
 */
export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-6 space-y-4 animate-pulse">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

/**
 * PageHeaderSkeleton - Skeleton para headers de página
 */
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

/**
 * FormSkeleton - Skeleton para formularios
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
