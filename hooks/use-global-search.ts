'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook para búsqueda global en la aplicación
 *
 * Características:
 * - Búsqueda en múltiples entidades (gastos, ingresos, categorías)
 * - Keyboard shortcuts (Cmd+K)
 * - Navegación con teclado
 * - Fuzzy search simple
 */

export interface SearchResult {
  id: string;
  type: 'expense' | 'income' | 'category' | 'payment-method';
  title: string;
  subtitle?: string;
  amount?: number;
  icon?: string;
  color?: string;
  url: string;
}

export interface UseGlobalSearchProps {
  data?: {
    expenses?: any[];
    incomes?: any[];
    categories?: any[];
    paymentMethods?: any[];
  };
}

export function useGlobalSearch({ data }: UseGlobalSearchProps = {}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Abrir/cerrar modal
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // ESC para cerrar
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // Convertir datos a resultados de búsqueda
  const allResults = useMemo(() => {
    const results: SearchResult[] = [];

    // Gastos
    if (data?.expenses) {
      data.expenses.forEach((expense: any) => {
        results.push({
          id: `expense-${expense.id}`,
          type: 'expense',
          title: expense.description || 'Sin descripción',
          subtitle: `Gasto · ${expense.category_name || 'Sin categoría'}`,
          amount: parseFloat(expense.amount),
          icon: expense.category_icon,
          color: expense.category_color,
          url: `/dashboard/gastos`,
        });
      });
    }

    // Ingresos
    if (data?.incomes) {
      data.incomes.forEach((income: any) => {
        results.push({
          id: `income-${income.id}`,
          type: 'income',
          title: income.description || 'Sin descripción',
          subtitle: `Ingreso · ${income.category_name || 'Sin categoría'}`,
          amount: parseFloat(income.amount),
          icon: income.category_icon,
          color: income.category_color,
          url: `/dashboard/ingresos`,
        });
      });
    }

    // Categorías
    if (data?.categories) {
      data.categories.forEach((category: any) => {
        results.push({
          id: `category-${category.id}`,
          type: 'category',
          title: category.name,
          subtitle: `Categoría · ${category.description || 'Sin descripción'}`,
          icon: category.icon,
          color: category.color,
          url: `/dashboard/categorias/${category.id}`,
        });
      });
    }

    // Métodos de pago
    if (data?.paymentMethods) {
      data.paymentMethods.forEach((method: any) => {
        results.push({
          id: `payment-${method.id}`,
          type: 'payment-method',
          title: method.name,
          subtitle: 'Método de pago',
          icon: method.icon,
          color: method.color,
          url: `/dashboard/metodos-pago`,
        });
      });
    }

    return results;
  }, [data]);

  // Filtrar resultados basado en query (fuzzy search simple)
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return allResults.slice(0, 10); // Mostrar solo 10 resultados recientes
    }

    const lowerQuery = query.toLowerCase();

    return allResults.filter((result) => {
      const titleMatch = result.title.toLowerCase().includes(lowerQuery);
      const subtitleMatch = result.subtitle?.toLowerCase().includes(lowerQuery);

      return titleMatch || subtitleMatch;
    }).slice(0, 20); // Limitar a 20 resultados
  }, [query, allResults]);

  // Agrupar resultados por tipo
  const groupedResults = useMemo(() => {
    const groups = new Map<string, SearchResult[]>();

    filteredResults.forEach((result) => {
      const typeLabel = {
        expense: 'Gastos',
        income: 'Ingresos',
        category: 'Categorías',
        'payment-method': 'Métodos de Pago',
      }[result.type];

      if (!groups.has(typeLabel)) {
        groups.set(typeLabel, []);
      }
      groups.get(typeLabel)!.push(result);
    });

    return Array.from(groups.entries()).map(([label, results]) => ({
      label,
      results,
    }));
  }, [filteredResults]);

  // Navegación con teclado
  const handleKeyboardNav = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredResults[selectedIndex];
        if (selected) {
          router.push(selected.url);
          close();
        }
      }
    },
    [filteredResults, selectedIndex, router, close]
  );

  // Seleccionar resultado
  const selectResult = useCallback(
    (result: SearchResult) => {
      router.push(result.url);
      close();
    },
    [router, close]
  );

  return {
    isOpen,
    open,
    close,
    query,
    setQuery,
    results: filteredResults,
    groupedResults,
    selectedIndex,
    setSelectedIndex,
    handleKeyboardNav,
    selectResult,
  };
}
