# End-to-End Tests

Comprehensive Playwright tests for the Gastos app, focusing on the shadcn migration and responsive dialogs.

## Test Structure

```
tests/
└── responsive-dialogs.spec.ts    # Responsive dialog behavior (mobile/desktop)
```

## Running Tests

### All tests
```bash
pnpm test:e2e
```

### With UI mode (recommended for debugging)
```bash
pnpm test:e2e:ui
```

### Headed mode (see browser)
```bash
pnpm test:e2e:headed
```

### Specific projects
```bash
pnpm test:e2e:mobile     # Mobile Chrome only
pnpm test:e2e:desktop    # Desktop Chrome only
```

## Test Coverage

### Responsive Dialogs (`responsive-dialogs.spec.ts`)

Tests the shadcn migration of all dialogs to ResponsiveDialog wrapper:

**Mobile (< 640px):**
- ✅ Opens as Drawer (bottom sheet with vaul)
- ✅ Closes on overlay click
- ✅ Form interactions work
- ✅ Swipe-to-dismiss gesture

**Desktop (≥ 640px):**
- ✅ Opens as Dialog (centered modal)
- ✅ Closes on ESC key
- ✅ Multiple dialogs (expenses, categories)
- ✅ Proper positioning

**Accessibility:**
- ✅ ARIA labels present
- ✅ Focus trap within dialog
- ✅ Focus restoration after close
- ✅ Keyboard navigation

**Visual Regression:**
- ✅ Mobile drawer screenshot
- ✅ Desktop dialog screenshot

## Test Environment

### Environment Variables

Tests use `.env.test.local` for test credentials:

```env
TEST_USER=testadmin@gmail.com
TEST_EMAIL=testadmin@gmail.com
```

### Configuration

Playwright config: `scripts/playwright/playwright.config.ts`

**Key settings:**
- Base URL: `http://localhost:3000` (or `NEXT_PUBLIC_SITE_URL`)
- Test directory: `tests/`
- Projects: Desktop Chrome, Mobile Chrome, Mobile Safari
- Auto-start dev server via `webServer` option
- Trace on failure for debugging

## Writing New Tests

### Template

```typescript
import { test, expect } from '@playwright/test';

const TEST_USER = process.env.TEST_EMAIL || 'testadmin@gmail.com';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    // Login logic if needed
  });

  test('should do something', async ({ page }) => {
    // Test logic
  });
});
```

### Best Practices

1. **Use semantic selectors:**
   ```typescript
   // ✅ Good
   page.getByRole('button', { name: /agregar/i })
   page.getByLabel('Descripción')

   // ❌ Avoid
   page.locator('.btn-primary')
   ```

2. **Wait for network idle:**
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

3. **Test responsive behavior:**
   ```typescript
   test.use({ viewport: { width: 375, height: 667 } });
   ```

4. **Accessibility checks:**
   ```typescript
   await expect(dialog).toHaveAttribute('aria-modal', 'true');
   ```

5. **Visual regression:**
   ```typescript
   await expect(page).toHaveScreenshot('feature.png');
   ```

## CI/CD Integration

Tests run automatically in CI with:
- 2 retries on failure
- Traces retained on failure
- Screenshots on failure
- HTML report generation

## Debugging Failed Tests

### 1. Use UI Mode
```bash
pnpm test:e2e:ui
```

### 2. View Traces
After a failed run, open the HTML report:
```bash
npx playwright show-report
```

### 3. Run Single Test
```bash
npx playwright test tests/responsive-dialogs.spec.ts:10 --headed
```

### 4. Debug Mode
```bash
npx playwright test --debug
```

## Migration Testing Strategy

The tests validate the shadcn migration quality:

1. **Component Parity:** All features from custom components work in shadcn versions
2. **Responsive Behavior:** ResponsiveDialog correctly switches between Dialog/Drawer
3. **Accessibility:** WCAG 2.1 AA compliance maintained
4. **Visual Consistency:** Screenshots match expected design
5. **User Flows:** End-to-end user journeys work as expected

## Future Test Coverage

Planned test additions:
- [ ] Dashboard analytics widgets
- [ ] Expense/Income CRUD operations
- [ ] Category management
- [ ] Payment methods
- [ ] Recurring expenses
- [ ] Global search (Cmd+K)
- [ ] Advanced filters
- [ ] Authentication flow (magic links)
- [ ] Onboarding wizard
- [ ] Dark mode toggle
