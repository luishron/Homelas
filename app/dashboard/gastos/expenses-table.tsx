'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Calendar, Repeat } from 'lucide-react';
import type { SelectExpense, Category, PaymentMethod } from '@/lib/db';
import { deleteExpense } from '../actions';
import { useRouter } from 'next/navigation';
import { EditExpenseDialog } from './edit-expense-dialog';

interface ExpensesTableProps {
  expenses: SelectExpense[];
  totalExpenses: number;
  categories: Category[];
  paymentMethods: PaymentMethod[];
}

export function ExpensesTable({
  expenses,
  totalExpenses,
  categories,
  paymentMethods
}: ExpensesTableProps) {
  const router = useRouter();
  const [editingExpense, setEditingExpense] = useState<SelectExpense | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Ordenar gastos: vencidos → pendientes → pagados
  const sortedExpenses = [...expenses].sort((a, b) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateA = new Date(a.date);
    dateA.setHours(0, 0, 0, 0);
    const dateB = new Date(b.date);
    dateB.setHours(0, 0, 0, 0);

    const isOverdueA = dateA < today && a.payment_status !== 'pagado';
    const isOverdueB = dateB < today && b.payment_status !== 'pagado';

    // Prioridad: vencidos primero
    if (isOverdueA && !isOverdueB) return -1;
    if (!isOverdueA && isOverdueB) return 1;

    // Luego por estado
    const statusOrder = { vencido: 0, pendiente: 1, pagado: 2 };
    const statusA = isOverdueA ? 'vencido' : (a.payment_status || 'pendiente');
    const statusB = isOverdueB ? 'vencido' : (b.payment_status || 'pendiente');

    const orderA = statusOrder[statusA as keyof typeof statusOrder] ?? 1;
    const orderB = statusOrder[statusB as keyof typeof statusOrder] ?? 1;

    if (orderA !== orderB) return orderA - orderB;

    // Finalmente por fecha (más reciente primero)
    return dateB.getTime() - dateA.getTime();
  });

  // Calcular estadísticas
  const stats = expenses.reduce(
    (acc, expense) => {
      const amount = parseFloat(expense.amount);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
      const isOverdue = expenseDate < today && expense.payment_status !== 'pagado';

      acc.total += amount;

      if (expense.payment_status === 'pagado') {
        acc.paid += amount;
        acc.paidCount++;
      } else if (isOverdue) {
        acc.overdue += amount;
        acc.overdueCount++;
      } else {
        acc.pending += amount;
        acc.pendingCount++;
      }

      return acc;
    },
    { total: 0, paid: 0, pending: 0, overdue: 0, paidCount: 0, pendingCount: 0, overdueCount: 0 }
  );

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    // Parsear la fecha como local sin conversión de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? `${category.icon || ''} ${category.name}`.trim() : 'Sin categoría';
  };

  const getPaymentMethodName = (methodId: string | null | undefined) => {
    if (!methodId) return 'No especificado';

    // Buscar el método de pago por ID
    const paymentMethod = paymentMethods.find((pm) => pm.id === parseInt(methodId));

    if (paymentMethod) {
      let displayName = paymentMethod.name;
      if (paymentMethod.bank) {
        displayName += ` (${paymentMethod.bank})`;
      }
      if (paymentMethod.last_four_digits) {
        displayName += ` ••${paymentMethod.last_four_digits}`;
      }
      return displayName;
    }

    // Fallback para gastos antiguos con valores hardcodeados
    const legacyMethods: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta_debito: 'Tarjeta de Débito',
      tarjeta_credito: 'Tarjeta de Crédito',
      transferencia: 'Transferencia'
    };
    return legacyMethods[methodId] || methodId;
  };

  const getPaymentStatusBadge = (status: string | null | undefined, expenseDate: string) => {
    // Verificar si el gasto está vencido (fecha pasada y no pagado)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expenseDateObj = new Date(expenseDate);
    expenseDateObj.setHours(0, 0, 0, 0);

    const isOverdue = expenseDateObj < today && status !== 'pagado';
    const daysDiff = Math.floor((expenseDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const statusConfig = {
      pagado: { label: 'Pagado', variant: 'default' as const, className: 'bg-green-500 hover:bg-green-600' },
      pendiente: { label: 'Pendiente', variant: 'secondary' as const, className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
      vencido: { label: 'Vencido', variant: 'destructive' as const, className: '' }
    };

    // Si está vencido automáticamente, mostrar con días de atraso
    if (isOverdue) {
      const daysOverdue = Math.abs(daysDiff);
      return {
        ...statusConfig.vencido,
        label: `Vencido (${daysOverdue}d)`
      };
    }

    // Si es pendiente y está próximo a vencer (menos de 7 días)
    if (status !== 'pagado' && daysDiff >= 0 && daysDiff <= 7) {
      return {
        ...statusConfig.pendiente,
        label: daysDiff === 0 ? 'Vence Hoy' : `Vence en ${daysDiff}d`,
        className: daysDiff <= 2 ? 'bg-orange-500 hover:bg-orange-600 text-white' : statusConfig.pendiente.className
      };
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendiente;
    return { ...config };
  };

  const handleEdit = (expense: SelectExpense) => {
    setEditingExpense(expense);
    setEditDialogOpen(true);
  };

  const handleDelete = async (expenseId: number) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) {
      return;
    }

    const formData = new FormData();
    formData.set('id', String(expenseId));
    await deleteExpense(formData);
    router.refresh();
  };

  return (
    <>
      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          categories={categories}
          paymentMethods={paymentMethods}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
      <Card>
      <CardHeader>
        <CardTitle>Lista de Gastos</CardTitle>
        <CardDescription>
          Administra y visualiza todos tus gastos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Estado</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead className="hidden lg:table-cell">
                Método de Pago
              </TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No hay gastos registrados.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              sortedExpenses.map((expense) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const expenseDate = new Date(expense.date);
                expenseDate.setHours(0, 0, 0, 0);
                const isOverdue = expenseDate < today && expense.payment_status !== 'pagado';

                return (
                <TableRow
                  key={expense.id}
                  className={isOverdue ? 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500' : ''}
                >
                  <TableCell className="font-medium">
                    {expense.description || 'Sin descripción'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(expense.category_id)}</Badge>
                  </TableCell>
                  <TableCell>
                    {expense.is_recurring === 1 ? (
                      <Badge className="gap-1">
                        <Repeat className="h-3 w-3" />
                        Recurrente
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        Único
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {(() => {
                      const statusBadge = getPaymentStatusBadge(expense.payment_status, expense.date);
                      return (
                        <Badge variant={statusBadge.variant} className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {getPaymentMethodName(expense.payment_method)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(expense)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(expense.id)}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                );
              })
            )}

            {/* Fila de Totales */}
            {expenses.length > 0 && (
              <TableRow className="bg-muted/50 font-semibold border-t-2">
                <TableCell colSpan={6} className="text-right">
                  Total General:
                </TableCell>
                <TableCell className="text-right text-lg">
                  {formatCurrency(stats.total)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Desglose de totales */}
        {expenses.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="text-xs font-medium text-red-600">Vencidos</div>
              <div className="text-2xl font-bold text-red-700">
                {formatCurrency(stats.overdue)}
              </div>
              <div className="text-xs text-red-600">{stats.overdueCount} gastos</div>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <div className="text-xs font-medium text-yellow-600">Pendientes</div>
              <div className="text-2xl font-bold text-yellow-700">
                {formatCurrency(stats.pending)}
              </div>
              <div className="text-xs text-yellow-600">{stats.pendingCount} gastos</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="text-xs font-medium text-green-600">Pagados</div>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(stats.paid)}
              </div>
              <div className="text-xs text-green-600">{stats.paidCount} gastos</div>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          Mostrando {expenses.length} de {totalExpenses} gastos
        </div>
      </CardContent>
    </Card>
    </>
  );
}
