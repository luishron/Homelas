import 'server-only';

import { createClient } from '@/lib/supabase/server';

//==============================================================================
// TYPES - Tipos TypeScript para las tablas
//==============================================================================

export type Category = {
  id: number;
  user_id: string;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
  created_at?: string;
};

export type PaymentStatus = 'pagado' | 'pendiente' | 'vencido';

export type PaymentMethodType =
  | 'tarjeta_credito'
  | 'tarjeta_debito'
  | 'efectivo'
  | 'transferencia'
  | 'otro';

export type PaymentMethod = {
  id: number;
  user_id: string;
  name: string;
  type: PaymentMethodType;
  bank?: string | null;
  last_four_digits?: string | null;
  icon?: string | null;
  color: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Expense = {
  id: number;
  user_id: string;
  category_id: number;
  amount: string;
  description?: string | null;
  date: string;
  payment_method?: string;
  payment_status?: PaymentStatus;
  notes?: string | null;
  is_recurring?: number;
  recurrence_frequency?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Budget = {
  id: number;
  user_id: string;
  category_id: number;
  amount: string;
  month: number;
  year: number;
  created_at?: string;
  updated_at?: string;
};

export type Income = {
  id: number;
  user_id: string;
  source: string;
  amount: string;
  date: string;
  description?: string | null;
  created_at?: string;
};

export type Statistic = {
  id: number;
  user_id: string;
  month: number;
  year: number;
  total_expenses: string;
  total_income: string;
  created_at?: string;
};

export type InsertCategory = Omit<Category, 'id' | 'created_at'>;
export type InsertPaymentMethod = Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>;
export type InsertExpense = Omit<Expense, 'id' | 'created_at' | 'updated_at'>;
export type InsertBudget = Omit<Budget, 'id' | 'created_at' | 'updated_at'>;
export type InsertIncome = Omit<Income, 'id' | 'created_at'>;

// Aliases para compatibilidad
export type SelectExpense = Expense;
export type SelectCategory = Category;

//==============================================================================
// FUNCIONES DE QUERIES - Categorías
//==============================================================================

export async function getCategoriesByUser(userId: string): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getCategoryTotalExpenses(
  userId: string,
  categoryId: number
): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .eq('category_id', categoryId);

  if (error) throw error;

  const total = (data || []).reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);

  return total;
}

export async function createCategory(category: InsertCategory): Promise<Category> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(
  id: number,
  category: Partial<InsertCategory>
): Promise<Category> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategoryById(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

//==============================================================================
// FUNCIONES DE QUERIES - Métodos de Pago
//==============================================================================

export async function getPaymentMethodsByUser(
  userId: string
): Promise<PaymentMethod[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createPaymentMethod(
  paymentMethod: InsertPaymentMethod
): Promise<PaymentMethod> {
  const supabase = await createClient();

  // Si se marca como default, desmarcar todos los demás
  if (paymentMethod.is_default) {
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', paymentMethod.user_id);
  }

  const { data, error } = await supabase
    .from('payment_methods')
    .insert(paymentMethod)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePaymentMethod(
  id: number,
  paymentMethod: Partial<InsertPaymentMethod>
): Promise<PaymentMethod> {
  const supabase = await createClient();

  // Si se marca como default, desmarcar todos los demás
  if (paymentMethod.is_default) {
    // Obtener el user_id del payment method que se está actualizando
    const { data: current } = await supabase
      .from('payment_methods')
      .select('user_id')
      .eq('id', id)
      .single();

    if (current) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', current.user_id)
        .neq('id', id);
    }
  }

  const { data, error } = await supabase
    .from('payment_methods')
    .update(paymentMethod)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePaymentMethodById(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

//==============================================================================
// FUNCIONES DE QUERIES - Gastos
//==============================================================================

export async function getExpensesByUser(
  userId: string,
  options?: {
    search?: string;
    isRecurring?: boolean;
    offset?: number;
    limit?: number;
  }
): Promise<{
  expenses: Expense[];
  newOffset: number | null;
  totalExpenses: number;
}> {
  const { search, isRecurring, offset = 0, limit = 10 } = options || {};
  const supabase = await createClient();

  // Construir query base
  let query = supabase
    .from('expenses')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  // Aplicar filtros
  if (search) {
    query = query.ilike('description', `%${search}%`);
  }

  if (isRecurring !== undefined) {
    query = query.eq('is_recurring', isRecurring ? 1 : 0);
  }

  // Paginación y orden
  const { data, error, count } = await query
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const newOffset = data && data.length >= limit ? offset + limit : null;

  return {
    expenses: data || [],
    newOffset,
    totalExpenses: count || 0,
  };
}

export async function createExpense(expense: InsertExpense): Promise<Expense> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateExpense(
  id: number,
  expense: Partial<InsertExpense>
): Promise<Expense> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('expenses')
    .update(expense)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExpenseById(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

//==============================================================================
// FUNCIONES DE QUERIES - Presupuestos
//==============================================================================

export async function getBudgetsByUser(userId: string): Promise<Budget[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createBudget(budget: InsertBudget): Promise<Budget> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('budgets')
    .insert(budget)
    .select()
    .single();

  if (error) throw error;
  return data;
}

//==============================================================================
// FUNCIONES DE QUERIES - Ingresos
//==============================================================================

export async function getIncomesByUser(userId: string): Promise<Income[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createIncome(income: InsertIncome): Promise<Income> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incomes')
    .insert(income)
    .select()
    .single();

  if (error) throw error;
  return data;
}

//==============================================================================
// FUNCIONES HELPERS - Gastos Recurrentes
//==============================================================================

export type UpcomingExpense = Expense & {
  isVirtual: true;
  daysUntilDue: number;
  dueMessage: string;
  nextDate: string;
  templateId: number;
};

/**
 * Calcula la próxima fecha de ocurrencia para un gasto recurrente
 */
function getNextOccurrence(
  lastDate: string,
  frequency: string
): Date {
  const date = new Date(lastDate);

  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}

/**
 * Genera mensaje amigable sobre cuándo vence un gasto
 */
function getDueMessage(daysUntilDue: number): string {
  if (daysUntilDue < 0) return 'Vencido';
  if (daysUntilDue === 0) return 'Vence hoy';
  if (daysUntilDue === 1) return 'Vence mañana';
  if (daysUntilDue <= 7) return `Vence en ${daysUntilDue} días`;
  if (daysUntilDue <= 30) return `Vence en ${Math.ceil(daysUntilDue / 7)} semanas`;
  return `Vence en ${Math.ceil(daysUntilDue / 30)} meses`;
}

/**
 * Obtiene las próximas instancias virtuales de gastos recurrentes
 * No crea registros en BD, solo genera la vista de próximos gastos
 */
export async function getUpcomingRecurringExpenses(
  userId: string,
  monthsAhead: number = 3
): Promise<UpcomingExpense[]> {
  const supabase = await createClient();

  // Obtener todos los gastos recurrentes del usuario
  const { data: recurringExpenses, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_recurring', 1);

  if (error) throw error;
  if (!recurringExpenses || recurringExpenses.length === 0) return [];

  // Obtener todos los gastos únicos (que son instancias pagadas de recurrentes)
  const { data: paidExpenses } = await supabase
    .from('expenses')
    .select('date, description')
    .eq('user_id', userId)
    .eq('is_recurring', 0);

  // Crear un Set de fechas ya pagadas para búsqueda rápida
  const paidDatesSet = new Set(
    (paidExpenses || []).map((e) => {
      // Extraer la fecha del formato "Descripción (YYYY-MM-DD)"
      const match = e.description?.match(/\((\d{4}-\d{2}-\d{2})\)$/);
      return match ? match[1] : null;
    }).filter(Boolean)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming: UpcomingExpense[] = [];

  for (const expense of recurringExpenses) {
    if (!expense.recurrence_frequency) continue;

    // Calcular próxima ocurrencia desde la fecha del gasto original
    let nextDate = getNextOccurrence(expense.date, expense.recurrence_frequency);

    // Generar instancias para los próximos N meses
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + monthsAhead);

    while (nextDate <= endDate) {
      const nextDateStr = nextDate.toISOString().split('T')[0];
      const daysUntilDue = Math.floor(
        (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Solo incluir si:
      // 1. Es futuro o vencido reciente (últimos 30 días)
      // 2. NO ha sido pagado ya
      if (daysUntilDue >= -30 && !paidDatesSet.has(nextDateStr)) {
        upcoming.push({
          ...expense,
          isVirtual: true,
          daysUntilDue,
          dueMessage: getDueMessage(daysUntilDue),
          nextDate: nextDateStr,
          templateId: expense.id,
          payment_status: daysUntilDue < 0 ? 'vencido' : 'pendiente'
        });
      }

      // Calcular siguiente ocurrencia
      nextDate = getNextOccurrence(nextDateStr, expense.recurrence_frequency);
    }
  }

  // Ordenar por fecha (más cercano primero)
  return upcoming.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

//==============================================================================
// FUNCIONES PARA DASHBOARD - Resúmenes y Estadísticas
//==============================================================================

export type MonthlySummary = {
  year: number;
  month: number;
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  expensesCount: number;
  incomesCount: number;
};

export type OverdueExpensesSummary = {
  count: number;
  total: number;
  expenses: Expense[];
};

export type CategorySummary = {
  categoryId: number;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string;
  total: number;
  count: number;
  percentage: number;
};

/**
 * Obtiene el resumen de gastos de un mes específico
 */
export async function getMonthlyExpensesSummary(
  userId: string,
  year: number,
  month: number
): Promise<{ total: number; count: number }> {
  const supabase = await createClient();

  // Calcular primer y último día del mes
  const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const lastDay = new Date(year, month, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .gte('date', firstDay)
    .lte('date', lastDay);

  if (error) throw error;

  const total = (data || []).reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);

  return { total, count: data?.length || 0 };
}

/**
 * Obtiene el resumen de ingresos de un mes específico
 */
export async function getMonthlyIncomesSummary(
  userId: string,
  year: number,
  month: number
): Promise<{ total: number; count: number }> {
  const supabase = await createClient();

  // Calcular primer y último día del mes
  const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const lastDay = new Date(year, month, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('incomes')
    .select('amount')
    .eq('user_id', userId)
    .gte('date', firstDay)
    .lte('date', lastDay);

  if (error) throw error;

  const total = (data || []).reduce((sum, income) => {
    return sum + parseFloat(income.amount);
  }, 0);

  return { total, count: data?.length || 0 };
}

/**
 * Obtiene resumen completo de un mes (gastos + ingresos + balance)
 */
export async function getMonthlySummary(
  userId: string,
  year: number,
  month: number
): Promise<MonthlySummary> {
  const expenses = await getMonthlyExpensesSummary(userId, year, month);
  const incomes = await getMonthlyIncomesSummary(userId, year, month);

  return {
    year,
    month,
    totalExpenses: expenses.total,
    totalIncome: incomes.total,
    balance: incomes.total - expenses.total,
    expensesCount: expenses.count,
    incomesCount: incomes.count
  };
}

/**
 * Obtiene gastos vencidos (fecha pasada y no pagados)
 */
export async function getOverdueExpenses(
  userId: string
): Promise<OverdueExpensesSummary> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .lt('date', today)
    .neq('payment_status', 'pagado')
    .order('date', { ascending: true });

  if (error) throw error;

  const expenses = data || [];
  const total = expenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);

  return {
    count: expenses.length,
    total,
    expenses
  };
}

/**
 * Obtiene gastos pendientes próximos a vencer
 */
export async function getUpcomingDueExpenses(
  userId: string,
  limit: number = 10
): Promise<Expense[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .gte('date', today)
    .neq('payment_status', 'pagado')
    .order('date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Obtiene top categorías con mayor gasto en un mes
 */
export async function getTopCategoriesByMonth(
  userId: string,
  year: number,
  month: number,
  limit: number = 5
): Promise<CategorySummary[]> {
  const supabase = await createClient();

  // Calcular primer y último día del mes
  const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const lastDay = new Date(year, month, 0).toISOString().split('T')[0];

  // Obtener gastos del mes con su categoría
  const { data: expenses, error: expensesError } = await supabase
    .from('expenses')
    .select('amount, category_id')
    .eq('user_id', userId)
    .gte('date', firstDay)
    .lte('date', lastDay);

  if (expensesError) throw expensesError;
  if (!expenses || expenses.length === 0) return [];

  // Obtener todas las categorías del usuario
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (categoriesError) throw categoriesError;

  // Agrupar gastos por categoría
  const categoryTotals = new Map<number, { total: number; count: number }>();

  expenses.forEach((expense) => {
    const current = categoryTotals.get(expense.category_id) || {
      total: 0,
      count: 0
    };
    current.total += parseFloat(expense.amount);
    current.count += 1;
    categoryTotals.set(expense.category_id, current);
  });

  // Calcular total general para porcentajes
  const grandTotal = Array.from(categoryTotals.values()).reduce(
    (sum, cat) => sum + cat.total,
    0
  );

  // Crear resumen con información de categoría
  const summaries: CategorySummary[] = Array.from(categoryTotals.entries())
    .map(([categoryId, stats]) => {
      const category = categories?.find((c) => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || 'Sin categoría',
        categoryIcon: category?.icon || null,
        categoryColor: category?.color || '#6B7280',
        total: stats.total,
        count: stats.count,
        percentage: grandTotal > 0 ? (stats.total / grandTotal) * 100 : 0
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);

  return summaries;
}

/**
 * Calcula proyección de gastos del próximo mes basado en gastos recurrentes
 */
export async function getNextMonthProjection(
  userId: string
): Promise<{ total: number; count: number }> {
  const supabase = await createClient();

  // Obtener gastos recurrentes activos
  const { data: recurringExpenses, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .eq('is_recurring', 1);

  if (error) throw error;

  const total = (recurringExpenses || []).reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);

  return { total, count: recurringExpenses?.length || 0 };
}
