import Link from 'next/link';
import { PlusCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/auth';
import {
  getMonthlySummary,
  getOverdueExpenses,
  getUpcomingDueExpenses,
  getTopCategoriesByMonth,
  getNextMonthProjection,
  getCategoriesByUser
} from '@/lib/db';
import { DashboardKPIs } from './dashboard-kpis';
import { MonthlyComparisonCard } from './monthly-comparison-card';
import { UpcomingExpensesWidget } from './upcoming-expenses-widget';
import { TopCategoriesChart } from './top-categories-chart';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">No autenticado</p>
        <Button className="mt-4" asChild>
          <Link href="/login">Iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  // Obtener fecha actual
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // Obtener todos los datos en paralelo
  const [
    currentMonthSummary,
    previousMonthSummary,
    overdueExpenses,
    upcomingExpenses,
    topCategories,
    nextMonthProjection,
    categories
  ] = await Promise.all([
    getMonthlySummary(user.id, currentYear, currentMonth),
    getMonthlySummary(user.id, previousYear, previousMonth),
    getOverdueExpenses(user.id),
    getUpcomingDueExpenses(user.id, 10),
    getTopCategoriesByMonth(user.id, currentYear, currentMonth, 5),
    getNextMonthProjection(user.id),
    getCategoriesByUser(user.id)
  ]);

  const getMonthName = (month: number) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1];
  };

  // Verificar si es el primer uso (sin datos)
  const isFirstTime = currentMonthSummary.expensesCount === 0 &&
                      previousMonthSummary.expensesCount === 0;

  if (isFirstTime) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenido a tu control de gastos
            </p>
          </div>
        </div>

        {/* Estado vacío con CTAs */}
        <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: '0.03s' }}>
          <div className="rounded-lg border bg-card p-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Comienza registrando gastos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Agrega tus primeros gastos para comenzar a visualizar tus finanzas
              </p>
              <Button asChild>
                <Link href="/dashboard/gastos">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Primer Gasto
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Registra tus ingresos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Lleva un control completo agregando también tus ingresos
              </p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/ingresos">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Agregar Ingresos
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Guía rápida */}
        <div className="rounded-lg border bg-muted/50 p-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <h3 className="font-semibold mb-3">Pasos para comenzar:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              <span>Crea categorías para organizar tus gastos (ej: Comida, Transporte, Vivienda)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              <span>Configura tus métodos de pago (tarjetas, efectivo, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">3.</span>
              <span>Registra tus gastos e ingresos diarios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">4.</span>
              <span>Visualiza tu resumen financiero y toma mejores decisiones</span>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Resumen de {getMonthName(currentMonth)} {currentYear}
          </p>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.03s' }}>
        <DashboardKPIs
          currentMonth={currentMonthSummary}
          previousMonth={previousMonthSummary.expensesCount > 0 ? previousMonthSummary : null}
          overdueExpenses={overdueExpenses}
        />
      </div>

      {/* Comparativa Mensual */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <MonthlyComparisonCard
          previousMonth={previousMonthSummary.expensesCount > 0 ? previousMonthSummary : null}
          currentMonth={currentMonthSummary}
          nextMonthProjection={nextMonthProjection}
        />
      </div>

      {/* Grid de 2 columnas: Próximos gastos y Top categorías */}
      <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: '0.07s' }}>
        <UpcomingExpensesWidget
          expenses={upcomingExpenses}
          categories={categories}
        />

        <TopCategoriesChart
          categories={topCategories}
          monthName={getMonthName(currentMonth)}
        />
      </div>
    </div>
  );
}
