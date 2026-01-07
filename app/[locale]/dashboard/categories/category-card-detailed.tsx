'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CardFinance } from '@/components/ui/card-finance';
import { MoneyDisplay } from '@/components/ui/money-display';
import { MiniChart } from '@/components/ui/mini-chart';
import {
  TransactionPreview,
  TransactionPreviewList
} from '@/components/ui/transaction-preview';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { deleteCategory } from '../actions';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatShortDate } from '@/lib/utils/date-grouping';
import { cn } from '@/lib/utils';

type CategoryWithData = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
  total?: number;
  monthlyTrend?: Array<{ month: string; total: number; count: number }>;
  monthlyAverage?: number;
  trendPercent?: number | null;
  lastExpenseDate?: string | null;
  budget?: { amount: number; period: string } | null;
  recentExpenses?: Array<{
    id: number;
    description: string | null;
    amount: string;
    date: string;
  }>;
};

export interface CategoryCardDetailedProps {
  category: CategoryWithData;
}

/**
 * CategoryCardDetailed - Vista detallada completa de categoría
 *
 * Features mejoradas:
 * - ✅ Promedio mensual
 * - ✅ Tendencia % vs mes anterior (badge con color)
 * - ✅ Último gasto (fecha relativa)
 * - ✅ Presupuesto con progress bar (si existe)
 * - ✅ Mini chart de 6 meses
 * - ✅ Últimas 3 transacciones
 * - ❌ Separador decorativo eliminado
 * - ✅ Líneas simples sutiles (border-t border-border/30)
 * - ✅ Hover en icono: rotate(3deg) + scale(1.05)
 * - ✅ WCAG 2.1 AA compliant
 *
 * Layout:
 * ┌────────────────────────────────┐
 * │ [🍔] Alimentos        [⋮]     │
 * │ Gastos de comida diaria        │
 * │ ───────────────────────────    │
 * │ Total gastado: $170.50         │
 * │ Promedio: $56.83/mes           │
 * │ Último gasto: Hace 2 días      │
 * │ ───────────────────────────    │
 * │ Tendencia (6 meses)   [+12%↑] │
 * │ [~~~~~~~~~ Chart ~~~~~]        │
 * │ ───────────────────────────    │
 * │ Presupuesto: $200/mes          │
 * │ [████████░░] 85%               │
 * │ ───────────────────────────    │
 * │ Últimas Transacciones:         │
 * │  • Compra semanal   $100.00   │
 * └────────────────────────────────┘
 *
 * @example
 * <CategoryCardDetailed category={categoryWithAllStats} />
 */
export function CategoryCardDetailed({ category }: CategoryCardDetailedProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const formData = new FormData();
    formData.set('id', String(category.id));
    await deleteCategory(formData);

    toast({
      title: 'Categoría eliminada',
      description: `La categoría "${category.name}" se ha eliminado exitosamente`
    });

    router.refresh();
  };

  // Calcular porcentaje de presupuesto usado
  const budgetPercent = category.budget
    ? Math.round(((category.total || 0) / category.budget.amount) * 100)
    : null;

  // Determinar color del progress bar
  const getBudgetVariant = (percent: number): 'success' | 'warning' | 'destructive' => {
    if (percent <= 70) return 'success';
    if (percent <= 90) return 'warning';
    return 'destructive';
  };

  // Formatear fecha relativa del último gasto
  const getRelativeDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Sin gastos';

    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return formatShortDate(date);
  };

  return (
    <>
      <Link href={`/dashboard/categories/${category.id}`}>
        <CardFinance
          variant="elevated"
          accentPosition="top"
          interactive
          className="transition-all duration-300"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              {/* Icon with glow effect */}
              <div className="relative group/icon">
                <div
                  className="absolute inset-0 rounded-xl blur-sm opacity-30 group-hover/icon:blur-md transition-all duration-300"
                  style={{
                    backgroundColor: category.color
                  }}
                />
                <div
                  className="relative flex h-16 w-16 items-center justify-center rounded-xl text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    backgroundColor: `${category.color}20`,
                    color: category.color
                  }}
                >
                  {category.icon || '📦'}
                </div>
              </div>

              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDeleteClick}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Eliminar categoría ${category.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <CardTitle className="mt-4">{category.name}</CardTitle>
            {category.description && (
              <CardDescription>{category.description}</CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Línea simple sutil */}
            <div className="border-t border-border/30" />

            {/* Stats principales */}
            <div className="space-y-2">
              {/* Total gastado */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total gastado</span>
                <MoneyDisplay amount={category.total || 0} size="md" />
              </div>

              {/* Promedio mensual */}
              {category.monthlyAverage !== undefined && category.monthlyAverage > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Promedio mensual</span>
                  <span className="text-xs font-medium tabular-nums">
                    ${category.monthlyAverage.toFixed(2)} /mes
                  </span>
                </div>
              )}

              {/* Último gasto */}
              {category.lastExpenseDate && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Último gasto</span>
                  <span className="text-xs text-foreground">
                    {getRelativeDate(category.lastExpenseDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Línea simple sutil */}
            <div className="border-t border-border/30" />

            {/* Mini Chart + Tendencia */}
            {category.monthlyTrend && category.monthlyTrend.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Tendencia (6 meses)</p>

                  {/* Badge de tendencia */}
                  {category.trendPercent !== null && category.trendPercent !== undefined && (
                    <Badge
                      variant={category.trendPercent > 0 ? 'destructive' : 'success'}
                      className="text-xs gap-1"
                    >
                      {category.trendPercent > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(category.trendPercent).toFixed(0)}%
                    </Badge>
                  )}
                </div>

                <MiniChart
                  data={category.monthlyTrend.map((m) => m.total)}
                  color={category.color}
                  height={40}
                  smooth
                />
              </div>
            )}

            {/* Presupuesto (condicional) */}
            {category.budget && budgetPercent !== null && (
              <>
                <div className="border-t border-border/30" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Presupuesto: ${category.budget.amount} /{category.budget.period}
                    </span>
                    <Badge
                      variant={getBudgetVariant(budgetPercent)}
                      className="text-xs"
                    >
                      {budgetPercent}%
                    </Badge>
                  </div>

                  <Progress
                    value={budgetPercent}
                    className={cn(
                      'h-2',
                      budgetPercent > 90 && 'bg-destructive/20',
                      budgetPercent > 70 && budgetPercent <= 90 && 'bg-warning/20',
                      budgetPercent <= 70 && 'bg-success/20'
                    )}
                  />
                </div>
              </>
            )}

            {/* Línea simple sutil */}
            <div className="border-t border-border/30" />

            {/* Recent Transactions */}
            {category.recentExpenses && category.recentExpenses.length > 0 && (
              <TransactionPreviewList title="Últimas Transacciones">
                {category.recentExpenses.slice(0, 3).map((expense, index) => (
                  <TransactionPreview
                    key={expense.id}
                    description={expense.description || 'Sin descripción'}
                    amount={-parseFloat(expense.amount)}
                    date={formatShortDate(new Date(expense.date))}
                    showDivider={index > 0}
                  />
                ))}
              </TransactionPreviewList>
            )}
          </CardContent>
        </CardFinance>
      </Link>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Eliminar categoría"
        description={`¿Estás seguro de que deseas eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
}
