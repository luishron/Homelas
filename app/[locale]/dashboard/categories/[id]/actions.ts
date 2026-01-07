'use server';

import { revalidatePath } from 'next/cache';
import {
  setCategoryMonthlyLimit,
  disableCategoryLimit
} from '@/lib/category-limits-supabase';

export async function setCategoryLimitAction(
  categoryId: number,
  limite: number,
  alertaEn: number = 80
) {
  try {
    await setCategoryMonthlyLimit(categoryId, limite, alertaEn);
    revalidatePath(`/dashboard/categorias/${categoryId}`);
    return { success: true };
  } catch (error) {
    console.error('Error setting category limit:', error);
    throw error;
  }
}

export async function disableCategoryLimitAction(categoryId: number) {
  try {
    await disableCategoryLimit(categoryId);
    revalidatePath(`/dashboard/categorias/${categoryId}`);
    return { success: true };
  } catch (error) {
    console.error('Error disabling category limit:', error);
    throw error;
  }
}
