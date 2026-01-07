'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, CreditCard, Banknote, Building2 } from 'lucide-react';
import { deletePaymentMethod } from '../actions';
import { useRouter } from 'next/navigation';
import type { PaymentMethod } from '@/lib/db';

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  tarjeta_credito: 'Tarjeta de Crédito',
  tarjeta_debito: 'Tarjeta de Débito',
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  otro: 'Otro'
};

const PAYMENT_TYPE_ICONS: Record<string, any> = {
  tarjeta_credito: CreditCard,
  tarjeta_debito: CreditCard,
  efectivo: Banknote,
  transferencia: Building2,
  otro: CreditCard
};

export function PaymentMethodCard({
  paymentMethod
}: {
  paymentMethod: PaymentMethod;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        `¿Estás seguro de eliminar el método de pago "${paymentMethod.name}"?`
      )
    ) {
      return;
    }

    const formData = new FormData();
    formData.set('id', String(paymentMethod.id));
    await deletePaymentMethod(formData);
    router.refresh();
  };

  const TypeIcon =
    PAYMENT_TYPE_ICONS[paymentMethod.type] || PAYMENT_TYPE_ICONS.otro;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: paymentMethod.color }}
          >
            {paymentMethod.icon || <TypeIcon className="h-6 w-6" />}
          </div>
          <div className="flex items-center gap-2">
            {paymentMethod.is_default && (
              <Badge variant="default" className="text-xs">
                Predeterminado
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle>{paymentMethod.name}</CardTitle>
        <CardDescription>
          {PAYMENT_TYPE_LABELS[paymentMethod.type] || paymentMethod.type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {paymentMethod.bank && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Banco:</span>
              <span className="text-sm font-medium">{paymentMethod.bank}</span>
            </div>
          )}
          {paymentMethod.last_four_digits && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Últimos 4 dígitos:
              </span>
              <span className="text-sm font-medium font-mono">
                •••• {paymentMethod.last_four_digits}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
