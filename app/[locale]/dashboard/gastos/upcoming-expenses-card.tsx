'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CreditCard, AlertCircle } from 'lucide-react';
import type { UpcomingExpense, Category } from '@/lib/db';
import { payRecurringExpense } from '../actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface UpcomingExpensesCardProps {
  upcomingExpenses: UpcomingExpense[];
  categories: Category[];
}

export function UpcomingExpensesCard({
  upcomingExpenses,
  categories
}: UpcomingExpensesCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [payingId, setPayingId] = useState<number | null>(null);

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    // Parsear la fecha como local sin conversión de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? `${category.icon || ''} ${category.name}`.trim() : 'Sin categoría';
  };

  const getDueBadge = (daysUntilDue: number) => {
    if (daysUntilDue < 0) {
      return { variant: 'destructive' as const, icon: AlertCircle };
    }
    if (daysUntilDue <= 3) {
      return { variant: 'destructive' as const, icon: AlertCircle };
    }
    if (daysUntilDue <= 7) {
      return { variant: 'secondary' as const, icon: Clock };
    }
    return { variant: 'outline' as const, icon: Clock };
  };

  const handlePay = async (expense: UpcomingExpense) => {
    setPayingId(expense.templateId);

    const formData = new FormData();
    formData.set('templateId', String(expense.templateId));
    formData.set('nextDate', expense.nextDate);
    formData.set('amount', expense.amount);
    formData.set('description', expense.description || '');
    formData.set('categoryId', String(expense.category_id));
    formData.set('paymentMethodId', expense.payment_method || '');
    formData.set('notes', expense.notes || '');
    formData.set('recurrenceFrequency', expense.recurrence_frequency || 'monthly');

    const result = await payRecurringExpense(formData);

    if (result?.error) {
      toast({
        title: 'Error al procesar pago',
        description: result.error,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Gasto pagado',
        description: 'El gasto recurrente se ha marcado como pagado exitosamente'
      });
      router.refresh();
    }

    setPayingId(null);
  };

  if (upcomingExpenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximos Gastos Recurrentes</CardTitle>
          <CardDescription>
            No hay gastos recurrentes programados
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Gastos Recurrentes</CardTitle>
        <CardDescription>
          Gastos que se vencen próximamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingExpenses.slice(0, 10).map((expense) => {
            const dueBadge = getDueBadge(expense.daysUntilDue);
            const DueIcon = dueBadge.icon;

            return (
              <div
                key={`${expense.templateId}-${expense.nextDate}`}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {expense.description || 'Sin descripción'}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryName(expense.category_id)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{formatDate(expense.nextDate)}</span>
                    <Badge variant={dueBadge.variant} className="gap-1">
                      <DueIcon className="h-3 w-3" />
                      {expense.dueMessage}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">
                    {formatCurrency(expense.amount)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handlePay(expense)}
                    disabled={payingId === expense.templateId}
                    className="gap-1"
                  >
                    <CreditCard className="h-4 w-4" />
                    {payingId === expense.templateId ? 'Pagando...' : 'Pagar'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {upcomingExpenses.length > 10 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Mostrando 10 de {upcomingExpenses.length} próximos gastos
          </p>
        )}
      </CardContent>
    </Card>
  );
}
