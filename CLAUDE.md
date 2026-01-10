# CLAUDE.md

This file provides guidance to Claude Code when working with this codebase.

## Project Overview

Personal expense management web application built with Next.js 15, TypeScript, Supabase, and Tailwind CSS.

**Version:** 0.1.0-beta
**Status:** 🚧 Beta
**Last Updated:** January 10, 2026

**Tech Stack:** Next.js 15 (App Router), TypeScript 5.7, Supabase (PostgreSQL + RLS), Drizzle ORM, Tailwind CSS + shadcn/ui, Zustand

**Architecture:** See [`/docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for detailed system design.

**Recent Changes:** See `git log` for latest updates.

---

## Critical Files

- **`lib/db.ts`** - ALL database queries (single source of truth)
- **`app/[locale]/dashboard/actions.ts`** - Primary Server Actions
- **`lib/auth.ts`** - Authentication layer
- **`lib/action-helpers.ts`** - Server Action utilities (`withAuth`, `revalidate*`)
- **`lib/validations/schemas.ts`** - Zod validation schemas

---

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (localhost:3000) |
| `pnpm build` | Production build |
| `pnpm db:generate` | Generate SQL from Drizzle schemas |
| `pnpm db:push` | Direct push (no migration files) |
| `pnpm db:migrate` | Apply migrations (dev/staging) |
| `pnpm build:prod` | Migrations + build (CI/CD) |
| `npx prettier --write .` | Format code |
| `npx tsc --noEmit` | Type check |

**Database:** For production, use `pnpm build:prod` which auto-applies migrations.

---

## Mandatory Patterns

### 1. Server Actions Pattern

**Location:** `app/[locale]/dashboard/actions.ts` (primary) or co-located with page.

```typescript
'use server'
export async function saveExpense(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const validation = validateFormData(expenseSchema, formData);
    // ... createExpense, revalidateGastos()
  });
}
```

**Never** create server actions in component files.

### 2. Authentication Flow

```typescript
// Server Components
const user = await getUser() // from lib/auth.ts

// Server Actions
withAuth(async (userId) => { ... }) // provides userId (string UUID)
```

### 3. Currency Formatting ⭐ CRITICAL

**Always** use centralized `formatCurrency()`:

```typescript
// Server Components
const currency = await getUserCurrency();
const formatted = formatCurrency(amount, currency);

// Client Components (pass currency as prop)
<Component amount={100} currency={currency} />
```

**Never:**
- ❌ Hardcode currency to 'USD'
- ❌ Create local `formatCurrency()` functions
- ❌ Use `Intl.NumberFormat` directly

**Supported:** 20 currencies from Spanish-speaking countries (`lib/config/currencies.ts`)

### 4. Icon System ⭐ MANDATORY

**NEVER use emojis in the codebase.** Always use lucide-react icons.

```typescript
import { CategoryIcon } from '@/components/ui/category-icon';

<CategoryIcon icon={category.icon} color={category.color} />
```

**Icon Picker:**
```typescript
import { CategoryIconPicker } from '@/components/ui/category-icon-picker';
<CategoryIconPicker value={icon} onChange={setIcon} />
```

~50 curated icons in `/lib/constants/curated-category-icons.ts`

### 5. Accessibility Requirements ✅ MANDATORY

**ALL new components MUST meet WCAG 2.1 AA:**

- **Touch Targets:** ≥ 44×44px (use `h-11`, `min-h-[44px]`)
- **Color Contrast:** ≥ 4.5:1 (use design tokens)
- **ARIA Labels:** All interactive elements without text
- **Keyboard Nav:** Tab, Enter/Space support
- **Focus Visible:** `focus-visible:ring-2`
- **Semantic HTML:** `<nav>`, `<main>`, `<button>`, `<a>`

**Full Requirements:** See [`/docs/ACCESSIBILITY-COMPLIANCE.md`](./docs/ACCESSIBILITY-COMPLIANCE.md)

### 6. Database Integer Booleans

Supabase stores booleans as integers (0|1):

```typescript
// Write: is_recurring: data.isRecurring ? 1 : 0
// Read: if (expense.is_recurring === 1) { ... }
```

### 7. FormData Handling

Server Actions receive `FormData`, not JSON:

```typescript
const categoryId = Number(formData.get('categoryId'))
const isRecurring = formData.get('isRecurring') === 'true'
const amount = parseFloat(formData.get('amount') as string)
```

### 8. Revalidation Strategy

After mutations, revalidate affected routes:

```typescript
revalidateGastos()        // /dashboard + /dashboard/gastos
revalidateCategorias()    // Category pages
revalidateIngresos()      // Income pages
revalidateMetodosPago()   // Payment methods
```

---

## Important Conventions

### Component Patterns

**Server Components (default):** Fetch data via `lib/db.ts`, pass to client components as props, zero JavaScript bundle.

**Client Components ('use client'):** Only when interactivity needed. Use Server Actions for mutations.

```tsx
'use client'
export function AddExpenseDialog() {
  return <Dialog><form action={saveExpense}>...</form></Dialog>
}
```

### Payment Method Display

Format: `"Name (Bank) ••1234"`

```typescript
const display = `${name}${bank ? ` (${bank})` : ''}${lastFour ? ` ••${lastFour}` : ''}`
```

Store as separate fields: `name`, `bank`, `last_four_digits`

### Date Handling

- **Database:** ISO strings (YYYY-MM-DD)
- **Display:** `date.toLocaleDateString('es-MX')`
- **Input:** `<input type="date">` uses ISO natively

### Smart Expense Sorting

Expenses sorted by urgency:
1. **Vencidos** (overdue) - Red background
2. **Pendientes** (pending) - Yellow badge
3. **Pagados** (paid) - Green badge

Within groups, sorted by date.

### Error Handling

`withAuth()` wrapper catches errors automatically:

```typescript
if (!category) throw new Error('Category not found')
```

### Styling

**Design System:** See [`/docs/design/design-system.md`](./docs/design/design-system.md)

- **Primary:** Verde vibrante `#9FFF66` (hsl(98 100% 70%))
- **Semantic:** `transaction-income`, `transaction-expense`, `transaction-transfer`
- **Tokens:** `bg-primary`, `text-foreground` (never hardcode colors)
- **Responsive:** Mobile-first (`sm:`, `md:`, `lg:`)

### Path Aliases

```typescript
import { Button } from '@/components/ui/button'  // ✅ Good
import { Button } from '../../../components/...'  // ❌ Bad
```

---

## Configuration

### Environment Variables

Required in `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres?sslmode=require
```

**Setup:** See [`/docs/QUICK_START.md`](./docs/QUICK_START.md) for complete setup guide.

---

## Critical Gotchas

- `'use server'` required at top of action files
- `'use client'` required for interactive components
- Server Actions return serializable data only (no functions/Dates)
- Supabase queries are async - always `await`
- `is_recurring` is 0|1 (integer), not boolean
- Payment method IDs are strings in forms, convert to number for DB
- User ID is string (UUID), NOT number

---

## Specialized Agents

Use specialized agents for better results:

| Agent | Use For | Invoke When |
|-------|---------|-------------|
| **shadcn-component-builder** | UI components with shadcn/ui, mobile-first design, WCAG 2.1 AA | Adding/modifying components, fixing accessibility |
| **docs-maintainer** | Maintaining accurate documentation | After feature changes, before releases |
| **playwright-qa-tester** | E2E testing, accessibility validation | After features, before deployments |

**Note:** These agents are proactive tools. Use them to maintain quality standards.

---

## Database Schema

**Key Tables:**
- `user_profiles` - User data with `plan` (ENUM), `preferences` (JSONB), `timezone`
- `expenses` - Expenses with `is_recurring` (0|1), `payment_status`
- `incomes` - Income records
- `categories` / `income_categories` - Separate category tables
- `payment_methods` - Payment methods with `is_default` flag

**Recurring Expenses:** Stored once with `is_recurring=1`. Virtual instances generated at runtime. When paid, creates new record with `is_recurring=0`.

**Full Schema:** See [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## Documentation

**Central Index:** [`/docs/INDEX.md`](./docs/INDEX.md)

**Key Docs:** README.md, QUICK_START.md, ARCHITECTURE.md, COMPONENT_GUIDE.md, ACCESSIBILITY-COMPLIANCE.md

---

**Version:** 0.1.0-beta
**Last Updated:** January 10, 2026
**Lines:** ~280 (reduced from 585)
