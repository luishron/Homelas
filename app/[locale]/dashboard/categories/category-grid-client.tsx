'use client';

import { CategoryCardCompact } from './category-card-compact';
import { CategoryCardDetailed } from './category-card-detailed';
import { ViewToggle } from '@/components/ui/view-toggle';
import { useCategoryView } from '@/lib/hooks/use-category-view';
import { AddCategoryDialog } from './add-category-dialog';
import { cn } from '@/lib/utils';

type CategoryWithAllData = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
  total: number;
  monthlyTrend: Array<{ month: string; total: number; count: number }>;
  monthlyAverage: number;
  trendPercent: number | null;
  lastExpenseDate: string | null;
  budget: { amount: number; period: string } | null;
  recentExpenses: Array<{
    id: number;
    description: string | null;
    amount: string;
    date: string;
  }>;
};

export interface CategoryGridClientProps {
  categories: CategoryWithAllData[];
}

/**
 * CategoryGridClient - Wrapper cliente para la grid de categorías
 *
 * Maneja el estado de la vista (compact/detailed) y renderiza las cards correspondientes
 * Este componente es cliente para poder usar useState y localStorage
 * Los datos vienen como props desde el server component padre
 */
export function CategoryGridClient({ categories }: CategoryGridClientProps) {
  const { view, setView } = useCategoryView();

  return (
    <div className="flex flex-col gap-4 animate-fade-in w-full max-w-full">
      <div className="flex items-center justify-between w-full min-w-0">
        <h1 className="text-3xl font-bold truncate min-w-0">Categorías</h1>

        <div className="flex items-center gap-3 flex-shrink-0">
          <ViewToggle view={view} onViewChange={setView} />
          <AddCategoryDialog />
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center w-full">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No hay categorías</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Crea tu primera categoría para comenzar a organizar tus gastos.
            </p>
            <AddCategoryDialog />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-4 transition-all duration-200 w-full',
            view === 'compact'
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' // Mobile: 1 col, Tablet+: 2-4 cols
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' // Mobile: 1 col, Desktop: 2-3 cols
          )}
        >
          {categories.map((category) =>
            view === 'compact' ? (
              <CategoryCardCompact key={category.id} category={category} />
            ) : (
              <CategoryCardDetailed key={category.id} category={category} />
            )
          )}
        </div>
      )}
    </div>
  );
}
