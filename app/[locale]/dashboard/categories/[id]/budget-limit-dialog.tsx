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
import { Settings, Loader2 } from 'lucide-react';
import { setCategoryLimitAction, disableCategoryLimitAction } from './actions';
import { useToast } from '@/hooks/use-toast';

type BudgetLimitDialogProps = {
  categoryId: number;
  currentLimit?: number;
  currentAlert?: number;
  isActive?: boolean;
};

export function BudgetLimitDialog({
  categoryId,
  currentLimit,
  currentAlert = 80,
  isActive = false
}: BudgetLimitDialogProps) {
  const [open, setOpen] = useState(false);
  const [limite, setLimite] = useState(currentLimit?.toString() || '');
  const [alertaEn, setAlertaEn] = useState(currentAlert.toString());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!limite || parseFloat(limite) <= 0) {
      toast({
        title: 'Error',
        description: 'El límite debe ser mayor a 0',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      await setCategoryLimitAction(
        categoryId,
        parseFloat(limite),
        parseInt(alertaEn)
      );

      toast({
        title: 'Límite configurado',
        description: `Límite mensual de $${parseFloat(limite).toLocaleString()} establecido correctamente`
      });

      setOpen(false);

      // Reload para actualizar el estado del presupuesto
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo establecer el límite',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);

    try {
      await disableCategoryLimitAction(categoryId);

      toast({
        title: 'Límite desactivado',
        description: 'El límite mensual ha sido desactivado'
      });

      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo desactivar el límite',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          {isActive ? 'Editar límite mensual' : 'Configurar límite mensual'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Límite Mensual</DialogTitle>
          <DialogDescription>
            Establece un límite de gasto mensual para esta categoría. Recibirás
            alertas cuando te acerques al límite.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="limite">Límite Mensual ($)</Label>
            <Input
              id="limite"
              type="number"
              placeholder="50000"
              value={limite}
              onChange={(e) => setLimite(e.target.value)}
              min="0"
              step="1000"
            />
            <p className="text-xs text-muted-foreground">
              Monto máximo que quieres gastar por mes en esta categoría
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="alerta">Alerta al (%) </Label>
            <Input
              id="alerta"
              type="number"
              placeholder="80"
              value={alertaEn}
              onChange={(e) => setAlertaEn(e.target.value)}
              min="1"
              max="100"
            />
            <p className="text-xs text-muted-foreground">
              Te avisaremos cuando alcances este porcentaje del límite
            </p>
          </div>

          {isActive && currentLimit && (
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-sm font-medium">Límite actual</p>
              <p className="text-2xl font-bold">
                ${currentLimit.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Alerta configurada al {currentAlert}%
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isActive && (
            <Button
              variant="outline"
              onClick={handleDisable}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Desactivar límite
            </Button>
          )}
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
