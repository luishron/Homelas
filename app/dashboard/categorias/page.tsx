import { Button } from '@/components/ui/button';
import {
  getCategoriesByUser,
  getCategoryTotalExpenses,
  getCategoryMonthlyTrend,
  getExpensesByCategoryId
} from '@/lib/db';
import { getUser } from '@/lib/auth';
import { AddCategoryDialog } from './add-category-dialog';
import { CategoryCard } from './category-card';

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  const categories = await getCategoriesByUser(user.id);

  // Obtener el total, tendencia y transacciones recientes para cada categoría
  const categoriesWithData = await Promise.all(
    categories.map(async (category) => {
      const [total, monthlyTrend, recentExpenses] = await Promise.all([
        getCategoryTotalExpenses(user.id, category.id),
        getCategoryMonthlyTrend(user.id, category.id, 6),
        getExpensesByCategoryId(user.id, category.id, { limit: 3 })
      ]);

      return {
        ...category,
        total,
        monthlyTrend,
        recentExpenses: recentExpenses.expenses
      };
    })
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <AddCategoryDialog />
      </div>

      {categoriesWithData.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">
              No hay categorías
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Crea tu primera categoría para comenzar a organizar tus gastos.
            </p>
            <AddCategoryDialog />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoriesWithData.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
