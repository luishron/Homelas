'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, ArrowUpDown } from 'lucide-react';
import { CategoryCard } from './category-card';
import { AddCategoryDialog } from './add-category-dialog';
import type { CategoryWithStats } from '@/lib/db';

type SortOption =
  | 'highest-expense'
  | 'lowest-expense'
  | 'alphabetical'
  | 'most-used';

interface CategoriesGridProps {
  categories: CategoryWithStats[];
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('highest-expense');

  // Load saved sort preference from localStorage
  useEffect(() => {
    const savedSort = localStorage.getItem('categories-sort-preference');
    if (savedSort) {
      setSortBy(savedSort as SortOption);
    }
  }, []);

  // Save sort preference to localStorage
  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    localStorage.setItem('categories-sort-preference', value);
  };

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    // Filter by search query
    let filtered = categories.filter((category) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;

      const nameMatch = category.name.toLowerCase().includes(query);
      const descriptionMatch = category.description
        ?.toLowerCase()
        .includes(query);

      return nameMatch || descriptionMatch;
    });

    // Sort categories
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'highest-expense':
          return b.total - a.total;

        case 'lowest-expense':
          return a.total - b.total;

        case 'alphabetical':
          return a.name.localeCompare(b.name, 'es');

        case 'most-used':
          return b.expenseCount - a.expenseCount;

        default:
          return 0;
      }
    });

    return sorted;
  }, [categories, searchQuery, sortBy]);

  const hasResults = filteredAndSortedCategories.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar categorías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort Dropdown and Results Counter */}
        <div className="flex items-center gap-3">
          {/* Results Counter */}
          <span className="text-sm text-muted-foreground">
            {filteredAndSortedCategories.length}{' '}
            {filteredAndSortedCategories.length === 1
              ? 'categoría'
              : 'categorías'}
          </span>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest-expense">Mayor gasto</SelectItem>
              <SelectItem value="lowest-expense">Menor gasto</SelectItem>
              <SelectItem value="alphabetical">Alfabético (A-Z)</SelectItem>
              <SelectItem value="most-used">Más usadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Categories Grid or Empty States */}
      {categories.length === 0 ? (
        // No categories at all
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No hay categorías</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Crea tu primera categoría para comenzar a organizar tus gastos.
            </p>
            <AddCategoryDialog />
          </div>
        </div>
      ) : !hasResults && isSearching ? (
        // No search results
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Search className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              No se encontraron categorías
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              No hay categorías que coincidan con &quot;{searchQuery}&quot;.
              Intenta con otro término de búsqueda.
            </p>
          </div>
        </div>
      ) : (
        // Show categories grid
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </>
  );
}
