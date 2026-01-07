import { getUser } from '@/lib/auth';
import { getExpensesByUser, getCategoriesByUser, getPaymentMethodsByUser } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ExpensesTable } from '../expenses-table';

export default async function RecurringExpensesPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  // Obtener solo gastos recurrentes
  const { expenses } = await getExpensesByUser(user.id, { isRecurring: true });
  const categories = await getCategoriesByUser(user.id);
  const paymentMethods = await getPaymentMethodsByUser(user.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gastos Recurrentes</h1>
          <p className="text-muted-foreground mt-2">
            Plantillas de gastos automáticos que se repiten cada periodo
          </p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-10 w-10 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">No hay gastos recurrentes</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-md">
            Los gastos recurrentes son plantillas que se repiten automáticamente (mensualidades, suscripciones, etc.).
            Crea un gasto y marca la opción "Recurrente" para verlo aquí.
          </p>
        </div>
      ) : (
        <ExpensesTable
          expenses={expenses}
          categories={categories}
          paymentMethods={paymentMethods}
          totalExpenses={expenses.length}
        />
      )}
    </div>
  );
}
