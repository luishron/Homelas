'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogDescription as DialogDescription,
  ResponsiveDialogFooter as DialogFooter,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle
} from '@/components/ui/responsive-dialog';
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
import { updateExpense } from '../actions';
import { useRouter } from 'next/navigation';
import type { SelectExpense, Category, PaymentMethod } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

interface EditExpenseDialogProps {
  expense: SelectExpense;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExpenseDialog({
  expense,
  categories,
  paymentMethods,
  open,
  onOpenChange
}: EditExpenseDialogProps) {
  const [isRecurring, setIsRecurring] = useState(expense.is_recurring === 1);
  const [categoryId, setCategoryId] = useState(String(expense.category_id));

  // Determinar método de pago inicial
  const defaultPaymentMethod = paymentMethods.find((pm) => pm.is_default);
  const initialPaymentMethodId = expense.payment_method
    ? expense.payment_method
    : defaultPaymentMethod
    ? String(defaultPaymentMethod.id)
    : paymentMethods.length > 0
    ? String(paymentMethods[0].id)
    : '';

  const [paymentMethodId, setPaymentMethodId] = useState(initialPaymentMethodId);
  const [paymentStatus, setPaymentStatus] = useState<'pagado' | 'pendiente' | 'vencido'>(
    (expense.payment_status as 'pagado' | 'pendiente' | 'vencido') || 'pendiente'
  );
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'yearly'>(
    (expense.recurrence_frequency as 'weekly' | 'monthly' | 'yearly') || 'monthly'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Reset form when expense changes
  useEffect(() => {
    setIsRecurring(expense.is_recurring === 1);
    setCategoryId(String(expense.category_id));
    setPaymentMethodId(expense.payment_method || initialPaymentMethodId);
    setPaymentStatus((expense.payment_status as 'pagado' | 'pendiente' | 'vencido') || 'pendiente');
    setFrequency((expense.recurrence_frequency as 'weekly' | 'monthly' | 'yearly') || 'monthly');
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validar que se haya seleccionado una categoría
    if (!categoryId) {
      toast({
        title: 'Error de validación',
        description: 'Por favor selecciona una categoría',
        variant: 'destructive'
      });
      setIsSubmitting(false);
      return;
    }

    formData.set('id', String(expense.id));
    formData.set('categoryId', categoryId);
    formData.set('paymentMethodId', paymentMethodId);
    formData.set('paymentStatus', paymentStatus);
    formData.set('isRecurring', String(isRecurring));
    if (isRecurring) {
      formData.set('recurrenceFrequency', frequency);
    }

    const result = await updateExpense(formData);

    if (result?.error) {
      toast({
        title: 'Error al actualizar',
        description: result.error,
        variant: 'destructive'
      });
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
          <DialogTitle>Editar Gasto</DialogTitle>
          <DialogDescription>
            Modifica los detalles de este gasto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              placeholder="ej. Factura de luz"
              defaultValue={expense.description || ''}
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
                defaultValue={expense.amount}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={expense.date}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No hay categorías. Por favor crea una primero.
                  </div>
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
            <Label htmlFor="paymentMethod">Método de Pago</Label>
            <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Selecciona un método de pago" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No hay métodos de pago configurados.
                  </div>
                ) : (
                  paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={String(method.id)}>
                      {method.name}
                      {method.bank && ` - ${method.bank}`}
                      {method.last_four_digits && ` (••${method.last_four_digits})`}
                      {method.is_default && ' ⭐'}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentStatus">Estado de Pago</Label>
            <Select value={paymentStatus} onValueChange={(value) => setPaymentStatus(value as 'pagado' | 'pendiente' | 'vencido')}>
              <SelectTrigger id="paymentStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expenseType">Tipo de Gasto</Label>
            <Select
              value={isRecurring ? 'recurrente' : 'unico'}
              onValueChange={(value) => setIsRecurring(value === 'recurrente')}
            >
              <SelectTrigger id="expenseType">
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
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Agrega notas adicionales..."
              defaultValue={expense.notes || ''}
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
