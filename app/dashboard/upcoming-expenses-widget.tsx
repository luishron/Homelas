'use client';

import { Clock, CheckCircle2 } from 'lucide-react';
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
import type { Expense, Category } from '@/lib/db';

interface UpcomingExpensesWidgetProps {
  expenses: Expense[];
  categories: Category[];
}

export function UpcomingExpensesWidget({ expenses, categories }: UpcomingExpensesWidgetProps) {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    // Parsear la fecha como local sin conversión de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? `${category.icon || ''} ${category.name}`.trim() : 'Sin categoría';
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expenseDate = new Date(dateString);
    expenseDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((expenseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) return 'Hoy';
    if (daysDiff === 1) return 'Mañana';
    if (daysDiff <= 7) return `En ${daysDiff} días`;
    return `${Math.ceil(daysDiff / 7)} semanas`;
  };

  const getUrgencyColor = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expenseDate = new Date(dateString);
    expenseDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((expenseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Usar colores alineados con la marca OLEA
    if (daysDiff === 0) return 'bg-orange-500 hover:bg-orange-600 text-white';
    if (daysDiff === 1) return 'bg-orange-400 hover:bg-orange-500 text-white';
    if (daysDiff <= 3) return 'bg-yellow-500/80 hover:bg-yellow-600 text-white';
    // Verde de marca muy sutil para baja urgencia
    return 'bg-primary/10 hover:bg-primary/15 text-primary-foreground border border-primary/20';
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximos Gastos a Vencer
          </CardTitle>
          <CardDescription>
            Gastos pendientes ordenados por fecha de vencimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
            <p className="text-lg font-medium text-muted-foreground">
              ¡No hay gastos pendientes!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Todos tus gastos están al día
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximos Gastos a Vencer
            </CardTitle>
            <CardDescription>
              {expenses.length} {expenses.length === 1 ? 'gasto pendiente' : 'gastos pendientes'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/gastos">Ver todos</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.slice(0, 7).map((expense, index) => {
            const urgency = getUrgencyColor(expense.date);
            const isUrgent = urgency.includes('orange') || urgency.includes('red');

            return (
              <div
                key={expense.id}
                className={`group relative flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 hover:shadow-md transition-all duration-300 ${
                  isUrgent ? 'border-l-4 border-l-orange-400' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {expense.description || 'Sin descripción'}
                    </p>
                    <Badge variant="outline" className="text-xs group-hover:border-primary/50 transition-colors">
                      {getCategoryName(expense.category_id)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(expense.date)}
                    </p>
                    <Badge className={`text-xs ${urgency} transition-transform group-hover:scale-105`}>
                      {getDaysUntil(expense.date)}
                    </Badge>
                  </div>
                </div>
                <div className="relative text-right ml-4">
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              </div>
            );
          })}

          {expenses.length > 7 && (
            <div className="pt-2 text-center">
              <Button variant="link" size="sm" asChild>
                <Link href="/dashboard/gastos">
                  Ver {expenses.length - 7} más
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
