import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { getMonthlySummaryGeneric, calculateExpenseStats } from '@/lib/db-helpers';
import type { CurrencyCode } from '@/lib/config/currencies';

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
  metadata?: Record<string, any> | null;
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
  metadata?: Record<string, any> | null;
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
  metadata?: Record<string, any> | null;
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
  metadata?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
};

export type IncomeCategory = {
  id: number;
  user_id: string;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
  metadata?: Record<string, any> | null;
  created_at?: string;
};

export type Income = {
  id: number;
  user_id: string;
  source: string;
  amount: string;
  date: string;
  description?: string | null;
  category_id?: number | null;
  payment_method?: string | null;
  is_recurring?: number;
  recurrence_frequency?: string | null;
  notes?: string | null;
  metadata?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
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

export type UserRole = 'free' | 'premium';

export type UserProfile = {
  id: string;
  role: UserRole;
  plan_expires_at?: string | null;
  onboarding_completed: boolean;
  timezone?: string | null;
  preferences?: {
    currency?: CurrencyCode;
    theme?: 'light' | 'dark' | 'system';
    language?: 'es' | 'en';
    [key: string]: any;
  } | null;
  full_name?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type InsertCategory = Omit<Category, 'id' | 'created_at'>;
export type InsertIncomeCategory = Omit<IncomeCategory, 'id' | 'created_at'>;
export type InsertPaymentMethod = Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>;
export type InsertExpense = Omit<Expense, 'id' | 'created_at' | 'updated_at'>;
export type InsertBudget = Omit<Budget, 'id' | 'created_at' | 'updated_at'>;
export type InsertIncome = Omit<Income, 'id' | 'created_at' | 'updated_at'>;
export type InsertUserProfile = Omit<UserProfile, 'created_at' | 'updated_at'>;

// Aliases para compatibilidad
export type SelectExpense = Expense;
export type SelectCategory = Category;

//==============================================================================
// FUNCIONES DE QUERIES - User Profiles
//==============================================================================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
}

export async function createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<InsertUserProfile>
): Promise<UserProfile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeOnboarding(userId: string): Promise<UserProfile> {
  const supabase = await createClient();

  // Update user_profiles table
  const profile = await updateUserProfile(userId, { onboarding_completed: true });

  // Update user metadata in auth for faster middleware checks (no DB query needed)
  await supabase.auth.updateUser({
    data: { onboarding_completed: true }
  });

  return profile;
}

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

export async function getCategoryById(
  userId: string,
  categoryId: number
): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .eq('id', categoryId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data;
}

export async function getExpensesByCategoryId(
  userId: string,
  categoryId: number
): Promise<Expense[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCategoryStatistics(
  userId: string,
  categoryId: number
): Promise<{
  totalSpent: number;
  expenseCount: number;
  averageExpense: number;
  paidTotal: number;
  pendingTotal: number;
  overdueTotal: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('amount, payment_status, date')
    .eq('user_id', userId)
    .eq('category_id', categoryId);

  if (error) throw error;

  const stats = calculateExpenseStats(expenses || [], today);

  return {
    ...stats,
    averageExpense: stats.expenseCount > 0 ? stats.totalSpent / stats.expenseCount : 0
  };
}

export async function getCategoryMonthlyTrend(
  userId: string,
  categoryId: number,
  months = 6
): Promise<Array<{ month: string; total: number; count: number }>> {
  const supabase = await createClient();

  // Calculate date range (last N months)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('amount, date')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0]);

  if (error) throw error;

  // Group by month
  const monthlyData = new Map<string, { total: number; count: number }>();

  (expenses || []).forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const existing = monthlyData.get(monthKey) || { total: 0, count: 0 };
    existing.total += parseFloat(expense.amount);
    existing.count++;
    monthlyData.set(monthKey, existing);
  });

  // Convert to array and sort by month
  const result = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      total: data.total,
      count: data.count
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return result;
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
  const { data, error} = await supabase
    .from('incomes')
    .insert(income)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIncome(
  id: number,
  income: Partial<InsertIncome>
): Promise<Income> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incomes')
    .update(income)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIncomeById(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('incomes').delete().eq('id', id);

  if (error) throw error;
}

//==============================================================================
// FUNCIONES DE QUERIES - Categorías de Ingresos
//==============================================================================

export async function getIncomeCategoriesByUser(
  userId: string
): Promise<IncomeCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createIncomeCategory(
  category: InsertIncomeCategory
): Promise<IncomeCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIncomeCategory(
  id: number,
  category: Partial<InsertIncomeCategory>
): Promise<IncomeCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIncomeCategoryById(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('income_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
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
 * Genera todas las instancias futuras de un gasto recurrente usando recursividad
 * @param expense Gasto recurrente base
 * @param currentDate Fecha actual a procesar
 * @param endDate Fecha límite
 * @param today Fecha de hoy
 * @param paidDatesSet Set de fechas ya pagadas
 * @param accumulator Array acumulador de resultados (tail recursion)
 */
function generateRecurringInstances(
  expense: Expense,
  currentDate: Date,
  endDate: Date,
  today: Date,
  paidDatesSet: Set<string | null>,
  accumulator: UpcomingExpense[] = []
): UpcomingExpense[] {
  // Caso base: si la fecha actual excede la fecha límite
  if (currentDate > endDate) {
    return accumulator;
  }

  const nextDateStr = currentDate.toISOString().split('T')[0];
  const daysUntilDue = Math.floor(
    (currentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Solo incluir si es futuro/vencido reciente y no ha sido pagado
  if (daysUntilDue >= -30 && !paidDatesSet.has(nextDateStr)) {
    accumulator.push({
      ...expense,
      isVirtual: true,
      daysUntilDue,
      dueMessage: getDueMessage(daysUntilDue),
      nextDate: nextDateStr,
      templateId: expense.id,
      payment_status: daysUntilDue < 0 ? 'vencido' : 'pendiente'
    });
  }

  // Caso recursivo: calcular siguiente ocurrencia
  const nextOccurrence = getNextOccurrence(nextDateStr, expense.recurrence_frequency!);

  return generateRecurringInstances(
    expense,
    nextOccurrence,
    endDate,
    today,
    paidDatesSet,
    accumulator
  );
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

  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  // Generar instancias usando recursividad para cada gasto recurrente
  const upcoming: UpcomingExpense[] = recurringExpenses.reduce<UpcomingExpense[]>(
    (acc, expense) => {
      if (!expense.recurrence_frequency) return acc;

      // Calcular próxima ocurrencia desde la fecha del gasto original
      const nextDate = getNextOccurrence(expense.date, expense.recurrence_frequency);

      // Generar instancias recursivamente
      const instances = generateRecurringInstances(
        expense,
        nextDate,
        endDate,
        today,
        paidDatesSet
      );

      return [...acc, ...instances];
    },
    []
  );

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
  return getMonthlySummaryGeneric('expenses', userId, year, month);
}

/**
 * Obtiene el resumen de ingresos de un mes específico
 */
export async function getMonthlyIncomesSummary(
  userId: string,
  year: number,
  month: number
): Promise<{ total: number; count: number }> {
  return getMonthlySummaryGeneric('incomes', userId, year, month);
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
 * Obtiene gastos que requieren atención en el mes actual
 * (vencidos + próximos a vencer en los próximos daysAhead días)
 */
export async function getAttentionRequiredExpenses(
  userId: string,
  daysAhead: number = 7
): Promise<Expense[]> {
  const supabase = await createClient();

  // Boundaries del mes actual
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  const monthStart = new Date(currentYear, currentMonth, 1)
    .toISOString().split('T')[0];
  const monthEnd = new Date(currentYear, currentMonth + 1, 0)
    .toISOString().split('T')[0];

  // Today + daysAhead
  const todayStr = today.toISOString().split('T')[0];
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysAhead);
  const futureDateStr = futureDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .neq('payment_status', 'pagado')
    // TODOS los vencidos (sin límite de mes) O próximos 7 días del mes actual
    .or(`date.lt.${todayStr},and(date.gte.${todayStr},date.lte.${futureDateStr},date.gte.${monthStart},date.lte.${monthEnd})`)
    .order('date', { ascending: true });

  if (error) throw error;

  // Sort in-memory: vencidos primero
  const expenses = data || [];
  const todayTime = new Date(todayStr).getTime();

  return expenses.sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    const aOverdue = aDate < todayTime;
    const bOverdue = bDate < todayTime;

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return aDate - bDate;
  });
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
