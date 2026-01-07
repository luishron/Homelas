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
import { MoreHorizontal, Calendar, Repeat, CreditCard } from 'lucide-react';
import type { SelectExpense, Category, PaymentMethod } from '@/lib/db';
import { deleteExpense, markExpenseAsPaid } from '../actions';
import { useRouter } from 'next/navigation';
import { EditExpenseDialog } from './edit-expense-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  formatCurrency,
  formatDate,
  getCategoryName,
  getPaymentMethodName
} from '@/lib/utils/formatting';
import { getPaymentStatusBadge, PAYMENT_STATUS } from '@/lib/constants/enums';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import { ExpenseCard } from './expense-card';

interface ExpensesTableProps {
  expenses: SelectExpense[];
  totalExpenses: number;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  hideActions?: boolean;
  showEditOnly?: boolean;
}

export function ExpensesTable({
  expenses,
  totalExpenses,
  categories,
  paymentMethods,
  hideActions = false,
  showEditOnly = false
}: ExpensesTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [editingExpense, setEditingExpense] = useState<SelectExpense | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [payingExpenseId, setPayingExpenseId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

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

  // Calcular total
  const totalAmount = expenses.reduce((acc, expense) => {
    return acc + parseFloat(expense.amount);
  }, 0);

  const handleEdit = (expense: SelectExpense) => {
    setEditingExpense(expense);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (expenseId: number) => {
    setExpenseToDelete(expenseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;

    const formData = new FormData();
    formData.set('id', String(expenseToDelete));
    await deleteExpense(formData);

    toast({
      title: 'Gasto eliminado',
      description: 'El gasto se ha eliminado exitosamente'
    });

    router.refresh();
    setExpenseToDelete(null);
  };

  const handlePay = async (expense: SelectExpense) => {
    setPayingExpenseId(expense.id);

    try {
      const result = await markExpenseAsPaid(expense.id);

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Gasto pagado',
          description: `"${expense.description || 'Sin descripción'}" marcado como pagado`,
          variant: 'default'
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al marcar el gasto como pagado',
        variant: 'destructive'
      });
    } finally {
      setPayingExpenseId(null);
    }
  };

  return (
    <>
      {(!hideActions || showEditOnly) && editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          categories={categories}
          paymentMethods={paymentMethods}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Eliminar gasto"
        description="¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />

      <Card>
      <CardHeader>
        <CardTitle>Lista de Gastos</CardTitle>
        <CardDescription>
          Administra y visualiza todos tus gastos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(hideActions || showEditOnly) && expenses.length > 0 && (
          <div className="mb-6">
            <div className="rounded-lg border-2 border-success bg-card p-4">
              <div className="text-sm font-medium text-success mb-1">Total Pagado</div>
              <div className="text-3xl font-bold text-success">
                {formatCurrency(totalAmount)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{expenses.length} gastos en historial</div>
            </div>
          </div>
        )}

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No hay gastos registrados.
              </p>
            </div>
          ) : (
            sortedExpenses.map((expense, index) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                categories={categories}
                paymentMethods={paymentMethods}
                onPay={handlePay}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
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
              {!hideActions && !showEditOnly && (
                <TableHead className="text-right">Acción</TableHead>
              )}
              {(!hideActions || showEditOnly) && (
                <TableHead>
                  <span className="sr-only">Más</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={hideActions && !showEditOnly ? 7 : showEditOnly ? 8 : 9} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No hay gastos registrados.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              sortedExpenses.map((expense, index) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const expenseDate = new Date(expense.date);
                expenseDate.setHours(0, 0, 0, 0);
                const isOverdue = expenseDate < today && expense.payment_status !== 'pagado';

                return (
                <TableRow
                  key={expense.id}
                  className={cn(
                    'animate-fade-in-up',
                    isOverdue && 'border-l-4 border-l-destructive'
                  )}
                  style={{ animationDelay: `${index * 0.015}s` }}
                >
                  <TableCell className="font-medium">
                    {expense.description || 'Sin descripción'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(expense.category_id, categories)}</Badge>
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
                    {getPaymentMethodName(expense.payment_method, paymentMethods)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  {!hideActions && !showEditOnly && (
                    <TableCell className="text-right">
                      {expense.payment_status !== 'pagado' && (
                        <Button
                          size="sm"
                          variant={isOverdue ? 'destructive' : 'default'}
                          onClick={() => handlePay(expense)}
                          disabled={payingExpenseId === expense.id}
                          className="gap-1"
                        >
                          <CreditCard className="h-4 w-4" />
                          {payingExpenseId === expense.id ? 'Pagando...' : 'Pagar'}
                        </Button>
                      )}
                    </TableCell>
                  )}
                  {(!hideActions || showEditOnly) && (
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
                            onClick={() => handleDeleteClick(expense.id)}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
                );
              })
            )}

            {/* Fila de Totales */}
            {expenses.length > 0 && (
              <TableRow className="bg-muted/50 font-semibold border-t-2">
                <TableCell colSpan={7} className="text-right">
                  Total General:
                </TableCell>
                <TableCell className="text-right text-lg">
                  {formatCurrency(totalAmount)}
                </TableCell>
                {(!hideActions || showEditOnly) && (
                  <TableCell></TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Mostrando {expenses.length} de {totalExpenses} gastos
        </div>
      </CardContent>
    </Card>
    </>
  );
}
