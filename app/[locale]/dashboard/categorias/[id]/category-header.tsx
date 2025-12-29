'use client';

import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Category = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
};

export function CategoryHeader({ category }: { category: Category }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/dashboard/categorias"
          className="hover:text-foreground transition-colors"
        >
          Categorías
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{category.name}</span>
      </div>

      {/* Back button for mobile */}
      <div className="md:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/categorias" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Categorías
          </Link>
        </Button>
      </div>

      {/* Category display */}
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-lg text-3xl text-white flex-shrink-0"
          style={{ backgroundColor: category.color }}
        >
          {category.icon || '📦'}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
