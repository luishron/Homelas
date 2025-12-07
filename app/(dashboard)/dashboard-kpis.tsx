import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Wallet } from 'lucide-react';
import type { MonthlySummary, OverdueExpensesSummary } from '@/lib/db';

interface DashboardKPIsProps {
  currentMonth: MonthlySummary;
  previousMonth: MonthlySummary | null;
  overdueExpenses: OverdueExpensesSummary;
}

export function DashboardKPIs({ currentMonth, previousMonth, overdueExpenses }: DashboardKPIsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const calculateChange = (current: number, previous: number | null) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const expensesChange = calculateChange(
    currentMonth.totalExpenses,
    previousMonth?.totalExpenses || null
  );

  const incomesChange = calculateChange(
    currentMonth.totalIncome,
    previousMonth?.totalIncome || null
  );

  const balanceChange = calculateChange(
    currentMonth.balance,
    previousMonth?.balance || null
  );

  const TrendIndicator = ({ change }: { change: number | null }) => {
    if (change === null) return null;

    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Gastos del Mes */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Gastos del Mes
          </h3>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-3xl font-bold">{formatCurrency(currentMonth.totalExpenses)}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {currentMonth.expensesCount} gastos
          </p>
          <TrendIndicator change={expensesChange} />
        </div>
      </div>

      {/* Total Ingresos del Mes */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Ingresos del Mes
          </h3>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-3xl font-bold text-green-600">
          {formatCurrency(currentMonth.totalIncome)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {currentMonth.incomesCount} ingresos
          </p>
          <TrendIndicator change={incomesChange} />
        </div>
      </div>

      {/* Balance del Mes */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Balance del Mes
          </h3>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className={`text-3xl font-bold ${
          currentMonth.balance >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatCurrency(currentMonth.balance)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {currentMonth.balance >= 0 ? 'Superávit' : 'Déficit'}
          </p>
          <TrendIndicator change={balanceChange} />
        </div>
      </div>

      {/* Gastos Vencidos */}
      <div className={`rounded-lg border p-6 ${
        overdueExpenses.count > 0
          ? 'bg-red-50 border-red-200'
          : 'bg-card'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-medium ${
            overdueExpenses.count > 0 ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            Gastos Vencidos
          </h3>
          <AlertTriangle className={`h-4 w-4 ${
            overdueExpenses.count > 0 ? 'text-red-600' : 'text-muted-foreground'
          }`} />
        </div>
        <p className={`text-3xl font-bold ${
          overdueExpenses.count > 0 ? 'text-red-600' : 'text-muted-foreground'
        }`}>
          {overdueExpenses.count > 0 ? formatCurrency(overdueExpenses.total) : '$0.00'}
        </p>
        <div className="mt-2">
          <p className={`text-xs ${
            overdueExpenses.count > 0 ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {overdueExpenses.count} {overdueExpenses.count === 1 ? 'gasto vencido' : 'gastos vencidos'}
          </p>
        </div>
      </div>
    </div>
  );
}
