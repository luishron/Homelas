'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

/**
 * TransactionItem - Componente estilo Wise para mostrar transacciones
 *
 * Features:
 * - Icono circular a la izquierda
 * - Layout [Icon | Content | Amount]
 * - Badge de estado con colores
 * - Touch target 44px mínimo (accesibilidad)
 * - Variantes: default, compact, detailed
 * - Animaciones suaves
 */

const transactionItemVariants = cva(
  'group relative flex items-center gap-3 rounded-lg transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'p-4 hover:bg-accent/50 active:scale-[0.98]',
        compact: 'p-3 hover:bg-accent/50 active:scale-[0.98]',
        detailed: 'p-4 bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/20',
      },
      clickable: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      clickable: false,
    },
  }
);

const iconContainerVariants = cva(
  'flex items-center justify-center rounded-full shrink-0 transition-transform duration-200 group-hover:scale-105',
  {
    variants: {
      size: {
        default: 'h-12 w-12',
        compact: 'h-10 w-10',
        large: 'h-14 w-14',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface TransactionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof transactionItemVariants> {
  /** Icono como string (nombre de lucide-react) o ReactNode */
  icon: string | React.ReactNode;
  /** Color del icono (HSL) */
  iconColor?: string;
  /** Color de fondo del icono (HSL) */
  iconBg?: string;
  /** Título principal (descripción de la transacción) */
  title: string;
  /** Subtítulo (fecha, categoría, método de pago) */
  subtitle?: string;
  /** Monto de la transacción (positivo para ingresos, negativo para gastos) */
  amount: number;
  /** Símbolo de moneda */
  currency?: string;
  /** Estado de la transacción */
  status?: 'paid' | 'pending' | 'overdue' | 'cancelled';
  /** Badge personalizado (reemplaza el status badge) */
  badge?: React.ReactNode;
  /** Tamaño del icono */
  iconSize?: 'default' | 'compact' | 'large';
  /** Callback cuando se hace click en el item */
  onClick?: () => void;
  /** Callback para acción rápida (ej: botón "Pagar") */
  onAction?: () => void;
  /** Label del botón de acción */
  actionLabel?: string;
  /** Mostrar chevron a la derecha */
  showChevron?: boolean;
}

export function TransactionItem({
  icon,
  iconColor = 'hsl(var(--icon-primary))',
  iconBg = 'hsl(var(--muted))',
  title,
  subtitle,
  amount,
  currency = '$',
  status,
  badge,
  variant = 'default',
  iconSize = 'default',
  onClick,
  onAction,
  actionLabel = 'Acción',
  showChevron = false,
  className,
  ...props
}: TransactionItemProps) {
  // Determinar si es clickable
  const isClickable = Boolean(onClick);

  // Renderizar icono
  const renderIcon = () => {
    if (typeof icon === 'string') {
      // Buscar el icono en lucide-react
      const IconComponent = (LucideIcons as any)[icon];
      if (IconComponent) {
        return <IconComponent className="h-5 w-5" style={{ color: iconColor }} />;
      }
      // Si no se encuentra, mostrar el string como emoji
      return <span className="text-xl">{icon}</span>;
    }
    return icon;
  };

  // Renderizar badge de estado
  const renderStatusBadge = () => {
    if (badge) return badge;
    if (!status) return null;

    const statusConfig = {
      paid: { variant: 'default' as const, label: 'Pagado', className: 'bg-success/10 text-success border-success/20' },
      pending: { variant: 'secondary' as const, label: 'Pendiente', className: 'bg-warning/10 text-warning border-warning/20' },
      overdue: { variant: 'destructive' as const, label: 'Vencido', className: 'bg-destructive/10 text-destructive border-destructive/20' },
      cancelled: { variant: 'outline' as const, label: 'Cancelado', className: 'bg-muted/50 text-muted-foreground' },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={cn('text-xs', config.className)}>
        {config.label}
      </Badge>
    );
  };

  // Determinar color del monto
  const getAmountColor = () => {
    if (amount > 0) return 'text-success';
    if (amount < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  // Formatear monto
  const formatAmount = (value: number) => {
    const absValue = Math.abs(value);
    const formatted = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absValue);

    const sign = value > 0 ? '+' : value < 0 ? '-' : '';
    return `${sign}${currency}${formatted}`;
  };

  return (
    <div
      className={cn(
        transactionItemVariants({ variant, clickable: isClickable }),
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      {...props}
    >
      {/* Icon */}
      <div
        className={cn(iconContainerVariants({ size: iconSize }))}
        style={{ backgroundColor: iconBg }}
      >
        {renderIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="text-right shrink-0">
            <p className={cn('font-bold text-base text-money tabular-nums', getAmountColor())}>
              {formatAmount(amount)}
            </p>
            {renderStatusBadge() && (
              <div className="mt-1 flex justify-end">
                {renderStatusBadge()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button o Chevron */}
      {onAction && (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className="shrink-0 ml-2"
        >
          {actionLabel}
        </Button>
      )}

      {showChevron && !onAction && (
        <LucideIcons.ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      )}
    </div>
  );
}

/**
 * TransactionItemSkeleton - Loading state
 */
export function TransactionItemSkeleton({
  variant = 'default',
}: {
  variant?: 'default' | 'compact' | 'detailed';
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg animate-pulse',
        variant === 'default' && 'p-4',
        variant === 'compact' && 'p-3',
        variant === 'detailed' && 'p-4 bg-card border'
      )}
    >
      {/* Icon skeleton */}
      <div className="h-12 w-12 rounded-full bg-muted" />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>

      {/* Amount skeleton */}
      <div className="shrink-0">
        <div className="h-5 bg-muted rounded w-20 mb-1" />
        <div className="h-4 bg-muted rounded w-16" />
      </div>
    </div>
  );
}

/**
 * TransactionList - Lista de transacciones con separadores
 */
export interface TransactionListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Mostrar separadores entre items */
  showDividers?: boolean;
}

export function TransactionList({
  children,
  showDividers = true,
  className,
  ...props
}: TransactionListProps) {
  return (
    <div
      className={cn(
        'space-y-0',
        showDividers && '[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
