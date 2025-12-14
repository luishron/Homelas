import type { StateCreator } from 'zustand';
import type { SelectExpense, Category, PaymentMethod } from '@/lib/db';

export interface ExpensesSlice {
  // State
  expenses: SelectExpense[];
  categories: Category[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;

  // Actions
  setExpenses: (expenses: SelectExpense[]) => void;
  addExpense: (expense: SelectExpense) => void;
  updateExpense: (id: number, expense: Partial<SelectExpense>) => void;
  removeExpense: (id: number) => void;

  setCategories: (categories: Category[]) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;

  setLoading: (loading: boolean) => void;

  // Computed helpers
  getExpenseById: (id: number) => SelectExpense | undefined;
  getActiveExpenses: () => SelectExpense[];
  getPaidExpenses: () => SelectExpense[];
  getOverdueExpenses: () => SelectExpense[];
}

export const createExpensesSlice: StateCreator<ExpensesSlice> = (set, get) => ({
  // Initial state
  expenses: [],
  categories: [],
  paymentMethods: [],
  isLoading: false,

  // Actions
  setExpenses: (expenses) => set({ expenses }),

  addExpense: (expense) => set((state) => ({
    expenses: [...state.expenses, expense]
  })),

  updateExpense: (id, updatedExpense) => set((state) => ({
    expenses: state.expenses.map((exp) =>
      exp.id === id ? { ...exp, ...updatedExpense } : exp
    )
  })),

  removeExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((exp) => exp.id !== id)
  })),

  setCategories: (categories) => set({ categories }),

  setPaymentMethods: (methods) => set({ paymentMethods: methods }),

  setLoading: (loading) => set({ isLoading: loading }),

  // Computed helpers
  getExpenseById: (id) => {
    return get().expenses.find((exp) => exp.id === id);
  },

  getActiveExpenses: () => {
    return get().expenses.filter((exp) => exp.payment_status !== 'pagado');
  },

  getPaidExpenses: () => {
    return get().expenses.filter((exp) => exp.payment_status === 'pagado');
  },

  getOverdueExpenses: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return get().expenses.filter((exp) => {
      const expenseDate = new Date(exp.date);
      expenseDate.setHours(0, 0, 0, 0);
      return expenseDate < today && exp.payment_status !== 'pagado';
    });
  }
});
