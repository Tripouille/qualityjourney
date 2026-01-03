# Mobile-First Validation Protocol

## Validation Checklist for UI Changes

Before submitting any UI change, verify the component works correctly on mobile devices.

---

## Step 1: Visual Inspection Using Playwright MCP

### Test Viewports

Test on these 3 viewports (minimum):

1. **iPhone 12 Pro:** `390x844` (recommended baseline)
2. **iPhone SE:** `375x667` (small phone test)
3. **Pixel 5:** `393x851` (Android baseline)

### Commands

```typescript
// Navigate to the page
await page.goto('http://localhost:3000/your-page');

// Resize to mobile viewport
await page.setViewportSize({ width: 390, height: 844 });

// Take screenshot
await page.screenshot({ path: 'mobile-test.png', fullPage: true });
```

---

## Step 2: Automated Checks

### Check 1: No Horizontal Overflow

```typescript
// Check for horizontal overflow
const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
const viewportWidth = await page.evaluate(() => window.innerWidth);

if (bodyWidth > viewportWidth) {
  console.error('❌ Horizontal overflow detected!');
  console.error(`Body width: ${bodyWidth}px, Viewport: ${viewportWidth}px`);
} else {
  console.log('✅ No horizontal overflow');
}
```

### Check 2: Touch Target Sizes

```typescript
// Verify touch targets (minimum 44px)
const buttons = await page.locator('button, a[href], input, select, [role="button"]').all();

for (const button of buttons) {
  const box = await button.boundingBox();
  if (box && (box.height < 44 || box.width < 44)) {
    const text = await button.textContent();
    console.warn(`⚠️  Touch target too small: "${text}" (${box.width}x${box.height})`);
  }
}
```

### Check 3: Font Size Validation

```typescript
// Check form inputs for font size (minimum 16px to prevent iOS zoom)
const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"], textarea, select').all();

for (const input of inputs) {
  const fontSize = await input.evaluate((el) => {
    return window.getComputedStyle(el).fontSize;
  });

  const sizeValue = parseFloat(fontSize);
  if (sizeValue < 16) {
    console.warn(`⚠️  Input font size too small: ${fontSize} (minimum 16px)`);
  }
}
```

---

## Step 3: Manual Verification Checklist

### UI Elements

- [ ] No horizontal scrolling occurs
- [ ] All buttons are at least 44px tall
- [ ] Gap between clickable elements is at least 16px
- [ ] Text is readable without zooming (16px+ body text)
- [ ] Form inputs are at least 16px font size
- [ ] Images scale properly (no overflow)
- [ ] Cards/containers stack vertically (flex-col)

### Navigation

- [ ] Mobile menu works (Sheet/Drawer opens correctly)
- [ ] Close buttons are at least 44x44px
- [ ] Navigation links have adequate padding (py-3 minimum)
- [ ] Active states are visible on tap

### Typography

- [ ] Headings scale appropriately (smaller on mobile)
- [ ] Line height is comfortable (1.5 minimum for body text)
- [ ] No text truncation unless intentional

### Layout

- [ ] Content doesn't touch screen edges (px-4 minimum)
- [ ] Spacing scales down on mobile (gap-4 → gap-6 md:)
- [ ] Grid layouts become single column (grid-cols-1 md:grid-cols-3)

---

## Step 4: CSS Pattern Verification

### Verify Mobile-First Approach

```tsx
// ✅ CORRECT: Mobile-first
<div className="flex flex-col gap-4 md:flex-row md:gap-6">

// ❌ FORBIDDEN: Desktop-first
<div className="flex flex-row gap-6 max-md:flex-col max-md:gap-4">
```

### Common Patterns

**Containers:**
```tsx
<div className="w-full md:max-w-2xl lg:max-w-4xl">
```

**Touch-Friendly Buttons:**
```tsx
<Button className="h-12 min-w-[120px]">
```

**Navigation Links:**
```tsx
<Link className="block py-3 text-base">
```

**Form Inputs:**
```tsx
<Input className="text-base h-12" />
```

**Grid Layouts:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## Step 5: Complete Playwright Validation Script

Create this script for automated validation:

```typescript
// .claude/scripts/validate-mobile.ts
import { chromium } from 'playwright';

async function validateMobile(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test on iPhone 12 Pro viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);

  console.log('🔍 Validating mobile layout...\n');

  // Check 1: Horizontal overflow
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = await page.evaluate(() => window.innerWidth);

  if (bodyWidth > viewportWidth) {
    console.error('❌ FAIL: Horizontal overflow detected!');
  } else {
    console.log('✅ PASS: No horizontal overflow');
  }

  // Check 2: Touch targets
  const buttons = await page.locator('button, a[href], [role="button"]').all();
  let touchTargetFails = 0;

  for (const button of buttons) {
    const box = await button.boundingBox();
    if (box && (box.height < 44 || box.width < 44)) {
      touchTargetFails++;
    }
  }

  if (touchTargetFails > 0) {
    console.error(`❌ FAIL: ${touchTargetFails} touch targets below 44px`);
  } else {
    console.log('✅ PASS: All touch targets adequate');
  }

  // Check 3: Form input font sizes
  const inputs = await page.locator('input, textarea, select').all();
  let fontSizeFails = 0;

  for (const input of inputs) {
    const fontSize = await input.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    if (fontSize < 16) {
      fontSizeFails++;
    }
  }

  if (fontSizeFails > 0) {
    console.error(`❌ FAIL: ${fontSizeFails} inputs below 16px font size`);
  } else {
    console.log('✅ PASS: All input font sizes adequate');
  }

  // Screenshot
  await page.screenshot({ path: 'mobile-validation.png', fullPage: true });
  console.log('\n📸 Screenshot saved: mobile-validation.png');

  await browser.close();
}

// Usage: node validate-mobile.ts http://localhost:3000/courses
validateMobile(process.argv[2] || 'http://localhost:3000');
```

---

## Anti-Patterns to Watch For

```tsx
// ❌ WRONG: Desktop-first
<div className="hidden md:block">Only visible on desktop</div>

// ✅ CORRECT: Mobile-first with alternative
<div className="block md:hidden">Mobile menu</div>
<div className="hidden md:block">Desktop menu</div>

// ❌ WRONG: Fixed widths
<div className="w-[600px]">

// ✅ CORRECT: Responsive widths
<div className="w-full md:w-[600px]">

// ❌ WRONG: Small touch targets
<button className="h-8 px-2">Click</button>

// ✅ CORRECT: Adequate touch targets
<button className="h-12 px-4">Click</button>

// ❌ WRONG: Tiny fonts on inputs
<input className="text-sm" />

// ✅ CORRECT: Prevents iOS zoom
<input className="text-base" />
```

---

## Failure Protocol

If validation fails:
1. **STOP** - Do not merge/commit
2. Fix the mobile layout issues
3. Re-run validation
4. Only proceed when all checks pass

If you cannot fix immediately:
1. Document the issue
2. Create a follow-up task
3. Mark the PR as "Mobile layout blocked"
