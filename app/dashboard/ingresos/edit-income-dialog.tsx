'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { updateIncome } from '../actions';
import { useRouter } from 'next/navigation';
import type { Income, IncomeCategory } from '@/lib/db';

interface EditIncomeDialogProps {
  income: Income;
  categories: IncomeCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditIncomeDialog({
  income,
  categories,
  open,
  onOpenChange
}: EditIncomeDialogProps) {
  const [isRecurring, setIsRecurring] = useState(income.is_recurring === 1);
  const [categoryId, setCategoryId] = useState(income.category_id ? String(income.category_id) : '');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'yearly'>(
    (income.recurrence_frequency as 'weekly' | 'monthly' | 'yearly') || 'monthly'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Reset form when income changes
  useEffect(() => {
    setIsRecurring(income.is_recurring === 1);
    setCategoryId(income.category_id ? String(income.category_id) : '');
    setFrequency((income.recurrence_frequency as 'weekly' | 'monthly' | 'yearly') || 'monthly');
  }, [income]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.set('id', String(income.id));
    formData.set('categoryId', categoryId);
    formData.set('isRecurring', String(isRecurring));
    if (isRecurring) {
      formData.set('recurrenceFrequency', frequency);
    }

    const result = await updateIncome(formData);

    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
    } else {
      // Close dialog and refresh
      onOpenChange(false);
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Ingreso</DialogTitle>
          <DialogDescription>
            Modifica los detalles de este ingreso.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="source">Fuente de Ingreso</Label>
            <Input
              id="source"
              name="source"
              placeholder="ej. Salario Mensual, Freelance Proyecto X"
              defaultValue={income.source}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={income.amount}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={income.date}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No hay categorías disponibles
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.icon && `${category.icon} `}
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Método de Pago (opcional)</Label>
            <Input
              id="paymentMethod"
              name="paymentMethod"
              placeholder="ej. Transferencia bancaria, Efectivo"
              defaultValue={income.payment_method || ''}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="incomeType">Tipo de Ingreso</Label>
            <Select
              value={isRecurring ? 'recurrente' : 'unico'}
              onValueChange={(value) => setIsRecurring(value === 'recurrente')}
            >
              <SelectTrigger id="incomeType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unico">Único</SelectItem>
                <SelectItem value="recurrente">Recurrente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isRecurring && (
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frecuencia</Label>
              <Select value={frequency} onValueChange={(value) => setFrequency(value as 'weekly' | 'monthly' | 'yearly')}>
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="Detalles adicionales..."
              defaultValue={income.description || ''}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Notas adicionales..."
              defaultValue={income.notes || ''}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
