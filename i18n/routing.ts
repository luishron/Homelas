import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['es', 'en'],

  // Used when no locale matches
  defaultLocale: 'es',

  // The `pathnames` object maps logical route names to their locale-specific paths
  // This allows you to use the same route name across different locales
  pathnames: {
    '/': '/',
    '/login': '/login',
    '/register': {
      es: '/registro',
      en: '/register'
    },
    '/terms': {
      es: '/terminos',
      en: '/terms'
    },
    '/privacy': {
      es: '/privacidad',
      en: '/privacy'
    },
    '/dashboard': '/dashboard'
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
