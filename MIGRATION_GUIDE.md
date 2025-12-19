# 🚀 Guía de Migración a Drizzle ORM

Esta guía te ayudará a completar la migración a Drizzle ORM sin perder ningún dato.

## ✅ Estado Actual de la Migración

- [x] Instalación de dependencias de Drizzle
- [x] Configuración de Drizzle
- [x] Schema de Drizzle creado con columnas `metadata` JSONB
- [x] Cliente de Drizzle configurado
- [ ] **Ejecutar migración SQL en Supabase** ← SIGUIENTE PASO
- [ ] Migrar funciones de lib/db.ts
- [ ] Probar en desarrollo

---

## 📋 Paso 1: Ejecutar la Migración SQL en Supabase

**IMPORTANTE: Esta migración NO borra ningún dato, solo agrega columnas `metadata` a las tablas.**

### Opción A: Usando el Dashboard de Supabase (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor** en el menú lateral
3. Copia y pega el contenido del archivo:
   ```
   scripts/supabase/migrations/04-add-metadata-columns.sql
   ```
4. Haz clic en **Run** para ejecutar la migración
5. Verifica que se agregaron las columnas correctamente

### Opción B: Usando la CLI de Supabase

```bash
# Si tienes Supabase CLI instalado
supabase db push scripts/supabase/migrations/04-add-metadata-columns.sql
```

### Verificación

Después de ejecutar la migración, verifica que las columnas `metadata` existan:

```sql
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE
  table_schema = 'public'
  AND column_name = 'metadata'
  AND table_name IN ('categories', 'payment_methods', 'expenses', 'budgets', 'income_categories', 'incomes')
ORDER BY table_name;
```

Deberías ver 6 filas (una por cada tabla).

---

## 📋 Paso 2: Migrar Funciones a Drizzle

### Comparación: Supabase vs Drizzle

#### Antes (Supabase):
```typescript
// lib/db.ts
export async function getExpensesByUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

#### Después (Drizzle):
```typescript
// lib/db.ts
import { db, eq, expenses } from '@/lib/drizzle';

export async function getExpensesByUser(userId: string) {
  return await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(expenses.date);
  // ✅ Sin manejo de errores necesario - Drizzle lanza excepciones automáticamente
  // ✅ 100% type-safe
  // ✅ Sin verificación de null
}
```

### Migración Gradual Recomendada

**NO es necesario migrar todo de una vez.** Puedes migrar función por función:

1. Deja las funciones actuales en `lib/db.ts`
2. Crea nuevas funciones en `lib/drizzle/queries.ts` usando Drizzle
3. Reemplaza las llamadas gradualmente en tu código
4. Una vez que todas las llamadas usen Drizzle, elimina las funciones viejas

### Ejemplo de Migración Gradual

```typescript
// lib/drizzle/queries.ts - Nuevas funciones con Drizzle
import { db, eq, and, desc, expenses, categories } from '@/lib/drizzle';

export async function getExpensesByUser(userId: string) {
  return await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date));
}

export async function createExpense(expense: NewExpense) {
  const [created] = await db
    .insert(expenses)
    .values(expense)
    .returning();
  return created;
}

// etc...
```

---

## 🎯 Ventajas de Usar Drizzle + Metadata

### 1. Agregar campos SIN migraciones

```typescript
// ANTES: Necesitabas crear migración SQL
// ALTER TABLE expenses ADD COLUMN tienda TEXT;

// AHORA: Solo usa metadata
await db.insert(expenses).values({
  userId,
  categoryId: 1,
  amount: '500',
  date: '2025-01-15',
  metadata: {
    tienda: 'Amazon',        // ← Nuevo campo!
    numeroOrden: 'ORD-123',  // ← Nuevo campo!
    tags: ['online']         // ← Nuevo campo!
  }
});
```

### 2. Type-Safety Completo

```typescript
// Drizzle infiere tipos automáticamente
const expense = await db
  .select()
  .from(expenses)
  .where(eq(expenses.id, 1))
  .then(rows => rows[0]);

// expense.amount     ✅ TypeScript sabe que es string
// expense.metadata   ✅ TypeScript sabe que es Record<string, any>
// expense.fakeField  ❌ Error en tiempo de compilación!
```

### 3. Queries Flexibles en Metadata

```typescript
// Buscar por campos en metadata
const amazonExpenses = await db
  .select()
  .from(expenses)
  .where(
    sql`${expenses.metadata}->>'tienda' = 'Amazon'`
  );

// Buscar con múltiples condiciones
const complexSearch = await db
  .select()
  .from(expenses)
  .where(
    and(
      eq(expenses.userId, userId),
      sql`${expenses.metadata}->>'tienda' = 'Amazon'`,
      sql`(${expenses.metadata}->>'cuotas')::int > 2`
    )
  );
```

---

## 📚 Recursos Adicionales

- **Ejemplos de uso**: Ver `lib/drizzle/example-usage.ts`
- **Schema completo**: Ver `lib/drizzle/schema.ts`
- **Documentación Drizzle**: https://orm.drizzle.team/docs/overview

---

## 🚨 Preguntas Frecuentes

### ¿Voy a perder datos?
**No.** La migración solo agrega columnas `metadata` con valor default `{}`. Tus datos existentes quedan intactos.

### ¿Puedo seguir usando Supabase Auth?
**Sí.** Drizzle solo reemplaza las queries. Sigues usando Supabase para autenticación, storage, realtime, etc.

### ¿Qué pasa con Row Level Security (RLS)?
Las políticas RLS de Supabase siguen funcionando perfectamente con Drizzle. Drizzle usa la misma conexión de PostgreSQL.

### ¿Cuánto trabajo es migrar?
Depende de cuántas funciones tengas. Puedes hacerlo gradualmente:
- Migrar 5-10 funciones por día
- Probar cada función antes de continuar
- No hay prisa, ambos ORMs pueden coexistir

### ¿Debo migrar TODO?
No necesariamente. Si algunas queries son muy específicas o complejas con Supabase, puedes dejarlas. Lo importante es que puedas agregar campos nuevos sin migraciones.

---

## ✅ Checklist de Migración Completa

- [ ] Ejecutar migración SQL `04-add-metadata-columns.sql`
- [ ] Verificar que columnas `metadata` existan
- [ ] Probar crear un gasto con metadata usando Drizzle
- [ ] Migrar función `getExpensesByUser`
- [ ] Migrar función `createExpense`
- [ ] Migrar función `updateExpense`
- [ ] ... (resto de funciones según necesidad)
- [ ] Probar en desarrollo
- [ ] Probar en producción con precaución
- [ ] Eliminar funciones viejas de Supabase que ya no se usen

---

**¿Necesitas ayuda?** Revisa los ejemplos en `lib/drizzle/example-usage.ts` o consulta la documentación oficial de Drizzle.
