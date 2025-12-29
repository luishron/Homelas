import { notFound } from 'next/navigation';
import { getUser } from '@/lib/auth';
import {
  getCategoryById,
  getExpensesByCategoryId,
  getCategoryStatistics,
  getCategoryMonthlyTrend,
  getCategoriesByUser,
  getPaymentMethodsByUser
} from '@/lib/db';
import { getCategoryBudgetStatus } from '@/lib/category-limits-supabase';
import { CategoryHeader } from './category-header';
import { CategoryStatsCards } from './category-stats-cards';
import { CategoryTrendChart } from './category-trend-chart';
import { ExpensesTable } from '../../gastos/expenses-table';
import { AddExpenseDialog } from '../../gastos/add-expense-dialog';
import { EditCategoryDialog } from '../edit-category-dialog';
import { BudgetLimitDialog } from './budget-limit-dialog';
import { BudgetStatusCard } from './budget-status-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function CategoryDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id);
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  // Fetch all data in parallel
  const [category, expenses, statistics, monthlyTrend, allCategories, paymentMethods] =
    await Promise.all([
      getCategoryById(user.id, categoryId),
      getExpensesByCategoryId(user.id, categoryId),
      getCategoryStatistics(user.id, categoryId),
      getCategoryMonthlyTrend(user.id, categoryId, 6),
      getCategoriesByUser(user.id),
      getPaymentMethodsByUser(user.id)
    ]);

  // Fetch budget status separately with error handling
  let budgetStatus = null;
  try {
    budgetStatus = await getCategoryBudgetStatus(categoryId, user.id);
  } catch (error) {
    console.error('Error fetching budget status:', error);
    // Continue without budget status if it fails
  }

  // Handle 404
  if (!category) {
    notFound();
  }

  // Extraer configuración de límite del metadata
  const categoryMetadata = category.metadata as any;
  const limiteConfig = categoryMetadata?.limitesMensuales;

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <CategoryHeader category={category} />

      {/* Mostrar estado del presupuesto si hay límite configurado */}
      {budgetStatus && (
        <BudgetStatusCard status={budgetStatus} />
      )}

      <CategoryStatsCards statistics={statistics} />

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryTrendChart data={monthlyTrend} category={category} />

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {allCategories.length > 0 && paymentMethods.length > 0 && (
              <AddExpenseDialog
                categories={allCategories}
                paymentMethods={paymentMethods}
                defaultCategoryId={categoryId}
                lockCategory={true}
              />
            )}
            <EditCategoryDialog category={category} />
            <BudgetLimitDialog
              categoryId={categoryId}
              currentLimit={limiteConfig?.limite}
              currentAlert={limiteConfig?.alertaEn}
              isActive={limiteConfig?.activo}
            />
          </CardContent>
        </Card>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No hay gastos en esta categoría
            </p>
            {allCategories.length > 0 && paymentMethods.length > 0 && (
              <AddExpenseDialog
                categories={allCategories}
                paymentMethods={paymentMethods}
                defaultCategoryId={categoryId}
                lockCategory={true}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <ExpensesTable
          expenses={expenses}
          totalExpenses={expenses.length}
          categories={allCategories}
          paymentMethods={paymentMethods}
        />
      )}
    </div>
  );
}
