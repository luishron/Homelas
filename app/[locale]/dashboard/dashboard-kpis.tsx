'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Wallet, Eye, EyeOff } from 'lucide-react';
import type { MonthlySummary, OverdueExpensesSummary } from '@/lib/db';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/lib/utils/formatting';
import type { CurrencyCode } from '@/lib/config/currencies';

interface DashboardKPIsProps {
  currentMonth: MonthlySummary;
  previousMonth: MonthlySummary | null;
  overdueExpenses: OverdueExpensesSummary;
  currency: CurrencyCode;
}

export function DashboardKPIs({ currentMonth, previousMonth, overdueExpenses, currency }: DashboardKPIsProps) {
  const t = useTranslations('pages.dashboard');
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
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-full min-w-0">
      {/* Total Gastos del Mes */}
      <div className="rounded-lg border bg-card p-6 shadow-sm max-w-full min-w-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t('kpis.monthlyExpenses.label')}
          </h3>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight tabular-nums">{formatCurrency(currentMonth.totalExpenses, currency)}</p>
          <p className="text-xs text-muted-foreground">
            {currentMonth.expensesCount} {currentMonth.expensesCount === 1 ? t('pluralization.expense.singular') : t('pluralization.expense.plural')}
          </p>
        </div>
        {expensesChange !== null && (
          <div className="mt-3">
            <TrendIndicator change={expensesChange} />
          </div>
        )}
      </div>

      {/* Total Ingresos del Mes */}
      <div className="rounded-lg border bg-card p-6 shadow-sm max-w-full min-w-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t('kpis.monthlyIncome.label')}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleHideIncome}
              className="text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-muted"
              aria-label={hideIncome ? t('kpis.monthlyIncome.show') : t('kpis.monthlyIncome.hide')}
            >
              {hideIncome ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight tabular-nums text-green-600">
            {hideIncome ? '••••••' : formatCurrency(currentMonth.totalIncome, currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentMonth.incomesCount} {currentMonth.incomesCount === 1 ? t('pluralization.income.singular') : t('pluralization.income.plural')}
          </p>
        </div>
        {!hideIncome && incomesChange !== null && (
          <div className="mt-3">
            <TrendIndicator change={incomesChange} />
          </div>
        )}
      </div>

      {/* Balance del Mes */}
      <div className="rounded-lg border bg-card p-6 shadow-sm max-w-full min-w-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t('kpis.monthlyBalance.label')}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleHideBalance}
              className="text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-muted"
              aria-label={hideBalance ? t('kpis.monthlyBalance.show') : t('kpis.monthlyBalance.hide')}
            >
              {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1">
          <p className={`text-2xl font-bold tracking-tight tabular-nums ${
            currentMonth.balance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {hideBalance ? '••••••' : formatCurrency(currentMonth.balance, currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentMonth.balance >= 0 ? t('kpis.monthlyBalance.surplus') : t('kpis.monthlyBalance.deficit')}
          </p>
        </div>
        {!hideBalance && balanceChange !== null && (
          <div className="mt-3">
            <TrendIndicator change={balanceChange} />
          </div>
        )}
      </div>

      {/* Gastos Vencidos */}
      <div className={`rounded-lg border bg-card p-6 shadow-sm transition-colors max-w-full min-w-0 ${
        overdueExpenses.count > 0 ? 'border-destructive/20 bg-destructive/[0.02]' : ''
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-medium ${
            overdueExpenses.count > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {t('kpis.overdueExpenses.label')}
          </h3>
          <AlertTriangle className={`h-4 w-4 ${
            overdueExpenses.count > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`} />
        </div>
        <div className="space-y-1">
          <p className={`text-2xl font-bold tracking-tight tabular-nums ${
            overdueExpenses.count > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {overdueExpenses.count > 0 ? formatCurrency(overdueExpenses.total, currency) : formatCurrency(0, currency)}
          </p>
          <p className={`text-xs ${
            overdueExpenses.count > 0 ? 'text-destructive/80' : 'text-muted-foreground'
          }`}>
            {overdueExpenses.count} {overdueExpenses.count === 1 ? t('kpis.overdueExpenses.singular') : t('kpis.overdueExpenses.plural')}
          </p>
        </div>
      </div>
    </div>
  );
}
