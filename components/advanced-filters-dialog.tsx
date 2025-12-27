'use client';

import * as React from 'react';
import { X, Save, Trash2, Filter } from 'lucide-react';
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogDescription as DialogDescription,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
} from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { FilterState, FilterPreset } from '@/hooks/use-filters';

/**
 * AdvancedFiltersDialog - Dialog completo de filtros avanzados
 *
 * Características:
 * - Filtros múltiples en un solo dialog
 * - Presets guardables
 * - Preview de filtros activos
 * - Diseño limpio estilo Wise
 */

interface AdvancedFiltersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  categories?: Array<{ id: number; name: string; icon?: string }>;
  paymentMethods?: Array<{ id: number; name: string; icon?: string }>;
  presets?: FilterPreset[];
  onSavePreset?: (name: string) => void;
  onLoadPreset?: (presetId: string) => void;
  onDeletePreset?: (presetId: string) => void;
}

export function AdvancedFiltersDialog({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
  categories = [],
  paymentMethods = [],
  presets = [],
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: AdvancedFiltersDialogProps) {
  const [presetName, setPresetName] = useState('');
  const [showPresetInput, setShowPresetInput] = useState(false);

  // Handlers para cada tipo de filtro
  const handleCategoryToggle = (categoryId: string) => {
    const current = filters.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    onFiltersChange({ categories: updated });
  };

  const handlePaymentMethodToggle = (methodId: string) => {
    const current = filters.paymentMethods || [];
    const updated = current.includes(methodId)
      ? current.filter((id) => id !== methodId)
      : [...current, methodId];
    onFiltersChange({ paymentMethods: updated });
  };

  const handleSavePreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset(presetName.trim());
      setPresetName('');
      setShowPresetInput(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avanzados
          </DialogTitle>
          <DialogDescription>
            Aplica múltiples filtros para encontrar exactamente lo que buscas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Presets guardados */}
          {presets.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Filtros Guardados</Label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center gap-1 rounded-md border bg-muted/30 px-2 py-1"
                  >
                    <button
                      onClick={() => onLoadPreset?.(preset.id)}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {preset.name}
                    </button>
                    <button
                      onClick={() => onDeletePreset?.(preset.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t my-2" />
            </div>
          )}

          {/* Categorías */}
          {categories.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Categorías</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((category) => {
                  const isSelected = filters.categories?.includes(String(category.id));
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryToggle(String(category.id))}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
                        'hover:border-primary/50 hover:bg-muted/50',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border'
                      )}
                    >
                      {category.icon && <span>{category.icon}</span>}
                      <span className="truncate">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rango de fechas */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Rango de Fechas</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
                  Desde
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => onFiltersChange({ dateFrom: e.target.value })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
                  Hasta
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => onFiltersChange({ dateTo: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Rango de montos */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Rango de Montos</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="amountMin" className="text-xs text-muted-foreground">
                  Monto mínimo
                </Label>
                <Input
                  id="amountMin"
                  type="number"
                  placeholder="$0"
                  value={filters.amountMin || ''}
                  onChange={(e) =>
                    onFiltersChange({
                      amountMin: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amountMax" className="text-xs text-muted-foreground">
                  Monto máximo
                </Label>
                <Input
                  id="amountMax"
                  type="number"
                  placeholder="$999,999"
                  value={filters.amountMax || ''}
                  onChange={(e) =>
                    onFiltersChange({
                      amountMax: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Métodos de pago */}
          {paymentMethods.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Métodos de Pago</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {paymentMethods.map((method) => {
                  const isSelected = filters.paymentMethods?.includes(String(method.id));
                  return (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodToggle(String(method.id))}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
                        'hover:border-primary/50 hover:bg-muted/50',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border'
                      )}
                    >
                      {method.icon && <span>{method.icon}</span>}
                      <span className="truncate">{method.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Estado */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Estado</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                onFiltersChange({ status: value as FilterState['status'] })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pagado</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="overdue">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Guardar preset */}
          {onSavePreset && (
            <div className="space-y-3">
              <div className="border-t my-2" />
              {showPresetInput ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Nombre del filtro..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                    className="h-10"
                  />
                  <Button onClick={handleSavePreset} size="sm" className="h-10">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPresetInput(false);
                      setPresetName('');
                    }}
                    variant="outline"
                    size="sm"
                    className="h-10"
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowPresetInput(true)}
                  variant="outline"
                  className="w-full h-10"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar estos filtros
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button onClick={onClearFilters} variant="outline" className="h-10">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
          <Button onClick={onClose} className="h-10">
            Aplicar filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook auxiliar para useState
function useState<T>(initialValue: T): [T, (value: T) => void] {
  return React.useState(initialValue);
}
