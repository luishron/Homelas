import 'server-only';

import { db } from './client';
import { userProfiles, expenses, categories, incomes } from './schema';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { cache } from 'react';

/**
 * Drizzle Query Examples
 *
 * These are example queries showing how to use Drizzle ORM
 * You can gradually migrate from lib/db.ts to these patterns
 */

// ============================================================================
// USER PROFILES
// ============================================================================

/**
 * Get user profile by ID
 */
export const getUserProfileById = cache(async (userId: string) => {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, userId))
    .limit(1);

  return profile || null;
});

/**
 * Get all users by plan
 */
export async function getUsersByPlan(plan: 'free' | 'pro' | 'plus' | 'admin') {
  return await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.plan, plan));
}

/**
 * Update user plan
 */
export async function updateUserPlan(
  userId: string,
  plan: 'free' | 'pro' | 'plus' | 'admin',
  expiresAt?: Date
) {
  await db
    .update(userProfiles)
    .set({
      plan,
      planExpiresAt: expiresAt || null,
      updatedAt: sql`now()`,
    })
    .where(eq(userProfiles.id, userId));
}

// ============================================================================
// EXPENSES
// ============================================================================

/**
 * Get user's expenses with category info
 */
export async function getExpensesWithCategories(userId: string) {
  return await db
    .select({
      expense: expenses,
      category: categories,
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date));
}

/**
 * Get expenses by date range
 */
export async function getExpensesByDateRange(
  userId: string,
  startDate: string,
  endDate: string
) {
  return await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    )
    .orderBy(desc(expenses.date));
}

/**
 * Get total expenses for a month
 */
export async function getMonthlyTotal(userId: string, year: number, month: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const [result] = await db
    .select({
      total: sql<string>`COALESCE(SUM(CAST(${expenses.amount} AS NUMERIC)), 0)`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    );

  return result?.total || '0';
}

/**
 * Create new expense
 */
export async function createExpense(data: {
  userId: string;
  categoryId: number;
  amount: string;
  description?: string;
  date: string;
  paymentMethod?: string;
  paymentStatus?: string;
}) {
  const [expense] = await db
    .insert(expenses)
    .values(data)
    .returning();

  return expense;
}

/**
 * Delete expense
 */
export async function deleteExpense(expenseId: number, userId: string) {
  await db
    .delete(expenses)
    .where(
      and(
        eq(expenses.id, expenseId),
        eq(expenses.userId, userId)
      )
    );
}

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Get user's categories
 */
export const getUserCategories = cache(async (userId: string) => {
  return await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.name);
});

/**
 * Get category with expense count
 */
export async function getCategoryWithStats(categoryId: number, userId: string) {
  const [result] = await db
    .select({
      category: categories,
      expenseCount: sql<number>`COUNT(${expenses.id})`,
      totalAmount: sql<string>`COALESCE(SUM(CAST(${expenses.amount} AS NUMERIC)), 0)`,
    })
    .from(categories)
    .leftJoin(
      expenses,
      and(
        eq(expenses.categoryId, categories.id),
        eq(expenses.userId, userId)
      )
    )
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.userId, userId)
      )
    )
    .groupBy(categories.id);

  return result || null;
}

/**
 * Create category
 */
export async function createCategory(data: {
  userId: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
}) {
  const [category] = await db
    .insert(categories)
    .values(data)
    .returning();

  return category;
}

// ============================================================================
// COMPLEX QUERIES
// ============================================================================

/**
 * Get dashboard summary with joins
 */
export async function getDashboardSummary(userId: string, month: number, year: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  // Get totals
  const [totals] = await db
    .select({
      totalExpenses: sql<string>`COALESCE(SUM(CAST(${expenses.amount} AS NUMERIC)), 0)`,
      expenseCount: sql<number>`COUNT(${expenses.id})`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    );

  // Get top categories
  const topCategories = await db
    .select({
      category: categories.name,
      categoryId: categories.id,
      total: sql<string>`SUM(CAST(${expenses.amount} AS NUMERIC))`,
      count: sql<number>`COUNT(${expenses.id})`,
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    )
    .groupBy(categories.id, categories.name)
    .orderBy(desc(sql`SUM(CAST(${expenses.amount} AS NUMERIC))`))
    .limit(5);

  return {
    totalExpenses: totals?.totalExpenses || '0',
    expenseCount: totals?.expenseCount || 0,
    topCategories,
  };
}

/**
 * Raw SQL example for complex queries
 */
export async function getCustomReport(userId: string) {
  return await sql`
    SELECT
      c.name as category_name,
      COUNT(e.id) as expense_count,
      SUM(CAST(e.amount AS NUMERIC)) as total_amount,
      AVG(CAST(e.amount AS NUMERIC)) as avg_amount
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.user_id = ${userId}
    GROUP BY c.id, c.name
    ORDER BY total_amount DESC
  `;
}
