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
    const colorClass = isPositive ? 'text-success' : 'text-destructive';

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
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Gastos del Mes
          </h3>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(currentMonth.totalExpenses)}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {currentMonth.expensesCount} gastos
          </p>
          <TrendIndicator change={expensesChange} />
        </div>
      </div>

      {/* Total Ingresos del Mes */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Ingresos del Mes
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleHideIncome}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 -m-2"
              aria-label={hideIncome ? 'Mostrar ingresos' : 'Ocultar ingresos'}
            >
              {hideIncome ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-success">
          {hideIncome ? '••••••' : formatCurrency(currentMonth.totalIncome)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {currentMonth.incomesCount} ingresos
          </p>
          {!hideIncome && <TrendIndicator change={incomesChange} />}
        </div>
      </div>

      {/* Balance del Mes */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Balance del Mes
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleHideBalance}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 -m-2"
              aria-label={hideBalance ? 'Mostrar balance' : 'Ocultar balance'}
            >
              {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <p className={`text-2xl sm:text-3xl font-bold ${
          currentMonth.balance >= 0 ? 'text-success' : 'text-destructive'
        }`}>
          {hideBalance ? '••••••' : formatCurrency(currentMonth.balance)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {currentMonth.balance >= 0 ? 'Superávit' : 'Déficit'}
          </p>
          {!hideBalance && <TrendIndicator change={balanceChange} />}
        </div>
      </div>

      {/* Gastos Vencidos */}
      <div className={`rounded-lg bg-card p-4 sm:p-6 ${
        overdueExpenses.count > 0
          ? 'border-2 border-destructive'
          : 'border'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-medium ${
            overdueExpenses.count > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            Gastos Vencidos
          </h3>
          <AlertTriangle className={`h-4 w-4 ${
            overdueExpenses.count > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`} />
        </div>
        <p className={`text-2xl sm:text-3xl font-bold ${
          overdueExpenses.count > 0 ? 'text-destructive' : 'text-muted-foreground'
        }`}>
          {overdueExpenses.count > 0 ? formatCurrency(overdueExpenses.total) : '$0.00'}
        </p>
        <div className="mt-2">
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
