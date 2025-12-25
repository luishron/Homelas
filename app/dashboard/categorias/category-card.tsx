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
import { TransactionPreview, TransactionPreviewList } from '@/components/ui/transaction-preview';
import { Trash2 } from 'lucide-react';
import { deleteCategory } from '../actions';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatShortDate } from '@/lib/utils/date-grouping';

type CategoryWithData = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
  total?: number;
  monthlyTrend?: Array<{ month: string; total: number; count: number }>;
  recentExpenses?: Array<{
    id: number;
    description: string | null;
    amount: string;
    date: string;
  }>;
};

export function CategoryCard({ category }: { category: CategoryWithData }) {
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

  return (
    <>
      <Link href={`/dashboard/categorias/${category.id}`}>
        <CardFinance
          variant="elevated"
          accentPosition="top"
          interactive
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              {/* Icon with gradient background */}
              <div className="relative group/icon">
                <div
                  className="absolute inset-0 rounded-xl blur-sm opacity-30 group-hover/icon:blur-md transition-all"
                  style={{
                    backgroundColor: category.color
                  }}
                />
                <div
                  className="relative flex h-16 w-16 items-center justify-center rounded-xl text-3xl transition-transform group-hover:scale-110"
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
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <CardTitle className="mt-4">{category.name}</CardTitle>
            {category.description && (
              <CardDescription>{category.description}</CardDescription>
            )}
          </CardHeader>

          <CardContent>
            {/* Decorative separator with category color */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <div
                  className="h-1 w-12 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            </div>

            {/* Total amount */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                Total gastado
              </span>
              <MoneyDisplay amount={category.total || 0} size="md" />
            </div>

            {/* Mini Chart - Tendencia de los últimos 6 meses */}
            {category.monthlyTrend && category.monthlyTrend.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Tendencia (6 meses)</p>
                <MiniChart
                  data={category.monthlyTrend.map((m) => m.total)}
                  color={category.color}
                  height={40}
                  smooth
                />
              </div>
            )}

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
