'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * Hook para gestión avanzada de filtros con sincronización URL
 *
 * Características:
 * - Sincronización automática con URL query params
 * - Filtros múltiples (categoría, fecha, monto, método de pago, estado)
 * - Presets guardables en localStorage
 * - Limpieza de filtros
 */

export interface FilterState {
  categories: string[];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethods: string[];
  status?: 'paid' | 'pending' | 'overdue' | 'all';
  search?: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: string;
}

const EMPTY_FILTERS: FilterState = {
  categories: [],
  paymentMethods: [],
  status: 'all',
};

const PRESETS_STORAGE_KEY = 'homelas-filter-presets';

export function useFilters(initialFilters: FilterState = EMPTY_FILTERS) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estado de filtros
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [presets, setPresets] = useState<FilterPreset[]>([]);

  // Cargar filtros desde URL al montar
  useEffect(() => {
    const urlFilters = parseFiltersFromURL(searchParams);
    if (Object.keys(urlFilters).length > 0) {
      setFilters({ ...EMPTY_FILTERS, ...urlFilters });
    }
  }, []);

  // Cargar presets desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading filter presets:', error);
      }
    }
  }, []);

  // Sincronizar filtros con URL
  const syncFiltersToURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());

    // Limpiar todos los params de filtros
    ['categories', 'dateFrom', 'dateTo', 'amountMin', 'amountMax', 'paymentMethods', 'status', 'search'].forEach(
      (key) => params.delete(key)
    );

    // Agregar filtros activos
    if (newFilters.categories.length > 0) {
      params.set('categories', newFilters.categories.join(','));
    }
    if (newFilters.dateFrom) params.set('dateFrom', newFilters.dateFrom);
    if (newFilters.dateTo) params.set('dateTo', newFilters.dateTo);
    if (newFilters.amountMin !== undefined) params.set('amountMin', String(newFilters.amountMin));
    if (newFilters.amountMax !== undefined) params.set('amountMax', String(newFilters.amountMax));
    if (newFilters.paymentMethods.length > 0) {
      params.set('paymentMethods', newFilters.paymentMethods.join(','));
    }
    if (newFilters.status && newFilters.status !== 'all') {
      params.set('status', newFilters.status);
    }
    if (newFilters.search) params.set('search', newFilters.search);

    // Navegar con nuevos params
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newURL, { scroll: false });
  }, [pathname, router, searchParams]);

  // Actualizar filtros
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    syncFiltersToURL(newFilters);
  }, [filters, syncFiltersToURL]);

  // Limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    syncFiltersToURL(EMPTY_FILTERS);
  }, [syncFiltersToURL]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.paymentMethods.length > 0 ||
      filters.dateFrom !== undefined ||
      filters.dateTo !== undefined ||
      filters.amountMin !== undefined ||
      filters.amountMax !== undefined ||
      (filters.status !== 'all' && filters.status !== undefined) ||
      (filters.search !== undefined && filters.search !== '')
    );
  }, [filters]);

  // Contar filtros activos
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.paymentMethods.length > 0) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.amountMin !== undefined || filters.amountMax !== undefined) count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  // Guardar preset
  const savePreset = useCallback((name: string) => {
    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));

    return newPreset;
  }, [filters, presets]);

  // Cargar preset
  const loadPreset = useCallback((presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setFilters(preset.filters);
      syncFiltersToURL(preset.filters);
    }
  }, [presets, syncFiltersToURL]);

  // Eliminar preset
  const deletePreset = useCallback((presetId: string) => {
    const updatedPresets = presets.filter((p) => p.id !== presetId);
    setPresets(updatedPresets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
  }, [presets]);

  // Aplicar filtros a un array de items
  const applyFilters = useCallback(<T extends Record<string, any>>(
    items: T[],
    config: {
      categoryField?: string;
      dateField?: string;
      amountField?: string;
      paymentMethodField?: string;
      statusField?: string;
      searchFields?: string[];
    } = {}
  ): T[] => {
    const {
      categoryField = 'category_id',
      dateField = 'date',
      amountField = 'amount',
      paymentMethodField = 'payment_method_id',
      statusField = 'status',
      searchFields = ['description'],
    } = config;

    return items.filter((item) => {
      // Filtro de categorías
      if (filters.categories.length > 0) {
        const itemCategory = String(item[categoryField]);
        if (!filters.categories.includes(itemCategory)) return false;
      }

      // Filtro de métodos de pago
      if (filters.paymentMethods.length > 0) {
        const itemPaymentMethod = String(item[paymentMethodField]);
        if (!filters.paymentMethods.includes(itemPaymentMethod)) return false;
      }

      // Filtro de fecha
      if (filters.dateFrom || filters.dateTo) {
        const itemDate = new Date(item[dateField]);
        if (filters.dateFrom && itemDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && itemDate > new Date(filters.dateTo)) return false;
      }

      // Filtro de monto
      if (filters.amountMin !== undefined || filters.amountMax !== undefined) {
        const itemAmount = parseFloat(item[amountField]);
        if (filters.amountMin !== undefined && itemAmount < filters.amountMin) return false;
        if (filters.amountMax !== undefined && itemAmount > filters.amountMax) return false;
      }

      // Filtro de estado
      if (filters.status && filters.status !== 'all') {
        if (item[statusField] !== filters.status) return false;
      }

      // Filtro de búsqueda
      if (filters.search && filters.search.trim() !== '') {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = searchFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    applyFilters,
  };
}

// Parsear filtros desde URL
function parseFiltersFromURL(searchParams: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {};

  const categories = searchParams.get('categories');
  if (categories) filters.categories = categories.split(',');

  const dateFrom = searchParams.get('dateFrom');
  if (dateFrom) filters.dateFrom = dateFrom;

  const dateTo = searchParams.get('dateTo');
  if (dateTo) filters.dateTo = dateTo;

  const amountMin = searchParams.get('amountMin');
  if (amountMin) filters.amountMin = parseFloat(amountMin);

  const amountMax = searchParams.get('amountMax');
  if (amountMax) filters.amountMax = parseFloat(amountMax);

  const paymentMethods = searchParams.get('paymentMethods');
  if (paymentMethods) filters.paymentMethods = paymentMethods.split(',');

  const status = searchParams.get('status');
  if (status) filters.status = status as FilterState['status'];

  const search = searchParams.get('search');
  if (search) filters.search = search;

  return filters;
}
