import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpensesTable } from './expenses-table';
import { AddExpenseDialog } from './add-expense-dialog';
import { UpcomingExpensesCard } from './upcoming-expenses-card';
import {
  getCategoriesByUser,
  getExpensesByUser,
  getUpcomingRecurringExpenses
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

  // Obtener gastos del usuario
  const { expenses, totalExpenses } = await getExpensesByUser(user.id, {
    limit: 100
  });

  // Obtener próximos gastos recurrentes (virtuales)
  const upcomingExpenses = await getUpcomingRecurringExpenses(user.id, 3);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gastos</h1>
      </div>

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
            ) : (
              <AddExpenseDialog categories={categories} />
            )}
          </div>
        </div>

        <TabsContent value="todos" className="mt-4">
          <ExpensesTable
            expenses={expenses}
            totalExpenses={totalExpenses}
            categories={categories}
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
            expenses={expenses.filter((e) => e.is_recurring === 1)}
            totalExpenses={expenses.filter((e) => e.is_recurring === 1).length}
            categories={categories}
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
            expenses={expenses.filter((e) => e.is_recurring === 0)}
            totalExpenses={expenses.filter((e) => e.is_recurring === 0).length}
            categories={categories}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
