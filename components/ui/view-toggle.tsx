'use client';

import * as React from 'react';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
 * Ahora usa shadcn ToggleGroup para mejor consistencia
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
}: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(value) => {
        if (value) onViewChange(value as CategoryView);
      }}
      className={cn('gap-1', className)}
      aria-label="Selector de vista de categorías"
    >
      <ToggleGroupItem
        value="compact"
        aria-label="Vista compacta"
        className="h-10 w-10"
      >
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="detailed"
        aria-label="Vista detallada"
        className="h-10 w-10"
      >
        <LayoutList className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
