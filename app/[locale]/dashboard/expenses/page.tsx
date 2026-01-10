import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpensesTable } from './expenses-table';
import { ExpensesListWise } from './expenses-list-wise';
import { AddExpenseDialog } from './add-expense-dialog';
import { UpcomingExpensesCard } from './upcoming-expenses-card';
import {
  getCategoriesByUser,
  getExpensesByUser,
  getUpcomingRecurringExpenses,
  getPaymentMethodsByUser
} from '@/lib/db';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatting';
import { PAYMENT_STATUS } from '@/lib/constants/enums';
import { getUserCurrency } from '@/lib/utils/currency-helpers';

export const dynamic = 'force-dynamic';

export default async function GastosPage({
  searchParams
}: {
  searchParams: Promise<{ recurring?: string }>
}) {
  const user = await getUser();

  // Detectar si se debe abrir con "recurrente" checkeado
  const params = await searchParams;
  const defaultRecurring = params.recurring === 'true';

  if (!user) {
    return <div>No autenticado</div>;
  }

  // Obtener moneda del usuario y datos en paralelo
  const [
    currency,
    categories,
    paymentMethods,
    { expenses },
    upcomingExpenses
  ] = await Promise.all([
    getUserCurrency(),
    getCategoriesByUser(user.id),
    getPaymentMethodsByUser(user.id),
    getExpensesByUser(user.id, { limit: 100 }),
    getUpcomingRecurringExpenses(user.id, 3)
  ]);

  // Filtrar gastos: separar pagados de activos (vencidos + pendientes)
  const activeExpenses = expenses.filter((e) => e.payment_status !== PAYMENT_STATUS.PAID);

  // Obtener mes actual para filtrar gastos pagados
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const paidExpenses = expenses.filter((e) => {
    if (e.payment_status !== PAYMENT_STATUS.PAID) return false;
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const paidCount = paidExpenses.length;
  const paidTotal = paidExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  // Calcular estadísticas
  const stats = activeExpenses.reduce(
    (acc, expense) => {
      const amount = parseFloat(expense.amount);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
      const isOverdue = expenseDate < today && expense.payment_status !== PAYMENT_STATUS.PAID;

      acc.total += amount;

      if (isOverdue) {
        acc.overdue += amount;
        acc.overdueCount++;
      } else {
        acc.pending += amount;
        acc.pendingCount++;
      }

      return acc;
    },
    { total: 0, overdue: 0, pending: 0, overdueCount: 0, pendingCount: 0 }
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in w-full max-w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full max-w-full min-w-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Gastos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona tus gastos vencidos y pendientes
          </p>
        </div>
        <Button variant="outline" asChild className="flex-shrink-0">
          <Link href="/dashboard/expenses/pagados" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Ver Pagados</span>
            <span className="sm:hidden">Pagados</span>
            <span>({paidCount})</span>
          </Link>
        </Button>
      </div>

      {/* Cards de estadísticas */}
      {activeExpenses.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 w-full max-w-full min-w-0">
          <div className="rounded-lg border-2 border-destructive bg-card p-3 sm:p-4 animate-scale-in max-w-full min-w-0" style={{ animationDelay: '0.02s' }}>
            <div className="text-xs font-medium text-destructive">Vencidos</div>
            <div className="text-xl sm:text-2xl font-bold text-destructive tabular-nums">
              {formatCurrency(stats.overdue, currency)}
            </div>
            <div className="text-xs text-muted-foreground">{stats.overdueCount} gastos</div>
          </div>
          <div className="rounded-lg border-2 border-warning bg-card p-3 sm:p-4 animate-scale-in max-w-full min-w-0" style={{ animationDelay: '0.04s' }}>
            <div className="text-xs font-medium text-warning">Pendientes</div>
            <div className="text-xl sm:text-2xl font-bold text-warning tabular-nums">
              {formatCurrency(stats.pending, currency)}
            </div>
            <div className="text-xs text-muted-foreground">{stats.pendingCount} gastos</div>
          </div>
          <div className="rounded-lg border-2 border-success bg-card p-3 sm:p-4 animate-scale-in max-w-full min-w-0" style={{ animationDelay: '0.06s' }}>
            <div className="text-xs font-medium text-success">Pagados</div>
            <div className="text-xl sm:text-2xl font-bold text-success tabular-nums">
              {formatCurrency(paidTotal, currency)}
            </div>
            <div className="text-xs text-muted-foreground">{paidCount} gastos</div>
          </div>
        </div>
      )}

      <Tabs defaultValue="todos" className="w-full max-w-full min-w-0">
        <div className="flex flex-col gap-3 w-full max-w-full min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full max-w-full min-w-0">
            <TabsList className="flex-shrink-0">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="recurrentes">Recurrentes</TabsTrigger>
              <TabsTrigger value="unicos">Únicos</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Exportar
                </span>
              </Button>
            {categories.length === 0 ? (
              <Button size="sm" className="h-8 gap-1" asChild>
                <Link href="/categorias">
                  <span>Crear Categoría Primero</span>
                </Link>
              </Button>
            ) : paymentMethods.length === 0 ? (
              <Button size="sm" className="h-8 gap-1" asChild>
                <Link href="/metodos-pago">
                  <span>Crear Método de Pago Primero</span>
                </Link>
              </Button>
            ) : (
              <AddExpenseDialog
                categories={categories}
                paymentMethods={paymentMethods}
                defaultRecurring={defaultRecurring}
              />
            )}
          </div>
        </div>
      </div>

      <TabsContent value="todos" className="mt-4">
          <ExpensesListWise
            expenses={activeExpenses}
            categories={categories}
            paymentMethods={paymentMethods}
          />
        </TabsContent>

        <TabsContent value="recurrentes" className="mt-4 space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Gastos Recurrentes</h3>
            <p className="text-sm text-muted-foreground">
              Gastos que se repiten periódicamente como agua, luz, internet, renta, etc.
            </p>
          </div>

          <UpcomingExpensesCard
            upcomingExpenses={upcomingExpenses}
            categories={categories}
            currency={currency}
          />

          <ExpensesTable
            expenses={activeExpenses.filter((e) => e.is_recurring === 1)}
            totalExpenses={activeExpenses.filter((e) => e.is_recurring === 1).length}
            categories={categories}
            paymentMethods={paymentMethods}
          />
        </TabsContent>

        <TabsContent value="unicos" className="mt-4">
          <div className="rounded-lg border bg-card p-6 mb-4">
            <h3 className="font-semibold mb-2">Gastos Únicos</h3>
            <p className="text-sm text-muted-foreground">
              Gastos que ocurren una sola vez.
            </p>
          </div>
          <ExpensesTable
            expenses={activeExpenses.filter((e) => e.is_recurring === 0)}
            totalExpenses={activeExpenses.filter((e) => e.is_recurring === 0).length}
            categories={categories}
            paymentMethods={paymentMethods}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
