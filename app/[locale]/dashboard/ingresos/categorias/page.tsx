import { Button } from '@/components/ui/button';
import { getIncomeCategoriesByUser } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { AddIncomeCategoryDialog } from './add-income-category-dialog';
import { IncomeCategoryCard } from './income-category-card';

export const dynamic = 'force-dynamic';

export default async function IncomeCategoriesPage() {
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  const categories = await getIncomeCategoriesByUser(user.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorías de Ingresos</h1>
          <p className="text-muted-foreground mt-1">
            Organiza tus ingresos por categorías
          </p>
        </div>
        <AddIncomeCategoryDialog />
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">
              No hay categorías de ingresos
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Crea tu primera categoría para comenzar a organizar tus ingresos.
            </p>
            <AddIncomeCategoryDialog />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <IncomeCategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
