import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, handle internationalization
  const intlResponse = intlMiddleware(request);

  // If intl middleware wants to redirect (e.g., to add locale prefix), honor that
  if (intlResponse && intlResponse.status === 307) {
    return intlResponse;
  }

  // Then, update the Supabase session
  const response = await updateSession(request);

  // Merge headers from intl middleware if it exists
  if (intlResponse) {
    intlResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - opengraph-image
     */
    '/((?!_next/static|_next/image|favicon.ico|api|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
