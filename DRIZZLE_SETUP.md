# 🎯 Migración Completa a Drizzle

## ✅ Estado Actual

### Configuración Completada

1. **Drizzle ORM Instalado** ✅
   - `@vercel/postgres` - Adaptador para Supabase
   - `drizzle-orm` - ORM TypeScript

2. **Cliente Drizzle Configurado** ✅
   - Archivo: `lib/drizzle/client.ts`
   - Usa Supavisor Transaction Mode (puerto 6543)
   - Compatible con Next.js App Router

3. **Queries de Ejemplo Creados** ✅
   - Archivo: `lib/drizzle/queries.ts`
   - Patrones para usuarios, gastos, categorías
   - Queries complejos con joins

4. **Schema Actualizado** ✅
   - Sistema de planes implementado
   - Todos los tipos TypeScript generados

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│         Next.js App Router              │
│  (Server Components & Server Actions)   │
└────────────┬────────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
┌────▼─────┐   ┌─────▼──────┐
│ Drizzle  │   │  Supabase  │
│   ORM    │   │    MCP     │
│ (Queries)│   │(Migrations)│
└────┬─────┘   └─────┬──────┘
     │               │
     └───────┬───────┘
             ▼
  ┌──────────────────────┐
  │  Supabase Postgres   │
  │   (Supavisor Pool)   │
  └──────────────────────┘
```

## 📝 Cómo Usar Drizzle

### 1. Queries Básicos

```typescript
import { db } from '@/lib/drizzle/client';
import { userProfiles, expenses } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

// Select
const users = await db.select().from(userProfiles);

// Where
const user = await db
  .select()
  .from(userProfiles)
  .where(eq(userProfiles.id, userId))
  .limit(1);

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
```

### 2. Joins y Queries Complejos

```typescript
import { db } from '@/lib/drizzle/client';
import { expenses, categories } from '@/lib/drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

// Join
const expensesWithCategories = await db
  .select({
    expense: expenses,
    category: categories,
  })
  .from(expenses)
  .leftJoin(categories, eq(expenses.categoryId, categories.id))
  .where(eq(expenses.userId, userId))
  .orderBy(desc(expenses.date));

// Aggregations
const [total] = await db
  .select({
    sum: sql<string>`SUM(CAST(${expenses.amount} AS NUMERIC))`,
    count: sql<number>`COUNT(*)`,
  })
  .from(expenses)
  .where(eq(expenses.userId, userId));
```

### 3. SQL Raw Cuando Sea Necesario

```typescript
import { sql } from '@/lib/drizzle/client';

const result = await sql`
  SELECT * FROM user_profiles
  WHERE plan = ${'free'}
  AND created_at > ${new Date('2025-01-01')}
`;
```

## 🔄 Migraciones

### Para Cambios de Schema:

1. **Actualiza** `lib/drizzle/schema.ts`
2. **Aplica con Supabase MCP**:
   ```typescript
   // Usar herramienta MCP
   mcp__supabase__apply_migration({
     name: "add_new_column",
     query: `ALTER TABLE user_profiles ADD COLUMN new_field TEXT;`
   })
   ```

3. **Los tipos se actualizan automáticamente** desde el schema

### Ejemplo de Migración:

```typescript
// 1. Actualizar schema.ts
export const userProfiles = pgTable('user_profiles', {
  // ... campos existentes
  newField: text('new_field'),
});

// 2. Aplicar SQL via MCP
mcp__supabase__execute_sql({
  query: `ALTER TABLE user_profiles ADD COLUMN new_field TEXT;`
})

// 3. ¡Listo! Los tipos ya están disponibles
```

## 📚 Próximos Pasos

### 1. Migrar Gradualmente de `lib/db.ts`

Reemplaza funciones una por una:

```typescript
// Antes (lib/db.ts)
export async function getExpenses(userId: string) {
  const { data } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId);
  return data;
}

// Después (Drizzle)
export async function getExpenses(userId: string) {
  return await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId));
}
```

### 2. Actualizar Server Actions

```typescript
// app/dashboard/actions.ts
import { db } from '@/lib/drizzle/client';
import { expenses } from '@/lib/drizzle/schema';

export async function createExpense(data: FormData) {
  return withAuth(async (userId) => {
    // Validación...

    const [expense] = await db
      .insert(expenses)
      .values({
        userId,
        categoryId: Number(data.get('categoryId')),
        amount: data.get('amount') as string,
        // ...
      })
      .returning();

    revalidateGastos();
    return { success: true, expense };
  });
}
```

### 3. Aprovechar Tipos TypeScript

```typescript
import type { Expense, UserProfile } from '@/lib/drizzle/schema';

// Los tipos están siempre sincronizados con la DB
function processExpense(expense: Expense) {
  // IntelliSense completo
  console.log(expense.amount, expense.date);
}
```

## 🎉 Beneficios Inmediatos

✅ **Type Safety**: Errores de tipado en tiempo de compilación
✅ **IntelliSense**: Autocompletado en VS Code
✅ **Performance**: Queries optimizados automáticamente
✅ **SQL Puro**: Soporte completo cuando lo necesites
✅ **Migraciones Flexibles**: Control total con Supabase MCP

## 🔗 Referencias

- Drizzle Docs: https://orm.drizzle.team/docs/overview
- Supabase + Drizzle: https://supabase.com/docs/guides/database/connecting-to-postgres/serverless-drivers
- Ejemplos: `lib/drizzle/queries.ts`

## 📞 Soporte

Para cualquier duda, revisa:
1. `lib/drizzle/README.md` - Arquitectura y conceptos
2. `lib/drizzle/queries.ts` - Ejemplos prácticos
3. Documentación oficial de Drizzle ORM
