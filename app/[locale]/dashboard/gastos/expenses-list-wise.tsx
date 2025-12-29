'use client';

import { useState } from 'react';
import { TransactionItem, TransactionList } from '@/components/ui/transaction-item';
import { TimelineGroup, TimelineContainer, EmptyTimeline } from '@/components/ui/timeline-group';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { AdvancedFiltersDialog } from '@/components/advanced-filters-dialog';
import type { SelectExpense, Category, PaymentMethod } from '@/lib/db';
import { deleteExpense, markExpenseAsPaid } from '../actions';
import { useRouter } from 'next/navigation';
import { EditExpenseDialog } from './edit-expense-dialog';
import { useToast } from '@/hooks/use-toast';
import { useFilters } from '@/hooks/use-filters';
import { getCategoryIcon, getStatusIcon } from '@/lib/constants/category-icons';
import { groupByDate, formatShortDate } from '@/lib/utils/date-grouping';
import { getCategoryName, getPaymentMethodName } from '@/lib/utils/formatting';
import { PAYMENT_STATUS } from '@/lib/constants/enums';
import { Receipt, Package, SlidersHorizontal } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExpensesListWiseProps {
  expenses: SelectExpense[];
  categories: Category[];
  paymentMethods: PaymentMethod[];
  hideActions?: boolean;
  showEditOnly?: boolean;
}

export function ExpensesListWise({
  expenses,
  categories,
  paymentMethods,
  hideActions = false,
  showEditOnly = false,
}: ExpensesListWiseProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Estado
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const [editingExpense, setEditingExpense] = useState<SelectExpense | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
  const [payingExpenseId, setPayingExpenseId] = useState<number | null>(null);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // Hook de filtros avanzados
  const {
    filters: advancedFilters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    applyFilters,
  } = useFilters();

  // Aplicar filtros avanzados primero
  const advancedFilteredExpenses = applyFilters(expenses, {
    categoryField: 'category_id',
    dateField: 'date',
    amountField: 'amount',
    paymentMethodField: 'payment_method_id',
    statusField: 'payment_status',
    searchFields: ['description'],
  });

  // Luego aplicar búsqueda y filtros rápidos
  const filteredExpenses = advancedFilteredExpenses.filter((expense) => {
    // Búsqueda adicional (si no está en filtros avanzados)
    if (searchQuery && !advancedFilters.search) {
      const query = searchQuery.toLowerCase();
      const matchesDescription = expense.description?.toLowerCase().includes(query);
      const matchesCategory = getCategoryName(expense.category_id, categories).toLowerCase().includes(query);
      const matchesAmount = String(expense.amount).includes(query);

      if (!matchesDescription && !matchesCategory && !matchesAmount) {
        return false;
      }
    }

    // Filtros rápidos (solo si no hay filtros avanzados de estado)
    if (!advancedFilters.status || advancedFilters.status === 'all') {
      if (selectedFilters.includes('all')) return true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
      const isOverdue = expenseDate < today && expense.payment_status !== PAYMENT_STATUS.PAID;

      if (selectedFilters.includes('overdue') && isOverdue) return true;
      if (selectedFilters.includes('pending') && !isOverdue && expense.payment_status !== PAYMENT_STATUS.PAID) return true;
      if (selectedFilters.includes('paid') && expense.payment_status === PAYMENT_STATUS.PAID) return true;
      if (selectedFilters.includes('recurring') && expense.is_recurring === 1) return true;
      if (selectedFilters.includes('one-time') && expense.is_recurring === 0) return true;

      return false;
    }

    return true;
  });

  // Agrupar por fecha
  const groupedExpenses = groupByDate(
    filteredExpenses.map((expense) => ({
      ...expense,
      date: new Date(expense.date),
    })),
    (items) => items.reduce((sum, item) => sum + parseFloat(item.amount), 0)
  );

  // Filtros disponibles
  const overdueCount = expenses.filter((e) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expenseDate = new Date(e.date);
    expenseDate.setHours(0, 0, 0, 0);
    return expenseDate < today && e.payment_status !== PAYMENT_STATUS.PAID;
  }).length;

  const pendingCount = expenses.filter((e) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expenseDate = new Date(e.date);
    expenseDate.setHours(0, 0, 0, 0);
    return expenseDate >= today && e.payment_status !== PAYMENT_STATUS.PAID;
  }).length;

  const paidCount = expenses.filter((e) => e.payment_status === PAYMENT_STATUS.PAID).length;
  const recurringCount = expenses.filter((e) => e.is_recurring === 1).length;

  const filters = [
    { id: 'all', label: 'Todos', count: expenses.length },
    { id: 'overdue', label: 'Vencidos', count: overdueCount },
    { id: 'pending', label: 'Pendientes', count: pendingCount },
    { id: 'paid', label: 'Pagados', count: paidCount },
    { id: 'recurring', label: 'Recurrentes', count: recurringCount },
  ];

  // Handlers
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
      description: 'El gasto se ha eliminado exitosamente',
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
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Gasto pagado',
          description: `"${expense.description || 'Sin descripción'}" marcado como pagado`,
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al marcar el gasto como pagado',
        variant: 'destructive',
      });
    } finally {
      setPayingExpenseId(null);
    }
  };

  // Renderizar TransactionItem
  const renderExpenseItem = (expense: Omit<SelectExpense, 'date'> & { date: string | Date }) => {
    // Obtener icono de categoría
    const category = categories.find((c) => c.id === expense.category_id);
    const categoryIconData = category?.icon
      ? { icon: category.icon, color: category.color || 'hsl(var(--primary))' }
      : getCategoryIcon(getCategoryName(expense.category_id, categories));

    // Determinar estado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expenseDate = new Date(expense.date);
    expenseDate.setHours(0, 0, 0, 0);
    const isOverdue = expenseDate < today && expense.payment_status !== PAYMENT_STATUS.PAID;

    let status: 'paid' | 'pending' | 'overdue' = 'pending';
    if (expense.payment_status === PAYMENT_STATUS.PAID) {
      status = 'paid';
    } else if (isOverdue) {
      status = 'overdue';
    }

    // Icon component
    const IconComponent = (LucideIcons as any)[categoryIconData.icon] || Receipt;

    // Normalize expense for handlers (convert Date back to string if needed)
    const normalizedExpense: SelectExpense = {
      ...expense,
      date: typeof expense.date === 'string' ? expense.date : expense.date.toISOString().split('T')[0]
    };

    return (
      <TransactionItem
        key={expense.id}
        icon={<IconComponent />}
        iconColor={categoryIconData.color}
        iconBg={`${categoryIconData.color}15`}
        title={expense.description || 'Sin descripción'}
        subtitle={`${getCategoryName(expense.category_id, categories)} · ${formatShortDate(typeof expense.date === 'string' ? new Date(expense.date) : expense.date)}`}
        amount={-parseFloat(expense.amount)}
        status={status}
        onClick={() => handleEdit(normalizedExpense)}
        onAction={
          !hideActions && !showEditOnly && status !== 'paid'
            ? () => handlePay(normalizedExpense)
            : undefined
        }
        actionLabel={payingExpenseId === expense.id ? 'Pagando...' : 'Pagar'}
        showChevron
      />
    );
  };

  return (
    <>
      {/* Dialogs */}
      {editingExpense && (
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

      {/* Search & Filters */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar gastos..."
              showShortcut
            />
          </div>
          <Button
            variant="outline"
            size="default"
            onClick={() => setAdvancedFiltersOpen(true)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge
                variant="default"
                className="ml-2 h-5 min-w-5 rounded-full px-1.5 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        <FilterBar
          filters={filters}
          selected={selectedFilters}
          onChange={setSelectedFilters}
          multiSelect={false}
          showCounts
        />
      </div>

      {/* Advanced Filters Dialog */}
      <AdvancedFiltersDialog
        isOpen={advancedFiltersOpen}
        onClose={() => setAdvancedFiltersOpen(false)}
        filters={advancedFilters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          icon: c.icon || undefined,
        }))}
        paymentMethods={paymentMethods.map((pm) => ({
          id: pm.id,
          name: pm.name,
          icon: pm.icon || undefined,
        }))}
        presets={presets}
        onSavePreset={savePreset}
        onLoadPreset={loadPreset}
        onDeletePreset={deletePreset}
      />

      {/* Timeline Groups */}
      {filteredExpenses.length === 0 ? (
        <EmptyTimeline
          icon={<Package className="h-16 w-16" />}
          title={searchQuery || selectedFilters.length > 0 ? 'No se encontraron gastos' : 'No hay gastos'}
          description={
            searchQuery || selectedFilters.length > 0
              ? 'Intenta ajustar los filtros o la búsqueda'
              : 'Cuando agregues gastos, aparecerán aquí agrupados por fecha'
          }
        />
      ) : (
        <TimelineContainer spacing="md">
          {groupedExpenses.map((group, index) => (
            <TimelineGroup
              key={group.label}
              label={group.label}
              date={group.date}
              showTotal
              total={group.total || 0}
              currency="$"
              sticky
              showDivider={index > 0}
              animationIndex={index}
            >
              <TransactionList showDividers>
                {group.items.map((expense) => renderExpenseItem(expense))}
              </TransactionList>
            </TimelineGroup>
          ))}
        </TimelineContainer>
      )}
    </>
  );
}
