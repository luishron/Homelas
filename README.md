# 💰 Sistema de Gestión de Gastos Personales

> Aplicación web moderna para gestionar gastos personales con soporte para gastos recurrentes, categorización inteligente y seguimiento de estados de pago. Diseñada con base en investigación científica sobre comportamiento financiero para el mercado hispano.

[![Version](https://img.shields.io/badge/version-0.1.0--beta-orange.svg)](https://github.com/luishron/nextjs-postgres-nextauth-tailwindcss-template/releases)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.9-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Novedades en v0.1.0-beta](#-novedades-en-v010-beta)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos Principales](#-módulos-principales)
- [Documentación de la Base de Datos](#-documentación-de-la-base-de-datos)
- [Roadmap](#-roadmap)
- [Documentación](#-documentación)

---

## ✨ Características

### 🌐 Landing Page

- **10-Section Conversion Funnel**: Hero, Problem, Solution, Demo, Comparison, Testimonials, Pricing, FAQ, CTA
- **Research-Backed Design**: Built on behavioral psychology studies (Li & Forlizzi tracking models, Epstein abandonment research)
- **Hispanic Market Focus**: Tailored messaging and value propositions

### 📊 Dashboard Inteligente

- **Resumen Mensual**: Vista consolidada de gastos e ingresos del mes actual
- **Comparativa Temporal**: Análisis de mes anterior, actual y proyección del próximo mes
- **KPIs Principales**: Indicadores clave con tendencias y cambios porcentuales
- **Próximos Gastos a Vencer**: Widget con los gastos pendientes ordenados por urgencia
- **Top Categorías**: Gráfico visual de las 5 categorías con mayor gasto
- **Estados Vacíos Inteligentes**: Onboarding guiado para nuevos usuarios sin datos
- **Balance en Tiempo Real**: Cálculo automático de ingresos - gastos

### 🎯 Gestión de Gastos

- **CRUD Completo**: Crear, leer, actualizar y eliminar gastos
- **Estados de Pago**: Seguimiento automático (pendiente, pagado, vencido)
- **Detección de Vencimientos**: Marcado automático de gastos vencidos por fecha
- **Métodos de Pago Dinámicos**: Selección de métodos configurados (banco + últimos 4 dígitos)
- **Ordenamiento Inteligente**: Prioriza vencidos → pendientes → pagados
- **Estadísticas en Tiempo Real**: Totales y desglose por estado en la tabla
- **Visual de Urgencia**: Resaltado de gastos vencidos con bordes y colores
- **Notas Personalizadas**: Agregar contexto adicional a cada gasto
- **Filtros Inteligentes**: Por tipo (todos, recurrentes, únicos)

### 🔄 Gastos Recurrentes Avanzados

- **Generación Virtual**: Cálculo automático de próximas instancias sin saturar la BD
- **Mensajes Inteligentes**: "Vence en X días/semanas/meses"
- **Pago Anticipado**: Posibilidad de pagar instancias futuras
- **Filtrado Automático**: Oculta instancias ya pagadas
- **Frecuencias Soportadas**: Semanal, mensual, anual
- **Vista Dedicada**: Pestaña especializada para gastos recurrentes

### 🏷️ Categorías Personalizables

- **CRUD Completo**: Gestión total de categorías
- **Personalización Visual**: Colores e iconos emoji
- **Totales Automáticos**: Cálculo en tiempo real del gasto por categoría
- **Descripción**: Contexto adicional para cada categoría
- **Cards Visuales**: Presentación clara con totales destacados

### 💳 Métodos de Pago

- **CRUD Completo**: Crear, editar y eliminar métodos de pago
- **Tipos Flexibles**: Tarjeta de crédito/débito, efectivo, transferencia, otro
- **Información Bancaria**: Asociar banco y últimos 4 dígitos de tarjeta
- **Método Predeterminado**: Marca un método como predeterminado para selección automática
- **Personalización Visual**: Colores personalizables para cada método
- **Iconos Dinámicos**: Iconos automáticos según el tipo de método
- **Integración Completa**: Selección de métodos al crear/editar gastos
- **Display Inteligente**: Muestra "Nombre (Banco) ••1234" en formularios y tablas

### 💰 Gestión de Ingresos

- **CRUD Completo**: Crear, leer, actualizar y eliminar ingresos
- **Categorías Separadas**: Sistema de categorías independiente para ingresos
- **Ingresos Recurrentes**: Seguimiento de salarios y otros ingresos periódicos
- **Frecuencias**: Semanal, mensual, anual
- **Métodos de Pago**: Asociar cómo se recibió cada ingreso
- **Vistas Organizadas**: Pestañas para todos, recurrentes y únicos
- **Integración Dashboard**: Ingresos reflejados en KPIs y balance
- **Categorías Predefinidas**: Salario, Freelance, Inversiones, Otros

### 🎨 Interfaz de Usuario

- **Diseño Moderno**: UI basada en shadcn/ui
- **Responsive**: Adaptable a móvil, tablet y desktop
- **Badges Semánticos**: Colores según urgencia y estado
- **Tablas Interactivas**: Acciones contextuales (editar, eliminar)
- **Diálogos Modales**: Experiencia fluida sin cambios de página
- **Formato USD**: Moneda mexicana con separadores correctos

---

## 🚀 Novedades en v0.1.0-beta

### Landing Page (Dec 2025)

Conversion-optimized marketing page with 10 strategic sections designed to guide users from problem awareness to signup. Built on scientific research about financial behavior and tracking abandonment patterns.

### Dashboard Inteligente Completamente Renovado

El dashboard ahora ofrece una vista completa de tu situación financiera:

**KPIs Principales:**
- Gastos del mes con tendencia vs mes anterior (↑ / ↓ %)
- Ingresos del mes con tendencia
- Balance en tiempo real (verde si positivo, rojo si negativo)
- Gastos vencidos destacados

**Comparativa Temporal:**
- Vista de 3 meses: anterior, actual y proyección del próximo
- Proyección automática basada en gastos recurrentes
- Detección inteligente de nuevos usuarios con onboarding

**Widgets Analíticos:**
- Próximos 7 gastos a vencer con badges de urgencia
- Top 5 categorías del mes con porcentajes y barras visuales
- Contador inteligente (hoy, mañana, en X días/semanas)

### Sistema de Ingresos Completo

**Funcionalidades:**
- CRUD completo de ingresos (crear, editar, eliminar)
- Categorías separadas e independientes de gastos
- 4 categorías predefinidas: Salario, Freelance, Inversiones, Otros
- Ingresos recurrentes (semanal, mensual, anual)
- Vistas organizadas en pestañas (todos, recurrentes, únicos)
- Integración completa con el dashboard para cálculo de balance

**Migración Automática:**
- Script SQL que crea la estructura completa
- Asignación inteligente de categorías basada en palabras clave
- Triggers automáticos para `updated_at`

### Tabla de Gastos Mejorada (UX/UI)

**Ordenamiento Inteligente:**
- Prioridad automática: vencidos → pendientes → pagados
- Dentro de cada grupo, ordenado por fecha
- Resaltado visual de gastos vencidos (fondo rojo, borde izquierdo)

**Estadísticas en Tiempo Real:**
- Total general al pie de la tabla
- Desglose detallado por estado en cards visuales
- Contador de gastos por cada estado
- Totales calculados automáticamente

**Mejoras Visuales:**
- Badges de estado con colores semánticos (verde/amarillo/rojo)
- Display mejorado de métodos de pago (banco + últimos 4 dígitos)
- Cards de resumen con iconos y colores distintivos

### Integración de Métodos de Pago Dinámicos

- Eliminados valores hardcodeados
- Selección desde tabla `payment_methods`
- Display inteligente: "Nombre (Banco) ••1234"
- Fallback para valores legacy

### Wise-Inspired UX/UI Transformation (FASE 1-5)

**Transformación completa del diseño** inspirada en Wise para máxima claridad y accesibilidad:

**FASE 1: Sistema de Diseño Homelas**
- Paleta de colores con verde vibrante (#9FFF66) como primary
- Colores semánticos para transacciones (income, expense, transfer)
- Sistema de iconos con 30+ categorías
- Tipografía optimizada y animaciones suaves
- Dark mode completamente funcional

**FASE 2: Componentes Core**
- `TransactionItem`: Componente principal estilo Wise (variantes: default, compact, detailed)
- `FilterBar`: Filtros horizontales con multi-select
- `SearchBar`: Búsqueda con debounce y Cmd+K shortcut
- `TimelineGroup`: Agrupación temporal (Today, Yesterday, etc.)
- `Skeletons`: 11 componentes de loading states

**FASE 3: Pantallas Principales**
- Dashboard rediseñado con KPIs, QuickAddFAB y widgets
- Gastos estilo Wise con TransactionItem y agrupación temporal
- Categorías en grid mejorado
- Formularios espaciosos y claros

**FASE 4: Features UX Avanzadas**
- GlobalSearch con Cmd+K y búsqueda fuzzy
- Filtros avanzados con URL sync y presets guardables
- Sistema de toast mejorado (success, error, warning, info, loading, promise)
- Micro-interacciones y animaciones

**FASE 5: Accesibilidad y Responsive** ✅
- **WCAG 2.1 AA Compliance:** 100% compliant
  - Touch targets ≥ 44px en todos los elementos interactivos
  - Contraste de colores ≥ 4.5:1 verificado
  - ARIA labels completos
  - Navegación por teclado completa
  - Focus visible en todos los elementos
- **Responsive Design:** Mobile-first (320px-1920px+)
- **Documentación completa:** 9 documentos actualizados/creados

Ver: `/docs/ACCESSIBILITY-AUDIT.md` y `/docs/IMPLEMENTATION_STATUS.md` para más detalles.

---

## 🛠 Stack Tecnológico

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes accesibles y personalizables
- **[Lucide React](https://lucide.dev/)** - Iconos modernos

### Backend & Base de Datos
- **[Supabase](https://supabase.com/)** - Base de datos PostgreSQL + Auth
- **[Supabase Auth](https://supabase.com/docs/guides/auth)** - Autenticación con Magic Links
- **[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)** - Mutaciones del lado del servidor
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database migrations

### Desarrollo
- **[pnpm](https://pnpm.io/)** - Package manager eficiente
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formateo de código

---

## 🏗 Arquitectura

### Patrón de Diseño

El proyecto sigue una arquitectura **Server-First** con Next.js App Router:

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente (Browser)                     │
│  - React Components (Client Components)                 │
│  - UI State Management                                  │
│  - Optimistic Updates                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓ Server Actions / API Routes
┌─────────────────────────────────────────────────────────┐
│                  Servidor (Next.js)                      │
│  - Server Components (RSC)                              │
│  - Server Actions (Mutations)                           │
│  - Authentication Middleware                            │
│  - Business Logic                                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓ Supabase Client
┌─────────────────────────────────────────────────────────┐
│                Base de Datos (Supabase)                  │
│  - PostgreSQL Database                                  │
│  - Row Level Security (RLS)                             │
│  - Real-time Subscriptions                             │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Server Components** → Fetch inicial de datos en el servidor
2. **Client Components** → Interacción del usuario
3. **Server Actions** → Mutaciones seguras en el servidor
4. **Supabase Client** → Operaciones de base de datos
5. **Revalidation** → Actualización automática de la UI

---

## 📦 Instalación

### Prerequisitos

- Node.js 18.17 o superior
- pnpm 8.0 o superior
- Cuenta de Supabase

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/luishron/nextjs-postgres-nextauth-tailwindcss-template.git
cd nextjs-postgres-nextauth-tailwindcss-template
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env.local
```

Edita `.env.local` y configura tus credenciales de Supabase (obtén las claves en tu [dashboard de Supabase](https://supabase.com/dashboard)):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Configurar Base de Datos**

La aplicación usa **Drizzle ORM** para migraciones automáticas siguiendo un enfoque 100% Drizzle.

**Opción A: Desarrollo (Push directo)**
```bash
pnpm db:push
```

**Opción B: Producción (Migraciones versionadas)**
```bash
pnpm db:migrate
```

**Importante:** Las migraciones de Drizzle incluyen todos los cambios de schema, triggers y funciones. La migración crítica `0001_add_user_plan_enum_and_triggers.sql` corrige el sistema de registro de usuarios.

Ver `/docs/DEPLOYMENT.md` y `MIGRATION-GUIDE.md` para configuración en producción.

5. **Iniciar servidor de desarrollo**

```bash
pnpm dev
```

Visita [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuración

### Supabase

Ver documentación detallada en [docs/setup/SUPABASE.md](./docs/setup/SUPABASE.md)

### Variables de Entorno

```env
# Supabase (Requerido)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Opcional: Site URL para Magic Links (producción)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Opcional: Database URL para Drizzle (producción)
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres?sslmode=require
```

Ver `.env.example` para el template completo.

---

## 🎮 Uso

### Crear un Gasto

1. Navega a la pestaña "Gastos"
2. Click en "Agregar Gasto"
3. Completa el formulario:
   - Descripción
   - Monto
   - Fecha
   - Categoría
   - Método de pago (selecciona de tus métodos configurados)
   - Estado de pago
   - Tipo (único o recurrente)
4. Si es recurrente, selecciona la frecuencia
5. Guarda

### Gestionar Gastos Recurrentes

1. Crea un gasto marcándolo como "Recurrente"
2. Ve a la pestaña "Recurrentes"
3. Visualiza las próximas instancias en la sección "Próximos Gastos Recurrentes"
4. Click en "Pagar" para registrar el pago de una instancia
5. La instancia desaparece de "Próximos" y se registra en el historial

### Configurar Métodos de Pago

1. Navega a "Métodos de Pago"
2. Click en "Nuevo Método de Pago"
3. Define:
   - Nombre (ej. "Visa Principal")
   - Tipo (tarjeta crédito/débito, efectivo, transferencia, otro)
   - Banco (opcional)
   - Últimos 4 dígitos (opcional, solo para tarjetas)
   - Color (selector visual)
   - Marcar como predeterminado
4. Los métodos aparecerán en los formularios de gastos

### Gestionar Ingresos

1. Navega a "Ingresos"
2. Si no hay categorías, primero crea una categoría de ingresos
3. Click en "Agregar Ingreso"
4. Completa el formulario:
   - Fuente del ingreso (ej. "Salario Enero")
   - Monto
   - Fecha de recepción
   - Categoría
   - Tipo (único o recurrente)
   - Frecuencia (si es recurrente)
5. Visualiza tus ingresos en las pestañas:
   - **Todos**: Lista completa
   - **Recurrentes**: Solo ingresos periódicos
   - **Únicos**: Solo ingresos puntuales
6. Los ingresos se reflejan automáticamente en el dashboard

### Categorías

1. Navega a "Categorías"
2. Click en "Agregar Categoría"
3. Define:
   - Nombre
   - Color (selector visual)
   - Icono emoji
   - Descripción
4. Visualiza el total gastado en cada categoría

---

## 📁 Estructura del Proyecto

```
gastos/
├── app/
│   ├── (dashboard)/          # Grupo de rutas del dashboard
│   │   ├── actions.ts        # Server Actions globales
│   │   ├── layout.tsx        # Layout compartido
│   │   ├── page.tsx          # Dashboard principal con resumen
│   │   ├── dashboard-kpis.tsx           # KPIs principales
│   │   ├── monthly-comparison-card.tsx  # Comparativa mensual
│   │   ├── upcoming-expenses-widget.tsx # Widget gastos próximos
│   │   ├── top-categories-chart.tsx     # Gráfico categorías
│   │   ├── categorias/       # Módulo de categorías de gastos
│   │   │   ├── page.tsx
│   │   │   ├── category-card.tsx
│   │   │   └── add-category-dialog.tsx
│   │   ├── metodos-pago/     # Módulo de métodos de pago
│   │   │   ├── page.tsx
│   │   │   ├── payment-method-card.tsx
│   │   │   └── add-payment-method-dialog.tsx
│   │   ├── gastos/           # Módulo de gastos
│   │   │   ├── page.tsx
│   │   │   ├── expenses-table.tsx
│   │   │   ├── add-expense-dialog.tsx
│   │   │   ├── edit-expense-dialog.tsx
│   │   │   └── upcoming-expenses-card.tsx
│   │   └── ingresos/         # Módulo de ingresos
│   │       ├── page.tsx
│   │       └── categorias/   # Categorías de ingresos
│   │           └── page.tsx
│   ├── login/                # Autenticación
│   └── layout.tsx            # Layout raíz
├── components/
│   └── ui/                   # Componentes shadcn/ui
├── lib/
│   ├── auth.ts               # Configuración de Auth.js
│   ├── db.ts                 # Cliente Supabase + Queries
│   └── supabase/
│       └── server.ts         # Cliente servidor de Supabase
├── types/                    # Tipos TypeScript compartidos
├── public/                   # Assets estáticos
├── supabase-init.sql         # Script de inicialización
├── supabase-add-payment-status.sql  # Script estados de pago
├── supabase-payment-methods.sql     # Script métodos de pago
├── supabase-incomes-migration.sql   # Script sistema de ingresos
└── package.json
```

---

## 🧩 Módulos Principales

### 1. Autenticación (`lib/auth.ts`)

Gestiona la autenticación de usuarios con Supabase Auth:

```typescript
export async function getUser(): Promise<User | null>
export async function signInWithMagicLink(email: string): Promise<void>
export async function signOut(): Promise<void>
```

**Características:**
- Magic Links (autenticación sin contraseña)
- Session management con cookies
- Protected routes y middleware
- Onboarding automático de nuevos usuarios

---

### 2. Base de Datos (`lib/db.ts`)

Cliente central de Supabase con todas las queries:

#### Tipos Principales

```typescript
export type Category = {
  id: number;
  user_id: string;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
}

export type PaymentStatus = 'pagado' | 'pendiente' | 'vencido';

export type PaymentMethodType =
  | 'tarjeta_credito'
  | 'tarjeta_debito'
  | 'efectivo'
  | 'transferencia'
  | 'otro';

export type PaymentMethod = {
  id: number;
  user_id: string;
  name: string;
  type: PaymentMethodType;
  bank?: string | null;
  last_four_digits?: string | null;
  icon?: string | null;
  color: string;
  is_default: boolean;
}

export type Expense = {
  id: number;
  user_id: string;
  category_id: number;
  amount: string;
  description?: string | null;
  date: string;
  payment_method?: string;
  payment_status?: PaymentStatus;
  notes?: string | null;
  is_recurring?: number;
  recurrence_frequency?: string | null;
}

export type UpcomingExpense = Expense & {
  isVirtual: true;
  daysUntilDue: number;
  dueMessage: string;
  nextDate: string;
  templateId: number;
}

export type IncomeCategory = {
  id: number;
  user_id: string;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
}

export type Income = {
  id: number;
  user_id: string;
  source: string;
  amount: string;
  date: string;
  description?: string | null;
  category_id?: number | null;
  payment_method?: string | null;
  is_recurring?: number;
  recurrence_frequency?: string | null;
  notes?: string | null;
}
```

#### Funciones de Gastos

```typescript
// Obtener gastos con paginación y filtros
getExpensesByUser(userId: string, options?: {
  search?: string;
  isRecurring?: boolean;
  offset?: number;
  limit?: number;
}): Promise<{
  expenses: Expense[];
  newOffset: number | null;
  totalExpenses: number;
}>

// CRUD de gastos
createExpense(expense: InsertExpense): Promise<Expense>
updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense>
deleteExpenseById(id: number): Promise<void>
```

#### Funciones de Categorías

```typescript
// Obtener categorías del usuario
getCategoriesByUser(userId: string): Promise<Category[]>

// Calcular total gastado por categoría
getCategoryTotalExpenses(userId: string, categoryId: number): Promise<number>

// CRUD de categorías
createCategory(category: InsertCategory): Promise<Category>
updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>
deleteCategoryById(id: number): Promise<void>
```

#### Funciones de Métodos de Pago

```typescript
// Obtener métodos de pago del usuario (ordenados por predeterminado)
getPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]>

// CRUD de métodos de pago
createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>
updatePaymentMethod(id: number, paymentMethod: Partial<InsertPaymentMethod>): Promise<PaymentMethod>
deletePaymentMethodById(id: number): Promise<void>
```

**Lógica Especial:**
- Al marcar un método como predeterminado, automáticamente desmarca todos los demás del usuario
- Los métodos se ordenan por predeterminado primero, luego por fecha de creación

#### Funciones de Gastos Recurrentes

```typescript
// Generar próximas instancias virtuales
getUpcomingRecurringExpenses(
  userId: string,
  monthsAhead?: number
): Promise<UpcomingExpense[]>
```

**Algoritmo de Generación Virtual:**

1. Obtiene templates recurrentes de la BD
2. Calcula próximas fechas según frecuencia
3. Genera mensajes inteligentes de vencimiento
4. Filtra instancias ya pagadas
5. Ordena por proximidad

#### Funciones de Dashboard

```typescript
// Resumen mensual de ingresos y gastos
getMonthlySummary(
  userId: string,
  year: number,
  month: number
): Promise<MonthlySummary>

// Obtener gastos vencidos
getOverdueExpenses(userId: string): Promise<OverdueExpensesSummary>

// Próximos gastos a vencer
getUpcomingDueExpenses(
  userId: string,
  limit?: number
): Promise<Expense[]>

// Top categorías del mes
getTopCategoriesByMonth(
  userId: string,
  year: number,
  month: number,
  limit?: number
): Promise<CategorySummary[]>

// Proyección del próximo mes (basado en recurrentes)
getNextMonthProjection(userId: string): Promise<MonthlyProjection>
```

#### Funciones de Ingresos

```typescript
// Obtener ingresos del usuario
getIncomesByUser(userId: string): Promise<Income[]>

// CRUD de ingresos
createIncome(income: InsertIncome): Promise<Income>
updateIncome(id: number, income: Partial<InsertIncome>): Promise<Income>
deleteIncomeById(id: number): Promise<void>

// Categorías de ingresos
getIncomeCategoriesByUser(userId: string): Promise<IncomeCategory[]>
createIncomeCategory(category: InsertIncomeCategory): Promise<IncomeCategory>
updateIncomeCategory(id: number, category: Partial<InsertIncomeCategory>): Promise<IncomeCategory>
deleteIncomeCategoryById(id: number): Promise<void>
```

---

### 3. Server Actions (`app/(dashboard)/actions.ts`)

Mutaciones seguras del lado del servidor:

```typescript
// Gastos
export async function saveExpense(formData: FormData): Promise<ActionResult>
export async function updateExpense(formData: FormData): Promise<ActionResult>
export async function deleteExpense(formData: FormData): Promise<void>

// Categorías
export async function saveCategory(formData: FormData): Promise<ActionResult>
export async function updateCategory(formData: FormData): Promise<ActionResult>
export async function deleteCategory(formData: FormData): Promise<void>

// Métodos de Pago
export async function savePaymentMethod(formData: FormData): Promise<ActionResult>
export async function updatePaymentMethod(formData: FormData): Promise<ActionResult>
export async function deletePaymentMethod(formData: FormData): Promise<void>

// Gastos Recurrentes
export async function payRecurringExpense(formData: FormData): Promise<ActionResult>

// Ingresos
export async function saveIncome(formData: FormData): Promise<ActionResult>
export async function updateIncome(formData: FormData): Promise<ActionResult>
export async function deleteIncome(formData: FormData): Promise<void>

// Categorías de Ingresos
export async function saveIncomeCategory(formData: FormData): Promise<ActionResult>
export async function updateIncomeCategory(formData: FormData): Promise<ActionResult>
export async function deleteIncomeCategory(formData: FormData): Promise<void>
```

**Características:**
- Validación de autenticación
- Manejo de errores centralizado
- Revalidación automática de paths
- Type-safe con FormData

---

### 4. Componentes de UI

#### ExpensesTable (`expenses-table.tsx`)

Tabla interactiva de gastos con:
- **Ordenamiento Inteligente**: Prioriza vencidos → pendientes → pagados
- **Estadísticas en Tiempo Real**: Calcula totales por estado
- **Resaltado Visual**: Gastos vencidos con fondo rojo y borde izquierdo
- **Badges Semánticos**: Colores según estado (verde/amarillo/rojo)
- **Desglose Detallado**: Cards al final con totales por estado
- **Formateo de Moneda USD**
- **Métodos de Pago Dinámicos**: Muestra nombre + banco + últimos dígitos
- **Acciones Contextuales**: Editar y eliminar

#### DashboardKPIs (`dashboard-kpis.tsx`)

KPIs principales del mes actual:
- Gastos del mes con tendencia vs mes anterior
- Ingresos del mes con tendencia
- Balance (ingresos - gastos) con indicador visual
- Gastos vencidos destacados en rojo

#### MonthlyComparisonCard (`monthly-comparison-card.tsx`)

Comparativa de 3 meses:
- Mes anterior (histórico)
- Mes actual (destacado)
- Próximo mes (proyección basada en recurrentes)
- Manejo inteligente de estados vacíos

#### UpcomingExpensesWidget (`upcoming-expenses-widget.tsx`)

Widget de próximos gastos a vencer:
- Muestra próximos 7 gastos pendientes
- Badges de urgencia por color (hoy/mañana/días/semanas)
- Contador de días hasta vencimiento
- Display de categorías y montos

#### TopCategoriesChart (`top-categories-chart.tsx`)

Top 5 categorías del mes:
- Ranking visual (#1, #2, etc.)
- Barras de progreso con colores de categoría
- Porcentajes calculados automáticamente
- Total y cantidad de gastos por categoría

#### UpcomingExpensesCard (`upcoming-expenses-card.tsx`)

Card de próximos gastos recurrentes:
- Lista de instancias virtuales
- Mensajes de vencimiento dinámicos
- Botón de pago anticipado
- Badges de urgencia por color

#### CategoryCard (`category-card.tsx`)

Card visual de categoría:
- Icono emoji personalizado
- Color de fondo configurable
- Total gastado destacado
- Acciones de eliminación

---

## 🗄️ Documentación de la Base de Datos

### Esquema de Tablas

#### `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `categories`
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `expenses`
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pendiente'
    CHECK (payment_status IN ('pagado', 'pendiente', 'vencido')),
  notes TEXT,
  is_recurring INTEGER DEFAULT 0,
  recurrence_frequency TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_payment_status ON expenses(payment_status);
```

#### `payment_methods`
```sql
CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'transferencia', 'otro')),
  bank TEXT,
  last_four_digits TEXT,
  icon TEXT,
  color TEXT NOT NULL DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
```

#### `income_categories`
```sql
CREATE TABLE income_categories (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#10B981',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_income_categories_user_id ON income_categories(user_id);
```

#### `incomes`
```sql
CREATE TABLE incomes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  source TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES income_categories(id) ON DELETE SET NULL,
  payment_method TEXT,
  is_recurring INTEGER DEFAULT 0 CHECK (is_recurring IN (0, 1)),
  recurrence_frequency TEXT CHECK (recurrence_frequency IN ('weekly', 'monthly', 'yearly')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_incomes_user_id ON incomes(user_id);
CREATE INDEX idx_incomes_recurring ON incomes(user_id, is_recurring) WHERE is_recurring = 1;
```

### Relaciones

```
users (1) ──< (N) categories
users (1) ──< (N) expenses
users (1) ──< (N) payment_methods
users (1) ──< (N) income_categories
users (1) ──< (N) incomes
categories (1) ──< (N) expenses
income_categories (1) ──< (N) incomes
```

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

```sql
-- Users solo pueden ver sus propios datos
CREATE POLICY "Users can view own data" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON expenses
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 🗺️ Roadmap

### ✅ v1.0.0 - MVP Base (Completado)
- [x] Sistema de autenticación con GitHub OAuth
- [x] CRUD de gastos
- [x] Categorías personalizables
- [x] Métodos de pago configurables
- [x] Gastos recurrentes con generación virtual
- [x] Estados de pago (pendiente, pagado, vencido)

### ✅ v2.0.0 - Dashboard e Ingresos (Completado)
- [x] Dashboard inteligente con KPIs
- [x] Resumen mensual (anterior, actual, proyección)
- [x] Widget de próximos gastos a vencer
- [x] Top categorías con gráficos
- [x] Gestión de ingresos con CRUD completo
- [x] Categorías de ingresos separadas
- [x] Ingresos recurrentes
- [x] Cálculo de balance (ingresos - gastos)
- [x] Tabla de gastos mejorada con ordenamiento inteligente
- [x] Estadísticas en tiempo real
- [x] Estados vacíos con onboarding

### v2.1.0 - Reportes y Exportación
- [ ] Exportación a CSV/Excel de gastos e ingresos
- [ ] Gráficas de tendencias temporales
- [ ] Reporte PDF mensual
- [ ] Análisis de patrones de gasto
- [ ] Comparativa año a año

### v2.2.0 - Presupuestos
- [ ] Definir presupuesto por categoría
- [ ] Alertas de sobre-gasto
- [ ] Progreso visual del presupuesto
- [ ] Presupuesto mensual global
- [ ] Notificaciones de límites

### v2.3.0 - Mejoras de Recurrentes
- [ ] Edición de monto por instancia
- [ ] Pausar/reanudar recurrentes
- [ ] Historial de cambios
- [ ] Predicción de gastos futuros
- [ ] Ajuste automático por inflación

### v3.0.0 - Metas y Ahorro
- [ ] Definir metas de ahorro
- [ ] Tracking de progreso de metas
- [ ] Sugerencias de ahorro basadas en IA
- [ ] Proyecciones financieras avanzadas
- [ ] Análisis de viabilidad de metas

---

## 📚 Documentación

**Índice central:** Para navegar toda la documentación del proyecto, consulta **[docs/INDEX.md](./docs/INDEX.md)** ⭐

### Documentación Principal

- **[README.md](./README.md)** - Este archivo, visión general del proyecto
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guía para contribuir al proyecto
- **[CLAUDE.md](./CLAUDE.md)** - Guía para trabajar con Claude Code
- **[MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)** - Guía completa para aplicar migraciones de base de datos (CRÍTICO para producción)

### Product & Strategy

- **[docs/PRD.md](./docs/PRD.md)** - Product Requirements Document (visión, user personas, métricas, roadmap)

### Diseño y Componentes

- **[docs/design-system.md](./docs/design-system.md)** - Sistema de diseño Homelas (colores, tipografía, animaciones)
- **[docs/COMPONENT_GUIDE.md](./docs/COMPONENT_GUIDE.md)** - Catálogo de componentes UI con ejemplos
- **[docs/ACCESSIBILITY-AUDIT.md](./docs/ACCESSIBILITY-AUDIT.md)** - Auditoría WCAG 2.1 AA compliance
- **[docs/ui-improvements.md](./docs/ui-improvements.md)** - Mejoras UI implementadas
- **[docs/card-improvements-plan.md](./docs/card-improvements-plan.md)** - Plan de mejora de cards

### Desarrollo y Features

- **[docs/IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md)** - Estado de features y roadmap

### Configuración

- **[docs/setup/SUPABASE.md](./docs/setup/SUPABASE.md)** - Setup de base de datos Supabase
- **[docs/setup/GITHUB_OAUTH.md](./docs/setup/GITHUB_OAUTH.md)** - Configuración de GitHub OAuth (Opcional - para OAuth via Supabase Auth)
- **[docs/AUTHENTICATION.md](./docs/AUTHENTICATION.md)** - Sistema de autenticación con Magic Links
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Guía de deployment en producción
- **[.env.example](./.env.example)** - Template de variables de entorno

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👤 Autor

**Luis Naranja**

- GitHub: [@luishron](https://github.com/luishron)

---

## 🙏 Agradecimientos

- Template base de [Next.js Admin Dashboard](https://github.com/vercel/nextjs-postgres-nextauth-tailwindcss-template)
- Componentes UI de [shadcn/ui](https://ui.shadcn.com/)
- Iconos de [Lucide](https://lucide.dev/)

---

<div align="center">
  <strong>Hecho con ❤️ y Claude Code</strong>
</div>
