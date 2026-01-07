import { getUser } from '@/lib/auth';
import { getIncomesByUser, getIncomeCategoriesByUser } from '@/lib/db';
import { redirect } from 'next/navigation';
import { IncomesList } from '../incomes-list';
import { AddIncomeDialog } from '../add-income-dialog';

export default async function RecurringIncomesPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  // Obtener solo ingresos recurrentes
  const allIncomes = await getIncomesByUser(user.id);
  const recurringIncomes = allIncomes.filter((income) => income.is_recurring === 1);
  const incomeCategories = await getIncomeCategoriesByUser(user.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ingresos Recurrentes</h1>
          <p className="text-muted-foreground mt-2">
            Plantillas de ingresos automáticos (salarios, rentas, etc.)
          </p>
        </div>
        <AddIncomeDialog categories={incomeCategories} />
      </div>

      {recurringIncomes.length === 0 ? (
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
          <h3 className="mt-4 text-lg font-semibold">No hay ingresos recurrentes</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-md">
            Los ingresos recurrentes son plantillas que se repiten automáticamente (salario mensual, rentas, etc.).
            Crea un ingreso y marca la opción "Recurrente" para verlo aquí.
          </p>
        </div>
      ) : (
        <IncomesList
          incomes={recurringIncomes}
          categories={incomeCategories}
        />
      )}
    </div>
  );
}
