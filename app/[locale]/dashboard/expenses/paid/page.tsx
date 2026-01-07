import { Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpensesTable } from '../expenses-table';
import {
  getCategoriesByUser,
  getExpensesByUser,
  getPaymentMethodsByUser
} from '@/lib/db';
import { getUser } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PagadosPage() {
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  // Obtener categorías del usuario
  const categories = await getCategoriesByUser(user.id);

  // Obtener métodos de pago del usuario
  const paymentMethods = await getPaymentMethodsByUser(user.id);

  // Obtener SOLO gastos pagados del mes actual
  const { expenses, totalExpenses } = await getExpensesByUser(user.id, {
    limit: 500
  });

  // Filtrar solo gastos pagados del mes actual
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const paidExpenses = expenses.filter((e) => {
    if (e.payment_status !== 'pagado') return false;
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/expenses">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Gastos Pagados</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gastos pagados del mes actual
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <Download className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Exportar
          </span>
        </Button>
      </div>

      <ExpensesTable
        expenses={paidExpenses}
        totalExpenses={paidExpenses.length}
        categories={categories}
        paymentMethods={paymentMethods}
        showEditOnly={true}
      />
    </div>
  );
}
