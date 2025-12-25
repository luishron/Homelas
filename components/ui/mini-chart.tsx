'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * MiniChart - Gráfico minimalista estilo Wise para tendencias
 *
 * Features:
 * - Sparkline simple y limpio
 * - Responsive
 * - Altura fija compacta
 * - Colores personalizables
 */

export interface MiniChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Datos para el gráfico (array de números) */
  data: number[];
  /** Color de la línea (HSL) */
  color?: string;
  /** Altura del gráfico */
  height?: number;
  /** Mostrar puntos en cada dato */
  showDots?: boolean;
  /** Suavizado de la línea */
  smooth?: boolean;
}

export function MiniChart({
  data,
  color = 'hsl(var(--primary))',
  height = 40,
  showDots = false,
  smooth = true,
  className,
  ...props
}: MiniChartProps) {
  // Si no hay datos, mostrar estado vacío
  if (!data || data.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center bg-muted/30 rounded', className)}
        style={{ height: `${height}px` }}
        {...props}
      >
        <span className="text-xs text-muted-foreground">Sin datos</span>
      </div>
    );
  }

  // Calcular dimensiones
  const width = 100; // Porcentaje
  const padding = 4;
  const chartHeight = height - padding * 2;

  // Normalizar datos - Manejar casos extremos
  const validData = data.filter(v => !isNaN(v) && isFinite(v));

  if (validData.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center bg-muted/30 rounded', className)}
        style={{ height: `${height}px` }}
        {...props}
      >
        <span className="text-xs text-muted-foreground">Sin datos válidos</span>
      </div>
    );
  }

  const max = Math.max(...validData);
  const min = Math.min(...validData);
  const range = max - min;

  // Si todos los valores son iguales, crear un rango artificial
  const effectiveRange = range === 0 ? max || 1 : range;
  const effectiveMin = range === 0 ? 0 : min;

  // Generar puntos del path
  const points = validData.map((value, index) => {
    const x = (index / Math.max(validData.length - 1, 1)) * 100;
    const normalizedValue = ((value - effectiveMin) / effectiveRange);
    const y = chartHeight - (normalizedValue * chartHeight) + padding;
    return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? chartHeight / 2 : y };
  });

  // Generar path SVG
  let pathData = '';

  if (smooth && points.length > 2) {
    // Curva suavizada (Catmull-Rom)
    pathData = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;

      pathData += ` Q ${current.x},${current.y} ${controlX},${(current.y + next.y) / 2}`;
      pathData += ` Q ${next.x},${next.y} ${next.x},${next.y}`;
    }
  } else {
    // Línea recta
    pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  }

  // Área bajo la curva (fill)
  const areaData = `${pathData} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <div className={cn('relative', className)} {...props}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: `${height}px` }}
      >
        {/* Área con gradiente */}
        <defs>
          <linearGradient id="miniChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path
          d={areaData}
          fill="url(#miniChartGradient)"
          className="transition-all duration-300"
        />

        {/* Línea principal */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Puntos opcionales */}
        {showDots &&
          points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={color}
              className="transition-all duration-300"
            />
          ))}
      </svg>
    </div>
  );
}

/**
 * MiniChartSkeleton - Loading state
 */
export function MiniChartSkeleton({ height = 40 }: { height?: number }) {
  return (
    <div
      className="bg-muted/30 rounded animate-pulse"
      style={{ height: `${height}px` }}
    />
  );
}
