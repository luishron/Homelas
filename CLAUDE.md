# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal expense management web application built with Next.js 15, TypeScript, Supabase whit Drizzle ORM, and Tailwind CSS. Features expense tracking, recurring expenses, income management, payment methods, and financial analytics dashboard.


**Version:** 0.1.0-beta
**Status:** 🚧 Beta
**Last Updated:** January 7, 2026

**Tech Stack:**
- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript 5.7 (strict mode)
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase Auth with Magic Links
- **ORM**: Drizzle for migrations
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand

**Architecture:** See [`/docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for detailed system design, directory structure, and data layer documentation.

---

## Recent Changes

### Quick Actions en Dashboard (Jan 4, 2026) ✅ COMPLETED

**Feature:** Botones de acción rápida "Resolver Gasto" en UpcomingExpensesWidget del dashboard.

**Cambios Implementados:**
1. **UpcomingExpensesWidget Interactive** - Botón "Pagar" inline con loading state
2. **Balance footer** - Muestra balance actual y proyectado después de pagar gastos visibles

**Patrón de Implementación:**
```typescript
const [payingId, setPayingId] = useState<number | null>(null);
const { toast } = useToast();

const handlePay = async (expense: Expense) => {
  setPayingId(expense.id);
  const result = await markExpenseAsPaid(expense.id);
  if (!result.error) {
    toast({ title: 'Gasto pagado', description: expense.description });
    router.refresh();
  }
  setPayingId(null);
};
```

### Multi-Currency System (Jan 2, 2026) ✅ COMPLETED

**Feature:** 20 currencies with intelligent timezone-based inference

**Key Files:**
- `lib/config/currencies.ts` - Currency metadata
- `lib/utils/currency-helpers.ts` - `getUserCurrency()` with caching
- `app/[locale]/dashboard/configuracion/` - Settings page

**Usage:**
```typescript
// Server Components
const currency = await getUserCurrency();
const formatted = formatCurrency(amount, currency);

// Client Components (pass as prop)
<Component amount={100} currency={currency} />
```

### User Registration Fix + 100% Drizzle (Dec 27, 2025) ✅ COMPLETED

**Critical Fix:** Created migration `0001_add_user_plan_enum_and_triggers.sql` that:
- Creates `user_plan` ENUM ('free', 'pro', 'plus', 'admin')
- Migrates `role` → `plan` column
- Sets up `handle_new_user()` trigger for automatic profile creation

**Migration Approach:** ALL database changes now go through Drizzle (`lib/drizzle/migrations/`)

### Design System & UX (Dec 23-27, 2025) ✅ COMPLETED

- **FASE 5**: WCAG 2.1 AA Compliance (89.2% - see ACCESSIBILITY-COMPLIANCE.md)
- **FASE 4**: GlobalSearch (Cmd+K), Advanced Filters, Toast System
- **FASE 3**: Dashboard redesign, Wise-style transactions
- **FASE 2**: Custom components (TransactionItem, FilterBar, SearchBar, etc.)
- **FASE 1**: Tallify Design System (#9FFF66 primary, semantic colors)

---

## Development Commands

### Local Development
```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm build           # Production build
pnpm start           # Start production server
```

### Code Quality
```bash
npx prettier --write .    # Format code
npx tsc --noEmit         # Type check
```

### Database Management

**100% Drizzle Migration Approach:**

```bash
pnpm db:generate     # Generate SQL from Drizzle schemas
pnpm db:push         # Direct push (no migration files)
pnpm db:migrate      # Apply migrations (dev/staging)
pnpm build:prod      # Migrations + build (CI/CD)
```

**Important:** For production, use `pnpm build:prod` which auto-applies migrations.

**Key Migration:**
- `0001_add_user_plan_enum_and_triggers.sql` - CRITICAL for user registration

---

## Architecture Quick Reference

### Server-First Pattern

```
Client → Server Actions → Next.js Server → Supabase → PostgreSQL
```

**Key Principle:** All mutations through Server Actions with:
1. Authentication via `withAuth()`
2. Validation via Zod schemas
3. Database ops via `lib/db.ts`
4. Revalidation via `revalidate*()`

### Critical Files

- **`lib/db.ts`** - ALL database queries (single source of truth)
- **`app/[locale]/dashboard/actions.ts`** - Primary Server Actions
- **`lib/auth.ts`** - Authentication layer
- **`lib/action-helpers.ts`** - Server Action utilities (`withAuth`, `revalidate*`)
- **`lib/validations/schemas.ts`** - Zod validation schemas

**Detailed Architecture:** See [`/docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

### Database Schema Quick Reference

**Key Tables:**
- `user_profiles` - User data with `plan` (ENUM), `preferences` (JSONB), `timezone`
- `expenses` - Expenses with `is_recurring` (0|1), `payment_status` ('pagado'|'pendiente'|'vencido')
- `incomes` - Income records
- `categories` / `income_categories` - Separate category tables
- `payment_methods` - Payment methods with `is_default` flag

**Recurring Expenses:** Stored once with `is_recurring=1`. Virtual instances generated at runtime. When paid, creates new record with `is_recurring=0`.

**Full Schema:** See `README.md` Database Schema section or [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## Important Patterns & Conventions

### 1. Server Actions Are Centralized

**Location:** `app/[locale]/dashboard/actions.ts` (primary) or co-located with page (page-specific)

**Pattern:**
```typescript
'use server'

export async function saveExpense(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const validation = validateFormData(expenseSchema, formData);
    if (!validation.success) throw new Error(validation.error);

    await createExpense({ ...validation.data, user_id: userId });
    revalidateGastos();
  });
}
```

**Never** create server actions in component files.

### 2. Authentication Flow

```typescript
// In Server Components
const user = await getUser() // from lib/auth.ts

// In Server Actions
// Use withAuth() wrapper (provides userId)

// User ID type
user.id // string (UUID), NOT number
```

### 3. Form Data Handling

Server Actions receive `FormData`, not JSON:

```typescript
const categoryId = Number(formData.get('categoryId'))
const isRecurring = formData.get('isRecurring') === 'true'
const amount = parseFloat(formData.get('amount') as string)
```

### 4. Database Integer Booleans

Supabase stores booleans as integers (0|1):

```typescript
// Write
is_recurring: data.isRecurring ? 1 : 0

// Read
if (expense.is_recurring === 1) { ... }
```

### 5. Payment Method Display

Format: `"Name (Bank) ••1234"`

```typescript
const display = `${name}${bank ? ` (${bank})` : ''}${lastFour ? ` ••${lastFour}` : ''}`
```

Store as separate fields: `name`, `bank`, `last_four_digits`

### 6. Date Handling

- **Database:** ISO strings (YYYY-MM-DD)
- **Display:** `date.toLocaleDateString('es-MX')`
- **Input:** `<input type="date">` uses ISO natively

### 7. Currency Formatting ⭐ CRITICAL

**Always** use centralized `formatCurrency()`:

```typescript
// Server Components
import { formatCurrency } from '@/lib/utils/formatting';
import { getUserCurrency } from '@/lib/utils/currency-helpers';

const currency = await getUserCurrency();
const formatted = formatCurrency(amount, currency);

// Client Components (pass currency as prop)
interface Props {
  amount: number;
  currency: CurrencyCode;
}

function Component({ amount, currency }: Props) {
  return <span>{formatCurrency(amount, currency)}</span>;
}
```

**Never:**
- ❌ Hardcode currency to 'USD'
- ❌ Create local `formatCurrency()` functions
- ❌ Use `Intl.NumberFormat` directly

**Supported:** 20 currencies from Spanish-speaking countries (`lib/config/currencies.ts`)

### 8. Smart Expense Sorting

In `expenses-table.tsx`, expenses sorted by urgency:

1. **Vencidos** (overdue) - Red background, left border
2. **Pendientes** (pending) - Yellow badge
3. **Pagados** (paid) - Green badge

Within groups, sorted by date (ascending for overdue, descending for others).

### 9. Revalidation Strategy

After mutations, revalidate affected routes:

```typescript
revalidateGastos()        // /dashboard + /dashboard/gastos
revalidateCategorias()    // Category pages
revalidateIngresos()      // Income pages
revalidateMetodosPago()   // Payment methods
```

### 10. Error Handling

`withAuth()` wrapper catches errors automatically. For specific errors:

```typescript
if (!category) throw new Error('Category not found')
```

### 11. Accessibility Requirements ✅ MANDATORY

**ALL new components MUST meet WCAG 2.1 AA:**

- **Touch Targets:** ≥ 44×44px (use `h-11`, `min-h-[44px]`)
- **Color Contrast:** ≥ 4.5:1 (use design tokens)
- **ARIA Labels:** All interactive elements without text
- **Keyboard Nav:** Tab, Enter/Space support
- **Focus Visible:** `focus-visible:ring-2`
- **Semantic HTML:** `<nav>`, `<main>`, `<button>`, `<a>`

**Quick Checklist:**
- [ ] Touch targets ≥ 44px
- [ ] Color contrast ≥ 4.5:1
- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Semantic HTML used

**Full Requirements:** See [`/docs/ACCESSIBILITY-COMPLIANCE.md`](./docs/ACCESSIBILITY-COMPLIANCE.md)

### 12. Component Patterns

**Server Components (default):**
- Fetch data directly via `lib/db.ts`
- Pass data to client components as props
- Zero JavaScript bundle

**Client Components ('use client'):**
- Only when interactivity needed
- Use Server Actions for mutations
- Examples: Forms, dialogs, dropdowns

**Dialog Pattern:**
```tsx
'use client'

export function AddExpenseDialog() {
  return (
    <Dialog>
      <form action={saveExpense}>
        {/* FormData fields */}
        <Button type="submit">Save</Button>
      </form>
    </Dialog>
  )
}
```

### 13. Specialized Agents

**When building features, use specialized agents for better results:**

#### shadcn-component-builder 🎨
**Use for:** Creating/modifying UI components with shadcn/ui
- Mobile-first responsive design (320px → 1440px+)
- WCAG 2.1 AA compliance (touch targets ≥ 44px, ARIA labels)
- Tallify Design System integration
- CVA variants and composition patterns
- shadcn MCP integration (list/get components)

**Invoke when:**
- Adding new shadcn/ui components
- Creating custom components
- Fixing accessibility violations
- Refactoring for mobile-first design

```bash
# Available in .claude/agents/shadcn-component-builder.md
```

#### docs-maintainer 📚
**Use for:** Maintaining accurate, up-to-date documentation
- Detects outdated documentation
- Identifies missing docs for new features
- Validates cross-references
- Ensures version consistency

**Invoke when:**
- After implementing new features
- After significant code changes
- Before major releases

#### playwright-qa-tester 🧪
**Use for:** Automated testing and QA validation
- End-to-end testing with Playwright
- Accessibility validation (WCAG 2.1 AA)
- UX/UI flow analysis
- Regression testing

**Invoke when:**
- After completing features
- Before deployments
- When accessibility compliance needs verification

**Note:** These agents are proactive tools. Don't hesitate to use them to maintain quality standards.

---

### 14. Styling

**Design System:** See [`/docs/design/design-system.md`](./docs/design/design-system.md)

- **Primary:** Verde vibrante `#9FFF66` (hsl(98 100% 70%))
- **Semantic:** `transaction-income`, `transaction-expense`, `transaction-transfer`
- **Tokens:** `bg-primary`, `text-foreground` (never hardcode colors)
- **Responsive:** Mobile-first (`sm:`, `md:`, `lg:`)
- **Dark Mode:** Fully supported via `next-themes`

---

## Configuration

### Environment Variables

Required in `.env.local`:

```env
# Supabase (required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Site URL (production)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Database URL (migrations in production)
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres?sslmode=require
```

**Test User:** Run `npx tsx create-test-user.ts` after config

### Path Aliases

```typescript
import { Button } from '@/components/ui/button'  // ✅ Good
import { getUser } from '@/lib/auth'             // ✅ Good
import { Button } from '../../../components/...'  // ❌ Bad
```

---

## Testing & Development Notes

### Manual Testing Checklist

Test these flows after changes:

1. Create expense (one-time + recurring)
2. Mark expense as paid/pending/overdue
3. Pay recurring instance (creates new record)
4. Create category (appears in expense form)
5. Set default payment method (unsets previous)
6. Dashboard KPIs update after changes

### Common Gotchas

- `'use server'` required at top of action files
- `'use client'` required for interactive components
- Server Actions return serializable data only (no functions/Dates)
- Supabase queries are async - always `await`
- RLS: Test with different users for data isolation
- `is_recurring` is 0|1 (integer), not boolean
- Payment method IDs are strings in forms, convert to number for DB

### Database Debugging

Supabase SQL Editor queries:

```sql
-- Check user's expenses
SELECT * FROM expenses WHERE user_id = 'your-user-id' ORDER BY date DESC;

-- Check recurring expenses
SELECT * FROM expenses WHERE user_id = 'your-user-id' AND is_recurring = 1;

-- Get user ID
SELECT id, email FROM auth.users;
```

**Scripts:** See `scripts/supabase/` for helper SQL scripts

---

## When Making Changes

### Adding a New Feature

1. Define types in `lib/db.ts`
2. Create database queries in `lib/db.ts`
3. Add Server Action in `app/[locale]/dashboard/actions.ts`
4. Create Zod schema in `lib/validations/schemas.ts`
5. Build UI (Server Components for display, Client for interaction)
6. Add revalidation helper in `lib/action-helpers.ts` if needed

### Modifying Database Schema

**100% Drizzle Approach:**

1. Edit `lib/drizzle/schema.ts`
2. Generate: `pnpm db:generate`
3. Review SQL in `lib/drizzle/migrations/`
4. Add triggers/functions as raw SQL if needed
5. Test locally: `pnpm db:migrate`
6. Deploy to prod: `pnpm build:prod`
7. Update `lib/db.ts` types
8. Update Zod schemas

**Example:** See `0001_add_user_plan_enum_and_triggers.sql` for triggers in migrations

### Adding a New Page

1. Create `app/[locale]/dashboard/[new-page]/page.tsx`
2. Add nav link in `app/[locale]/dashboard/layout.tsx`
3. Add revalidation path in `lib/action-helpers.ts` if needed
4. Ensure RLS policies cover new data access

---

## Documentation

**Central Index:** [`/docs/INDEX.md`](./docs/INDEX.md)

**Key Docs:**
- [`README.md`](./README.md) - Project overview & setup
- [`/docs/QUICK_START.md`](./docs/QUICK_START.md) - 5-minute setup guide
- [`/docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) - System architecture
- [`/docs/TESTING.md`](./docs/TESTING.md) - Testing guide
- [`/docs/COMPONENT_GUIDE.md`](./docs/COMPONENT_GUIDE.md) - Component catalog
- [`/docs/ACCESSIBILITY-COMPLIANCE.md`](./docs/ACCESSIBILITY-COMPLIANCE.md) - WCAG compliance
- [`/docs/design/design-system.md`](./docs/design/design-system.md) - Design system
- [`/docs/deployment/MIGRATION-GUIDE.md`](./docs/deployment/MIGRATION-GUIDE.md) - Database migrations
- [`/docs/deployment/DEPLOYMENT.md`](./docs/deployment/DEPLOYMENT.md) - Production deployment
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) - Contribution guidelines

---

**Version:** 0.1.0-beta
**Last Updated:** January 7, 2026
**Lines:** ~420 (reduced from 787)
