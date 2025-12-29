'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryName } from '@/lib/utils/formatting';
import { getPaymentStatusBadge } from '@/lib/constants/enums';
import type { SelectExpense, Category, PaymentMethod } from '@/lib/db';

interface ExpenseCardProps {
  expense: SelectExpense;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  onPay: (expense: SelectExpense) => void;
  onEdit: (expense: SelectExpense) => void;
  onDelete: (expenseId: number) => void;
}

export function ExpenseCard({ expense, categories, paymentMethods, onPay, onEdit, onDelete }: ExpenseCardProps) {
  const statusBadge = getPaymentStatusBadge(expense.payment_status, expense.date);

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3 transition-all hover:shadow-md animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-base">{expense.description || 'Sin descripción'}</h3>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatCurrency(expense.amount)}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(expense)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(expense.id)} className="text-destructive">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{getCategoryName(expense.category_id, categories)}</Badge>
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
        <span>{formatDate(expense.date)}</span>
        {expense.payment_status !== 'pagado' && (
          <Button size="sm" onClick={() => onPay(expense)}>
            Pagar
          </Button>
        )}
      </div>
    </div>
  );
}
