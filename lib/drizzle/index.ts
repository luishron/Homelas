// Exportar cliente de Drizzle
export { db } from './client';

// Exportar schema completo
export * from './schema';

// Exportar funciones de límites de categorías
export * from './category-limits';

// Re-exportar funciones útiles de drizzle-orm
export { eq, and, or, not, gt, gte, lt, lte, like, ilike, sql } from 'drizzle-orm';
