import {
  getCategoriesByUser,
  getCategoryTotalExpenses,
  getCategoryMonthlyTrend,
  getExpensesByCategoryId
} from '@/lib/db';
import { getUser } from '@/lib/auth';
import { CategoryGridClient } from './category-grid-client';

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  const categories = await getCategoriesByUser(user.id);

  // Obtener stats completas para cada categoría
  const categoriesWithData = await Promise.all(
    categories.map(async (category) => {
      const [total, monthlyTrend, allExpenses] = await Promise.all([
        getCategoryTotalExpenses(user.id, category.id),
        getCategoryMonthlyTrend(user.id, category.id, 6),
        getExpensesByCategoryId(user.id, category.id)
      ]);

      // Calcular stats adicionales
      const thisMonth = monthlyTrend[monthlyTrend.length - 1];
      const lastMonth = monthlyTrend[monthlyTrend.length - 2];

      const monthlyAverage =
        monthlyTrend.length > 0
          ? monthlyTrend.reduce((sum, m) => sum + m.total, 0) /
            monthlyTrend.length
          : 0;

      const trendPercent =
        lastMonth && lastMonth.total > 0
          ? ((thisMonth.total - lastMonth.total) / lastMonth.total) * 100
          : null;

      const lastExpense = allExpenses[0]; // Ya ordenados por fecha DESC

      return {
        ...category,
        total,
        monthlyTrend,
        monthlyAverage,
        trendPercent,
        lastExpenseDate: lastExpense?.date || null,
        budget: null, // TODO: Implement budget fetching when budget system is ready
        recentExpenses: allExpenses.slice(0, 3).map((expense) => ({
          id: expense.id,
          description: expense.description || null,
          amount: expense.amount,
          date: expense.date
        }))
      };
    })
  );

  return <CategoryGridClient categories={categoriesWithData} />;
}
