'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Wallet, Eye, EyeOff } from 'lucide-react';
import type { MonthlySummary, OverdueExpensesSummary } from '@/lib/db';

interface DashboardKPIsProps {
  currentMonth: MonthlySummary;
  previousMonth: MonthlySummary | null;
  overdueExpenses: OverdueExpensesSummary;
}

export function DashboardKPIs({ currentMonth, previousMonth, overdueExpenses }: DashboardKPIsProps) {
  const [hideIncome, setHideIncome] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  // Cargar preferencias desde localStorage al montar el componente
  useEffect(() => {
    const savedHideIncome = localStorage.getItem('hideIncome');
    const savedHideBalance = localStorage.getItem('hideBalance');

    if (savedHideIncome !== null) {
      setHideIncome(savedHideIncome === 'true');
    }
    if (savedHideBalance !== null) {
      setHideBalance(savedHideBalance === 'true');
    }
  }, []);

  // Guardar preferencias en localStorage cuando cambien
  const toggleHideIncome = () => {
    const newValue = !hideIncome;
    setHideIncome(newValue);
    localStorage.setItem('hideIncome', String(newValue));
  };

  const toggleHideBalance = () => {
    const newValue = !hideBalance;
    setHideBalance(newValue);
    localStorage.setItem('hideBalance', String(newValue));
  };
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
    const colorClass = isPositive ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10';

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Gastos del Mes */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Gastos del Mes
          </h3>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight">{formatCurrency(currentMonth.totalExpenses)}</p>
          <p className="text-xs text-muted-foreground">
            {currentMonth.expensesCount} {currentMonth.expensesCount === 1 ? 'gasto' : 'gastos'}
          </p>
        </div>
        {expensesChange !== null && (
          <div className="mt-3">
            <TrendIndicator change={expensesChange} />
          </div>
        )}
      </div>

      {/* Total Ingresos del Mes */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Ingresos del Mes
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleHideIncome}
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
              aria-label={hideIncome ? 'Mostrar ingresos' : 'Ocultar ingresos'}
            >
              {hideIncome ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight text-green-600">
            {hideIncome ? '••••••' : formatCurrency(currentMonth.totalIncome)}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentMonth.incomesCount} {currentMonth.incomesCount === 1 ? 'ingreso' : 'ingresos'}
          </p>
        </div>
        {!hideIncome && incomesChange !== null && (
          <div className="mt-3">
            <TrendIndicator change={incomesChange} />
          </div>
        )}
      </div>

      {/* Balance del Mes */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Balance del Mes
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleHideBalance}
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
              aria-label={hideBalance ? 'Mostrar balance' : 'Ocultar balance'}
            >
              {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1">
          <p className={`text-2xl font-bold tracking-tight ${
            currentMonth.balance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {hideBalance ? '••••••' : formatCurrency(currentMonth.balance)}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentMonth.balance >= 0 ? 'Superávit' : 'Déficit'}
          </p>
        </div>
        {!hideBalance && balanceChange !== null && (
          <div className="mt-3">
            <TrendIndicator change={balanceChange} />
          </div>
        )}
      </div>

      {/* Gastos Vencidos */}
      <div className={`rounded-lg border bg-card p-6 shadow-sm transition-colors ${
        overdueExpenses.count > 0 ? 'border-destructive/20 bg-destructive/[0.02]' : ''
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-medium ${
            overdueExpenses.count > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            Gastos Vencidos
          </h3>
          <AlertTriangle className={`h-4 w-4 ${
            overdueExpenses.count > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`} />
        </div>
        <div className="space-y-1">
          <p className={`text-2xl font-bold tracking-tight ${
            overdueExpenses.count > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {overdueExpenses.count > 0 ? formatCurrency(overdueExpenses.total) : '$0.00'}
          </p>
          <p className={`text-xs ${
            overdueExpenses.count > 0 ? 'text-destructive/80' : 'text-muted-foreground'
          }`}>
            {overdueExpenses.count} {overdueExpenses.count === 1 ? 'gasto vencido' : 'gastos vencidos'}
          </p>
        </div>
      </div>
    </div>
  );
}
