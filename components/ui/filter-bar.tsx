'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * FilterBar - Componente estilo Wise para filtros interactivos
 *
 * Features:
 * - Pills/chips horizontales con scroll
 * - Estados: default, selected, disabled
 * - Multi-select o single-select
 * - Contador de items en cada filtro
 * - Reset button para limpiar filtros
 * - Animaciones suaves
 */

const filterChipVariants = cva(
  'inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px]',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground hover:bg-muted/80',
        selected: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        disabled: 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface Filter {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lista de filtros disponibles */
  filters: Filter[];
  /** IDs de filtros seleccionados */
  selected: string[];
  /** Callback cuando cambia la selección */
  onChange: (selected: string[]) => void;
  /** Permitir selección múltiple */
  multiSelect?: boolean;
  /** Mostrar contadores en los filtros */
  showCounts?: boolean;
  /** Mostrar botón de reset */
  showReset?: boolean;
  /** Label del botón de reset */
  resetLabel?: string;
  /** Tamaño de los chips */
  size?: 'sm' | 'md' | 'lg';
}

export function FilterBar({
  filters,
  selected,
  onChange,
  multiSelect = false,
  showCounts = true,
  showReset = true,
  resetLabel = 'Limpiar',
  size = 'md',
  className,
  ...props
}: FilterBarProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleFilterClick = (filterId: string) => {
    const filter = filters.find((f) => f.id === filterId);
    if (filter?.disabled) return;

    if (multiSelect) {
      // Multi-select: toggle filtro
      if (selected.includes(filterId)) {
        onChange(selected.filter((id) => id !== filterId));
      } else {
        onChange([...selected, filterId]);
      }
    } else {
      // Single-select: seleccionar solo uno
      if (selected.includes(filterId)) {
        onChange([]); // Deseleccionar si ya estaba seleccionado
      } else {
        onChange([filterId]);
      }
    }
  };

  const handleReset = () => {
    onChange([]);
  };

  const hasActiveFilters = selected.length > 0;

  // Tamaños de chips - todos cumplen con 44px mínimo de touch target
  const chipSizeClasses = {
    sm: 'px-3 py-2.5 text-xs min-h-[44px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px]',
    lg: 'px-5 py-3 text-base min-h-[48px]',
  };

  return (
    <div className={cn('relative', className)} {...props}>
      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent"
        style={{
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Filter chips */}
        {filters.map((filter) => {
          const isSelected = selected.includes(filter.id);
          const isDisabled = filter.disabled;

          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              disabled={isDisabled}
              className={cn(
                filterChipVariants({
                  variant: isDisabled ? 'disabled' : isSelected ? 'selected' : 'default',
                }),
                chipSizeClasses[size],
                'active:scale-95',
                isSelected && 'ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
              )}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
            >
              {/* Icon */}
              {filter.icon && (
                <span className="shrink-0 flex items-center">{filter.icon}</span>
              )}

              {/* Label */}
              <span>{filter.label}</span>

              {/* Count */}
              {showCounts && filter.count !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold',
                    isSelected
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-foreground/10 text-foreground'
                  )}
                >
                  {filter.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Reset button */}
        {showReset && hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className={cn(
              'shrink-0 gap-1 text-muted-foreground hover:text-foreground',
              chipSizeClasses[size]
            )}
          >
            <X className="h-3.5 w-3.5" />
            <span>{resetLabel}</span>
          </Button>
        )}
      </div>

      {/* Fade gradients para indicar scroll */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

/**
 * FilterBarSkeleton - Loading state
 */
export function FilterBarSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden pb-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-8 w-20 rounded-full bg-muted animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}

/**
 * FilterBarWithTitle - FilterBar con título y descripción
 */
export interface FilterBarWithTitleProps extends FilterBarProps {
  title?: string;
  description?: string;
}

export function FilterBarWithTitle({
  title,
  description,
  ...filterBarProps
}: FilterBarWithTitleProps) {
  return (
    <div className="space-y-3">
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
      <FilterBar {...filterBarProps} />
    </div>
  );
}
