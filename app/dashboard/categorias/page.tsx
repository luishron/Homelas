import { getCategoriesWithStats } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { AddCategoryDialog } from './add-category-dialog';
import { CategoriesGrid } from './categories-grid';

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  const categories = await getCategoriesWithStats(user.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <AddCategoryDialog />
      </div>

      <CategoriesGrid categories={categories} />
    </div>
  );
}
