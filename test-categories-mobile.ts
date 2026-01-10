import { chromium, Browser, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const TEST_USER = 'admin@test.local';
const TEST_PASSWORD = 'admin123';
const BASE_URL = 'http://localhost:3001';

interface TestResult {
  viewport: string;
  gridColumns: string;
  cardLayout: 'horizontal' | 'vertical' | 'unknown';
  buttonText: 'icon-only' | 'icon-and-text' | 'unknown';
  hasOverflow: boolean;
  screenshot: string;
  errors: string[];
}

async function login(page: Page) {
  console.log('Logging in...');
  await page.goto(`${BASE_URL}/login`);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });

  await page.fill('input[type="email"]', TEST_USER);
  await page.fill('input[type="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard**', { timeout: 10000 });
  console.log('Login successful');
}

async function testCategoriesPage(page: Page, width: number, height: number): Promise<TestResult> {
  const viewportName = `${width}x${height}`;
  console.log(`\n=== Testing ${viewportName} ===`);

  const errors: string[] = [];
  const screenshotDir = path.join(__dirname, 'test-screenshots');

  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Set viewport
  await page.setViewportSize({ width, height });
  await page.goto(`${BASE_URL}/dashboard/categories`);
  await page.waitForSelector('main', { timeout: 10000 });

  // Wait for content to load
  await page.waitForTimeout(1000);

  // 1. Check grid columns
  const gridColumns = await page.evaluate(() => {
    const grid = document.querySelector('.grid');
    if (!grid) return 'not-found';
    const computedStyle = window.getComputedStyle(grid);
    return computedStyle.gridTemplateColumns;
  });

  console.log(`Grid columns: ${gridColumns}`);

  // Validate grid columns
  if (width < 640) {
    // Mobile: should be 1 column
    if (!gridColumns.includes('1fr') || gridColumns.split(' ').length > 1) {
      errors.push(`ERROR: Mobile grid should be 1 column, got: ${gridColumns}`);
    }
  } else {
    // Tablet+: should be 2 columns
    const columnCount = gridColumns.split(' ').length;
    if (columnCount !== 2) {
      errors.push(`ERROR: Tablet grid should be 2 columns, got ${columnCount}`);
    }
  }

  // 2. Check card layout (horizontal vs vertical)
  const cardLayout = await page.evaluate(() => {
    // Look for the first category card
    const card = document.querySelector('a[href*="/dashboard/categories/"]');
    if (!card) return 'no-cards-found';

    // Check if it has flex-row class
    const hasFlexRow = card.classList.contains('flex-row');
    const hasFlexCol = card.classList.contains('flex-col');

    // Also check computed flex direction
    const computedStyle = window.getComputedStyle(card);
    const flexDirection = computedStyle.flexDirection;

    return {
      hasFlexRow,
      hasFlexCol,
      flexDirection,
      classes: Array.from(card.classList).join(' ')
    };
  });

  console.log(`Card layout:`, cardLayout);

  let layoutType: 'horizontal' | 'vertical' | 'unknown' = 'unknown';
  if (typeof cardLayout === 'object') {
    if (width < 640) {
      // Mobile: should be horizontal (flex-row)
      if (cardLayout.flexDirection !== 'row' && !cardLayout.hasFlexRow) {
        errors.push(`ERROR: Mobile cards should be horizontal (flex-row), got: ${cardLayout.flexDirection}`);
      } else {
        layoutType = 'horizontal';
      }
    } else {
      // Tablet+: should be vertical (flex-col)
      if (cardLayout.flexDirection !== 'column' && !cardLayout.hasFlexCol) {
        errors.push(`ERROR: Tablet cards should be vertical (flex-col), got: ${cardLayout.flexDirection}`);
      } else {
        layoutType = 'vertical';
      }
    }
  }

  // 3. Check button text visibility
  const buttonInfo = await page.evaluate(() => {
    // Find button by aria-label or by looking for buttons with "Nueva" text
    let button = document.querySelector('button[aria-label*="Nueva"]');
    if (!button) {
      // Try to find by text content
      const buttons = Array.from(document.querySelectorAll('button'));
      button = buttons.find(btn => btn.textContent?.includes('Nueva')) || null;
    }
    if (!button) return { found: false };

    // Check if there's a span with text
    const spans = button.querySelectorAll('span');
    let textVisible = false;
    let textHidden = false;

    spans.forEach(span => {
      const text = span.textContent?.trim();
      if (text && text.includes('Nueva')) {
        const computedStyle = window.getComputedStyle(span);
        if (computedStyle.display === 'none' || span.classList.contains('hidden')) {
          textHidden = true;
        } else {
          textVisible = true;
        }
      }
    });

    return {
      found: true,
      textVisible,
      textHidden,
      innerHTML: button.innerHTML
    };
  });

  console.log(`Button info:`, buttonInfo);

  let buttonType: 'icon-only' | 'icon-and-text' | 'unknown' = 'unknown';
  if (buttonInfo.found) {
    if (width < 640) {
      // Mobile: should be icon only
      if (buttonInfo.textVisible) {
        errors.push(`ERROR: Mobile button should be icon-only, but text is visible`);
      } else {
        buttonType = 'icon-only';
      }
    } else {
      // Tablet+: should have text
      if (!buttonInfo.textVisible) {
        errors.push(`ERROR: Tablet button should show text, but it's hidden`);
      } else {
        buttonType = 'icon-and-text';
      }
    }
  } else {
    errors.push(`ERROR: Button not found`);
  }

  // 4. Check for horizontal overflow
  const hasOverflow = await page.evaluate(() => {
    const body = document.body;
    return body.scrollWidth > body.clientWidth;
  });

  if (hasOverflow) {
    errors.push(`ERROR: Page has horizontal overflow (${width}px viewport)`);
  }

  // 5. Check for text truncation
  const textTruncationIssues = await page.evaluate(() => {
    const issues: string[] = [];

    // Check all category cards
    const cards = document.querySelectorAll('a[href*="/dashboard/categories/"]');
    cards.forEach((card, index) => {
      // Check if text is cut off without ellipsis
      const textElements = card.querySelectorAll('p, h3, span');
      textElements.forEach(el => {
        const element = el as HTMLElement;
        if (element.scrollWidth > element.clientWidth) {
          const hasEllipsis = window.getComputedStyle(element).textOverflow === 'ellipsis';
          if (!hasEllipsis) {
            issues.push(`Card ${index}: Text overflows without ellipsis: "${element.textContent?.substring(0, 30)}..."`);
          }
        }
      });
    });

    return issues;
  });

  if (textTruncationIssues.length > 0) {
    errors.push(...textTruncationIssues.map(issue => `ERROR: ${issue}`));
  }

  // 6. Take screenshots
  const screenshotPath = path.join(screenshotDir, `categories-${viewportName}.png`);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });
  console.log(`Screenshot saved: ${screenshotPath}`);

  // Take a zoomed screenshot of the first card
  const firstCard = await page.$('a[href*="/dashboard/categories/"]');
  if (firstCard) {
    const cardScreenshotPath = path.join(screenshotDir, `card-${viewportName}.png`);
    await firstCard.screenshot({ path: cardScreenshotPath });
    console.log(`Card screenshot saved: ${cardScreenshotPath}`);
  }

  // Take a screenshot of the button
  const button = await page.$('button[aria-label*="Nueva"]');
  if (button) {
    const buttonScreenshotPath = path.join(screenshotDir, `button-${viewportName}.png`);
    await button.screenshot({ path: buttonScreenshotPath });
    console.log(`Button screenshot saved: ${buttonScreenshotPath}`);
  }

  return {
    viewport: viewportName,
    gridColumns,
    cardLayout: layoutType,
    buttonText: buttonType,
    hasOverflow,
    screenshot: screenshotPath,
    errors
  };
}

async function runTests() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Login first
    await login(page);

    // Test different viewports
    const viewports = [
      { width: 320, height: 568 },  // Mobile (iPhone SE)
      { width: 375, height: 667 },  // Mobile (iPhone 8)
      { width: 640, height: 1136 }, // Tablet breakpoint
      { width: 768, height: 1024 }, // Tablet (iPad)
      { width: 1440, height: 900 }  // Desktop
    ];

    const results: TestResult[] = [];

    for (const viewport of viewports) {
      const result = await testCategoriesPage(page, viewport.width, viewport.height);
      results.push(result);
    }

    // Print summary
    console.log('\n=== TEST SUMMARY ===\n');

    let allPassed = true;

    results.forEach(result => {
      console.log(`\n${result.viewport}:`);
      console.log(`  Grid columns: ${result.gridColumns}`);
      console.log(`  Card layout: ${result.cardLayout}`);
      console.log(`  Button: ${result.buttonText}`);
      console.log(`  Overflow: ${result.hasOverflow ? 'YES ⚠️' : 'NO ✅'}`);
      console.log(`  Screenshot: ${result.screenshot}`);

      if (result.errors.length > 0) {
        allPassed = false;
        console.log(`  ❌ ERRORS (${result.errors.length}):`);
        result.errors.forEach(error => console.log(`    - ${error}`));
      } else {
        console.log(`  ✅ All checks passed`);
      }
    });

    console.log(`\n=== FINAL RESULT: ${allPassed ? '✅ PASSED' : '❌ FAILED'} ===\n`);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

runTests();
