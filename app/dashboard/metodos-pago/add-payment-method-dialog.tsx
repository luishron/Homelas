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
import { PlusCircle, CreditCard } from 'lucide-react';
import { savePaymentMethod } from '../actions';
import { useRouter } from 'next/navigation';
import { COLORS } from '@/lib/constants/colors';
import { useToast } from '@/hooks/use-toast';

const PAYMENT_TYPES = [
  { label: 'Tarjeta de Crédito', value: 'tarjeta_credito' },
  { label: 'Tarjeta de Débito', value: 'tarjeta_debito' },
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Transferencia', value: 'transferencia' },
  { label: 'Otro', value: 'otro' }
];

export function AddPaymentMethodDialog() {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[6].value);
  const [selectedType, setSelectedType] = useState('tarjeta_credito');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('type', selectedType);
    formData.set('color', selectedColor);
    formData.set('isDefault', String(isDefault));

    const result = await savePaymentMethod(formData);

    if (result?.error) {
      toast({
        title: 'Error al guardar',
        description: result.error,
        variant: 'destructive'
      });
      setIsSubmitting(false);
    } else {
      // Reset form state antes de cerrar el diálogo
      e.currentTarget.reset();
      setSelectedType('tarjeta_credito');
      setSelectedColor(COLORS[6].value);
      setIsDefault(false);
      setIsSubmitting(false);
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Método de Pago
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Método de Pago</DialogTitle>
          <DialogDescription>
            Crea un nuevo método de pago para gestionar tus transacciones.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="ej. Visa Principal, Efectivo, etc."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bank">Banco (opcional)</Label>
            <Input
              id="bank"
              name="bank"
              placeholder="ej. BBVA, Santander, etc."
            />
          </div>

          {(selectedType === 'tarjeta_credito' ||
            selectedType === 'tarjeta_debito') && (
            <div className="grid gap-2">
              <Label htmlFor="lastFourDigits">Últimos 4 dígitos (opcional)</Label>
              <Input
                id="lastFourDigits"
                name="lastFourDigits"
                placeholder="1234"
                maxLength={4}
                pattern="[0-9]{4}"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-10 rounded-md border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-foreground scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isDefault" className="cursor-pointer">
              Establecer como método de pago predeterminado
            </Label>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium mb-2">Vista previa:</p>
            <div
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white"
              style={{ backgroundColor: selectedColor }}
            >
              <CreditCard className="h-5 w-5" />
              <span>
                {PAYMENT_TYPES.find((t) => t.value === selectedType)?.label}
              </span>
            </div>
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
              {isSubmitting ? 'Guardando...' : 'Guardar Método de Pago'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
