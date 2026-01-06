import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Validar que las variables de entorno existan
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Evitar escribir lógica entre createServerClient y
  // supabase.auth.getUser(). Un refresh simple de sesión es todo lo que se necesita.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Extraer locale del pathname (e.g., /es/dashboard -> es)
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'es';

  // Proteger todas las rutas del dashboard
  if (!user && pathname.includes('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Proteger la ruta de onboarding (solo usuarios autenticados)
  if (!user && pathname.includes('/onboarding')) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Si el usuario está autenticado, verificar onboarding
  if (user) {
    // Permitir acceso a auth callback
    if (pathname.startsWith('/auth/callback')) {
      return supabaseResponse;
    }

    // Read onboarding status from user metadata (cached in JWT, no DB query!)
    // This is MUCH faster than querying the database on every request
    const onboardingCompleted = user.user_metadata?.onboarding_completed === true;

    // Si no ha completado onboarding, redirigir a onboarding
    if (!onboardingCompleted) {
      // Permitir acceso a la página de onboarding
      if (pathname.includes('/onboarding')) {
        return supabaseResponse;
      }

      // Redirigir desde otras rutas a onboarding
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/onboarding`;
      return NextResponse.redirect(url);
    }

    // Si ya completó onboarding, redirigir desde onboarding al dashboard
    if (pathname.includes('/onboarding')) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/dashboard`;
      return NextResponse.redirect(url);
    }

    // Si el usuario está autenticado y completó onboarding, redirigir desde login o home al dashboard
    if (pathname.includes('/login') || pathname === `/${locale}` || pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
