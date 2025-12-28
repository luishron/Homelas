import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type UserPlan = 'free' | 'pro' | 'plus' | 'admin';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: UserPlan;
  plan_expires_at: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  timezone: string | null;
  language: string | null;
  max_monthly_expenses: number | null;
  max_categories: number | null;
}

export interface PlanLimits {
  maxCategories: number;
  maxMonthlyExpenses: number | null; // null = unlimited
  name: string;
  features: string[];
}

// ============================================================================
// PLAN DEFINITIONS
// ============================================================================

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    maxCategories: 10,
    maxMonthlyExpenses: null,
    name: 'Plan Free',
    features: [
      'Hasta 10 categorías',
      'Gastos ilimitados',
      'Ingresos ilimitados',
      'Dashboard básico',
      'Exportar a CSV',
    ],
  },
  pro: {
    maxCategories: 50,
    maxMonthlyExpenses: null,
    name: 'Plan Pro',
    features: [
      'Hasta 50 categorías',
      'Gastos ilimitados',
      'Ingresos ilimitados',
      'Dashboard avanzado',
      'Presupuestos por categoría',
      'Exportar a Excel/PDF',
      'Reportes personalizados',
      'Soporte prioritario',
    ],
  },
  plus: {
    maxCategories: 999999, // Unlimited
    maxMonthlyExpenses: null,
    name: 'Plan Plus',
    features: [
      'Categorías ilimitadas',
      'Gastos ilimitados',
      'Ingresos ilimitados',
      'Dashboard premium',
      'Presupuestos avanzados',
      'API access',
      'Integraciones (Stripe, PayPal)',
      'Reportes avanzados con IA',
      'Soporte 24/7',
      'Acceso anticipado a nuevas funciones',
    ],
  },
  admin: {
    maxCategories: 999999, // Unlimited
    maxMonthlyExpenses: null,
    name: 'Plan Admin',
    features: [
      'Todas las funciones de Plus',
      'Gestión de usuarios',
      'Logs de actividad',
      'Configuración del sistema',
      'Sin límites',
    ],
  },
};

// ============================================================================
// PROFILE FUNCTIONS
// ============================================================================

/**
 * Get user profile (cached)
 * Returns null if user is not authenticated or profile doesn't exist
 */
export const getUserProfile = cache(async (): Promise<UserProfile | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile as UserProfile;
});

/**
 * Get user plan
 * Returns 'free' if user is not authenticated or profile doesn't exist
 */
export const getUserPlan = cache(async (): Promise<UserPlan> => {
  const profile = await getUserProfile();
  return profile?.plan || 'free';
});

/**
 * Check if user has a specific plan or higher
 */
export async function hasPlan(requiredPlan: UserPlan): Promise<boolean> {
  const currentPlan = await getUserPlan();

  const planHierarchy: Record<UserPlan, number> = {
    free: 0,
    pro: 1,
    plus: 2,
    admin: 3,
  };

  return planHierarchy[currentPlan] >= planHierarchy[requiredPlan];
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const plan = await getUserPlan();
  return plan === 'admin';
}

/**
 * Get plan limits for current user
 * Respects custom limits if set on the profile
 */
export async function getPlanLimits(): Promise<PlanLimits> {
  const profile = await getUserProfile();

  if (!profile) {
    return PLAN_LIMITS.free;
  }

  const baseLimits = PLAN_LIMITS[profile.plan];

  // Override with custom limits if set
  return {
    ...baseLimits,
    maxCategories: profile.max_categories ?? baseLimits.maxCategories,
    maxMonthlyExpenses:
      profile.max_monthly_expenses ?? baseLimits.maxMonthlyExpenses,
  };
}

/**
 * Check if user can create more of a resource type
 */
export async function canCreateResource(
  resourceType: 'categories' | 'expenses'
): Promise<boolean> {
  const supabase = await createClient();
  const profile = await getUserProfile();

  if (!profile) {
    return false;
  }

  // Admins have no limits
  if (profile.plan === 'admin') {
    return true;
  }

  const limits = await getPlanLimits();

  if (resourceType === 'categories') {
    const { count } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);

    return (count ?? 0) < limits.maxCategories;
  }

  // Expenses are unlimited in all plans
  return true;
}

/**
 * Update user profile
 * Only allows updating specific fields (not plan)
 */
export async function updateProfile(updates: {
  full_name?: string;
  avatar_url?: string;
  timezone?: string;
  language?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'No autenticado' };
  }

  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Upgrade user plan (admin only)
 */
export async function upgradePlan(
  userId: string,
  newPlan: UserPlan,
  expiresAt?: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await isAdmin();

  if (!admin) {
    return { success: false, error: 'No autorizado' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('user_profiles')
    .update({
      plan: newPlan,
      plan_expires_at: expiresAt || null,
    })
    .eq('id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
