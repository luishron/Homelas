'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog as Dialog,
  ResponsiveDialogContent as DialogContent,
  ResponsiveDialogDescription as DialogDescription,
  ResponsiveDialogFooter as DialogFooter,
  ResponsiveDialogHeader as DialogHeader,
  ResponsiveDialogTitle as DialogTitle,
  ResponsiveDialogTrigger as DialogTrigger
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
import { PlusCircle } from 'lucide-react';
import { saveIncome } from '../actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type IncomeCategory = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
};

export function AddIncomeDialog({
  categories,
  trigger
}: {
  categories: IncomeCategory[];
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Obtener fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

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

    formData.set('categoryId', categoryId);
    formData.set('isRecurring', String(isRecurring));
    if (isRecurring) {
      formData.set('recurrenceFrequency', frequency);
    }

    const result = await saveIncome(formData);

    if (result?.error) {
      toast({
        title: 'Error al guardar',
        description: result.error,
        variant: 'destructive'
      });
      setIsSubmitting(false);
    } else{
      // Reset form state
      form.reset();
      setIsRecurring(false);
      setCategoryId('');
      setFrequency('monthly');
      setIsSubmitting(false);
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Ingreso
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Ingreso</DialogTitle>
          <DialogDescription>
            Registra un ingreso en tu historial financiero.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="source">Fuente de Ingreso</Label>
            <Input
              id="source"
              name="source"
              placeholder="ej. Salario Mensual, Freelance Proyecto X"
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
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={today}
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
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Notas adicionales..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Ingreso'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
