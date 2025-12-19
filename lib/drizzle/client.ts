import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Verificar que DATABASE_URL esté disponible
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Crear conexión a PostgreSQL
// Nota: Para producción, considera usar un pool de conexiones
const client = postgres(process.env.DATABASE_URL, {
  max: 10, // número máximo de conexiones
  idle_timeout: 20, // segundos antes de cerrar conexión inactiva
  connect_timeout: 10, // segundos antes de timeout en conexión
});

// Crear instancia de Drizzle con el schema
export const db = drizzle(client, { schema });

// Exportar tipos útiles
export type Database = typeof db;
