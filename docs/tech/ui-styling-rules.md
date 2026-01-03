# UI & Styling Rules

## 📱 Mobile-First Development Mandate (CRITICAL)

This project follows a **strict Mobile-First approach**. All UI must be designed and functional on mobile BEFORE desktop.

**Non-negotiable Rule:** Base CSS classes target mobile. Use responsive breakpoints for larger screens.

---

## 1. CSS/Tailwind Flow

### The Rule

Write base classes for mobile, then use responsive modifiers for larger screens.

### ✅ CORRECT: Mobile-first approach

```tsx
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
  {/* Base: vertical stack with 16px gap (mobile) */}
  {/* md (768px+): horizontal row with 24px gap (tablet) */}
  {/* lg (1024px+): horizontal row with 32px gap (desktop) */}
</div>
```

### ❌ FORBIDDEN: Desktop-first with max-width breakpoints

```tsx
<div className="flex flex-row gap-8 max-md:flex-col max-md:gap-4">
  {/* Anti-pattern: starts with desktop, then shrinks */}
</div>
```

### Tailwind Responsive Modifiers

| Breakpoint | Min Width | Target Device |
|------------|-----------|---------------|
| (none) | 0px | Mobile (base) |
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

**Pattern:**
```tsx
className="[mobile] sm:[small-tablet] md:[tablet] lg:[desktop]"
```

---

## 2. Touch Targets (P0 - Accessibility Critical)

### Minimum Dimensions

**Rule:** All interactive elements must be at least **44px** tall (Apple HIG) or **48px** (Material Design).

**Tailwind Equivalents:**
- `h-11` = 44px
- `h-12` = 48px
- `min-h-11` = minimum 44px
- `min-h-12` = minimum 48px

**Minimum Gap:** 16px between clickable elements (Tailwind `gap-4`)

### ✅ CORRECT: Proper touch targets

```tsx
<Button className="h-12 min-w-[120px]">Sign In</Button>

<nav className="flex flex-col gap-4">
  <Link className="block py-3">Courses</Link> {/* py-3 = 12px*2 + text ≈ 44px */}
  <Link className="block py-3">Blog</Link>
</nav>
```

### ❌ FORBIDDEN: Touch targets too small

```tsx
<Button className="h-8 px-2">Sign In</Button> {/* Only 32px tall */}

<nav className="flex flex-col gap-1">
  <Link>Courses</Link> {/* No padding, too close */}
</nav>
```

### Critical Elements Requiring Validation

- All `<Button>` components
- All `<Link>` elements in navigation
- Form inputs (`<Input>`, `<Select>`, `<Checkbox>`, `<Radio>`)
- Icon-only buttons (hamburger menus, close buttons)
- Cards with `onClick` handlers

**Validation:** See `.claude/skills/mobile-first-validation.md`

---

## 3. Navigation & Interactivity

### Mobile Navigation Patterns

**Complex navigation:** Use `Sheet` (drawer) component for mobile menus
**Filters/Search:** Use `Sheet` or `Collapsible` on mobile, inline on desktop
**Tabs:** Use `ScrollArea` for horizontal scroll on mobile if needed

### ✅ CORRECT: Sheet for mobile navigation

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="h-12 w-12 md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="right">
    <nav className="flex flex-col gap-4 mt-8">
      <Link href="/courses" className="block py-3 text-base">
        Courses
      </Link>
      <Link href="/blog" className="block py-3 text-base">
        Blog
      </Link>
      <Link href="/profile" className="block py-3 text-base">
        Profile
      </Link>
    </nav>
  </SheetContent>
</Sheet>

{/* Desktop navigation (hidden on mobile) */}
<nav className="hidden md:flex md:gap-6">
  <Link href="/courses">Courses</Link>
  <Link href="/blog">Blog</Link>
  <Link href="/profile">Profile</Link>
</nav>
```

### ❌ FORBIDDEN: Horizontal scroll without explicit design

```tsx
<div className="flex overflow-x-auto gap-2">
  {/* Accidental horizontal scroll - poor UX */}
</div>
```

**Rule:** If horizontal scroll is needed, make it obvious with visual cues (scroll indicators, partial next item visible).

---

## 4. Typography & Readability

### Font Size Constraints

| Element | Minimum Size | Tailwind Class | Reason |
|---------|--------------|----------------|---------|
| Body text | 16px | `text-base` | Comfortable reading |
| Form inputs | 16px | `text-base` | Prevents iOS auto-zoom |
| Small text | 14px | `text-sm` | Secondary content only |

### ✅ CORRECT: Readable font sizes

```tsx
<input className="text-base h-12" /> {/* 16px - prevents iOS zoom */}
<p className="text-base">Main content</p>
<span className="text-sm text-muted-foreground">Secondary info</span>
```

### ❌ FORBIDDEN: Font too small

```tsx
<input className="text-sm" /> {/* 14px - triggers iOS zoom on focus! */}
<p className="text-xs">Main content</p> {/* 12px - too small for body text */}
```

**iOS Auto-Zoom:** When an input with font-size < 16px receives focus, iOS Safari automatically zooms in. This breaks the layout. Always use `text-base` (16px) for form inputs.

---

## 5. Layout Patterns

### Container Widths

```tsx
{/* Mobile: full width, Desktop: constrained */}
<div className="w-full md:max-w-2xl lg:max-w-4xl mx-auto px-4">
```

### Grid Layouts

```tsx
{/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

### Flex Layouts

```tsx
{/* Mobile: vertical stack, Desktop: horizontal row */}
<div className="flex flex-col md:flex-row gap-4 md:gap-6">
```

### Spacing

```tsx
{/* Mobile: smaller gaps, Desktop: larger gaps */}
<div className="space-y-4 md:space-y-6 lg:space-y-8">
```

---

## 6. Anti-Patterns (Forbidden)

### ❌ WRONG: Using max-width breakpoints (desktop-first)

```tsx
<div className="grid grid-cols-3 max-md:grid-cols-1">
```

### ✅ CORRECT: Using min-width breakpoints (mobile-first)

```tsx
<div className="grid grid-cols-1 md:grid-cols-3">
```

---

### ❌ WRONG: Hidden on mobile without alternative

```tsx
<nav className="hidden md:flex">
  {/* Mobile users can't navigate! */}
</nav>
```

### ✅ CORRECT: Mobile menu alternative

```tsx
<nav className="hidden md:flex">
  {/* Desktop navigation */}
</nav>
<Sheet>{/* Mobile navigation */}</Sheet>
```

---

### ❌ WRONG: Fixed widths that don't scale

```tsx
<div className="w-[600px]">
```

### ✅ CORRECT: Responsive widths

```tsx
<div className="w-full md:w-[600px] md:max-w-2xl">
```

---

### ❌ WRONG: Tiny buttons

```tsx
<Button className="h-8 px-2 text-xs">
```

### ✅ CORRECT: Touch-friendly buttons

```tsx
<Button className="h-12 px-4 text-base">
```

---

## 7. Component-Specific Rules

### Buttons

```tsx
{/* Minimum height: 44px */}
<Button className="h-11 min-w-[100px]">
  Click Me
</Button>

{/* Icon buttons: minimum 44x44 */}
<Button variant="ghost" size="icon" className="h-11 w-11">
  <X className="h-5 w-5" />
</Button>
```

### Form Inputs

```tsx
{/* Minimum height: 44px, font-size: 16px */}
<Input
  type="email"
  className="h-12 text-base"
  placeholder="your@email.com"
/>

<Select className="h-12 text-base">
  <option>Choose</option>
</Select>
```

### Cards

```tsx
{/* Full width on mobile, constrained on desktop */}
<Card className="w-full md:max-w-sm">
  <CardHeader>
    <CardTitle className="text-lg md:text-xl">Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-base">Content</p>
  </CardContent>
</Card>
```

### Navigation Links

```tsx
{/* Touch-friendly padding */}
<Link
  href="/courses"
  className="block py-3 px-4 text-base hover:bg-accent rounded-md"
>
  Courses
</Link>
```

---

## 8. Validation Protocol

Before submitting any UI change, verify mobile layout using Playwright MCP.

**See:** `.claude/skills/mobile-first-validation.md`

### Quick Checklist

- [ ] No horizontal overflow on mobile (390px viewport)
- [ ] All interactive elements are at least 44px tall
- [ ] Gap between clickable elements is at least 16px
- [ ] Form inputs are at least 16px font size
- [ ] Text is readable without zooming
- [ ] Navigation works on mobile (Sheet/Drawer functional)
- [ ] Base CSS classes target mobile (no `max-*` breakpoints)

---

## 9. Common Mobile Viewports

Test on these viewports (minimum):

| Device | Viewport | Use Case |
|--------|----------|----------|
| iPhone SE | 375x667 | Small phone (worst case) |
| iPhone 12 Pro | 390x844 | Baseline mobile |
| Pixel 5 | 393x851 | Android baseline |
| iPad Mini | 768x1024 | Tablet (portrait) |

**Playwright Command:**
```typescript
await page.setViewportSize({ width: 390, height: 844 });
```

---

## 10. Enforcement

### Code Review Gate

- No PR approval without mobile-first verification
- Use Playwright MCP to demonstrate mobile layout
- Screenshot required for UI changes

### Automated Checks

Run mobile validation script before commit:

```bash
pnpm playwright test --project=mobile
```

---

## Summary

1. **Base classes = Mobile** (flex-col, gap-4, text-base)
2. **Breakpoints = Desktop** (md:flex-row, md:gap-6, lg:gap-8)
3. **Touch targets ≥ 44px** (h-11 minimum)
4. **Input font-size ≥ 16px** (prevents iOS zoom)
5. **Gap between clickable ≥ 16px** (gap-4)
6. **Mobile menu required** (Sheet for complex navigation)
7. **Validate with Playwright** (390x844 viewport)
8. **No `max-*` breakpoints** (desktop-first forbidden)

**Mantra:** If it doesn't work on mobile, it doesn't work.
