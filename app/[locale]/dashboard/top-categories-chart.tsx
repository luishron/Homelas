'use client';

import { PieChart, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategorySummary } from '@/lib/db';

interface TopCategoriesChartProps {
  categories: CategorySummary[];
  monthName: string;
}

type ViewMode = 'list' | 'pie';

export function TopCategoriesChart({ categories, monthName }: TopCategoriesChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Preparar datos para el gráfico de pie
  const pieData = categories.map((category) => ({
    name: category.categoryName,
    value: category.total,
    percentage: category.percentage,
    color: category.categoryColor,
    icon: category.categoryIcon
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm mb-1">
            {payload[0].payload.icon && `${payload[0].payload.icon} `}
            {payload[0].name}
          </p>
          <p className="text-sm font-bold text-primary">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-muted-foreground">
            {payload[0].payload.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
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
              <Link href="/dashboard/gastos">Agregar Gasto</Link>
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
          <div className="flex items-center gap-2">
            {/* Selector de vista */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none h-8"
                onClick={() => setViewMode('list')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'pie' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none h-8"
                onClick={() => setViewMode('pie')}
              >
                <PieChart className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/categorias">Ver todas</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'list' ? (
          // Vista de lista con barras (actual)
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
        ) : (
          // Vista de gráfico de pie
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.name} (${props.percentage.toFixed(1)}%)`}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value, entry: any) => {
                    const icon = entry.payload.icon ? `${entry.payload.icon} ` : '';
                    return `${icon}${value}`;
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
