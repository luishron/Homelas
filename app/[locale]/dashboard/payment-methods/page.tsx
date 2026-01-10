import { getPaymentMethodsByUser } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { AddPaymentMethodDialog } from './add-payment-method-dialog';
import { PaymentMethodCard } from './payment-method-card';

export const dynamic = 'force-dynamic';

export default async function MetodosPagoPage() {
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  const paymentMethods = await getPaymentMethodsByUser(user.id);

  return (
    <div className="flex flex-col gap-4 w-full max-w-full">
      <div className="flex items-center justify-between w-full min-w-0">
        <h1 className="text-3xl font-bold truncate min-w-0">Métodos de Pago</h1>
        <AddPaymentMethodDialog />
      </div>

      {paymentMethods.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center w-full">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">
              No hay métodos de pago
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Crea tu primer método de pago para gestionar tus transacciones.
            </p>
            <AddPaymentMethodDialog />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.id} paymentMethod={method} />
          ))}
        </div>
      )}
    </div>
  );
}
