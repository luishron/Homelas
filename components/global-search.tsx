'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Search, TrendingDown, TrendingUp, Folder, CreditCard } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useGlobalSearch, type SearchResult } from '@/hooks/use-global-search';
import { formatCurrency } from '@/lib/utils/formatting';

/**
 * GlobalSearch - Command Palette estilo Wise/Linear
 *
 * Características:
 * - Modal con Cmd+K
 * - Búsqueda fuzzy
 * - Resultados agrupados por tipo
 * - Navegación con teclado
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

export function GlobalSearch({ data, isOpen, onClose }: GlobalSearchProps) {
  const {
    query,
    setQuery,
    groupedResults,
    selectedIndex,
    handleKeyboardNav,
    selectResult,
  } = useGlobalSearch({ data });

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input cuando se abre
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Calcular índice absoluto para cada resultado
  let absoluteIndex = 0;

  // Wrapper para selectResult que cierra el modal
  const handleSelectResult = React.useCallback((result: SearchResult) => {
    selectResult(result);
    onClose();
  }, [selectResult, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl p-0 gap-0 overflow-hidden"
        onKeyDown={handleKeyboardNav}
      >
        {/* Título para accesibilidad (visualmente oculto) */}
        <DialogTitle className="sr-only">Búsqueda Global</DialogTitle>

        {/* Search Input */}
        <div className="flex items-center border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar gastos, ingresos, categorías..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {groupedResults.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {query ? 'No se encontraron resultados' : 'Empieza a escribir para buscar...'}
            </div>
          ) : (
            <div className="py-2">
              {groupedResults.map((group) => (
                <div key={group.label} className="mb-4 last:mb-0">
                  {/* Group Label */}
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.label}
                    </h3>
                  </div>

                  {/* Group Results */}
                  <div>
                    {group.results.map((result) => {
                      const currentIndex = absoluteIndex++;
                      const isSelected = currentIndex === selectedIndex;

                      return (
                        <SearchResultItem
                          key={result.id}
                          result={result}
                          isSelected={isSelected}
                          onClick={() => handleSelectResult(result)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
      </DialogContent>
    </Dialog>
  );
}

/**
 * SearchResultItem - Item individual de resultado
 */
interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

function SearchResultItem({ result, isSelected, onClick }: SearchResultItemProps) {
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
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
        'hover:bg-accent focus:bg-accent outline-none',
        isSelected && 'bg-accent'
      )}
    >
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
    </button>
  );
}

