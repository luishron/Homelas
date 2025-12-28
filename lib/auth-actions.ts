'use server';

import {
  signIn as authSignIn,
  signOut as authSignOut,
  signInWithMagicLink as authSignInWithMagicLink,
} from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signIn(email: string, password: string) {
  const result = await authSignIn(email, password);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function signInWithMagicLink(email: string) {
  const result = await authSignInWithMagicLink(email);

  if (result.error) {
    return { error: result.error };
  }

  return { success: true };
}

export async function signOut() {
  await authSignOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Sign up a new user with email, password, and optional full name
 * Creates user in auth.users and automatically creates profile via trigger
 */
export async function signUp(
  email: string,
  password: string,
  fullName?: string
) {
  const { signUp: authSignUpFn } = await import('@/lib/auth');

  const result = await authSignUpFn(email, password, fullName);

  if (result.error) {
    return { error: result.error };
  }

  return { success: true, user: result.user };
}

/**
 * Get test credentials (INTERNAL USE ONLY)
 * Only returns credentials in development mode
 * Credentials are never exposed to the client
 */
export async function getTestCredentials(): Promise<{
  email: string;
  password: string;
} | null> {
  // Only in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const testUser = process.env.TEST_USER;
  const testPassword = process.env.TEST_PASSWORD;

  if (!testUser || !testPassword) {
    return null;
  }

  return {
    email: testUser,
    password: testPassword,
  };
}
