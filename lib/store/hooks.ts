import { useStore } from './index';
import { useShallow } from 'zustand/react/shallow';

/**
 * Hooks optimizados para acceder al store
 * Estos hooks usan shallow comparison para prevenir re-renders innecesarios
 */

// ==================== Expenses Hooks ====================

export const useExpenses = () =>
  useStore(useShallow((state) => state.expenses));

export const useActiveExpenses = () =>
  useStore((state) => state.getActiveExpenses());

export const usePaidExpenses = () =>
  useStore((state) => state.getPaidExpenses());

export const useOverdueExpenses = () =>
  useStore((state) => state.getOverdueExpenses());

export const useExpenseById = (id: number) =>
  useStore((state) => state.getExpenseById(id));

export const useExpenseActions = () =>
  useStore(
    useShallow((state) => ({
      setExpenses: state.setExpenses,
      addExpense: state.addExpense,
      updateExpense: state.updateExpense,
      removeExpense: state.removeExpense
    }))
  );

// ==================== Categories & Payment Methods ====================

export const useCategories = () =>
  useStore(useShallow((state) => state.categories));

export const usePaymentMethods = () =>
  useStore(useShallow((state) => state.paymentMethods));

export const useDataActions = () =>
  useStore(
    useShallow((state) => ({
      setCategories: state.setCategories,
      setPaymentMethods: state.setPaymentMethods
    }))
  );

// ==================== UI Hooks ====================

export const useAddExpenseDialog = () =>
  useStore(
    useShallow((state) => ({
      isOpen: state.isAddExpenseDialogOpen,
      open: state.openAddExpenseDialog,
      close: state.closeAddExpenseDialog
    }))
  );

export const useEditExpenseDialog = () =>
  useStore(
    useShallow((state) => ({
      isOpen: state.isEditExpenseDialogOpen,
      expenseId: state.editingExpenseId,
      open: state.openEditExpenseDialog,
      close: state.closeEditExpenseDialog
    }))
  );

export const useGlobalLoading = () =>
  useStore(
    useShallow((state) => ({
      isLoading: state.globalLoading,
      setLoading: state.setGlobalLoading
    }))
  );

// ==================== Combined Hooks ====================

/**
 * Hook para obtener todo lo relacionado con expenses y sus acciones
 * Úsalo cuando necesites tanto el estado como las acciones
 */
export const useExpensesStore = () =>
  useStore(
    useShallow((state) => ({
      expenses: state.expenses,
      categories: state.categories,
      paymentMethods: state.paymentMethods,
      isLoading: state.isLoading,
      setExpenses: state.setExpenses,
      addExpense: state.addExpense,
      updateExpense: state.updateExpense,
      removeExpense: state.removeExpense,
      getActiveExpenses: state.getActiveExpenses,
      getPaidExpenses: state.getPaidExpenses,
      getOverdueExpenses: state.getOverdueExpenses
    }))
  );
