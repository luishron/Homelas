import type { StateCreator } from 'zustand';

export interface UISlice {
  // Dialog states
  isAddExpenseDialogOpen: boolean;
  isEditExpenseDialogOpen: boolean;
  editingExpenseId: number | null;

  // Global loading state
  globalLoading: boolean;

  // Actions
  openAddExpenseDialog: () => void;
  closeAddExpenseDialog: () => void;

  openEditExpenseDialog: (expenseId: number) => void;
  closeEditExpenseDialog: () => void;

  setGlobalLoading: (loading: boolean) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  // Initial state
  isAddExpenseDialogOpen: false,
  isEditExpenseDialogOpen: false,
  editingExpenseId: null,
  globalLoading: false,

  // Actions
  openAddExpenseDialog: () => set({ isAddExpenseDialogOpen: true }),
  closeAddExpenseDialog: () => set({ isAddExpenseDialogOpen: false }),

  openEditExpenseDialog: (expenseId) => set({
    isEditExpenseDialogOpen: true,
    editingExpenseId: expenseId
  }),
  closeEditExpenseDialog: () => set({
    isEditExpenseDialogOpen: false,
    editingExpenseId: null
  }),

  setGlobalLoading: (loading) => set({ globalLoading: loading })
});
