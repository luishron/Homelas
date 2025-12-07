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
