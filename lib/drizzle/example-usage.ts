/**
 * EJEMPLOS DE USO DE DRIZZLE ORM
 *
 * Este archivo muestra cómo usar Drizzle para reemplazar las queries de Supabase.
 * NO ejecutes este archivo, solo úsalo como referencia.
 */

import { db, eq, and, sql, expenses, categories, NewExpense } from '@/lib/drizzle';
import { sql as rawSql } from 'drizzle-orm';

// ============================================================================
// EJEMPLO 1: Obtener gastos de un usuario (equivalente a getExpensesByUser)
// ============================================================================
async function getExpensesByUserId(userId: string) {
  const userExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(expenses.date);

  // ✅ userExpenses está 100% tipado automáticamente!
  return userExpenses;
}

// ============================================================================
// EJEMPLO 2: Crear un gasto CON metadata flexible
// ============================================================================
async function createExpenseWithMetadata(userId: string) {
  const newExpense: NewExpense = {
    userId,
    categoryId: 1,
    amount: '500',
    date: '2025-01-15',
    description: 'Compra en Amazon',
    paymentStatus: 'pagado',
    // 🎯 Agrega cualquier campo en metadata sin migración!
    metadata: {
      tienda: 'Amazon',
      numeroOrden: 'ORD-12345',
      enlaceFactura: 'https://amazon.com/orders/12345',
      cuotas: 3,
      tags: ['online', 'tecnologia'],
      ubicacion: {
        lat: -34.6037,
        lng: -58.3816,
        nombre: 'Buenos Aires'
      }
    }
  };

  const [expense] = await db
    .insert(expenses)
    .values(newExpense)
    .returning();

  return expense;
}

// ============================================================================
// EJEMPLO 3: Buscar gastos por metadata (query dentro de JSON!)
// ============================================================================
async function getExpensesByStore(userId: string, storeName: string) {
  const storeExpenses = await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        // 🔍 Query dentro del campo JSONB!
        sql`${expenses.metadata}->>'tienda' = ${storeName}`
      )
    );

  return storeExpenses;
}

// ============================================================================
// EJEMPLO 4: Actualizar gasto agregando metadata
// ============================================================================
async function updateExpenseMetadata(expenseId: number, newData: Record<string, any>) {
  const [updated] = await db
    .update(expenses)
    .set({
      // Merge metadata existente con nueva data
      metadata: sql`${expenses.metadata} || ${JSON.stringify(newData)}::jsonb`,
    })
    .where(eq(expenses.id, expenseId))
    .returning();

  return updated;
}

// ============================================================================
// EJEMPLO 5: JOIN de gastos con categorías (type-safe!)
// ============================================================================
async function getExpensesWithCategory(userId: string) {
  const expensesWithCat = await db
    .select({
      // Especifica exactamente qué campos quieres
      expenseId: expenses.id,
      amount: expenses.amount,
      date: expenses.date,
      description: expenses.description,
      metadata: expenses.metadata,
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryIcon: categories.icon,
    })
    .from(expenses)
    .innerJoin(categories, eq(expenses.categoryId, categories.id))
    .where(eq(expenses.userId, userId))
    .orderBy(expenses.date);

  // ✅ El resultado está perfectamente tipado!
  return expensesWithCat;
}

// ============================================================================
// EJEMPLO 6: Agregar nuevos campos en el futuro SIN migración
// ============================================================================
async function addNewFieldsToExpense(expenseId: number) {
  // En el futuro, simplemente agrega campos a metadata
  const [updated] = await db
    .update(expenses)
    .set({
      metadata: {
        // Campos que NO existían antes, agregados sin migración!
        compartidoCon: ['usuario1@email.com', 'usuario2@email.com'],
        esDeducibleImpuestos: true,
        categoria_personalizada: 'Viajes de trabajo',
        adjuntos: [
          {
            nombre: 'factura.pdf',
            url: 'https://storage.com/factura.pdf',
            tipo: 'pdf'
          }
        ]
      }
    })
    .where(eq(expenses.id, expenseId))
    .returning();

  return updated;
}

// ============================================================================
// EJEMPLO 7: Búsqueda compleja con metadata
// ============================================================================
async function searchExpensesAdvanced(userId: string) {
  // Buscar gastos que:
  // - Sean del usuario
  // - Tengan tienda 'Amazon'
  // - Tengan más de 2 cuotas
  const results = await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        sql`${expenses.metadata}->>'tienda' = 'Amazon'`,
        sql`(${expenses.metadata}->>'cuotas')::int > 2`
      )
    );

  return results;
}

export {
  getExpensesByUserId,
  createExpenseWithMetadata,
  getExpensesByStore,
  updateExpenseMetadata,
  getExpensesWithCategory,
  addNewFieldsToExpense,
  searchExpensesAdvanced,
};
