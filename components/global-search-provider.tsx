'use client';

import * as React from 'react';
import { GlobalSearch } from './global-search';

/**
 * GlobalSearchProvider - Proveedor de búsqueda global
 *
 * Envuelve la aplicación y proporciona el modal de búsqueda
 */

interface GlobalSearchContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const GlobalSearchContext = React.createContext<GlobalSearchContextValue | null>(null);

export function useGlobalSearchContext() {
  const context = React.useContext(GlobalSearchContext);
  if (!context) {
    throw new Error('useGlobalSearchContext must be used within GlobalSearchProvider');
  }
  return context;
}

interface GlobalSearchProviderProps {
  children: React.ReactNode;
  data?: {
    expenses?: any[];
    incomes?: any[];
    categories?: any[];
    paymentMethods?: any[];
  };
}

export function GlobalSearchProvider({ children, data }: GlobalSearchProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = React.useMemo(
    () => ({ open, close, isOpen }),
    [open, close, isOpen]
  );

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      <GlobalSearch data={data} isOpen={isOpen} onClose={close} />
    </GlobalSearchContext.Provider>
  );
}

/**
 * GlobalSearchTrigger - Botón para abrir búsqueda
 */
export function GlobalSearchTrigger() {
  const { open } = useGlobalSearchContext();

  return (
    <button
      onClick={open}
      className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="hidden sm:inline">Buscar...</span>
      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-xs font-medium">
        ⌘K
      </kbd>
    </button>
  );
}
