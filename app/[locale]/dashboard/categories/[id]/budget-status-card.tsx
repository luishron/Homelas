import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import type { CategoryBudgetStatus } from '@/lib/category-limits-supabase';

type BudgetStatusCardProps = {
  status: CategoryBudgetStatus;
};

export function BudgetStatusCard({ status }: BudgetStatusCardProps) {
  const {
    limite,
    gastado,
    disponible,
    porcentajeUsado,
    excedido,
    alertaActiva,
    mes,
    año
  } = status;

  // Determinar color según el estado
  const getStatusColor = () => {
    if (excedido) return 'text-red-500';
    if (alertaActiva) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressBarColor = () => {
    if (excedido) return 'bg-red-500';
    if (alertaActiva) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBackgroundColor = () => {
    if (excedido) return 'bg-red-500/10 border-red-500/20';
    if (alertaActiva) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-green-500/10 border-green-500/20';
  };

  return (
    <Card className={`${getBackgroundColor()} border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-medium line-clamp-1">
            Presupuesto Mensual
          </CardTitle>
          <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
            {mes}/{año}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alertas */}
        {excedido && (
          <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 border border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm min-w-0 flex-1">
              <p className="font-medium text-red-700 dark:text-red-400 break-words">
                Límite excedido
              </p>
              <p className="text-red-600 dark:text-red-500 text-xs mt-0.5 break-words">
                Has superado el límite mensual por <span className="tabular-nums">${(gastado - limite).toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}

        {alertaActiva && !excedido && (
          <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3 border border-yellow-500/20">
            <TrendingUp className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm min-w-0 flex-1">
              <p className="font-medium text-yellow-700 dark:text-yellow-400 break-words">
                Alerta de presupuesto
              </p>
              <p className="text-yellow-600 dark:text-yellow-500 text-xs mt-0.5 break-words">
                Te estás acercando al límite mensual
              </p>
            </div>
          </div>
        )}

        {/* Límite y Gastado */}
        <div className="grid grid-cols-2 gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1 truncate">Límite</p>
            <p className="text-lg font-bold tabular-nums truncate">${limite.toLocaleString()}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1 truncate">Gastado</p>
            <p className={`text-lg font-bold tabular-nums truncate ${getStatusColor()}`}>
              ${gastado.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground truncate">Progreso</span>
            <span className={`font-medium tabular-nums flex-shrink-0 ${getStatusColor()}`}>
              {porcentajeUsado.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getProgressBarColor()} transition-all duration-500 ease-out`}
              style={{
                width: `${Math.min(porcentajeUsado, 100)}%`
              }}
            />
          </div>
        </div>

        {/* Disponible */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate">Disponible</span>
            </div>
            <span
              className={`text-lg font-bold tabular-nums flex-shrink-0 ${
                disponible < 0 ? 'text-red-500' : 'text-foreground'
              }`}
            >
              ${disponible.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
