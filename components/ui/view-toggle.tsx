'use client';

import * as React from 'react';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { Button } from './button';
import { type CategoryView } from '@/lib/hooks/use-category-view';
import { cn } from '@/lib/utils';

export interface ViewToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Vista actual seleccionada
   */
  view: CategoryView;
  /**
   * Callback cuando cambia la vista
   */
  onViewChange: (view: CategoryView) => void;
}

/**
 * ViewToggle - Toggle entre vista compacta y detallada
 *
 * Basado en el patrón de TopCategoriesChart
 * Dos botones con iconos, el botón activo tiene variant="default"
 *
 * Features:
 * - WCAG 2.1 AA compliant (botones ≥44px)
 * - ARIA labels descriptivos
 * - Keyboard accessible
 * - Smooth transitions
 *
 * @example
 * const { view, setView } = useCategoryView();
 *
 * <ViewToggle view={view} onViewChange={setView} />
 */
export function ViewToggle({
  view,
  onViewChange,
  className,
  ...props
}: ViewToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-md border border-border bg-background p-1',
        className
      )}
      role="group"
      aria-label="Selector de vista de categorías"
      {...props}
    >
      <Button
        variant={view === 'compact' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('compact')}
        aria-label="Vista compacta"
        aria-pressed={view === 'compact'}
        className={cn(
          'transition-all duration-200',
          view === 'compact' && 'shadow-sm'
        )}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>

      <Button
        variant={view === 'detailed' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('detailed')}
        aria-label="Vista detallada"
        aria-pressed={view === 'detailed'}
        className={cn(
          'transition-all duration-200',
          view === 'detailed' && 'shadow-sm'
        )}
      >
        <LayoutList className="h-4 w-4" />
      </Button>
    </div>
  );
}
