'use server';

import { withAuth, type ActionResult } from '@/lib/action-helpers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isValidCurrency, type CurrencyCode } from '@/lib/config/currencies';

/**
 * Actualiza el perfil del usuario (nombre, avatar, timezone, idioma)
 */
export async function updateUserProfile(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const fullName = formData.get('fullName') as string;
    const timezone = formData.get('timezone') as string;
    const language = formData.get('language') as string;

    const updates: any = {};

    if (fullName) updates.full_name = fullName;
    if (timezone) updates.timezone = timezone;
    if (language) updates.language = language;

    const supabase = await createClient();
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/dashboard/profile/settings');
    revalidatePath('/dashboard');
  });
}

/**
 * Actualiza las preferencias del usuario (currency, theme)
 */
export async function updateUserPreferences(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const currency = formData.get('currency') as string;
    const theme = formData.get('theme') as 'light' | 'dark' | 'system';

    // Validar que currency sea válido
    if (currency && !isValidCurrency(currency)) {
      throw new Error('Moneda no soportada');
    }

    // Construir objeto de preferences
    const preferences: {
      currency?: CurrencyCode;
      theme?: 'light' | 'dark' | 'system';
    } = {};

    if (currency) preferences.currency = currency as CurrencyCode;
    if (theme) preferences.theme = theme;

    const supabase = await createClient();

    // Actualizar preferences (merge con existentes)
    const { data: currentProfile } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', userId)
      .single();

    const updatedPreferences = {
      ...(currentProfile?.preferences || {}),
      ...preferences,
    };

    const { error } = await supabase
      .from('user_profiles')
      .update({ preferences: updatedPreferences })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    // Revalidar todas las páginas del dashboard
    // (porque la moneda afecta todo el formateo)
    revalidatePath('/dashboard', 'layout');
    revalidatePath('/dashboard/profile/settings');
  });
}
