'use client';

import { useState, useEffect } from 'react';

export type CategoryView = 'compact' | 'detailed';

const STORAGE_KEY = 'categoryView';

/**
 * Hook para gestionar la preferencia de vista de categorías
 *
 * Basado en el patrón de dashboard-kpis.tsx
 * Persiste la preferencia en localStorage automáticamente
 *
 * @returns {object} view - Vista actual ('compact' | 'detailed')
 * @returns {function} setView - Función para cambiar la vista
 *
 * @example
 * const { view, setView } = useCategoryView();
 *
 * <ViewToggle view={view} onViewChange={setView} />
 */
export function useCategoryView() {
  const [view, setViewState] = useState<CategoryView>('detailed');

  // Cargar preferencia guardada al montar el componente
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === 'compact' || saved === 'detailed') {
      setViewState(saved);
    }
  }, []);

  // Función para cambiar la vista y persistir en localStorage
  const setView = (newView: CategoryView) => {
    setViewState(newView);
    localStorage.setItem(STORAGE_KEY, newView);
  };

  return { view, setView };
}
