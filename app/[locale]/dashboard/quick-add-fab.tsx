'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
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
import { saveExpense } from './actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type Category = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
};

type PaymentMethod = {
  id: number;
  name: string;
  type: string;
  bank?: string | null;
  last_four_digits?: string | null;
  is_default: boolean;
};

export function QuickAddFAB({
  categories,
  paymentMethods
}: {
  categories: Category[];
  paymentMethods: PaymentMethod[];
}) {
  const [open, setOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const defaultPaymentMethod = paymentMethods.find((pm) => pm.is_default);
  const defaultPaymentMethodId = defaultPaymentMethod
    ? String(defaultPaymentMethod.id)
    : paymentMethods.length > 0
    ? String(paymentMethods[0].id)
    : '';

  const [paymentMethodId, setPaymentMethodId] = useState(defaultPaymentMethodId);
  const [frequency, setFrequency] = useState('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const todayDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

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
    formData.set('paymentMethodId', paymentMethodId);
    formData.set('paymentStatus', isPaid ? 'pagado' : 'pendiente');
    formData.set('isRecurring', String(isRecurring));
    if (isRecurring) {
      formData.set('recurrenceFrequency', frequency);
    }

    const result = await saveExpense(formData);

    if (result?.error) {
      toast({
        title: 'Error al guardar',
        description: result.error,
        variant: 'destructive'
      });
      setIsSubmitting(false);
    } else {
      toast({
        title: '✅ Gasto guardado',
        description: 'El gasto se registró correctamente'
      });
      setIsRecurring(false);
      setCategoryId('');
      setPaymentMethodId(defaultPaymentMethodId);
      setIsPaid(false);
      setFrequency('monthly');
      setShowAdvanced(false);
      form.reset();
      setOpen(false);
      setIsSubmitting(false);
      router.refresh();
    }
  };

  // No mostrar si no hay categorías o métodos de pago
  if (categories.length === 0 || paymentMethods.length === 0) {
    return null;
  }

  return (
    <>
      {/* Botón flotante estilo shadcn - mejor contraste */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6
                   z-50
                   inline-flex items-center justify-center gap-2
                   rounded-full
                   bg-primary text-primary-foreground
                   shadow-lg
                   px-4 py-3 sm:px-6 sm:py-4
                   text-sm font-medium
                   transition-all
                   hover:bg-primary/90
                   hover:shadow-xl
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                   disabled:pointer-events-none disabled:opacity-50"
        aria-label="Agregar gasto rápido"
      >
        <PlusCircle className="h-5 w-5" />
        <span className="hidden sm:inline-block">Nuevo Gasto</span>
      </button>

      {/* Diálogo mejorado */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] gap-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80
                            flex items-center justify-center shadow-lg shadow-primary/30">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Agregar Gasto</DialogTitle>
                <DialogDescription className="text-base">
                  Registra un gasto en segundos ⚡
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quick-description">¿Qué compraste?</Label>
              <Input
                id="quick-description"
                name="description"
                placeholder="ej. Comida del supermercado"
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quick-amount">¿Cuánto costó?</Label>
                <Input
                  id="quick-amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  min="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quick-date">¿Cuándo?</Label>
                <Input
                  id="quick-date"
                  name="date"
                  type="date"
                  defaultValue={todayDate}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quick-category">Categoría</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger id="quick-category">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.icon && `${category.icon} `}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-md border bg-muted/50">
              <input
                type="checkbox"
                id="quick-isPaid"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 cursor-pointer"
              />
              <Label htmlFor="quick-isPaid" className="cursor-pointer font-normal flex-1">
                Ya pagué este gasto
              </Label>
            </div>

            <div className="border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full justify-between"
              >
                <span>Detalles adicionales</span>
                <span className="text-muted-foreground">
                  {showAdvanced ? '▲' : '▼'}
                </span>
              </Button>

              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quick-paymentMethod">Método de Pago</Label>
                    <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
                      <SelectTrigger id="quick-paymentMethod">
                        <SelectValue placeholder="Selecciona un método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={String(method.id)}>
                            {method.name}
                            {method.bank && ` - ${method.bank}`}
                            {method.last_four_digits && ` (••${method.last_four_digits})`}
                            {method.is_default && ' ⭐'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="quick-expenseType">Tipo de Gasto</Label>
                    <Select
                      value={isRecurring ? 'recurrente' : 'unico'}
                      onValueChange={(value) => setIsRecurring(value === 'recurrente')}
                    >
                      <SelectTrigger id="quick-expenseType">
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
                      <Label htmlFor="quick-frequency">Frecuencia</Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger id="quick-frequency">
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
                    <Label htmlFor="quick-notes">Notas</Label>
                    <Textarea
                      id="quick-notes"
                      name="notes"
                      placeholder="Agrega notas adicionales..."
                      rows={3}
                    />
                  </div>
                </div>
              )}
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
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
