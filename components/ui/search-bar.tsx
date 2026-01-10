'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * SearchBar - Componente estilo Wise para búsqueda
 *
 * Features:
 * - Input grande con icono de búsqueda
 * - Clear button (X) cuando hay texto
 * - Sugerencias/autocomplete (opcional)
 * - Keyboard shortcuts (Cmd+K)
 * - Debounced search
 * - Loading state
 */

const searchBarVariants = cva(
  'relative flex items-center transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'w-full',
        compact: 'max-w-md',
        expanded: 'w-full max-w-2xl',
      },
      focused: {
        true: 'ring-2 ring-primary/20 ring-offset-2 ring-offset-background rounded-lg',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      focused: false,
    },
  }
);

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>,
    VariantProps<typeof searchBarVariants> {
  /** Valor del search */
  value: string;
  /** Callback cuando cambia el valor */
  onChange: (value: string) => void;
  /** Callback cuando se ejecuta la búsqueda (Enter o debounce) */
  onSearch?: (value: string) => void;
  /** Sugerencias para autocomplete */
  suggestions?: string[];
  /** Callback cuando se selecciona una sugerencia */
  onSuggestionSelect?: (suggestion: string) => void;
  /** Mostrar loading spinner */
  loading?: boolean;
  /** Delay para debounce en ms */
  debounceMs?: number;
  /** Mostrar shortcut hint (Cmd+K) */
  showShortcut?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  suggestions = [],
  onSuggestionSelect,
  loading = false,
  debounceMs = 300,
  showShortcut = false,
  variant = 'default',
  placeholder = 'Buscar...',
  className,
  ...props
}: SearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced search
  React.useEffect(() => {
    if (!onSearch) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (value.trim()) {
        onSearch(value);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, onSearch, debounceMs]);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    if (!showShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcut]);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch(value);
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const hasSuggestions = suggestions.length > 0 && value.trim().length > 0;

  return (
    <div className={cn(searchBarVariants({ variant, focused: isFocused }), className)}>
      <div className="relative w-full">
        {/* Input */}
        <div className="relative flex items-center">
          {/* Search icon */}
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />

          {/* Input field */}
          <Input
            ref={inputRef}
            type="search"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (value.trim()) setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay para permitir click en sugerencias
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            className={cn(
              'h-12 pl-10 pr-20 rounded-lg bg-muted/50 border-muted hover:border-input focus:bg-background',
              'transition-all duration-200'
            )}
            {...props}
          />

          {/* Loading / Clear button */}
          <div className="absolute right-3 flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />}

            {!loading && value && (
              <button
                type="button"
                onClick={handleClear}
                className="h-12 w-12 rounded-full hover:bg-muted/80 flex items-center justify-center transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}

            {/* Keyboard shortcut hint */}
            {showShortcut && !value && !isFocused && (
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            )}
          </div>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && hasSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{suggestion}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SearchBarSkeleton - Loading state
 */
export function SearchBarSkeleton() {
  return (
    <div className="relative w-full">
      <div className="h-12 rounded-lg bg-muted/50 animate-pulse" />
    </div>
  );
}
