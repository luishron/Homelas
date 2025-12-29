'use client';

import Link from 'next/link';
import { CardFinance } from '@/components/ui/card-finance';
import { MoneyDisplay } from '@/components/ui/money-display';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CategoryWithData = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
  total?: number;
  recentExpenses?: Array<{
    id: number;
    description: string | null;
    amount: string;
    date: string;
  }>;
};

export interface CategoryCardCompactProps {
  category: CategoryWithData;
}

/**
 * CategoryCardCompact - Vista compacta minimalista de categoría
 *
 * Features:
 * - Icono grande centrado (64px x 64px)
 * - Nombre de categoría
 * - Total gastado (MoneyDisplay md)
 * - Badge con número de transacciones
 * - Sin gráficos ni transacciones detalladas
 * - Hover effect: scale(1.05) + shadow-xl
 * - Touch target ≥44px (WCAG 2.1 AA)
 * - Min-height: 220px (consistente)
 *
 * Layout (~200-250px):
 * ┌──────────────────┐
 * │                  │
 * │   [🍔 64px]     │
 * │                  │
 * │   Alimentos      │
 * │   $170.50        │
 * │   [3 gastos]     │
 * │                  │
 * └──────────────────┘
 *
 * @example
 * <CategoryCardCompact category={categoryData} />
 */
export function CategoryCardCompact({ category }: CategoryCardCompactProps) {
  const transactionCount = category.recentExpenses?.length || 0;

  return (
    <Link href={`/dashboard/categorias/${category.id}`}>
      <CardFinance
        variant="elevated"
        accentPosition="none"
        interactive
        className={cn(
          'min-h-[220px]',
          'hover:scale-105 hover:shadow-xl',
          'transition-all duration-200'
        )}
      >
        <div className="flex flex-col items-center justify-center gap-4 p-5 text-center">
          {/* Icono grande con efecto glow */}
          <div className="relative group/icon">
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-2xl blur-lg opacity-20 group-hover/icon:blur-xl group-hover/icon:opacity-30 transition-all duration-300"
              style={{
                backgroundColor: category.color
              }}
            />

            {/* Icono */}
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-4xl transition-transform duration-300 group-hover/icon:scale-110"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color
              }}
            >
              {category.icon || '📦'}
            </div>
          </div>

          {/* Nombre de categoría */}
          <h3 className="text-lg font-semibold tracking-tight line-clamp-1">
            {category.name}
          </h3>

          {/* Total gastado */}
          <div className="flex flex-col items-center gap-1">
            <MoneyDisplay amount={category.total || 0} size="md" />
          </div>

          {/* Badge con número de transacciones */}
          {transactionCount > 0 && (
            <Badge
              variant="paid-soft"
              className="text-xs px-3 py-1"
              style={{
                borderColor: `${category.color}30`,
                color: category.color,
                backgroundColor: `${category.color}08`
              }}
            >
              {transactionCount} {transactionCount === 1 ? 'gasto' : 'gastos'}
            </Badge>
          )}
        </div>
      </CardFinance>
    </Link>
  );
}
