# Zustand Store - Documentación

Esta es la implementación del store global usando Zustand con una arquitectura de slices centralizada.

## Estructura

```
lib/store/
├── index.ts           # Store principal que combina slices
├── hooks.ts           # Hooks personalizados optimizados
├── slices/
│   ├── expenses-slice.ts  # Estado y acciones de gastos
│   └── ui-slice.ts        # Estado de UI (dialogs, loading)
└── README.md          # Esta documentación
```

## Características

- ✅ Store único centralizado con slices separados por dominio
- ✅ Persistencia en localStorage (solo datos importantes)
- ✅ Hooks optimizados para prevenir re-renders
- ✅ TypeScript con tipos completos
- ✅ Arquitectura limpia y escalable

## Uso Básico

### 1. Importar hooks personalizados

```tsx
import { useExpenses, useExpenseActions } from '@/lib/store/hooks';

function MyComponent() {
  // Solo leer datos
  const expenses = useExpenses();

  // Solo acciones
  const { addExpense, updateExpense } = useExpenseActions();

  return <div>...</div>;
}
```

### 2. Hooks disponibles

#### Expenses
```tsx
// Obtener gastos
const expenses = useExpenses();                    // Todos los gastos
const activeExpenses = useActiveExpenses();        // No pagados
const paidExpenses = usePaidExpenses();            // Pagados
const overdueExpenses = useOverdueExpenses();      // Vencidos

// Obtener un gasto específico
const expense = useExpenseById(123);

// Acciones
const { setExpenses, addExpense, updateExpense, removeExpense } = useExpenseActions();
```

#### Categories & Payment Methods
```tsx
const categories = useCategories();
const paymentMethods = usePaymentMethods();
const { setCategories, setPaymentMethods } = useDataActions();
```

#### UI State
```tsx
// Dialog de agregar gasto
const { isOpen, open, close } = useAddExpenseDialog();

// Dialog de editar gasto
const { isOpen, expenseId, open, close } = useEditExpenseDialog();

// Loading global
const { isLoading, setLoading } = useGlobalLoading();
```

#### Combined Hook
```tsx
// Si necesitas todo junto (usa con precaución, puede causar más re-renders)
const store = useExpensesStore();
```

### 3. Ejemplos prácticos

#### Cargar gastos desde servidor
```tsx
'use client';
import { useEffect } from 'react';
import { useExpenseActions, useDataActions } from '@/lib/store/hooks';

export function ExpensesLoader({
  initialExpenses,
  categories,
  paymentMethods
}) {
  const { setExpenses } = useExpenseActions();
  const { setCategories, setPaymentMethods } = useDataActions();

  useEffect(() => {
    setExpenses(initialExpenses);
    setCategories(categories);
    setPaymentMethods(paymentMethods);
  }, []);

  return null;
}
```

#### Usar en un componente
```tsx
'use client';
import { useActiveExpenses, useExpenseActions } from '@/lib/store/hooks';

export function ExpensesList() {
  const activeExpenses = useActiveExpenses();
  const { updateExpense, removeExpense } = useExpenseActions();

  const handlePay = (id: number) => {
    updateExpense(id, { payment_status: 'pagado' });
  };

  return (
    <div>
      {activeExpenses.map(expense => (
        <div key={expense.id}>
          {expense.description}
          <button onClick={() => handlePay(expense.id)}>
            Pagar
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### Controlar dialogs
```tsx
'use client';
import { useAddExpenseDialog } from '@/lib/store/hooks';

export function AddButton() {
  const { open } = useAddExpenseDialog();

  return <button onClick={open}>Agregar Gasto</button>;
}

export function AddExpenseDialog() {
  const { isOpen, close } = useAddExpenseDialog();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      {/* contenido del dialog */}
    </Dialog>
  );
}
```

## Persistencia

El store automáticamente guarda en localStorage:
- ✅ `expenses` - Lista de gastos
- ✅ `categories` - Categorías
- ✅ `paymentMethods` - Métodos de pago
- ❌ Estado de UI (dialogs, loading) NO se persiste

Los datos se guardan con la clave `gastos-storage` en localStorage.

## Agregar nuevos slices

Para agregar un nuevo dominio:

1. Crear el slice en `slices/`
```tsx
// slices/settings-slice.ts
import type { StateCreator } from 'zustand';

export interface SettingsSlice {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme })
});
```

2. Agregarlo al store principal en `index.ts`
```tsx
import { createSettingsSlice, type SettingsSlice } from './slices/settings-slice';

export type AppStore = ExpensesSlice & UISlice & SettingsSlice;

export const useStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createExpensesSlice(...a),
      ...createUISlice(...a),
      ...createSettingsSlice(...a)  // ← Agregar aquí
    }),
    {
      // ... configuración
      partialize: (state) => ({
        expenses: state.expenses,
        categories: state.categories,
        paymentMethods: state.paymentMethods,
        theme: state.theme  // ← Si quieres persistirlo
      })
    }
  )
);
```

3. Crear hooks en `hooks.ts`
```tsx
export const useTheme = () =>
  useStore(useShallow((state) => ({
    theme: state.theme,
    setTheme: state.setTheme
  })));
```

## Mejores prácticas

1. **Usa hooks específicos** en lugar del store completo
   ```tsx
   // ✅ Bueno - solo se re-renderiza cuando expenses cambia
   const expenses = useExpenses();

   // ❌ Malo - se re-renderiza con cualquier cambio del store
   const { expenses } = useStore();
   ```

2. **Separa estado de acciones** si solo necesitas uno
   ```tsx
   // ✅ Bueno
   const expenses = useExpenses();
   const { addExpense } = useExpenseActions();

   // ❌ Malo si solo necesitas leer
   const { expenses, addExpense } = useExpensesStore();
   ```

3. **Carga datos iniciales** desde el servidor
   ```tsx
   // En un componente client que recibe props del servidor
   useEffect(() => {
     setExpenses(serverExpenses);
   }, [serverExpenses]);
   ```

4. **No persistas estado temporal** (dialogs, loading, forms)
   - Solo persiste datos que el usuario espera que permanezcan

## Debugging

Para ver el estado actual del store en consola:
```tsx
import { useStore } from '@/lib/store';

// En cualquier componente
console.log(useStore.getState());
```

Para resetear localStorage:
```tsx
localStorage.removeItem('gastos-storage');
```
