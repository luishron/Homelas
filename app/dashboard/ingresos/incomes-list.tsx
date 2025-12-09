'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { EditIncomeDialog } from './edit-income-dialog';
import { deleteIncome } from '../actions';
import { useRouter } from 'next/navigation';
import type { Income, IncomeCategory } from '@/lib/db';

interface IncomesListProps {
  incomes: Income[];
  categories: IncomeCategory[];
}

export function IncomesList({ incomes, categories }: IncomesListProps) {
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const router = useRouter();

  const handleDelete = async (incomeId: number) => {
    if (!confirm('¿Estás seguro de eliminar este ingreso?')) {
      return;
    }

    const formData = new FormData();
    formData.set('id', String(incomeId));

    await deleteIncome(formData);
    router.refresh();
  };

  return (
    <>
      <div className="space-y-2">
        {incomes.map((income) => (
          <div
            key={income.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
          >
            <div className="flex-1">
              <p className="font-medium">{income.source}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(income.date).toLocaleDateString('es-MX')}
                {income.description && ` • ${income.description}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-green-600 text-lg">
                {new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN'
                }).format(parseFloat(income.amount))}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingIncome(income)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(income.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {editingIncome && (
        <EditIncomeDialog
          income={editingIncome}
          categories={categories}
          open={!!editingIncome}
          onOpenChange={(open) => !open && setEditingIncome(null)}
        />
      )}
    </>
  );
}
