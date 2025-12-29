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
import {
  expenseSchema,
  updateExpenseSchema,
  incomeSchema,
  updateIncomeSchema,
  deleteIncomeSchema,
  categorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  paymentMethodSchema,
  updatePaymentMethodSchema,
  deletePaymentMethodSchema,
  validateFormData
} from '@/lib/validations/schemas';
import {
  withAuth,
  revalidateGastos,
  revalidateCategorias,
  revalidateMetodosPago,
  revalidateIngresos,
  isValidPaymentMethodType,
  type ActionResult,
  type PaymentMethodType
} from '@/lib/action-helpers';

export async function saveExpense(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const validation = validateFormData(expenseSchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await createExpense({
      user_id: userId,
      category_id: data.categoryId,
      amount: data.amount,
      description: data.description,
      date: data.date,
      payment_method: String(data.paymentMethodId),
      payment_status: data.paymentStatus as 'pagado' | 'pendiente' | 'vencido',
      is_recurring: data.isRecurring ? 1 : 0,
      recurrence_frequency: data.isRecurring ? data.recurrenceFrequency : null,
      notes: data.notes
    });

    revalidateGastos();
  });
}

export async function updateExpense(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const validation = validateFormData(updateExpenseSchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await updateExpenseInDb(data.id, {
      category_id: data.categoryId,
      amount: data.amount,
      description: data.description,
      date: data.date,
      payment_method: String(data.paymentMethodId),
      payment_status: data.paymentStatus as 'pagado' | 'pendiente' | 'vencido',
      is_recurring: data.isRecurring ? 1 : 0,
      recurrence_frequency: data.isRecurring ? data.recurrenceFrequency : null,
      notes: data.notes
    });

    revalidateGastos();
  });
}

export async function deleteExpense(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const id = Number(formData.get('id'));
    await deleteExpenseById(id);
    revalidateGastos();
  });
}

export async function markExpenseAsPaid(expenseId: number): Promise<ActionResult> {
  return withAuth(async () => {
    await updateExpenseInDb(expenseId, {
      payment_status: 'pagado'
    });
    revalidateGastos();
  });
}

export async function deleteCategory(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const validation = validateFormData(deleteCategorySchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await deleteCategoryById(data.id);
    revalidateCategorias();
  });
}

export async function updateCategory(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const validation = validateFormData(updateCategorySchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await updateCategoryInDb(data.id, {
      name: data.name,
      color: data.color,
      icon: data.icon || null,
      description: data.description || null
    });

    revalidateCategorias();
  });
}

export async function saveCategory(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const validation = validateFormData(categorySchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await createCategory({
      user_id: userId,
      name: data.name,
      color: data.color,
      icon: data.icon || null,
      description: data.description || null
    });

    revalidateCategorias();
  });
}

export async function payRecurringExpense(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const nextDate = formData.get('nextDate') as string;
    const amount = formData.get('amount') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const paymentMethodId = formData.get('paymentMethodId') as string;
    const notes = formData.get('notes') as string;

    // Crear el gasto real para esta instancia recurrente
    await createExpense({
      user_id: userId,
      category_id: parseInt(categoryId),
      amount,
      description: `${description} (${nextDate})`,
      date: nextDate,
      payment_method: paymentMethodId,
      payment_status: 'pagado',
      is_recurring: 0,
      recurrence_frequency: null,
      notes
    });

    revalidateGastos();
  });
}

export async function savePaymentMethod(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const validation = validateFormData(paymentMethodSchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    if (!isValidPaymentMethodType(data.type)) {
      throw new Error('Tipo de método de pago inválido');
    }

    await createPaymentMethod({
      user_id: userId,
      name: data.name,
      type: data.type as PaymentMethodType,
      bank: data.bank || null,
      last_four_digits: data.lastFourDigits || null,
      icon: null,
      color: data.color,
      is_default: data.isDefault
    });

    revalidateMetodosPago();
  });
}

export async function updatePaymentMethod(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const validation = validateFormData(updatePaymentMethodSchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    if (!isValidPaymentMethodType(data.type)) {
      throw new Error('Tipo de método de pago inválido');
    }

    await updatePaymentMethodInDb(data.id, {
      name: data.name,
      type: data.type as PaymentMethodType,
      bank: data.bank || null,
      last_four_digits: data.lastFourDigits || null,
      icon: null,
      color: data.color,
      is_default: data.isDefault
    });

    revalidateMetodosPago();
  });
}

export async function deletePaymentMethod(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const validation = validateFormData(deletePaymentMethodSchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await deletePaymentMethodById(data.id);
    revalidateMetodosPago();
  });
}

//==============================================================================
// SERVER ACTIONS - Ingresos
//==============================================================================

export async function saveIncome(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const validation = validateFormData(incomeSchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await createIncome({
      user_id: userId,
      source: data.source,
      amount: data.amount,
      date: data.date,
      description: data.description || null,
      category_id: data.categoryId,
      payment_method: null,
      is_recurring: data.isRecurring ? 1 : 0,
      recurrence_frequency: data.isRecurring ? data.recurrenceFrequency : null,
      notes: null
    });

    revalidateIngresos();
  });
}

export async function updateIncome(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const validation = validateFormData(updateIncomeSchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await updateIncomeInDb(data.id, {
      source: data.source,
      amount: data.amount,
      date: data.date,
      description: data.description || null,
      category_id: data.categoryId,
      payment_method: null,
      is_recurring: data.isRecurring ? 1 : 0,
      recurrence_frequency: data.isRecurring ? data.recurrenceFrequency : null,
      notes: null
    });

    revalidateIngresos();
  });
}

export async function deleteIncome(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const validation = validateFormData(deleteIncomeSchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await deleteIncomeById(data.id);
    revalidateIngresos();
  });
}

//==============================================================================
// SERVER ACTIONS - Categorías de Ingresos
//==============================================================================

export async function saveIncomeCategory(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const validation = validateFormData(categorySchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await createIncomeCategory({
      user_id: userId,
      name: data.name,
      color: data.color,
      icon: data.icon || null,
      description: data.description || null
    });

    revalidateIngresos();
  });
}

export async function updateIncomeCategoryAction(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const validation = validateFormData(updateCategorySchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await updateIncomeCategoryInDb(data.id, {
      name: data.name,
      color: data.color,
      icon: data.icon || null,
      description: data.description || null
    });

    revalidateIngresos();
  });
}

export async function deleteIncomeCategory(formData: FormData): Promise<ActionResult> {
  return withAuth(async () => {
    const validation = validateFormData(deleteCategorySchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    const data = validation.data;

    await deleteIncomeCategoryById(data.id);
    revalidateIngresos();
  });
}

//==============================================================================
// ONBOARDING ACTIONS
//==============================================================================

import { updateUserProfile, completeOnboarding } from '@/lib/db';
import { z } from 'zod';

const onboardingNameSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres')
});

export async function saveOnboardingName(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const validation = validateFormData(onboardingNameSchema, formData);

    if (!validation.success) {
      throw new Error(validation.error);
    }

    await updateUserProfile(userId, {
      full_name: validation.data.fullName
    });

    // No revalidation needed for onboarding
  });
}

export async function finishOnboarding(): Promise<ActionResult> {
  return withAuth(async (userId) => {
    await completeOnboarding(userId);
    revalidateGastos(); // Revalidate dashboard
  });
}
