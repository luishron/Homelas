# 🎯 Cómo Usar Metadata - Guía Rápida

Tu problema original está **RESUELTO**. Ya no necesitas crear migraciones SQL cada vez que quieres agregar campos nuevos.

## ✅ Lo Que Ya Tienes

- Columnas `metadata` JSONB en todas tus tablas
- Puedes agregar cualquier campo sin migraciones
- Funciona con tu código actual de Supabase

---

## 📝 Ejemplos Prácticos

### 1. Agregar metadata a un gasto

```typescript
// lib/db.ts
import { createClient } from '@/lib/supabase/server';

export async function createExpenseWithMetadata(expense: InsertExpense) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      ...expense,
      metadata: {
        // 🎯 Agrega CUALQUIER campo que necesites
        tienda: 'Amazon',
        numeroOrden: 'ORD-12345',
        cuotas: 3,
        enlaceFactura: 'https://...',
        tags: ['online', 'tecnologia']
      }
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 2. Actualizar metadata existente

```typescript
export async function addTagsToExpense(
  expenseId: number,
  tags: string[]
) {
  const supabase = await createClient();

  // Obtener metadata actual
  const { data: expense } = await supabase
    .from('expenses')
    .select('metadata')
    .eq('id', expenseId)
    .single();

  // Merge con nuevos tags
  const { data, error } = await supabase
    .from('expenses')
    .update({
      metadata: {
        ...expense?.metadata,
        tags: [...(expense?.metadata?.tags || []), ...tags]
      }
    })
    .eq('id', expenseId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 3. Buscar por metadata

```typescript
// Buscar gastos de una tienda específica
export async function getExpensesByStore(
  userId: string,
  storeName: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .eq('metadata->>tienda', storeName); // 🔍 Query en JSON!

  if (error) throw error;
  return data || [];
}

// Buscar gastos con más de 2 cuotas
export async function getExpensesWithInstallments(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .filter('metadata->>cuotas', 'gt', '2');

  if (error) throw error;
  return data || [];
}

// Buscar gastos con tags específicos
export async function getExpensesByTag(
  userId: string,
  tag: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .contains('metadata', { tags: [tag] });

  if (error) throw error;
  return data || [];
}
```

### 4. Actualizar solo un campo de metadata

```typescript
export async function updateExpenseStore(
  expenseId: number,
  storeName: string
) {
  const supabase = await createClient();

  // PostgreSQL permite merge de JSONB con ||
  const { data, error } = await supabase.rpc('update_expense_metadata', {
    expense_id: expenseId,
    new_metadata: { tienda: storeName }
  });

  // O manualmente:
  const { data: expense } = await supabase
    .from('expenses')
    .select('metadata')
    .eq('id', expenseId)
    .single();

  const { data: updated, error } = await supabase
    .from('expenses')
    .update({
      metadata: {
        ...expense?.metadata,
        tienda: storeName
      }
    })
    .eq('id', expenseId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}
```

---

## 💡 Ideas de Campos para Metadata

### Para Expenses (Gastos)
```typescript
metadata: {
  // Comercio
  tienda: 'Amazon',
  numeroOrden: 'ORD-12345',
  enlaceFactura: 'https://...',

  // Financiero
  cuotas: 3,
  cuotaActual: 1,
  tasaInteres: 5.2,

  // Ubicación
  ubicacion: {
    lat: -34.6037,
    lng: -58.3816,
    nombre: 'Buenos Aires'
  },

  // Organización
  tags: ['online', 'trabajo', 'urgente'],
  proyecto: 'Proyecto X',
  cliente: 'Cliente Y',

  // Documentos
  adjuntos: [
    { nombre: 'factura.pdf', url: '...', tipo: 'pdf' }
  ],

  // Impuestos
  esDeducible: true,
  categoriaFiscal: 'Gastos operativos',

  // Compartido
  compartidoCon: ['user@email.com'],
  porcentajePropio: 50
}
```

### Para Categories (Categorías)
```typescript
metadata: {
  orden: 1,
  icono: 'shopping-cart',
  grupo: 'Esenciales',
  limiteAlerta: 80, // % del presupuesto
  color_secundario: '#abc123'
}
```

### Para Payment Methods (Métodos de Pago)
```typescript
metadata: {
  limiteCredito: 50000,
  diaVencimiento: 15,
  recompensas: {
    tipo: 'cashback',
    porcentaje: 2,
    categoria: 'Supermercado'
  },
  notificaciones: true
}
```

---

## 🚀 Migración de Funciones Existentes

No necesitas cambiar nada de tu código actual. Simplemente empieza a usar `metadata` cuando necesites campos nuevos:

```typescript
// ANTES: Necesitabas crear migración
// ALTER TABLE expenses ADD COLUMN tienda TEXT;

// AHORA: Solo usa metadata
const expense = {
  ...expenseData,
  metadata: {
    tienda: 'Amazon'
  }
};
```

---

## ✅ Resumen

- ✨ **Nunca más migraciones** para agregar campos
- 🎯 **Funciona ahora** con tu código actual
- 🔍 **Búsquedas flexibles** en metadata
- 📦 **Type-safe** con TypeScript (puedes validar con Zod)

¡Ya puedes empezar a usar metadata en tu aplicación!
