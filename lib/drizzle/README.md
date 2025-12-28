# Drizzle + Supabase Architecture

## Overview

This project uses a **hybrid approach** combining Drizzle ORM for queries and Supabase for migrations:

- **Queries**: Drizzle ORM with `@vercel/postgres` adapter
- **Migrations**: Supabase MCP (SQL migrations via database tools)
- **Schema**: Single source of truth in `lib/drizzle/schema.ts`

## Why This Approach?

1. **Drizzle** provides excellent TypeScript types and query builder
2. **Supabase MCP** has full database access for complex migrations (triggers, RLS policies, etc.)
3. **Best of both worlds**: Type-safe queries + powerful migrations

## Usage

### Querying with Drizzle

```typescript
import { db, sql } from '@/lib/drizzle/client';
import { userProfiles, expenses, categories } from '@/lib/drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';

// Select with type safety
const users = await db.select().from(userProfiles);

// Where clause
const freeUsers = await db
  .select()
  .from(userProfiles)
  .where(eq(userProfiles.plan, 'free'));

// Join queries
const expensesWithCategories = await db
  .select()
  .from(expenses)
  .leftJoin(categories, eq(expenses.categoryId, categories.id))
  .where(eq(expenses.userId, userId));

// Insert
await db.insert(userProfiles).values({
  id: userId,
  email: 'user@example.com',
  plan: 'free',
});

// Update
await db
  .update(userProfiles)
  .set({ plan: 'pro' })
  .where(eq(userProfiles.id, userId));

// Delete
await db
  .delete(expenses)
  .where(eq(expenses.id, expenseId));

// Raw SQL when needed
const result = await sql`SELECT * FROM user_profiles WHERE plan = ${'free'}`;
```

### Schema Migrations

Use Supabase MCP tools for migrations:

```bash
# Apply migration via Supabase MCP
mcp__supabase__apply_migration

# Execute SQL directly
mcp__supabase__execute_sql
```

## Schema Updates Workflow

1. **Update schema** in `lib/drizzle/schema.ts`
2. **Apply migration** via Supabase MCP
3. **Types auto-update** from schema file

## Files

- `schema.ts` - Database schema (single source of truth)
- `client.ts` - Drizzle database client
- `migrations/` - SQL migration files (reference only)

## Connection

Uses Supavisor transaction pooler (port 6543) via `@vercel/postgres`:

```env
DATABASE_URL=postgresql://postgres.PROJECT:[PASSWORD]@aws-0-REGION.pooler.supabase.com:6543/postgres?workaround=supabase-pooler.vercel
```

## Benefits

✅ Type-safe queries with IntelliSense
✅ No N+1 query problems
✅ Powerful migration control
✅ Full Postgres feature support (triggers, RLS, views)
✅ Works with Next.js App Router & Server Components
