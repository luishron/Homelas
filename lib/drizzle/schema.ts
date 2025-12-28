import {
  pgTable,
  serial,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  unique,
  boolean,
  pgEnum,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

//==============================================================================
// ENUMS
//==============================================================================
export const userPlanEnum = pgEnum('user_plan', ['free', 'pro', 'plus', 'admin']);

//==============================================================================
// TABLA: user_profiles (Perfiles de usuario con sistema de planes)
//==============================================================================
export const userProfiles = pgTable(
  'user_profiles',
  {
    id: uuid('id').primaryKey(),
    email: text('email'),
    fullName: text('full_name'),
    plan: userPlanEnum('plan').notNull().default('free'),
    planExpiresAt: timestamp('plan_expires_at', { withTimezone: true }),

    // Metadata
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    avatarUrl: text('avatar_url'),
    timezone: text('timezone').default('America/Mexico_City'),
    language: text('language').default('es'),

    // Límites personalizables
    maxMonthlyExpenses: integer('max_monthly_expenses'),
    maxCategories: integer('max_categories'),

    // Onboarding y preferences
    onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
    preferences: jsonb('preferences').$type<{
      currency?: 'USD' | 'MXN';
      theme?: 'light' | 'dark' | 'system';
      [key: string]: any;
    }>().default({ currency: 'MXN', theme: 'system' }),
  },
  (table) => ({
    planIdx: index('idx_user_profiles_plan').on(table.plan),
    emailIdx: index('idx_user_profiles_email').on(table.email),
  })
);

//==============================================================================
// TABLA: categories (Categorías de gastos)
//==============================================================================
export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    name: text('name').notNull(),
    color: text('color').notNull().default('#6B7280'),
    icon: text('icon'),
    description: text('description'),
    // 🎯 Columna flexible para datos adicionales sin migraciones
    metadata: jsonb('metadata').$type<{
      orden?: number;
      esDefault?: boolean;
      limiteAlerta?: number;
      tags?: string[];
      [key: string]: any;
    }>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_categories_user_id').on(table.userId),
    uniqueUserName: unique('categories_user_id_name_key').on(table.userId, table.name),
  })
);

//==============================================================================
// TABLA: payment_methods (Métodos de pago)
//==============================================================================
export const paymentMethods = pgTable(
  'payment_methods',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    name: text('name').notNull(),
    type: text('type').notNull(), // 'tarjeta_credito' | 'tarjeta_debito' | 'efectivo' | 'transferencia' | 'otro'
    bank: text('bank'),
    lastFourDigits: text('last_four_digits'),
    icon: text('icon'),
    color: text('color').notNull(),
    isDefault: integer('is_default').notNull().default(0),
    // 🎯 Columna flexible para datos adicionales
    metadata: jsonb('metadata').$type<{
      limiteCredito?: number;
      fechaVencimiento?: string;
      recompensas?: {
        tipo: string;
        porcentaje: number;
      };
      [key: string]: any;
    }>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_payment_methods_user_id').on(table.userId),
  })
);

//==============================================================================
// TABLA: expenses (Gastos)
//==============================================================================
export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    categoryId: integer('category_id').notNull(),
    amount: text('amount').notNull(),
    description: text('description'),
    date: text('date').notNull(),
    paymentMethod: text('payment_method'),
    paymentStatus: text('payment_status'), // 'pagado' | 'pendiente' | 'vencido'
    notes: text('notes'),
    isRecurring: integer('is_recurring').default(0),
    recurrenceFrequency: text('recurrence_frequency'), // 'weekly' | 'monthly' | 'yearly'
    // 🎯 Columna flexible para datos adicionales sin migraciones
    metadata: jsonb('metadata').$type<{
      tienda?: string;
      numeroOrden?: string;
      enlaceFactura?: string;
      cuotas?: number;
      tags?: string[];
      ubicacion?: {
        lat: number;
        lng: number;
        nombre?: string;
      };
      adjuntos?: Array<{
        nombre: string;
        url: string;
        tipo: string;
      }>;
      compartidoCon?: string[];
      [key: string]: any;
    }>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_expenses_user_id').on(table.userId),
    categoryIdIdx: index('idx_expenses_category_id').on(table.categoryId),
    dateIdx: index('idx_expenses_date').on(table.date),
    recurringIdx: index('idx_expenses_recurring').on(table.userId, table.isRecurring),
  })
);

//==============================================================================
// TABLA: budgets (Presupuestos)
//==============================================================================
export const budgets = pgTable(
  'budgets',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    categoryId: integer('category_id').notNull(),
    amount: text('amount').notNull(),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    // 🎯 Columna flexible para datos adicionales
    metadata: jsonb('metadata').$type<{
      alertaEn?: number; // % del presupuesto para alertar
      notas?: string;
      [key: string]: any;
    }>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_budgets_user_id').on(table.userId),
    categoryIdIdx: index('idx_budgets_category_id').on(table.categoryId),
    monthYearIdx: index('idx_budgets_month_year').on(table.year, table.month),
    uniqueBudget: unique('budgets_user_id_category_id_month_year_key').on(
      table.userId,
      table.categoryId,
      table.month,
      table.year
    ),
  })
);

//==============================================================================
// TABLA: income_categories (Categorías de ingresos)
//==============================================================================
export const incomeCategories = pgTable(
  'income_categories',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    name: text('name').notNull(),
    color: text('color').notNull(),
    icon: text('icon'),
    description: text('description'),
    // 🎯 Columna flexible para datos adicionales
    metadata: jsonb('metadata').$type<{
      orden?: number;
      tags?: string[];
      [key: string]: any;
    }>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_income_categories_user_id').on(table.userId),
  })
);

//==============================================================================
// TABLA: incomes (Ingresos)
//==============================================================================
export const incomes = pgTable(
  'incomes',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    source: text('source').notNull(),
    amount: text('amount').notNull(),
    date: text('date').notNull(),
    description: text('description'),
    categoryId: integer('category_id'),
    paymentMethod: text('payment_method'),
    isRecurring: integer('is_recurring').default(0),
    recurrenceFrequency: text('recurrence_frequency'),
    notes: text('notes'),
    // 🎯 Columna flexible para datos adicionales
    metadata: jsonb('metadata').$type<{
      empresa?: string;
      tipoIngreso?: string;
      referencia?: string;
      tags?: string[];
      [key: string]: any;
    }>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_incomes_user_id').on(table.userId),
    dateIdx: index('idx_incomes_date').on(table.date),
  })
);

//==============================================================================
// TABLA: statistics (Estadísticas mensuales)
//==============================================================================
export const statistics = pgTable(
  'statistics',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    totalExpenses: text('total_expenses').notNull().default('0'),
    totalIncome: text('total_income').notNull().default('0'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_statistics_user_id').on(table.userId),
    monthYearIdx: index('idx_statistics_month_year').on(table.year, table.month),
    uniqueStats: unique('statistics_user_id_month_year_key').on(
      table.userId,
      table.month,
      table.year
    ),
  })
);

//==============================================================================
// TIPOS INFERIDOS PARA TYPESCRIPT
//==============================================================================
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;

export type IncomeCategory = typeof incomeCategories.$inferSelect;
export type NewIncomeCategory = typeof incomeCategories.$inferInsert;

export type Income = typeof incomes.$inferSelect;
export type NewIncome = typeof incomes.$inferInsert;

export type Statistic = typeof statistics.$inferSelect;
export type NewStatistic = typeof statistics.$inferInsert;
