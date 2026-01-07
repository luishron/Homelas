import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { getIncomesByUser, getIncomeCategoriesByUser } from '@/lib/db';
import Link from 'next/link';
import { AddIncomeDialog } from './add-income-dialog';
import { IncomesList } from './incomes-list';

export const dynamic = 'force-dynamic';

export default async function IngresosPage() {
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  // Obtener categorías de ingresos
  const categories = await getIncomeCategoriesByUser(user.id);

  // Obtener ingresos del usuario
  const incomes = await getIncomesByUser(user.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ingresos</h1>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="recurrentes">Recurrentes</TabsTrigger>
            <TabsTrigger value="unicos">Únicos</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {categories.length === 0 ? (
              <Link href="/dashboard/income/categories">
                <Button size="sm" className="h-8 gap-1">
                  <span>Crear Categoría Primero</span>
                </Button>
              </Link>
            ) : (
              <AddIncomeDialog
                categories={categories}
                trigger={
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Agregar Ingreso
                    </span>
                  </Button>
                }
              />
            )}
          </div>
        </div>

        <TabsContent value="todos" className="mt-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Todos los Ingresos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {incomes.length} {incomes.length === 1 ? 'ingreso registrado' : 'ingresos registrados'}
            </p>
            {incomes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay ingresos registrados</p>
                {categories.length === 0 ? (
                  <Link href="/dashboard/income/categories">
                    <Button className="mt-4" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear Categoría Primero
                    </Button>
                  </Link>
                ) : (
                  <AddIncomeDialog
                    categories={categories}
                    trigger={
                      <Button className="mt-4" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar Primer Ingreso
                      </Button>
                    }
                  />
                )}
              </div>
            ) : (
              <IncomesList incomes={incomes} categories={categories} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="recurrentes" className="mt-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Ingresos Recurrentes</h3>
            <p className="text-sm text-muted-foreground">
              Ingresos que se repiten periódicamente como salarios, rentas, etc.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="unicos" className="mt-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Ingresos Únicos</h3>
            <p className="text-sm text-muted-foreground">
              Ingresos que ocurren una sola vez.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
