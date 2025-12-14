import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createExpensesSlice, type ExpensesSlice } from './slices/expenses-slice';
import { createUISlice, type UISlice } from './slices/ui-slice';

// Combinar todos los slices en un solo store
export type AppStore = ExpensesSlice & UISlice;

export const useStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createExpensesSlice(...a),
      ...createUISlice(...a)
    }),
    {
      name: 'gastos-storage', // nombre en localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir datos importantes, no UI state
      partialize: (state) => ({
        expenses: state.expenses,
        categories: state.categories,
        paymentMethods: state.paymentMethods
        // UI state no se persiste (dialogs, loading, etc.)
      })
    }
  )
);
