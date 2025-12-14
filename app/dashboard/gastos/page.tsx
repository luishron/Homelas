import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpensesTable } from './expenses-table';
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

export const dynamic = 'force-dynamic';

export default async function GastosPage() {
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  // Obtener categorías del usuario
  const categories = await getCategoriesByUser(user.id);

  // Obtener métodos de pago del usuario
  const paymentMethods = await getPaymentMethodsByUser(user.id);

  // Obtener gastos del usuario
  const { expenses } = await getExpensesByUser(user.id, {
    limit: 100
  });

  // Obtener próximos gastos recurrentes (virtuales)
  const upcomingExpenses = await getUpcomingRecurringExpenses(user.id, 3);

  // Filtrar gastos: separar pagados de activos (vencidos + pendientes)
  const activeExpenses = expenses.filter((e) => e.payment_status !== 'pagado');
  const paidCount = expenses.filter((e) => e.payment_status === 'pagado').length;

  // Calcular estadísticas
  const stats = activeExpenses.reduce(
    (acc, expense) => {
      const amount = parseFloat(expense.amount);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
      const isOverdue = expenseDate < today && expense.payment_status !== 'pagado';

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gastos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona tus gastos vencidos y pendientes
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/gastos/pagados" className="gap-2">
            <History className="h-4 w-4" />
            <span>Ver Pagados ({paidCount})</span>
          </Link>
        </Button>
      </div>

      {/* Cards de estadísticas */}
      {activeExpenses.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="text-xs font-medium text-red-600">Vencidos</div>
            <div className="text-2xl font-bold text-red-700">
              {formatCurrency(stats.overdue)}
            </div>
            <div className="text-xs text-red-600">{stats.overdueCount} gastos</div>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="text-xs font-medium text-yellow-600">Pendientes</div>
            <div className="text-2xl font-bold text-yellow-700">
              {formatCurrency(stats.pending)}
            </div>
            <div className="text-xs text-yellow-600">{stats.pendingCount} gastos</div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="text-xs font-medium text-green-600">Pagados</div>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(0)}
            </div>
            <div className="text-xs text-green-600">{paidCount} gastos</div>
          </div>
        </div>
      )}

      <Tabs defaultValue="todos" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="recurrentes">Recurrentes</TabsTrigger>
            <TabsTrigger value="unicos">Únicos</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
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
              />
            )}
          </div>
        </div>

        <TabsContent value="todos" className="mt-4">
          <ExpensesTable
            expenses={activeExpenses}
            totalExpenses={activeExpenses.length}
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
