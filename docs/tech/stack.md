# Technical Stack

## Core Technologies

### Framework
**Next.js 16+** (App Router)

- **Why:** React-based framework with built-in routing, server components, and excellent DX
- **App Router:** Using the new `app/` directory structure (not `pages/`)
- **Server Components:** Leverage RSC for better performance
- **File-based routing:** Automatic routing based on file structure

### Language
**TypeScript 5+** (Strictest Mode)

- **Config:** Using `@tsconfig/strictest@2.0.8` (see [typescript-rules.md](typescript-rules.md))
- **Zero tolerance:** No `any`, no `as` assertions, Zod for all external data
- **noUncheckedIndexedAccess:** Array access always returns `T | undefined`

### Styling
**Tailwind CSS v4**

- **Why:** Utility-first CSS with excellent mobile-first support
- **Mobile-First Mandate:** Base classes target mobile, use breakpoints for desktop (see [ui-styling-rules.md](ui-styling-rules.md))
- **Config:** Custom color palette, spacing, typography
- **Typography Plugin:** For article content with proper reading experience

### UI Components
**Shadcn/ui** (new-york style)

- **Why:** Copy-paste components, full customization, TypeScript-first
- **Style:** Using "new-york" variant (clean, modern aesthetic)
- **Components:** Button, Card, Input, Sheet, Progress, Badge, Tooltip, etc.
- **Installation:** Via `npx shadcn@latest add <component>`

### Icons
**Lucide React**

- **Why:** Modern, consistent icon set with tree-shaking
- **Usage:** `import { Menu, CheckCircle, PlayCircle } from 'lucide-react'`
- **Size:** Always specify size explicitly (e.g., `className="h-5 w-5"`)

---

## State Management

### Server State
**TanStack Query** (React Query v5)

- **Purpose:** Manage server data (courses, users, certificates, progress)
- **Why:** Automatic caching, background refetching, loading/error states
- **Pattern:** Wrap repository calls in async functions, even for in-memory data
- **See:** [state-management.md](state-management.md)

### Client State
**Zustand**

- **Purpose:** Synchronous UI state (sidebar, modals, quiz session)
- **Why:** Minimal boilerplate, no providers needed, TypeScript-first
- **Usage:** `const { sidebarOpen, toggleSidebar } = useUIStore()`
- **See:** [state-management.md](state-management.md)

---

## Validation
**Zod**

- **Purpose:** Runtime type validation for all external data
- **Usage:** API responses, URL params, form inputs, localStorage
- **Pattern:** Define schemas, use `.parse()` or `.safeParse()`
- **See:** [typescript-rules.md](typescript-rules.md)

**Example:**
```typescript
const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

const course = CourseSchema.parse(data); // Throws if invalid
```

---

## Database
**Drizzle ORM + PostgreSQL** (coming later)

- **Current:** In-memory repositories with mock data
- **Future:** Drizzle ORM for type-safe database queries
- **Migration:** Change only repository implementation, zero UI changes
- **See:** [repository-pattern.md](repository-pattern.md)

---

## Package Manager
**pnpm** (mandatory)

- **Why:** Faster than npm/yarn, disk-efficient, strict dependency resolution
- **Commands:**
  - `pnpm install` - Install dependencies
  - `pnpm dev` - Start development server
  - `pnpm build` - Build for production
  - `pnpm start` - Start production server
  - `pnpm add <package>` - Add dependency
  - `pnpm add -D <package>` - Add dev dependency

**Lockfile:** `pnpm-lock.yaml` (always commit this)

---

## Additional Libraries

### Animations
**Framer Motion** (future)

- **Purpose:** Page transitions, micro-interactions
- **Usage:** Smooth animations for quiz transitions, section unlocks

### Confetti
**canvas-confetti**

- **Purpose:** Visual celebration on quiz completion
- **Usage:** Trigger confetti explosion when user passes quiz with 100%
- **See:** [docs/business/educational-philosophy.md](../business/educational-philosophy.md)

### Diagrams
**Mermaid** (future)

- **Purpose:** Render diagrams in lesson content
- **Usage:** Process flows, relationships (e.g., Error → Defect → Failure)
- **Integration:** Server-side rendering to SVG

---

## Development Tools

### Code Quality
- **ESLint:** Configured for Next.js + TypeScript
- **Prettier:** Code formatting (integrated with ESLint)
- **TypeScript:** Strictest mode (zero errors policy)

### Testing (future)
- **Vitest:** Unit tests for domain services, utilities
- **Playwright:** E2E tests for critical user flows
- **Testing Library:** Component tests (if needed)

---

## Environment

### Node.js
**Version:** 20+ LTS

**Check version:**
```bash
node --version
```

### Operating System
- **Development:** Windows (Git Bash) or macOS/Linux
- **Production:** Linux (Vercel, AWS, etc.)

---

## Deployment (future)

### Platform
**Vercel** (recommended for Next.js)

- **Why:** Zero-config Next.js deployment, edge functions, global CDN
- **Alternatives:** AWS Amplify, Netlify, Railway

### Database Hosting
**Supabase** or **Neon** (PostgreSQL)

- **Why:** Managed PostgreSQL, Drizzle-compatible, generous free tier

---

## File Structure

See [architecture.md](architecture.md) for detailed folder structure.

**Summary:**
```
src/
├── app/                 # Next.js App Router (pages, layouts)
├── components/          # Shared UI components
│   ├── ui/              # Shadcn components
│   └── common/          # Custom shared components
├── domain/              # Business logic & interfaces
│   ├── entities/        # Domain models
│   ├── repositories/    # Repository interfaces
│   └── services/        # Business logic services
├── infrastructure/      # External concerns (data, API)
│   ├── repositories/    # Repository implementations
│   └── di/              # Dependency Injection
├── features/            # Feature modules
├── lib/                 # Utilities, helpers, config
└── public/              # Static assets
```

---

## Version Constraints

**Locked Versions (critical dependencies):**
```json
{
  "next": "^16.0.0",
  "typescript": "^5.0.0",
  "@tsconfig/strictest": "2.0.8",
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^5.0.0",
  "zod": "^3.23.0",
  "lucide-react": "^0.460.0"
}
```

**Flexible Versions (minor updates OK):**
- Tailwind CSS plugins
- ESLint/Prettier configs
- Dev dependencies

---

## Installation Commands

### Fresh Setup
```bash
pnpm install
```

### Add New Dependency
```bash
# Regular dependency
pnpm add package-name

# Dev dependency
pnpm add -D package-name

# Shadcn component
npx shadcn@latest add component-name
```

### Update Dependencies
```bash
# Check outdated
pnpm outdated

# Update all (use with caution)
pnpm update
```

---

## Build & Run

### Development
```bash
pnpm dev
# → http://localhost:3000
```

### Production Build
```bash
pnpm build
pnpm start
```

### Type Check Only
```bash
pnpm tsc --noEmit
```

---

## Rules

1. **NEVER** install packages without testing in `pnpm dev` first
2. **ALWAYS** commit `pnpm-lock.yaml` with dependency changes
3. **NEVER** use `npm` or `yarn` in this project (pnpm only)
4. **ALWAYS** verify TypeScript compiles (`pnpm tsc --noEmit`) before commit
5. **NEVER** add dependencies "just in case" (add only when needed)
