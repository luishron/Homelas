# Sistema de Planes y Permisos - Homelas

## Tabla de Contenidos

1. [Overview](#overview)
2. [Planes Disponibles](#planes-disponibles)
3. [Límites por Plan](#límites-por-plan)
4. [Registro y Autenticación](#registro-y-autenticación)
5. [Verificación de Roles](#verificación-de-roles)
6. [Actualización de Planes](#actualización-de-planes)
7. [Estructura de Base de Datos](#estructura-de-base-de-datos)
8. [API Reference](#api-reference)

---

## Overview

Homelas implementa un sistema de **4 planes** con límites y funcionalidades escalables:

- **Free**: Plan gratuito para usuarios individuales
- **Pro**: Plan profesional con límites ampliados
- **Plus**: Plan premium con funcionalidades ilimitadas
- **Admin**: Plan administrativo con control total del sistema

**Características principales:**
- ✅ Registro automático con plan Free
- ✅ Perfiles creados automáticamente via trigger
- ✅ Row Level Security (RLS) para seguridad
- ✅ Límites personalizables por usuario
- ✅ Verificación de roles server-side

---

## Planes Disponibles

### 🆓 Plan Free (Gratuito)

**Precio:** $0/mes - Gratis para siempre

**Límites:**
- Hasta 10 categorías
- Gastos ilimitados
- Ingresos ilimitados

**Funcionalidades:**
- ✅ Dashboard básico con KPIs
- ✅ Gastos recurrentes
- ✅ Múltiples métodos de pago
- ✅ Exportar a CSV
- ✅ Categorización con colores e iconos
- ✅ Filtros y búsqueda

**Ideal para:** Usuarios individuales que comienzan a organizar sus finanzas

---

### 💼 Plan Pro (Profesional)

**Precio:** $9.99/mes

**Límites:**
- Hasta 50 categorías
- Gastos ilimitados
- Ingresos ilimitados

**Todo de Free, más:**
- ✅ Dashboard avanzado con gráficos
- ✅ Presupuestos por categoría
- ✅ Alertas de límites
- ✅ Exportar a Excel/PDF
- ✅ Reportes personalizados
- ✅ Soporte prioritario

**Ideal para:** Freelancers y pequeños negocios

---

### 🌟 Plan Plus (Premium)

**Precio:** $19.99/mes

**Límites:**
- Categorías ilimitadas
- Gastos ilimitados
- Ingresos ilimitados

**Todo de Pro, más:**
- ✅ Dashboard premium con IA
- ✅ Presupuestos avanzados (proyecciones, metas)
- ✅ API Access (REST + webhooks)
- ✅ Integraciones (Stripe, PayPal, Mercado Pago)
- ✅ Reportes avanzados con análisis de tendencias
- ✅ Exportar a múltiples formatos
- ✅ Soporte 24/7
- ✅ Acceso anticipado a nuevas funciones

**Ideal para:** Empresas y usuarios avanzados

---

### 🛡️ Plan Admin (Administrador)

**Precio:** Solo por invitación

**Límites:**
- Sin límites

**Todo de Plus, más:**
- ✅ Gestión de usuarios del sistema
- ✅ Logs de actividad y auditoría
- ✅ Configuración del sistema
- ✅ Cambiar planes de usuarios
- ✅ Ver perfiles de todos los usuarios
- ✅ Acceso a métricas globales

**Ideal para:** Administradores del sistema

---

## Límites por Plan

| Recurso | Free | Pro | Plus | Admin |
|---------|------|-----|------|-------|
| Categorías | 10 | 50 | ∞ | ∞ |
| Gastos mensuales | ∞ | ∞ | ∞ | ∞ |
| Ingresos | ∞ | ∞ | ∞ | ∞ |
| Métodos de pago | ∞ | ∞ | ∞ | ∞ |
| Presupuestos | ❌ | ✅ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| Integraciones | ❌ | ❌ | ✅ | ✅ |
| Soporte | Email | Prioritario | 24/7 | 24/7 |

---

## Registro y Autenticación

### Proceso de Registro

1. **Usuario se registra** en `/registro`:
   ```typescript
   // app/registro/page.tsx
   await signUp(email, password, fullName);
   ```

2. **Supabase crea usuario** en `auth.users`

3. **Trigger automático** crea perfil en `public.profiles`:
   ```sql
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW
     EXECUTE FUNCTION public.handle_new_user();
   ```

4. **Perfil creado** con plan **free** por defecto

5. **Email de confirmación** enviado

### Métodos de Autenticación

1. **Email + Contraseña** (implementado)
   ```typescript
   await signIn(email, password);
   ```

2. **Magic Link** (implementado)
   ```typescript
   await signInWithMagicLink(email);
   ```

3. **OAuth** (próximamente)
   - Google
   - GitHub

---

## Verificación de Roles

### Server-Side Helpers

```typescript
import {
  getUserProfile,
  getUserPlan,
  hasPlan,
  isAdmin,
  canCreateResource,
  getPlanLimits
} from '@/lib/profiles';

// En Server Components o Server Actions
const profile = await getUserProfile();
const plan = await getUserPlan();

// Verificar si tiene un plan específico
if (await hasPlan('pro')) {
  // Usuario tiene plan Pro o superior
}

// Verificar si es admin
if (await isAdmin()) {
  // Usuario es administrador
}

// Verificar si puede crear un recurso
if (await canCreateResource('categories')) {
  // Puede crear más categorías
} else {
  // Ha alcanzado el límite
}

// Obtener límites del plan
const limits = await getPlanLimits();
console.log(limits.maxCategories); // 10, 50, o 999999
```

### Ejemplo: Proteger una Acción

```typescript
// app/dashboard/actions.ts
'use server';

import { canCreateResource } from '@/lib/profiles';

export async function saveCategory(formData: FormData) {
  return withAuth(async (userId) => {
    // Verificar límites del plan
    if (!(await canCreateResource('categories'))) {
      throw new Error(
        'Has alcanzado el límite de categorías de tu plan. Actualiza a Pro para crear más.'
      );
    }

    // ... continuar con la creación
  });
}
```

### Ejemplo: Proteger una Página

```typescript
// app/admin/page.tsx
import { isAdmin } from '@/lib/profiles';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect('/dashboard');
  }

  return <div>Panel de Administrador</div>;
}
```

---

## Actualización de Planes

### Cambiar Plan (Solo Admins)

```typescript
import { upgradePlan } from '@/lib/profiles';

// Actualizar plan de un usuario
await upgradePlan(userId, 'pro', '2025-12-31T23:59:59Z');
// expiresAt es opcional (null = sin expiración)
```

### Límites Personalizados (Admins)

Los admins pueden establecer límites personalizados por usuario:

```sql
-- SQL directo (solo admins)
UPDATE profiles
SET
  max_categories = 100,
  max_monthly_expenses = 1000
WHERE id = 'user-id';
```

---

## Estructura de Base de Datos

### Tabla: `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  plan user_plan NOT NULL DEFAULT 'free',
  plan_expires_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT,
  timezone TEXT DEFAULT 'America/Mexico_City',
  language TEXT DEFAULT 'es',

  -- Límites personalizados (NULL = usar límite del plan)
  max_monthly_expenses INTEGER,
  max_categories INTEGER
);
```

### Enum: `user_plan`

```sql
CREATE TYPE user_plan AS ENUM ('free', 'pro', 'plus', 'admin');
```

### Políticas RLS

1. **Usuarios ven su propio perfil:**
   ```sql
   USING (auth.uid() = id)
   ```

2. **Usuarios no pueden cambiar su plan:**
   ```sql
   WITH CHECK (
     auth.uid() = id AND
     plan = (SELECT plan FROM profiles WHERE id = auth.uid())
   )
   ```

3. **Admins ven todos los perfiles:**
   ```sql
   USING (
     EXISTS (
       SELECT 1 FROM profiles
       WHERE id = auth.uid() AND plan = 'admin'
     )
   )
   ```

---

## API Reference

### `getUserProfile()`
Obtiene el perfil completo del usuario autenticado.

**Returns:** `Promise<UserProfile | null>`

**Uso:**
```typescript
const profile = await getUserProfile();
if (profile) {
  console.log(profile.plan); // 'free' | 'pro' | 'plus' | 'admin'
}
```

---

### `getUserPlan()`
Obtiene solo el plan del usuario.

**Returns:** `Promise<UserPlan>` (siempre devuelve un valor, 'free' si no está autenticado)

**Uso:**
```typescript
const plan = await getUserPlan();
```

---

### `hasPlan(requiredPlan)`
Verifica si el usuario tiene un plan específico o superior.

**Parameters:**
- `requiredPlan`: `'free' | 'pro' | 'plus' | 'admin'`

**Returns:** `Promise<boolean>`

**Uso:**
```typescript
if (await hasPlan('pro')) {
  // Usuario tiene Pro, Plus o Admin
}
```

---

### `isAdmin()`
Verifica si el usuario es administrador.

**Returns:** `Promise<boolean>`

**Uso:**
```typescript
if (await isAdmin()) {
  // Mostrar opciones de admin
}
```

---

### `canCreateResource(resourceType)`
Verifica si el usuario puede crear más de un tipo de recurso.

**Parameters:**
- `resourceType`: `'categories' | 'expenses'`

**Returns:** `Promise<boolean>`

**Uso:**
```typescript
if (!(await canCreateResource('categories'))) {
  throw new Error('Límite de categorías alcanzado');
}
```

---

### `getPlanLimits()`
Obtiene los límites del plan del usuario (respeta límites personalizados).

**Returns:** `Promise<PlanLimits>`

**Uso:**
```typescript
const limits = await getPlanLimits();
console.log(limits.maxCategories); // 10, 50, 999999
console.log(limits.features); // Array de strings
```

---

### `updateProfile(updates)`
Actualiza el perfil del usuario (no puede cambiar el plan).

**Parameters:**
- `updates`: `{ full_name?: string; avatar_url?: string; timezone?: string; language?: string }`

**Returns:** `Promise<{ success: boolean; error?: string }>`

**Uso:**
```typescript
await updateProfile({ full_name: 'Juan Pérez' });
```

---

### `upgradePlan(userId, newPlan, expiresAt?)`
Actualiza el plan de un usuario (solo admins).

**Parameters:**
- `userId`: `string`
- `newPlan`: `'free' | 'pro' | 'plus' | 'admin'`
- `expiresAt`: `string | undefined` (ISO date string)

**Returns:** `Promise<{ success: boolean; error?: string }>`

**Uso:**
```typescript
// Actualizar a Pro sin expiración
await upgradePlan(userId, 'pro');

// Actualizar a Plus con expiración
await upgradePlan(userId, 'plus', '2025-12-31T23:59:59Z');
```

---

## Roadmap

- [ ] Página de precios (`/pricing`)
- [ ] Sistema de pagos con Stripe
- [ ] Downgrades automáticos al expirar
- [ ] Email notifications de límites
- [ ] Dashboard de administrador
- [ ] Métricas de uso por plan
- [ ] Webhooks para cambios de plan

---

## Notas de Seguridad

1. **Todas las verificaciones de roles son server-side** - Los helpers están en archivos `'server-only'`
2. **RLS protege la base de datos** - Usuarios no pueden modificar planes vía SQL directo
3. **Triggers automáticos** - Garantizan que todos los usuarios tengan perfil
4. **Límites respetados** - Verificar antes de cada creación de recurso

---

**Última actualización:** December 27, 2025
**Versión:** 0.1.0-beta
