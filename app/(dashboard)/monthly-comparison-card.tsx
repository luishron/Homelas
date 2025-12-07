import { Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { MonthlySummary } from '@/lib/db';

interface MonthlyComparisonCardProps {
  previousMonth: MonthlySummary | null;
  currentMonth: MonthlySummary;
  nextMonthProjection: { total: number; count: number };
}

export function MonthlyComparisonCard({
  previousMonth,
  currentMonth,
  nextMonthProjection
}: MonthlyComparisonCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1];
  };

  const hasPreviousData = previousMonth && previousMonth.expensesCount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Comparativa Mensual
        </CardTitle>
        <CardDescription>
          Resumen de gastos por mes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mes Anterior */}
          <div className={`rounded-lg border p-4 ${
            !hasPreviousData ? 'bg-muted/30' : 'bg-card'
          }`}>
            <div className="text-sm font-medium text-muted-foreground mb-2">
              {previousMonth
                ? `${getMonthName(previousMonth.month)} ${previousMonth.year}`
                : 'Mes Anterior'}
            </div>
            {hasPreviousData ? (
              <>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(previousMonth.totalExpenses)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {previousMonth.expensesCount} gastos
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Ingresos:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(previousMonth.totalIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className={`font-medium ${
                      previousMonth.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(previousMonth.balance)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground py-4">
                Sin datos del mes anterior
              </div>
            )}
          </div>

          {/* Mes Actual */}
          <div className="rounded-lg border p-4 bg-primary/5 border-primary/20">
            <div className="text-sm font-medium text-primary mb-2">
              {`${getMonthName(currentMonth.month)} ${currentMonth.year}`}
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                Actual
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatCurrency(currentMonth.totalExpenses)}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentMonth.expensesCount} gastos
            </div>
            <div className="mt-3 pt-3 border-t border-primary/20">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Ingresos:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(currentMonth.totalIncome)}
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Balance:</span>
                <span className={`font-medium ${
                  currentMonth.balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(currentMonth.balance)}
                </span>
              </div>
            </div>
          </div>

          {/* Próximo Mes (Proyección) */}
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 bg-muted/20">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Próximo Mes
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">
                Proyección
              </span>
            </div>
            {nextMonthProjection.count > 0 ? (
              <>
                <div className="text-2xl font-bold mb-1 text-muted-foreground">
                  {formatCurrency(nextMonthProjection.total)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {nextMonthProjection.count} gastos recurrentes
                </div>
                <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                  <p className="text-xs text-muted-foreground">
                    Estimado basado en gastos recurrentes activos
                  </p>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground py-4">
                Sin gastos recurrentes configurados
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
