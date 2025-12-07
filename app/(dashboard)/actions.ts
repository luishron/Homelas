'use server';

import {
  deleteExpenseById,
  deleteCategoryById,
  createExpense,
  updateExpense as updateExpenseInDb,
  createCategory,
  updateCategory as updateCategoryInDb
} from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/auth';

export async function saveExpense(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const userId = user.id;

    const description = formData.get('description') as string;
    const amount = formData.get('amount') as string;
    const date = formData.get('date') as string;
    const categoryId = formData.get('categoryId') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const paymentStatus = formData.get('paymentStatus') as string;
    const isRecurring = formData.get('isRecurring') === 'true';
    const recurrenceFrequency = formData.get('recurrenceFrequency') as string;
    const notes = formData.get('notes') as string;

    await createExpense({
      user_id: userId,
      category_id: parseInt(categoryId),
      amount,
      description,
      date,
      payment_method: paymentMethod,
      payment_status: paymentStatus as any,
      is_recurring: isRecurring ? 1 : 0,
      recurrence_frequency: isRecurring ? recurrenceFrequency : null,
      notes
    });

    revalidatePath('/gastos');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar gasto:', error);
    return { error: 'Error al guardar el gasto' };
  }
}

export async function updateExpense(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const id = Number(formData.get('id'));
    const description = formData.get('description') as string;
    const amount = formData.get('amount') as string;
    const date = formData.get('date') as string;
    const categoryId = formData.get('categoryId') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const paymentStatus = formData.get('paymentStatus') as string;
    const isRecurring = formData.get('isRecurring') === 'true';
    const recurrenceFrequency = formData.get('recurrenceFrequency') as string;
    const notes = formData.get('notes') as string;

    await updateExpenseInDb(id, {
      category_id: parseInt(categoryId),
      amount,
      description,
      date,
      payment_method: paymentMethod,
      payment_status: paymentStatus as any,
      is_recurring: isRecurring ? 1 : 0,
      recurrence_frequency: isRecurring ? recurrenceFrequency : null,
      notes
    });

    revalidatePath('/gastos');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar gasto:', error);
    return { error: 'Error al actualizar el gasto' };
  }
}

export async function deleteExpense(formData: FormData) {
  let id = Number(formData.get('id'));
  await deleteExpenseById(id);
  revalidatePath('/gastos');
}

export async function deleteCategory(formData: FormData) {
  let id = Number(formData.get('id'));
  await deleteCategoryById(id);
  revalidatePath('/categorias');
}

export async function updateCategory(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const id = Number(formData.get('id'));
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;
    const icon = formData.get('icon') as string;
    const description = formData.get('description') as string;

    await updateCategoryInDb(id, {
      name,
      color,
      icon,
      description
    });

    revalidatePath('/categorias');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return { error: 'Error al actualizar la categoría' };
  }
}

export async function saveCategory(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const userId = user.id;

    const name = formData.get('name') as string;
    const color = formData.get('color') as string;
    const icon = formData.get('icon') as string;
    const description = formData.get('description') as string;

    await createCategory({
      user_id: userId,
      name,
      color,
      icon,
      description
    });

    revalidatePath('/categorias');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar categoría:', error);
    return { error: 'Error al guardar la categoría' };
  }
}

export async function payRecurringExpense(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const userId = user.id;

    const templateId = formData.get('templateId') as string;
    const nextDate = formData.get('nextDate') as string;
    const amount = formData.get('amount') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const notes = formData.get('notes') as string;
    const recurrenceFrequency = formData.get('recurrenceFrequency') as string;

    // Crear el gasto real para esta instancia recurrente
    await createExpense({
      user_id: userId,
      category_id: parseInt(categoryId),
      amount,
      description: `${description} (${nextDate})`,
      date: nextDate,
      payment_method: paymentMethod,
      payment_status: 'pagado',
      is_recurring: 0, // Marcar como no recurrente (es una instancia individual)
      recurrence_frequency: null,
      notes
    });

    revalidatePath('/gastos');
    return { success: true };
  } catch (error) {
    console.error('Error al pagar gasto recurrente:', error);
    return { error: 'Error al pagar el gasto recurrente' };
  }
}
