'use server';

import {
  deleteExpenseById,
  deleteCategoryById,
  createExpense,
  updateExpense as updateExpenseInDb,
  createCategory,
  updateCategory as updateCategoryInDb,
  createPaymentMethod,
  updatePaymentMethod as updatePaymentMethodInDb,
  deletePaymentMethodById,
  createIncome,
  updateIncome as updateIncomeInDb,
  deleteIncomeById,
  createIncomeCategory,
  updateIncomeCategory as updateIncomeCategoryInDb,
  deleteIncomeCategoryById
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
    const paymentMethodId = formData.get('paymentMethodId') as string;
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
      payment_method: paymentMethodId,
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
    const paymentMethodId = formData.get('paymentMethodId') as string;
    const paymentStatus = formData.get('paymentStatus') as string;
    const isRecurring = formData.get('isRecurring') === 'true';
    const recurrenceFrequency = formData.get('recurrenceFrequency') as string;
    const notes = formData.get('notes') as string;

    await updateExpenseInDb(id, {
      category_id: parseInt(categoryId),
      amount,
      description,
      date,
      payment_method: paymentMethodId,
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
    const paymentMethodId = formData.get('paymentMethodId') as string;
    const notes = formData.get('notes') as string;
    const recurrenceFrequency = formData.get('recurrenceFrequency') as string;

    // Crear el gasto real para esta instancia recurrente
    await createExpense({
      user_id: userId,
      category_id: parseInt(categoryId),
      amount,
      description: `${description} (${nextDate})`,
      date: nextDate,
      payment_method: paymentMethodId,
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

export async function savePaymentMethod(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const userId = user.id;

    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const bank = formData.get('bank') as string;
    const lastFourDigits = formData.get('lastFourDigits') as string;
    const icon = formData.get('icon') as string;
    const color = formData.get('color') as string;
    const isDefault = formData.get('isDefault') === 'true';

    await createPaymentMethod({
      user_id: userId,
      name,
      type: type as any,
      bank: bank || null,
      last_four_digits: lastFourDigits || null,
      icon: icon || null,
      color: color || '#6366f1',
      is_default: isDefault
    });

    revalidatePath('/metodos-pago');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar método de pago:', error);
    return { error: 'Error al guardar el método de pago' };
  }
}

export async function updatePaymentMethod(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const id = Number(formData.get('id'));
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const bank = formData.get('bank') as string;
    const lastFourDigits = formData.get('lastFourDigits') as string;
    const icon = formData.get('icon') as string;
    const color = formData.get('color') as string;
    const isDefault = formData.get('isDefault') === 'true';

    await updatePaymentMethodInDb(id, {
      name,
      type: type as any,
      bank: bank || null,
      last_four_digits: lastFourDigits || null,
      icon: icon || null,
      color: color || '#6366f1',
      is_default: isDefault
    });

    revalidatePath('/metodos-pago');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    return { error: 'Error al actualizar el método de pago' };
  }
}

export async function deletePaymentMethod(formData: FormData) {
  let id = Number(formData.get('id'));
  await deletePaymentMethodById(id);
  revalidatePath('/metodos-pago');
}

//==============================================================================
// SERVER ACTIONS - Ingresos
//==============================================================================

export async function saveIncome(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const userId = user.id;

    const source = formData.get('source') as string;
    const amount = formData.get('amount') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const isRecurring = formData.get('isRecurring') === 'true';
    const recurrenceFrequency = formData.get('recurrenceFrequency') as string;
    const notes = formData.get('notes') as string;

    await createIncome({
      user_id: userId,
      source,
      amount,
      date,
      description: description || null,
      category_id: categoryId ? parseInt(categoryId) : null,
      payment_method: paymentMethod || null,
      is_recurring: isRecurring ? 1 : 0,
      recurrence_frequency: isRecurring ? recurrenceFrequency : null,
      notes: notes || null
    });

    revalidatePath('/ingresos');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar ingreso:', error);
    return { error: 'Error al guardar el ingreso' };
  }
}

export async function updateIncome(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const id = Number(formData.get('id'));
    const source = formData.get('source') as string;
    const amount = formData.get('amount') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const isRecurring = formData.get('isRecurring') === 'true';
    const recurrenceFrequency = formData.get('recurrenceFrequency') as string;
    const notes = formData.get('notes') as string;

    await updateIncomeInDb(id, {
      source,
      amount,
      date,
      description: description || null,
      category_id: categoryId ? parseInt(categoryId) : null,
      payment_method: paymentMethod || null,
      is_recurring: isRecurring ? 1 : 0,
      recurrence_frequency: isRecurring ? recurrenceFrequency : null,
      notes: notes || null
    });

    revalidatePath('/ingresos');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar ingreso:', error);
    return { error: 'Error al actualizar el ingreso' };
  }
}

export async function deleteIncome(formData: FormData) {
  let id = Number(formData.get('id'));
  await deleteIncomeById(id);
  revalidatePath('/ingresos');
}

//==============================================================================
// SERVER ACTIONS - Categorías de Ingresos
//==============================================================================

export async function saveIncomeCategory(formData: FormData) {
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

    await createIncomeCategory({
      user_id: userId,
      name,
      color: color || '#10B981',
      icon: icon || null,
      description: description || null
    });

    revalidatePath('/ingresos');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar categoría de ingreso:', error);
    return { error: 'Error al guardar la categoría' };
  }
}

export async function updateIncomeCategoryAction(formData: FormData) {
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

    await updateIncomeCategoryInDb(id, {
      name,
      color: color || '#10B981',
      icon: icon || null,
      description: description || null
    });

    revalidatePath('/ingresos');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar categoría de ingreso:', error);
    return { error: 'Error al actualizar la categoría' };
  }
}

export async function deleteIncomeCategory(formData: FormData) {
  let id = Number(formData.get('id'));
  await deleteIncomeCategoryById(id);
  revalidatePath('/ingresos');
}
