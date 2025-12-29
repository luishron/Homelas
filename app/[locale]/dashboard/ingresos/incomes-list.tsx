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
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';

interface IncomesListProps {
  incomes: Income[];
  categories: IncomeCategory[];
}

export function IncomesList({ incomes, categories }: IncomesListProps) {
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleDeleteClick = (incomeId: number) => {
    setIncomeToDelete(incomeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!incomeToDelete) return;

    const formData = new FormData();
    formData.set('id', String(incomeToDelete));

    await deleteIncome(formData);

    toast({
      title: 'Ingreso eliminado',
      description: 'El ingreso se ha eliminado exitosamente'
    });

    router.refresh();
    setIncomeToDelete(null);
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
                {(() => {
                  const [year, month, day] = income.date.split('-').map(Number);
                  const date = new Date(year, month - 1, day);
                  return date.toLocaleDateString('es-MX');
                })()}
                {income.description && ` • ${income.description}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-green-600 text-lg">
                {new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'USD'
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
                    onClick={() => handleDeleteClick(income.id)}
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Eliminar ingreso"
        description="¿Estás seguro de que deseas eliminar este ingreso? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
}
