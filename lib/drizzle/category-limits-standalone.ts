/**
 * Funciones para manejar límites de gasto en categorías (versión standalone)
 * Para usar en scripts fuera de Next.js
 */

import { db } from './client-standalone';
import { categories, expenses } from './schema';
import { eq, and, sql } from 'drizzle-orm';

export type CategoryLimitMetadata = {
  limitesMensuales?: {
    limite: number;
    alertaEn?: number;
    activo?: boolean;
  };
  [key: string]: any;
};

export type CategoryBudgetStatus = {
  categoryId: number;
  categoryName: string;
  limite: number;
  gastado: number;
  disponible: number;
  porcentajeUsado: number;
  excedido: boolean;
  alertaActiva: boolean;
  mes: number;
  año: number;
};

export async function setCategoryMonthlyLimit(
  categoryId: number,
  limite: number,
  alertaEn: number = 80
): Promise<void> {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));

  if (!category) {
    throw new Error(`Categoría ${categoryId} no encontrada`);
  }

  await db
    .update(categories)
    .set({
      metadata: {
        ...(category.metadata as any),
        limitesMensuales: {
          limite,
          alertaEn,
          activo: true
        }
      }
    })
    .where(eq(categories.id, categoryId));
}

export async function disableCategoryLimit(categoryId: number): Promise<void> {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));

  if (!category) {
    throw new Error(`Categoría ${categoryId} no encontrada`);
  }

  await db
    .update(categories)
    .set({
      metadata: {
        ...(category.metadata as any),
        limitesMensuales: {
          ...(category.metadata as any)?.limitesMensuales,
          activo: false
        }
      }
    })
    .where(eq(categories.id, categoryId));
}

export async function getCategoryMonthlySpending(
  categoryId: number,
  userId: string,
  mes?: number,
  año?: number
): Promise<number> {
  const now = new Date();
  const targetMonth = mes || now.getMonth() + 1;
  const targetYear = año || now.getFullYear();

  const firstDay = new Date(targetYear, targetMonth - 1, 1)
    .toISOString()
    .split('T')[0];
  const lastDay = new Date(targetYear, targetMonth, 0)
    .toISOString()
    .split('T')[0];

  const monthExpenses = await db
    .select()
    .from(expenses)
    .where(
      and(
        eq(expenses.categoryId, categoryId),
        eq(expenses.userId, userId),
        sql`${expenses.date} >= ${firstDay}`,
        sql`${expenses.date} <= ${lastDay}`
      )
    );

  const total = monthExpenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);

  return total;
}

export async function getCategoryBudgetStatus(
  categoryId: number,
  userId: string,
  mes?: number,
  año?: number
): Promise<CategoryBudgetStatus | null> {
  const now = new Date();
  const targetMonth = mes || now.getMonth() + 1;
  const targetYear = año || now.getFullYear();

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));

  if (!category) {
    return null;
  }

  const metadata = category.metadata as CategoryLimitMetadata;
  const limiteConfig = metadata?.limitesMensuales;

  if (!limiteConfig || !limiteConfig.activo) {
    return null;
  }

  const limite = limiteConfig.limite;
  const alertaEn = limiteConfig.alertaEn || 80;

  const gastado = await getCategoryMonthlySpending(
    categoryId,
    userId,
    targetMonth,
    targetYear
  );

  const disponible = limite - gastado;
  const porcentajeUsado = (gastado / limite) * 100;
  const excedido = gastado > limite;
  const alertaActiva = porcentajeUsado >= alertaEn;

  return {
    categoryId: category.id,
    categoryName: category.name,
    limite,
    gastado,
    disponible,
    porcentajeUsado,
    excedido,
    alertaActiva,
    mes: targetMonth,
    año: targetYear
  };
}

export async function getAllCategoriesBudgetStatus(
  userId: string,
  mes?: number,
  año?: number
): Promise<CategoryBudgetStatus[]> {
  const userCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId));

  const statuses: CategoryBudgetStatus[] = [];

  for (const category of userCategories) {
    const metadata = category.metadata as CategoryLimitMetadata;

    if (metadata?.limitesMensuales?.activo) {
      const status = await getCategoryBudgetStatus(
        category.id,
        userId,
        mes,
        año
      );

      if (status) {
        statuses.push(status);
      }
    }
  }

  return statuses.sort((a, b) => b.porcentajeUsado - a.porcentajeUsado);
}

export async function getExceededCategories(
  userId: string,
  mes?: number,
  año?: number
): Promise<CategoryBudgetStatus[]> {
  const allStatuses = await getAllCategoriesBudgetStatus(userId, mes, año);
  return allStatuses.filter(status => status.excedido);
}

export async function getCategoriesWithAlert(
  userId: string,
  mes?: number,
  año?: number
): Promise<CategoryBudgetStatus[]> {
  const allStatuses = await getAllCategoriesBudgetStatus(userId, mes, año);
  return allStatuses.filter(status => status.alertaActiva && !status.excedido);
}

export async function wouldExceedLimit(
  categoryId: number,
  userId: string,
  amount: number,
  mes?: number,
  año?: number
): Promise<{
  excederia: boolean;
  status: CategoryBudgetStatus | null;
  nuevoTotal: number;
}> {
  const status = await getCategoryBudgetStatus(categoryId, userId, mes, año);

  if (!status) {
    return {
      excederia: false,
      status: null,
      nuevoTotal: amount
    };
  }

  const nuevoTotal = status.gastado + amount;
  const excederia = nuevoTotal > status.limite;

  return {
    excederia,
    status,
    nuevoTotal
  };
}
