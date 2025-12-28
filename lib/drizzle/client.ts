import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

/**
 * Drizzle Database Client
 *
 * Uses @vercel/postgres adapter for connection pooling via Supavisor
 * Compatible with Next.js App Router and Server Components
 *
 * Connection details:
 * - Pool: Supavisor Transaction Mode (port 6543)
 * - Driver: @vercel/postgres
 * - SSL: Enabled by default
 */
export const db = drizzle(sql, { schema });

// Export SQL helper for raw queries
export { sql };
