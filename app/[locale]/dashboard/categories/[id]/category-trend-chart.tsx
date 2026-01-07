'use client';

import { useState } from 'react';
import { LineChart as LineChartIcon, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils/formatting';

type Category = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
};

type MonthlyData = {
  month: string;
  total: number;
  count: number;
};

type ViewMode = 'line' | 'bar';

export function CategoryTrendChart({
  data,
  category
}: {
  data: MonthlyData[];
  category: Category;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>('line');

  // Format month for display (e.g., "2024-01" -> "Ene 2024")
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
  };

  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    total: item.total,
    count: item.count,
    average: item.count > 0 ? item.total / item.count : 0
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm mb-2">{data.month}</p>
          <p className="text-sm font-bold text-primary mb-1">
            Total: {formatCurrency(data.total)}
          </p>
          <p className="text-xs text-muted-foreground mb-1">
            Gastos: {data.count}
          </p>
          <p className="text-xs text-muted-foreground">
            Promedio: {formatCurrency(data.average)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5" />
            Evolución de Gastos
          </CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <LineChartIcon className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-lg font-medium text-muted-foreground">
              Sin datos disponibles
            </p>
            <p className="text-sm text-muted-foreground">
              No hay gastos registrados en los últimos meses
            </p>
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
              <LineChartIcon className="h-5 w-5" />
              Evolución de Gastos
            </CardTitle>
            <CardDescription>Últimos 6 meses en {category.name}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'line' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('line')}
              className="h-8 w-8"
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'bar' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('bar')}
              className="h-8 w-8"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {viewMode === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat('es-MX', {
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke={category.color}
                strokeWidth={2}
                dot={{ fill: category.color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat('es-MX', {
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" fill={category.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
