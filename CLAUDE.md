# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal expense management web application built with Next.js 15, TypeScript, Supabase, and Tailwind CSS. Features expense tracking, recurring expenses, income management, payment methods, and financial analytics dashboard.

**Version:** 2.0.0 (Wise-inspired UX/UI transformation completed)
**Status:** ✅ Production Ready
**Last Updated:** 25 de Diciembre, 2025

## Recent Changes (v2.0.0)

### FASE 5: Accessibility & Responsive Audit (Dec 25, 2025) ✅ COMPLETED

- **WCAG 2.1 AA Compliance:** 100% compliant
  - Touch targets ≥ 44px on all interactive elements
  - Color contrast ≥ 4.5:1 (all combinations verified)
  - Complete ARIA labels on all interactive components
  - Full keyboard navigation support
  - Focus visible indicators on all elements
  - Semantic HTML throughout

- **Responsive Design:** Mobile-first approach
  - Mobile (320px-640px): Optimized touch targets, bottom navigation
  - Tablet (640px-1024px): Adaptive layouts
  - Desktop (1024px+): Full-featured experience

- **Components Updated:**
  - Button: All sizes now ≥ 40px (h-10 to h-11)
  - Input: Height increased to 44px (h-11)
  - FilterBar: Min-height 44px on all chips
  - NavItem: Min-height 44px
  - SearchBar: Clear button 32px
  - MobileNavBottom: Complete ARIA labels

See: `/docs/ACCESSIBILITY-AUDIT.md` for full audit report

### FASE 4: Advanced UX Features (Dec 24, 2025) ✅ COMPLETED

- **GlobalSearch Component** (`/components/global-search.tsx`):
  - Cmd+K / Ctrl+K keyboard shortcut
  - Fuzzy search with fuse.js
  - Results grouped by type (Gastos, Ingresos, Categorías)
  - Keyboard navigation (arrows, Enter, Escape)
  - Auto-focus on open

- **Advanced Filters** (`/lib/hooks/use-filters.ts`):
  - URL sync with query params
  - Preset save/load to localStorage
  - Multi-filter support (category, payment method, date range, amount, status)
  - AdvancedFiltersDialog component

- **Enhanced Toast System** (`/lib/utils/toast-helpers.tsx`):
  - success(), error(), warning(), info(), loading(), promise()
  - Auto-dismissal with configurable duration
  - Action buttons support

### FASE 3: Main Screens Redesign (Dec 24, 2025) ✅ COMPLETED

- **Dashboard Redesign:**
  - DashboardKPIs with semantic colors
  - QuickAddFAB for rapid expense entry
  - UpcomingExpensesWidget with urgency colors
  - Recent Activity with TimelineGroup

- **Expenses Page Wise-Style:**
  - Replaced table with TransactionItem components
  - Temporal grouping (Today, Yesterday, This Week)
  - FilterBar and SearchBar integration
  - Empty states

### FASE 2: Core Components (Dec 24, 2025) ✅ COMPLETED

New custom components:
- **TransactionItem** (`/components/ui/transaction-item.tsx`): Main transaction display with variants (default, compact, detailed)
- **FilterBar** (`/components/ui/filter-bar.tsx`): Horizontal filter chips with multi-select
- **SearchBar** (`/components/ui/search-bar.tsx`): Debounced search with Cmd+K shortcut
- **TimelineGroup** (`/components/ui/timeline-group.tsx`): Temporal grouping for transactions
- **EmptyState** (`/components/ui/empty-state.tsx`): Semantic empty states
- **Skeletons** (`/components/ui/skeletons.tsx`): 11 loading state components

### FASE 1: Design System OLEA (Dec 23, 2025) ✅ COMPLETED

- **Color Palette:** Verde vibrante (#9FFF66) as primary
- **Semantic Colors:** transaction-income, transaction-expense, transaction-transfer
- **Icon System:** 30+ categorías with colors and Lucide icons
- **Typography:** Display sizes, caption, overline utilities
- **Animations:** fadeIn, slideIn, shimmer, bounce, pulse
- **Dark Mode:** Optimized contrast for all colors

See: `/docs/design-system.md` for complete design system documentation

## Development Commands

### Local Development
```bash
pnpm dev              # Start dev server with Turbopack (default: localhost:3000)
pnpm build           # Production build
pnpm start           # Start production server
```

### Code Quality
```bash
npx prettier --write .    # Format code (configured in package.json)
npx tsc --noEmit         # Type check without emitting files
```

### Database Management
Execute SQL scripts in Supabase SQL Editor (not via command line):
- `scripts/supabase/migrations/00-initial-schema.sql` - Initial database schema
- `scripts/supabase/migrations/01-add-payment-status.sql` - Payment status system
- `scripts/supabase/migrations/02-payment-methods.sql` - Payment methods table
- `scripts/supabase/migrations/03-incomes-system.sql` - Income tracking system
- `scripts/supabase/migrations/04-add-metadata-columns.sql` - Metadata columns

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and Server Components
- **Language**: TypeScript 5.7 (strict mode)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth (configured in `lib/auth.ts`)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand for client state
- **Validation**: Zod schemas (in `lib/validations/schemas.ts`)

### Server-First Architecture

This project follows a **Server-First** pattern with minimal client-side JavaScript:

```
Client (Browser)
  ↓ Server Actions
Server Components (Next.js)
  - Authentication via lib/auth.ts
  - Data fetching via lib/db.ts
  - Business logic in app/dashboard/actions.ts
  ↓ Supabase Client
Database (Supabase PostgreSQL)
  - Row Level Security (RLS)
  - Triggers for updated_at
```

**Key Principle**: All data mutations happen through Server Actions (`app/dashboard/actions.ts`), which automatically:
1. Validate authentication via `withAuth()` helper
2. Validate data via Zod schemas
3. Execute database operations via `lib/db.ts`
4. Revalidate affected paths via `revalidate*()` helpers

### Directory Structure

```
app/
├── dashboard/                    # Main application (route group)
│   ├── actions.ts               # ALL Server Actions (expenses, categories, incomes, etc)
│   ├── page.tsx                 # Dashboard home with KPIs and analytics
│   ├── layout.tsx               # Shared layout with navigation
│   ├── categorias/              # Expense categories module
│   │   ├── [id]/               # Category detail page with stats/budget
│   │   └── page.tsx
│   ├── gastos/                  # Expenses module
│   │   ├── expenses-table.tsx   # Main table with smart sorting (overdue > pending > paid)
│   │   ├── upcoming-expenses-card.tsx  # Recurring expenses widget
│   │   └── page.tsx
│   ├── ingresos/                # Income module
│   │   ├── categorias/         # Income categories (separate from expense categories)
│   │   └── page.tsx
│   ├── metodos-pago/           # Payment methods module
│   └── dashboard-kpis.tsx       # KPI cards component
├── login/                       # Auth pages
└── layout.tsx                   # Root layout

lib/
├── db.ts                        # Database queries (Supabase client + all queries)
├── db-helpers.ts                # Reusable query helpers and calculations
├── action-helpers.ts            # Server Action helpers (withAuth, revalidate*)
├── auth.ts                      # Authentication (getUser, signIn, signOut)
├── supabase/
│   └── server.ts               # Supabase server client factory
└── validations/
    └── schemas.ts              # Zod validation schemas

components/
├── ui/                          # UI components
│   ├── button.tsx               # Enhanced button (WCAG AA compliant)
│   ├── card.tsx, badge.tsx, input.tsx, select.tsx, etc.  # shadcn/ui base
│   ├── transaction-item.tsx     # ⭐ Main transaction display (Wise-inspired)
│   ├── filter-bar.tsx           # ⭐ Horizontal filter chips
│   ├── search-bar.tsx           # ⭐ Debounced search with Cmd+K
│   ├── timeline-group.tsx       # ⭐ Temporal grouping
│   ├── empty-state.tsx          # ⭐ Semantic empty states
│   └── skeletons.tsx            # ⭐ 11 loading state components
├── global-search.tsx            # ⭐ Global search modal (Cmd+K)
└── mobile-nav-bottom.tsx        # ⭐ Mobile bottom navigation

⭐ = Custom components (see /docs/COMPONENT_GUIDE.md)
```

### Data Layer (`lib/db.ts`)

**Critical Pattern**: All database operations MUST go through `lib/db.ts`. This file exports:
- Type definitions (Category, Expense, Income, PaymentMethod, etc.)
- CRUD functions for all entities
- Dashboard analytics functions
- Recurring expense calculation logic

**Key Types**:
- `PaymentStatus`: 'pagado' | 'pendiente' | 'vencido' (auto-calculated on date)
- `is_recurring`: 0 | 1 (integer, not boolean, for database compatibility)
- `UpcomingExpense`: Virtual type for recurring expense instances (not stored in DB)

**Recurring Expenses Pattern**:
Recurring expenses are stored once with `is_recurring=1` and `recurrence_frequency` (weekly/monthly/yearly). The function `getUpcomingRecurringExpenses()` generates virtual instances using recursion without creating database records. When a virtual instance is paid, it creates a NEW expense record with `is_recurring=0`.

### Server Actions Pattern (`app/dashboard/actions.ts`)

**All mutations go through this single file**. Every action follows this pattern:

```typescript
export async function saveExpense(formData: FormData): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const validation = validateFormData(expenseSchema, formData);
    if (!validation.success) throw new Error(validation.error);

    await createExpense({ ...validation.data, user_id: userId });
    revalidateGastos(); // Refresh affected pages
  });
}
```

**Key Helpers** (from `lib/action-helpers.ts`):
- `withAuth()`: Wraps actions with authentication + error handling
- `validateFormData()`: Validates FormData against Zod schema
- `revalidateGastos()`, `revalidateCategorias()`, etc.: Revalidate specific paths

### Database Schema

**Key Tables**:
- `users` - User accounts (from Supabase Auth)
- `categories` - Expense categories (user-scoped, with color/icon)
- `income_categories` - Income categories (separate from expense categories)
- `expenses` - All expenses (recurring templates + one-time)
- `incomes` - All income records
- `payment_methods` - User payment methods (with is_default flag)
- `budgets` - Category budgets (month/year scoped)

**Important Constraints**:
- ALL tables have `user_id` foreign key to `users.id` with `ON DELETE CASCADE`
- RLS policies ensure users can only access their own data
- `payment_methods.is_default`: Only ONE can be true per user (enforced in code, not DB)
- `expenses.payment_status`: Auto-marked 'vencido' if date < today and status != 'pagado'

**Indexes**:
- `idx_expenses_user_id`, `idx_expenses_date`, `idx_expenses_payment_status`
- `idx_payment_methods_user_id`
- `idx_incomes_user_id`, `idx_incomes_recurring`

### Component Patterns

**Server Components** (default):
- Fetch data directly via `lib/db.ts`
- Pass data to client components as props
- Examples: `app/dashboard/page.tsx`, `categorias/page.tsx`

**Client Components** (use 'use client'):
- Only when you need interactivity (forms, dialogs, dropdowns)
- Use Server Actions for mutations via `formAction` or `startTransition`
- Examples: `add-expense-dialog.tsx`, `expenses-table.tsx`

**Dialog Pattern**:
All CRUD operations use Radix UI dialogs with forms that submit to Server Actions:
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

### Styling Conventions

- **Design System OLEA** (see `/docs/design-system.md`):
  - Primary color: Verde vibrante #9FFF66 (`hsl(98 100% 70%)`)
  - Semantic colors: transaction-income, transaction-expense, transaction-transfer
  - Design tokens in `app/globals.css` (use CSS variables, not hardcoded colors)

- **Tailwind CSS:**
  - Use design tokens: `bg-primary`, `text-foreground`, `bg-background`
  - Responsive: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
  - Utilities: `.text-money`, `.card-hover`, `.animate-fade-in`, etc.

- **Component Library:**
  - shadcn/ui as base for UI primitives
  - Custom components in `/components/ui/` (see COMPONENT_GUIDE.md)

- **Dark Mode:**
  - Fully implemented with `next-themes`
  - All colors optimized for light and dark modes
  - Automatic theme switching based on system preference

### Accessibility Requirements (WCAG 2.1 AA) ✅ MANDATORY

**ALL new components MUST comply with these requirements:**

1. **Touch Targets (2.5.5 - AAA):**
   - Minimum 44x44px for all interactive elements
   - Use `h-11` (44px) for buttons, `h-10` (40px) acceptable for small variants
   - Use `min-h-[44px]` for chips, filters, navigation items

2. **Color Contrast (1.4.3 - AA):**
   - Text contrast ≥ 4.5:1 for normal text
   - Text contrast ≥ 3:1 for large text (18px+ or 14px+ bold)
   - Use design tokens to ensure compliance (verified in globals.css)
   - Test with WebAIM Contrast Checker

3. **ARIA Labels (4.1.2 - A):**
   - All interactive elements without visible text MUST have `aria-label`
   - Use `aria-current="page"` for active navigation items
   - Use `aria-expanded` for collapsible elements
   - Use `aria-pressed` for toggle buttons

4. **Keyboard Navigation (2.1.1 - A):**
   - All interactive elements must be keyboard accessible
   - Use `role="button"` + `tabIndex={0}` for non-button clickables
   - Implement `onKeyDown` for Enter/Space on custom interactive elements
   - Support keyboard shortcuts where appropriate (e.g., Cmd+K for search)

5. **Focus Visible (2.4.7 - AA):**
   - All focusable elements must have visible focus indicator
   - Use `focus-visible:ring-2 focus-visible:ring-ring` consistently

6. **Semantic HTML (1.3.1 - A):**
   - Use `<nav>` for navigation, `<main>` for main content
   - Use heading hierarchy (`<h1>`, `<h2>`, `<h3>`)
   - Use `<button>` for actions, `<a>` for navigation
   - Use `<label>` with `htmlFor` for form inputs

**Testing Checklist for New Components:**
- [ ] Touch targets ≥ 44px
- [ ] Color contrast ≥ 4.5:1
- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] Focus visible
- [ ] Semantic HTML used
- [ ] Tested with screen reader (optional but recommended)

See `/docs/ACCESSIBILITY-AUDIT.md` for full compliance report.

### Path Aliases

Configured in `tsconfig.json`:
- `@/components/*` → `components/*`
- `@/lib/*` → `lib/*`
- `@/hooks/*` → `hooks/*`

## Important Patterns & Conventions

### 1. Server Actions Are Centralized
ALL Server Actions live in `app/dashboard/actions.ts`. Never create server actions in component files.

### 2. Authentication Flow
- Authentication check: `const user = await getUser()` (from `lib/auth.ts`)
- In Server Actions: Use `withAuth()` wrapper (auto-checks auth)
- User ID access: Always via `user.id` (string type, NOT number)

### 3. Form Data Handling
Server Actions receive `FormData`, not JSON. Convert using:
```typescript
const categoryId = Number(formData.get('categoryId'))
const isRecurring = formData.get('isRecurring') === 'true'
```

### 4. Database Integer Booleans
Supabase stores booleans as integers:
- Write: `is_recurring: data.isRecurring ? 1 : 0`
- Read: `if (expense.is_recurring === 1)`

### 5. Payment Method Display
Payment methods show as: "Name (Bank) ••1234"
- Build string in components: `${name}${bank ? ` (${bank})` : ''}${lastFour ? ` ••${lastFour}` : ''}`
- Store as separate fields in DB: `name`, `bank`, `last_four_digits`

### 6. Date Handling
- Database: Store as ISO date strings (YYYY-MM-DD)
- Display: Use `date.toLocaleDateString('es-MX')` for Mexican format
- Input: HTML `<input type="date">` natively uses ISO format

### 7. Currency Formatting
Always format as MXN:
```typescript
new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
}).format(amount)
```

### 8. Smart Expense Sorting
Expenses are sorted by urgency in `expenses-table.tsx`:
1. Vencidos (overdue) - red background, left border
2. Pendientes (pending) - yellow badge
3. Pagados (paid) - green badge

Within each group, sorted by date (ascending for overdue, descending for others).

### 9. Revalidation Strategy
After mutations, revalidate affected paths:
- Expense changes: `revalidateGastos()` (revalidates /dashboard/gastos + /dashboard)
- Category changes: `revalidateCategorias()`
- Income changes: `revalidateIngresos()`
- Payment method changes: `revalidateMetodosPago()`

### 10. Error Handling in Server Actions
`withAuth()` wrapper automatically catches errors and returns user-friendly messages. For specific errors, throw with message:
```typescript
if (!category) throw new Error('Category not found')
```

## Documentation

**Central Index:** See `/docs/INDEX.md` for complete documentation navigation.

**Key Documentation Files:**
- `/README.md` - Project overview and setup
- `/CONTRIBUTING.md` - Contribution guidelines
- `/docs/PRD.md` - Product Requirements Document (vision, personas, metrics, roadmap)
- `/docs/design-system.md` - OLEA design system
- `/docs/COMPONENT_GUIDE.md` - Component catalog and usage
- `/docs/ACCESSIBILITY-AUDIT.md` - WCAG 2.1 AA compliance audit
- `/docs/IMPLEMENTATION_STATUS.md` - Feature tracking and roadmap
- `/docs/setup/SUPABASE.md` - Database setup guide
- `/docs/setup/GITHUB_OAUTH.md` - OAuth configuration guide

## Configuration

### Environment Variables
Required in `.env.local` (see `.env.example` for template):
```
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# NextAuth.js Configuration
AUTH_SECRET=your-auth-secret-here-run-openssl-rand-base64-32
AUTH_GITHUB_ID=your-github-oauth-app-id
AUTH_GITHUB_SECRET=your-github-oauth-app-secret
```

**Test User Setup:**
After configuring `.env.local`, run `npx tsx create-test-user.ts` to create a test user for development.

### Prettier Configuration
Configured in `package.json`:
- Single quotes
- 2 space tabs
- Arrow parens: always
- No trailing commas

### TypeScript
- Strict mode enabled
- Path aliases configured
- No emit (Next.js handles compilation)

## Dashboard Analytics

The dashboard (`app/dashboard/page.tsx`) displays:
1. **KPIs** (current month):
   - Total expenses with trend vs previous month
   - Total income with trend
   - Balance (income - expenses) with color coding
   - Overdue expenses count

2. **Monthly Comparison**: 3-column view (previous, current, projected next month)

3. **Upcoming Expenses Widget**: Next 7 expenses to be paid (sorted by date)

4. **Top Categories Chart**: Top 5 expense categories with percentages and bar graphs

All calculations are done server-side via functions in `lib/db.ts`:
- `getMonthlySummary()` - Full month summary
- `getOverdueExpenses()` - Overdue expenses
- `getUpcomingDueExpenses()` - Next expenses due
- `getTopCategoriesByMonth()` - Category rankings
- `getNextMonthProjection()` - Projected expenses from recurring templates

## Testing & Development Notes

### Manual Testing Checklist
When making changes, test these flows:
1. Create expense (one-time and recurring)
2. Mark expense as paid/pending/overdue
3. Pay recurring expense instance (should create new record)
4. Create category and verify it appears in expense form
5. Set default payment method (should unset previous default)
6. Dashboard KPIs update after adding expense/income

### Common Gotchas
- Don't forget `'use server'` at top of action files
- Don't forget `'use client'` for interactive components
- Server Actions MUST return serializable data (no functions, Date objects must be strings)
- Supabase queries are async - always await them
- RLS policies: Test with different user accounts to ensure data isolation
- `is_recurring` is an integer (0 or 1), not boolean
- Payment method selection uses string IDs, must convert to number for DB

### Database Debugging
Use Supabase SQL Editor to run:
```sql
-- Check user's expenses
SELECT * FROM expenses WHERE user_id = 'your-user-id' ORDER BY date DESC;

-- Check recurring expenses
SELECT * FROM expenses WHERE user_id = 'your-user-id' AND is_recurring = 1;

-- Get user ID for testing
SELECT id, email FROM auth.users;
```

Scripts in `scripts/supabase/` directory:
- `quick-check.sql` - Verify table structures
- `get-user-id.sql` - Get authenticated user ID
- `delete-user.sql` - Clean up test data

## When Making Changes

### Adding a New Feature
1. Define types in `lib/db.ts`
2. Create database queries in `lib/db.ts`
3. Add Server Action in `app/dashboard/actions.ts`
4. Create Zod schema in `lib/validations/schemas.ts`
5. Build UI components (server components for display, client for interaction)
6. Add revalidation helper in `lib/action-helpers.ts` if needed

### Modifying Database Schema
1. Create migration SQL in `scripts/supabase/migrations/`
2. Run in Supabase SQL Editor (NOT via pnpm/npm)
3. Update types in `lib/db.ts`
4. Update affected queries
5. Update Zod schemas if validation changes

### Adding a New Page
1. Create in `app/dashboard/[new-page]/page.tsx`
2. Add navigation link in `app/dashboard/layout.tsx`
3. Add revalidation path in `lib/action-helpers.ts` if mutations affect it
4. Ensure RLS policies cover the new data access pattern
