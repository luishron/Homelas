'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

/**
 * QuickActionCard - Componente estilo Wise para acciones rápidas
 *
 * Features:
 * - Tarjeta compacta con icono y label
 * - Touch target 44px mínimo
 * - Hover/active states suaves
 * - Diseño minimalista
 */

const quickActionVariants = cva(
  'flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200 cursor-pointer select-none min-w-[80px] sm:min-w-[100px]',
  {
    variants: {
      variant: {
        default: 'bg-card border-2 border-border hover:border-primary/50 hover:bg-accent/50 active:scale-95',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95',
        ghost: 'bg-transparent hover:bg-accent active:scale-95',
      },
      size: {
        sm: 'p-3 h-20',
        md: 'p-4 h-24',
        lg: 'p-5 h-28',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface QuickActionCardProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof quickActionVariants> {
  /** Icono de Lucide React */
  icon: LucideIcon;
  /** Label de la acción */
  label: string;
  /** Color del icono (HSL) */
  iconColor?: string;
  /** Tamaño del icono */
  iconSize?: number;
  /** Badge opcional (número o texto corto) */
  badge?: string | number;
  /** Callback al hacer click */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

export function QuickActionCard({
  icon: Icon,
  label,
  iconColor,
  iconSize = 24,
  badge,
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false,
  className,
  ...props
}: QuickActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        quickActionVariants({ variant, size }),
        disabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-card',
        className
      )}
      {...props}
    >
      {/* Icon container */}
      <div className="relative">
        <Icon
          size={iconSize}
          className="transition-transform duration-200 group-hover:scale-110"
          style={{ color: iconColor }}
        />

        {/* Badge */}
        {badge !== undefined && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold px-1">
            {badge}
          </div>
        )}
      </div>

      {/* Label */}
      <span className="text-xs font-medium text-center line-clamp-1">
        {label}
      </span>
    </button>
  );
}

/**
 * QuickActionsContainer - Contenedor para múltiples QuickActionCards
 */
export interface QuickActionsContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Título opcional */
  title?: string;
}

export function QuickActionsContainer({
  children,
  title,
  className,
  ...props
}: QuickActionsContainerProps) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {title && (
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {children}
      </div>
    </div>
  );
}

/**
 * Skeleton loading state
 */
export function QuickActionCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center gap-2 rounded-xl bg-muted p-4 h-24 min-w-[100px] animate-pulse"
        >
          <div className="h-6 w-6 rounded-full bg-muted-foreground/20" />
          <div className="h-3 w-16 rounded bg-muted-foreground/20" />
        </div>
      ))}
    </div>
  );
}
