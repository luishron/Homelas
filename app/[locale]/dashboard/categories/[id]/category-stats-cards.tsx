'use client';

import {
  DollarSign,
  Hash,
  BarChart2,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatting';

type Statistics = {
  totalSpent: number;
  expenseCount: number;
  averageExpense: number;
  paidTotal: number;
  pendingTotal: number;
  overdueTotal: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
};

export function CategoryStatsCards({ statistics }: { statistics: Statistics }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Spent */}
      <div
        className="rounded-lg border-2 bg-card p-3 sm:p-4 animate-scale-in"
        style={{ animationDelay: '0.02s' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="text-xs font-medium text-muted-foreground truncate">Total Gastado</div>
        </div>
        <div className="text-xl sm:text-2xl font-bold tabular-nums truncate">
          {formatCurrency(statistics.totalSpent)}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          En {statistics.expenseCount} {statistics.expenseCount === 1 ? 'gasto' : 'gastos'}
        </div>
      </div>

      {/* Expense Count */}
      <div
        className="rounded-lg border-2 bg-card p-3 sm:p-4 animate-scale-in"
        style={{ animationDelay: '0.04s' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="text-xs font-medium text-muted-foreground truncate">Cantidad de Gastos</div>
        </div>
        <div className="text-xl sm:text-2xl font-bold tabular-nums">{statistics.expenseCount}</div>
        <div className="text-xs text-muted-foreground truncate">Total de registros</div>
      </div>

      {/* Average Expense */}
      <div
        className="rounded-lg border-2 bg-card p-3 sm:p-4 animate-scale-in"
        style={{ animationDelay: '0.06s' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="text-xs font-medium text-muted-foreground truncate">Promedio por Gasto</div>
        </div>
        <div className="text-xl sm:text-2xl font-bold tabular-nums truncate">
          {formatCurrency(statistics.averageExpense)}
        </div>
        <div className="text-xs text-muted-foreground truncate">Gasto promedio</div>
      </div>

      {/* Paid Total */}
      <div
        className="rounded-lg border-2 border-success bg-card p-3 sm:p-4 animate-scale-in"
        style={{ animationDelay: '0.08s' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
          <div className="text-xs font-medium text-success truncate">Pagado</div>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-success tabular-nums truncate">
          {formatCurrency(statistics.paidTotal)}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {statistics.paidCount} {statistics.paidCount === 1 ? 'gasto' : 'gastos'}
        </div>
      </div>

      {/* Pending Total */}
      <div
        className="rounded-lg border-2 border-warning bg-card p-3 sm:p-4 animate-scale-in"
        style={{ animationDelay: '0.10s' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-warning flex-shrink-0" />
          <div className="text-xs font-medium text-warning truncate">Pendiente</div>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-warning tabular-nums truncate">
          {formatCurrency(statistics.pendingTotal)}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {statistics.pendingCount} {statistics.pendingCount === 1 ? 'gasto' : 'gastos'}
        </div>
      </div>

      {/* Overdue Total */}
      <div
        className="rounded-lg border-2 border-destructive bg-card p-3 sm:p-4 animate-scale-in"
        style={{ animationDelay: '0.12s' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
          <div className="text-xs font-medium text-destructive truncate">Vencido</div>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-destructive tabular-nums truncate">
          {formatCurrency(statistics.overdueTotal)}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {statistics.overdueCount} {statistics.overdueCount === 1 ? 'gasto' : 'gastos'}
        </div>
      </div>
    </div>
  );
}
