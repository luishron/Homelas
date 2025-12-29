'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Folder, CreditCard } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useGlobalSearch, type SearchResult } from '@/hooks/use-global-search';
import { formatCurrency } from '@/lib/utils/formatting';

/**
 * GlobalSearch - Command Palette estilo Wise/Linear
 *
 * Ahora usa shadcn Command component para mejor consistencia
 *
 * Características:
 * - Modal con Cmd+K
 * - Búsqueda fuzzy
 * - Resultados agrupados por tipo
 * - Navegación con teclado (integrada en Command)
 * - Quick actions
 */

interface GlobalSearchProps {
  data?: {
    expenses?: any[];
    incomes?: any[];
    categories?: any[];
    paymentMethods?: any[];
  };
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SearchResultContent - Contenido de un resultado de búsqueda
 */
interface SearchResultContentProps {
  result: SearchResult;
}

function SearchResultContent({ result }: SearchResultContentProps) {
  // Icono según tipo
  const TypeIcon = {
    expense: TrendingDown,
    income: TrendingUp,
    category: Folder,
    'payment-method': CreditCard,
  }[result.type];

  // Icono de categoría/entidad
  const EntityIcon = result.icon
    ? ((LucideIcons as any)[result.icon] as React.ComponentType || TypeIcon)
    : TypeIcon;

  return (
    <>
      {/* Icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: result.color ? `${result.color}15` : 'hsl(var(--muted))',
          color: result.color || 'hsl(var(--foreground))',
        }}
      >
        <EntityIcon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{result.title}</p>
        {result.subtitle && (
          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
        )}
      </div>

      {/* Amount */}
      {result.amount !== undefined && (
        <div
          className={cn(
            'text-sm font-semibold tabular-nums',
            result.type === 'expense' ? 'text-destructive' : 'text-success'
          )}
        >
          {result.type === 'expense' ? '-' : '+'}
          {formatCurrency(Math.abs(result.amount))}
        </div>
      )}
    </>
  );
}

export function GlobalSearch({ data, isOpen, onClose }: GlobalSearchProps) {
  const {
    query,
    setQuery,
    groupedResults,
    selectResult,
  } = useGlobalSearch({ data });

  // Wrapper para selectResult que cierra el modal
  const handleSelectResult = React.useCallback((result: SearchResult) => {
    selectResult(result);
    onClose();
  }, [selectResult, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Búsqueda global</DialogTitle>
        <Command className="rounded-lg border-none">
          <CommandInput
            placeholder="Buscar gastos, ingresos, categorías..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>
              {query ? 'No se encontraron resultados' : 'Empieza a escribir para buscar...'}
            </CommandEmpty>

            {groupedResults.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelectResult(result)}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <SearchResultContent result={result} />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono">
                  ↑↓
                </kbd>
                <span>Navegar</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono">
                  ↵
                </kbd>
                <span>Seleccionar</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono">
                ⌘K
              </kbd>
              <span>para abrir</span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

