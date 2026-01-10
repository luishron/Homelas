'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, CheckCircle2, Loader2, Tag, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { Expense, Category } from '@/lib/db';
import { formatCurrency } from '@/lib/utils/formatting';
import type { CurrencyCode } from '@/lib/config/currencies';
import { useToast } from '@/hooks/use-toast';
import { markExpenseAsPaid, postponeExpenseDate } from './actions';
import { cn } from '@/lib/utils';

interface AttentionRequiredWidgetProps {
  expenses: Expense[];
  categories: Category[];
  currency: CurrencyCode;
  currentBalance: number;
}

export function AttentionRequiredWidget({
  expenses,
  categories,
  currency,
  currentBalance
}: AttentionRequiredWidgetProps) {
  const [payingId, setPayingId] = useState<number | null>(null);
  const [postponingId, setPostponingId] = useState<number | null>(null);
  const [customDateExpenseId, setCustomDateExpenseId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const router = useRouter();
  const { toast } = useToast();

  // Helper: Calculate postpone date based on option
  const getPostponeDate = (option: 'tomorrow' | '3days' | 'week' | 'month'): string => {
    const today = new Date();
    const daysToAdd = {
      tomorrow: 1,
      '3days': 3,
      week: 7,
      month: 30
    }[option];

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    return targetDate.toISOString().split('T')[0];
  };

  // Helper: Get urgency badge color and label
  const getUrgencyBadge = (dateString: string): { color: string; label: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expenseDate = new Date(dateString);
    expenseDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor(
      (expenseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Overdue (red)
    if (daysDiff < 0) {
      return {
        color: 'bg-destructive text-destructive-foreground',
        label: `Vencido (${Math.abs(daysDiff)}d)`
      };
    }

    // Today (orange)
    if (daysDiff === 0) {
      return { color: 'bg-orange-500 text-white', label: 'Hoy' };
    }

    // Tomorrow (orange)
    if (daysDiff === 1) {
      return { color: 'bg-orange-400 text-white', label: 'Mañana' };
    }

    // Within 3 days (yellow)
    if (daysDiff <= 3) {
      return { color: 'bg-warning text-warning-foreground', label: `En ${daysDiff}d` };
    }

    // Within 7 days (muted yellow)
    return { color: 'bg-warning/60 text-foreground', label: `En ${daysDiff}d` };
  };

  // Helper: Get category name
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  };

  // Helper: Format date
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Handler: Mark expense as paid
  const handlePay = async (expense: Expense) => {
    setPayingId(expense.id);

    try {
      const result = await markExpenseAsPaid(expense.id);

      if (result.error) {
        toast({
          title: 'Error al pagar gasto',
          description: result.error,
          variant: 'destructive'
        });
      } else {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Gasto pagado</span>
            </div>
          ) as any,
          description: `${expense.description} - ${formatCurrency(expense.amount, currency)}`
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error inesperado',
        variant: 'destructive'
      });
    } finally {
      setPayingId(null);
    }
  };

  // Handler: Postpone expense date
  const handlePostpone = async (expenseId: number, option: string) => {
    setPostponingId(expenseId);

    try {
      let newDate: string;

      // Si option ya es una fecha (de calendario custom)
      if (/^\d{4}-\d{2}-\d{2}$/.test(option)) {
        newDate = option;
      } else {
        newDate = getPostponeDate(option as 'tomorrow' | '3days' | 'week' | 'month');
      }

      const result = await postponeExpenseDate(expenseId, newDate);

      if (result.error) {
        toast({
          title: 'Error al posponer',
          description: result.error,
          variant: 'destructive'
        });
      } else {
        const expense = expenses.find((e) => e.id === expenseId);
        toast({
          title: 'Gasto pospuesto',
          description: `${expense?.description || 'Gasto'} reprogramado para ${formatDate(newDate)}`
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error inesperado',
        variant: 'destructive'
      });
    } finally {
      setPostponingId(null);
    }
  };

  // Empty state
  if (expenses.length === 0) {
    return (
      <Card className="max-w-full min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Atención Requerida
          </CardTitle>
          <CardDescription>Gastos que requieren acción este mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <p className="text-lg font-medium text-muted-foreground">Todo en orden</p>
            <p className="text-sm text-muted-foreground mt-1">
              No hay gastos pendientes este mes
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate balance
  const totalPending = expenses.slice(0, 5).reduce((sum, e) => sum + Number(e.amount), 0);
  const balanceAfterPaying = currentBalance - totalPending;

  return (
    <Card className="max-w-full min-w-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Atención Requerida
            </CardTitle>
            <CardDescription>
              {expenses.length} {expenses.length === 1 ? 'gasto requiere' : 'gastos requieren'}{' '}
              acción este mes
            </CardDescription>
          </div>
          {expenses.length > 5 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/expenses?filter=attention">Ver todos</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-w-full">
          {expenses.slice(0, 5).map((expense, index) => {
            const urgency = getUrgencyBadge(expense.date);
            const isOverdue = urgency.color.includes('destructive');

            return (
              <div
                key={expense.id}
                className={cn(
                  'group relative flex items-center justify-between p-3 rounded-lg border border-border max-w-full',
                  'hover:border-primary/30 hover:bg-muted/30 hover:shadow-md transition-all duration-300',
                  isOverdue && 'border-l-4 border-l-destructive'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors truncate min-w-0">
                      {expense.description || 'Sin descripción'}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs group-hover:border-primary/50 transition-colors flex items-center gap-1 flex-shrink-0 truncate"
                    >
                      <Tag className="h-3 w-3" />
                      {getCategoryName(expense.category_id)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
                    <Badge className={cn('text-xs transition-transform group-hover:scale-105', urgency.color)}>
                      {urgency.label}
                    </Badge>
                  </div>
                </div>

                <div className="relative flex items-center gap-2 ml-4 flex-shrink-0">
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors whitespace-nowrap tabular-nums">
                    {formatCurrency(expense.amount, currency)}
                  </p>

                  {/* Botón Pagar */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePay(expense)}
                    disabled={payingId === expense.id}
                    className="px-3 text-xs min-w-[60px] flex-shrink-0"
                    aria-label={`Marcar ${expense.description} como pagado`}
                  >
                    {payingId === expense.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Pagar'
                    )}
                  </Button>

                  {/* Dropdown Posponer */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={postponingId === expense.id}
                        className="px-3 text-xs min-w-[90px] flex-shrink-0"
                        aria-label={`Posponer ${expense.description}`}
                      >
                        {postponingId === expense.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            Posponer
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handlePostpone(expense.id, 'tomorrow')}
                      >
                        Mañana
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePostpone(expense.id, '3days')}>
                        En 3 días
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePostpone(expense.id, 'week')}>
                        Próxima semana
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePostpone(expense.id, 'month')}>
                        Próximo mes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => setCustomDateExpenseId(expense.id)}
                      >
                        <CalendarIcon className="h-3 w-3 mr-2" />
                        Fecha personalizada...
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}

          {/* "Ver todos" link */}
          {expenses.length > 5 && (
            <div className="pt-2 text-center">
              <Button variant="link" size="sm" asChild>
                <Link href="/dashboard/expenses?filter=attention">
                  Ver todos ({expenses.length})
                </Link>
              </Button>
            </div>
          )}

          {/* Balance footer */}
          <div className="mt-4 pt-4 border-t space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Balance actual:</span>
              <span className="font-medium tabular-nums">{formatCurrency(currentBalance, currency)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Después de pagar todo:</span>
              <span
                className={cn(
                  'font-medium tabular-nums',
                  balanceAfterPaying >= 0
                    ? 'text-transaction-income'
                    : 'text-transaction-expense'
                )}
              >
                {formatCurrency(balanceAfterPaying, currency)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Custom Date Popover */}
      {customDateExpenseId && (
        <Popover
          open={!!customDateExpenseId}
          onOpenChange={(open) => !open && setCustomDateExpenseId(null)}
        >
          <PopoverTrigger asChild>
            <div />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date && customDateExpenseId) {
                  setSelectedDate(date);
                  const dateStr = date.toISOString().split('T')[0];
                  handlePostpone(customDateExpenseId, dateStr);
                  setCustomDateExpenseId(null);
                  setSelectedDate(undefined);
                }
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date <= today;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </Card>
  );
}
