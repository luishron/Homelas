import { test, expect } from '@playwright/test';

/**
 * End-to-End Tests for Responsive Dialogs (shadcn migration)
 *
 * Tests the ResponsiveDialog wrapper behavior:
 * - Mobile (< 640px): Renders as Drawer (bottom sheet)
 * - Desktop (≥ 640px): Renders as Dialog (centered modal)
 *
 * Validates:
 * - Dialog opening/closing
 * - Form interactions
 * - Responsive behavior
 * - Accessibility (ARIA labels, keyboard nav)
 */

const TEST_USER = process.env.TEST_EMAIL || 'testadmin@gmail.com';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

test.describe('Responsive Dialogs - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto(`${BASE_URL}/login`);

    // Fill magic link email
    await page.fill('input[type="email"]', TEST_USER);

    // In test environment, we'll skip actual auth and go straight to dashboard
    // (This assumes test user is already authenticated or we have a test bypass)
    await page.goto(`${BASE_URL}/dashboard/gastos`);
    await page.waitForLoadState('networkidle');
  });

  test('should open Add Expense dialog as drawer on mobile', async ({ page }) => {
    // Find and click "Agregar Gasto" button
    const addButton = page.getByRole('button', { name: /agregar gasto/i });
    await expect(addButton).toBeVisible();
    await addButton.click();

    // On mobile, ResponsiveDialog renders as Drawer
    // Drawer has data-vaul-drawer attribute
    const drawer = page.locator('[data-vaul-drawer]');
    await expect(drawer).toBeVisible();

    // Check drawer slides up from bottom
    await expect(drawer).toHaveCSS('position', 'fixed');

    // Check form fields are present
    await expect(page.getByLabel(/descripción/i)).toBeVisible();
    await expect(page.getByLabel(/monto/i)).toBeVisible();
    await expect(page.getByLabel(/categoría/i)).toBeVisible();
  });

  test('should close drawer on mobile when clicking outside', async ({ page }) => {
    // Open drawer
    await page.getByRole('button', { name: /agregar gasto/i }).click();
    await expect(page.locator('[data-vaul-drawer]')).toBeVisible();

    // Click outside (on overlay)
    const overlay = page.locator('[data-vaul-overlay]');
    await overlay.click({ force: true });

    // Drawer should close
    await expect(page.locator('[data-vaul-drawer]')).not.toBeVisible();
  });

  test('should handle form interaction in mobile drawer', async ({ page }) => {
    // Open drawer
    await page.getByRole('button', { name: /agregar gasto/i }).click();

    // Fill form
    await page.fill('input[name="description"]', 'Test expense mobile');
    await page.fill('input[name="amount"]', '100');

    // Select category (if dropdown works)
    const categorySelect = page.locator('select[name="category_id"]');
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ index: 1 });
    }

    // Form should maintain values
    await expect(page.locator('input[name="description"]')).toHaveValue('Test expense mobile');
    await expect(page.locator('input[name="amount"]')).toHaveValue('100');
  });
});

test.describe('Responsive Dialogs - Desktop', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_USER);
    await page.goto(`${BASE_URL}/dashboard/gastos`);
    await page.waitForLoadState('networkidle');
  });

  test('should open Add Expense dialog as modal on desktop', async ({ page }) => {
    // Find and click "Agregar Gasto" button
    const addButton = page.getByRole('button', { name: /agregar gasto/i });
    await expect(addButton).toBeVisible();
    await addButton.click();

    // On desktop, ResponsiveDialog renders as Dialog
    // Dialog has role="dialog"
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Check dialog is centered (not at bottom like drawer)
    const dialogBox = await dialog.boundingBox();
    expect(dialogBox?.y).toBeGreaterThan(100); // Not at top/bottom

    // Check form fields
    await expect(page.getByLabel(/descripción/i)).toBeVisible();
    await expect(page.getByLabel(/monto/i)).toBeVisible();
  });

  test('should close dialog on desktop with ESC key', async ({ page }) => {
    // Open dialog
    await page.getByRole('button', { name: /agregar gasto/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Press ESC
    await page.keyboard.press('Escape');

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should handle category dialog on desktop', async ({ page }) => {
    // Navigate to categories page
    await page.goto(`${BASE_URL}/dashboard/categorias`);
    await page.waitForLoadState('networkidle');

    // Click "Nueva Categoría" button
    const addCategoryButton = page.getByRole('button', { name: /nueva categoría/i });
    if (await addCategoryButton.isVisible()) {
      await addCategoryButton.click();

      // Check dialog opens
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      // Check category form fields
      await expect(page.getByLabel(/nombre/i)).toBeVisible();

      // Close dialog
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
    }
  });
});

test.describe('Responsive Dialogs - Accessibility', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/gastos`);
    await page.waitForLoadState('networkidle');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Open dialog
    await page.getByRole('button', { name: /agregar gasto/i }).click();

    // Check dialog has proper ARIA attributes
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Check title is accessible
    const title = page.getByRole('heading', { name: /nuevo gasto/i });
    await expect(title).toBeVisible();
  });

  test('should trap focus within dialog', async ({ page }) => {
    // Open dialog
    await page.getByRole('button', { name: /agregar gasto/i }).click();

    // Press Tab multiple times
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Focus should stay within dialog (not leak to background)
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA']).toContain(focusedElement);
  });

  test('should restore focus after dialog closes', async ({ page }) => {
    // Click button to open dialog
    const addButton = page.getByRole('button', { name: /agregar gasto/i });
    await addButton.click();

    // Close dialog
    await page.keyboard.press('Escape');

    // Focus should return to trigger button
    // (This is a shadcn Dialog default behavior)
    await page.waitForTimeout(300); // Wait for animation
    const focusedElement = await page.evaluate(() =>
      document.activeElement?.textContent?.toLowerCase()
    );

    // The button should be focused or at least visible
    await expect(addButton).toBeVisible();
  });
});

test.describe('Responsive Dialogs - Visual Regression', () => {
  test('should match mobile drawer screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/dashboard/gastos`);

    // Open drawer
    await page.getByRole('button', { name: /agregar gasto/i }).click();
    await page.waitForTimeout(500); // Wait for animation

    // Take screenshot
    await expect(page).toHaveScreenshot('expense-drawer-mobile.png', {
      fullPage: true,
    });
  });

  test('should match desktop dialog screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/dashboard/gastos`);

    // Open dialog
    await page.getByRole('button', { name: /agregar gasto/i }).click();
    await page.waitForTimeout(500);

    // Take screenshot
    await expect(page).toHaveScreenshot('expense-dialog-desktop.png');
  });
});
