# Code Review Checklist

## Pre-Commit Validation Protocol

Before committing any code, verify ALL items below:

### Type Safety (P0 - Critical)

- [ ] No `as` type assertions used (use Zod or type guards instead)
- [ ] All external data validated with Zod (API responses, URL params, form inputs, localStorage)
- [ ] Array/object indexed access checked for undefined (`noUncheckedIndexedAccess`)
- [ ] TypeScript strictest mode passes with zero errors
- [ ] No implicit `any` types

### Architecture (P0 - Critical)

- [ ] Repository pattern respected (no direct data access in components)
- [ ] Dependency flow is correct (domain → infrastructure, never reverse)
- [ ] No imports from `infrastructure/` in `domain/`
- [ ] No business logic in React components (use domain services)
- [ ] File/folder naming follows conventions (kebab-case for files/folders, PascalCase for components)

### Mobile-First (P0 - Critical)

- [ ] Base CSS classes target mobile (no `max-width` breakpoints)
- [ ] All interactive elements are at least 44px tall (touch targets)
- [ ] Gap between clickable elements is at least 16px
- [ ] Form inputs are at least 16px font size (prevents iOS auto-zoom)
- [ ] Text is readable without zooming (minimum 16px body text)
- [ ] Navigation works on mobile (Sheet/Drawer implemented)
- [ ] No horizontal overflow on mobile viewports

### State Management (P1 - Important)

- [ ] Server data uses TanStack Query (courses, users, certificates, progress)
- [ ] Client state uses Zustand (UI state, sidebar, modals, quiz session)
- [ ] No Zustand for server data (forbidden)
- [ ] No TanStack Query for pure UI state (forbidden)

### Documentation (P1 - Important)

- [ ] If architectural decision made, update relevant docs in `docs/tech/` or `docs/business/`
- [ ] If new repeatable task discovered, create Skill in `.claude/skills/`
- [ ] If business rule changed, update `docs/business/`

---

## Failure Protocol

If any P0 item fails:
1. **STOP** - Do not commit
2. Fix the issue immediately
3. Re-run the checklist
4. Only commit when all P0 items pass

If any P1 item fails:
1. Fix before commit if possible
2. If blocking, create a follow-up task
3. Document the debt

---

## Quick Reference

**Type Safety:**
```typescript
// ❌ FORBIDDEN
const user = data as User;

// ✅ CORRECT
const UserSchema = z.object({ id: z.string(), name: z.string() });
const user = UserSchema.parse(data);
```

**Mobile-First:**
```tsx
// ❌ FORBIDDEN
<div className="flex-row max-md:flex-col">

// ✅ CORRECT
<div className="flex-col md:flex-row">
```

**Architecture:**
```typescript
// ❌ FORBIDDEN (in domain/)
import { CourseRepositoryInMemory } from '@/infrastructure/repositories/in-memory/course-repository-in-memory';

// ✅ CORRECT (in domain/)
import { CourseRepository } from '@/domain/repositories/course-repository';
```
