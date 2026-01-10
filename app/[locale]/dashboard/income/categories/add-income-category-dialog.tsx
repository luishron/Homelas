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
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { saveIncomeCategory } from '../../actions';
import { useRouter } from 'next/navigation';
import { COLORS } from '@/lib/constants/colors';
import { useToast } from '@/hooks/use-toast';

const ICONS = [
  '💼',
  '💡',
  '📈',
  '🎁',
  '💰',
  '🏦',
  '📊',
  '💵',
  '🎯',
  '⭐',
  '🚀',
  '💎'
];

export function AddIncomeCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState('💰');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('color', selectedColor);
    formData.set('icon', selectedIcon);

    const result = await saveIncomeCategory(formData);

    if (result?.error) {
      toast({
        title: 'Error al guardar',
        description: result.error,
        variant: 'destructive'
      });
      setIsSubmitting(false);
    } else {
      // Reset form before closing
      e.currentTarget.reset();
      setSelectedColor(COLORS[0].value);
      setSelectedIcon('💰');
      setIsSubmitting(false);
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Agregar nueva categoría de ingreso"
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4 shrink-0" />
          <span className="hidden sm:block">Nueva Categoría</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Categoría de Ingresos</DialogTitle>
          <DialogDescription>
            Crea una categoría para organizar tus ingresos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="ej. Salario, Freelance, Inversiones"
              required
            />
          </div>

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

          <div className="grid gap-2">
            <Label>Icono</Label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`h-10 rounded-md border-2 text-2xl transition-all ${
                    selectedIcon === icon
                      ? 'border-foreground bg-accent scale-110'
                      : 'border-transparent hover:bg-accent/50 hover:scale-105'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe esta categoría de ingresos..."
              rows={3}
            />
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium mb-2">Vista previa:</p>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white"
              style={{ backgroundColor: selectedColor }}
            >
              <span className="text-xl">{selectedIcon}</span>
              <span>Categoría de Ingreso</span>
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
              {isSubmitting ? 'Guardando...' : 'Guardar Categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
