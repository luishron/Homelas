/**
 * Funciones para manejar límites de gasto en categorías usando metadata
 *
 * Permite establecer límites mensuales sin necesidad de migraciones
 */

import 'server-only';
import { db } from './client';
import { categories, expenses } from './schema';
import { eq, and, sql } from 'drizzle-orm';

//==============================================================================
// TIPOS
//==============================================================================

export type CategoryLimitMetadata = {
  limitesMensuales?: {
    limite: number;
    alertaEn?: number; // % del límite para alertar (ej: 80 = alerta al 80%)
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

//==============================================================================
// FUNCIONES PARA ESTABLECER LÍMITES
//==============================================================================

/**
 * Establece el límite mensual de gasto para una categoría
 */
export async function setCategoryMonthlyLimit(
  categoryId: number,
  limite: number,
  alertaEn: number = 80
): Promise<void> {
  // Obtener metadata actual
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));

  if (!category) {
    throw new Error(`Categoría ${categoryId} no encontrada`);
  }

  // Actualizar con el límite en metadata
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

/**
 * Desactiva el límite mensual de una categoría
 */
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

//==============================================================================
// FUNCIONES PARA OBTENER ESTADO DEL PRESUPUESTO
//==============================================================================

/**
 * Obtiene el total gastado en una categoría en un mes específico
 */
export async function getCategoryMonthlySpending(
  categoryId: number,
  userId: string,
  mes?: number,
  año?: number
): Promise<number> {
  const now = new Date();
  const targetMonth = mes || now.getMonth() + 1;
  const targetYear = año || now.getFullYear();

  // Calcular primer y último día del mes
  const firstDay = new Date(targetYear, targetMonth - 1, 1)
    .toISOString()
    .split('T')[0];
  const lastDay = new Date(targetYear, targetMonth, 0)
    .toISOString()
    .split('T')[0];

  // Obtener gastos del mes
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

  // Sumar total
  const total = monthExpenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);

  return total;
}

/**
 * Obtiene el estado completo del presupuesto de una categoría
 */
export async function getCategoryBudgetStatus(
  categoryId: number,
  userId: string,
  mes?: number,
  año?: number
): Promise<CategoryBudgetStatus | null> {
  const now = new Date();
  const targetMonth = mes || now.getMonth() + 1;
  const targetYear = año || now.getFullYear();

  // Obtener categoría con metadata
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));

  if (!category) {
    return null;
  }

  const metadata = category.metadata as CategoryLimitMetadata;
  const limiteConfig = metadata?.limitesMensuales;

  // Si no tiene límite configurado o está inactivo
  if (!limiteConfig || !limiteConfig.activo) {
    return null;
  }

  const limite = limiteConfig.limite;
  const alertaEn = limiteConfig.alertaEn || 80;

  // Obtener total gastado en el mes
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

/**
 * Obtiene el estado de todas las categorías con límite
 */
export async function getAllCategoriesBudgetStatus(
  userId: string,
  mes?: number,
  año?: number
): Promise<CategoryBudgetStatus[]> {
  // Obtener todas las categorías del usuario
  const userCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId));

  const statuses: CategoryBudgetStatus[] = [];

  for (const category of userCategories) {
    const metadata = category.metadata as CategoryLimitMetadata;

    // Solo procesar categorías con límite activo
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

  // Ordenar por porcentaje usado (más alto primero)
  return statuses.sort((a, b) => b.porcentajeUsado - a.porcentajeUsado);
}

/**
 * Obtiene solo las categorías que excedieron el límite
 */
export async function getExceededCategories(
  userId: string,
  mes?: number,
  año?: number
): Promise<CategoryBudgetStatus[]> {
  const allStatuses = await getAllCategoriesBudgetStatus(userId, mes, año);
  return allStatuses.filter(status => status.excedido);
}

/**
 * Obtiene solo las categorías que activaron la alerta
 */
export async function getCategoriesWithAlert(
  userId: string,
  mes?: number,
  año?: number
): Promise<CategoryBudgetStatus[]> {
  const allStatuses = await getAllCategoriesBudgetStatus(userId, mes, año);
  return allStatuses.filter(status => status.alertaActiva && !status.excedido);
}

//==============================================================================
// FUNCIONES HELPER
//==============================================================================

/**
 * Verifica si agregar un gasto excedería el límite de la categoría
 */
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
