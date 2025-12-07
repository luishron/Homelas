import { PieChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { CategorySummary } from '@/lib/db';

interface TopCategoriesChartProps {
  categories: CategorySummary[];
  monthName: string;
}

export function TopCategoriesChart({ categories, monthName }: TopCategoriesChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Top Categorías del Mes
          </CardTitle>
          <CardDescription>
            Categorías con mayor gasto en {monthName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PieChart className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-lg font-medium text-muted-foreground">
              Sin gastos registrados
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Comienza agregando gastos para ver tus categorías principales
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/gastos">Agregar Gasto</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top Categorías del Mes
            </CardTitle>
            <CardDescription>
              Categorías con mayor gasto en {monthName}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/categorias">Ver todas</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={category.categoryId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">
                      {category.categoryIcon && `${category.categoryIcon} `}
                      {category.categoryName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.count} {category.count === 1 ? 'gasto' : 'gastos'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {formatCurrency(category.total)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              {/* Barra de progreso */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: category.categoryColor
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {categories.length === 5 && (
          <div className="mt-4 pt-4 border-t text-center">
            <Button variant="link" size="sm" asChild>
              <Link href="/reportes">
                Ver reporte completo
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
