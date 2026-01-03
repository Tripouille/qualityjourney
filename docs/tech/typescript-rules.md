# TypeScript Doctrine (Strict Safety)

## Compiler Configuration

We use **`@tsconfig/strictest`** to enforce maximum type safety without manually maintaining flags.

**Package:** `@tsconfig/strictest@2.0.8`

This extends the base TypeScript config with the strictest possible settings:
- `strict: true` (enables all strict family flags)
- `noUncheckedIndexedAccess: true` - Array/object access requires undefined checks
- `noImplicitOverride: true` - Explicit override keyword required
- `noPropertyAccessFromIndexSignature: true` - Forces bracket notation for index signatures
- `exactOptionalPropertyTypes: true` - Distinguishes `undefined` from absent properties
- `noFallthroughCasesInSwitch: true` - Prevents fallthrough in switch cases
- `forceConsistentCasingInFileNames: true` - Enforces consistent file naming
- And many more safety checks

### tsconfig.json

```json
{
  "extends": "@tsconfig/strictest/tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Critical Implication: `noUncheckedIndexedAccess`

This flag makes array and object indexed access always return `T | undefined`.

### The Problem

```typescript
const courses: Course[] = [/* ... */];
const course = courses[0];
course.title; // ❌ TypeScript error: 'course' is possibly 'undefined'
```

Even though `courses[0]` might exist, TypeScript treats it as `Course | undefined` because the index might be out of bounds.

### Solutions

#### ✅ Pattern 1: Non-null Assertion After Index Validation

```typescript
const index = courses.findIndex(c => c.id === id);
if (index === -1) {
  throw new Error('Course not found');
}
const course = courses[index]!; // Safe: we verified index exists
course.title; // ✅ OK
```

#### ✅ Pattern 2: Use .find() Instead of Indexed Access

```typescript
const course = courses.find(c => c.id === id);
if (!course) {
  throw new Error('Course not found');
}
// course is now Course (not undefined)
course.title; // ✅ OK
```

**Recommended:** Use `.find()` for single item lookup. It's more explicit and safer.

#### ✅ Pattern 3: Check After Access

```typescript
const course = courses[0];
if (course) {
  course.title; // ✅ OK
} else {
  // Handle empty array case
}
```

#### ❌ WRONG: Direct Access Without Check

```typescript
const course = courses[0];
course.title; // ❌ TypeScript error
```

---

## Type Safety Rules (Zero Tolerance)

### 1. FORBIDDEN: Type Assertions (`as`)

Type assertions (`as`) bypass TypeScript's type checking and should **never** be used.

#### ❌ FORBIDDEN

```typescript
const user = data as User;
const id = params.id as string;
const element = document.getElementById('foo') as HTMLDivElement;
```

#### ✅ REQUIRED: Use Type Guards

```typescript
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    typeof (data as { id: unknown }).id === 'string' &&
    typeof (data as { name: unknown }).name === 'string'
  );
}

if (isUser(data)) {
  // data is User here
  console.log(data.name);
}
```

#### ✅ REQUIRED: Use Zod Parsing

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

// Throws if invalid
const user = UserSchema.parse(data);

// Returns { success: true, data: User } or { success: false, error: ZodError }
const result = UserSchema.safeParse(data);
if (result.success) {
  console.log(result.data.name);
}
```

**Recommended:** Use Zod for all external data validation.

---

### 2. MANDATORY: Zod Validation

All external data MUST be validated with Zod:

**External Data Sources:**
- API responses (fetch, axios)
- URL parameters (params, searchParams)
- Form inputs (user input)
- LocalStorage/SessionStorage data
- Environment variables
- File uploads
- WebSocket messages

#### Example: API Response

```typescript
const CourseResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().positive(),
  createdAt: z.string().datetime(),
});

async function fetchCourse(id: string) {
  const response = await fetch(`/api/courses/${id}`);
  const data = await response.json();
  return CourseResponseSchema.parse(data); // Validates or throws
}
```

#### Example: URL Parameters

```typescript
const ParamsSchema = z.object({
  courseId: z.string().min(1),
  sectionId: z.string().regex(/^\d+\.\d+$/), // e.g., "1.1"
});

export default function SectionPage({ params }: { params: unknown }) {
  const { courseId, sectionId } = ParamsSchema.parse(params);
  // ...
}
```

#### Example: Form Input

```typescript
const CourseFormSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

function handleSubmit(formData: FormData) {
  const rawData = Object.fromEntries(formData);
  const validatedData = CourseFormSchema.parse(rawData);
  // validatedData is now type-safe
}
```

---

### 3. No Implicit Any

Every function parameter, return type, and variable must have explicit types.

#### ❌ FORBIDDEN

```typescript
function processData(data) { // ❌ Implicit any
  return data.map(item => item.id); // ❌ Implicit any
}

const result = getSomething(); // ❌ No type annotation
```

#### ✅ REQUIRED

```typescript
function processData(data: Course[]): string[] {
  return data.map((item: Course) => item.id);
}

const result: Course = getSomething();
```

**Exception:** You can omit types when they're trivially inferred:

```typescript
// ✅ OK: Type is clearly inferred
const count = 42; // number
const name = 'Alice'; // string
const courses = ['A', 'B']; // string[]

// ✅ OK: Return type inferred from explicit parameter types
function add(a: number, b: number) {
  return a + b; // Inferred: number
}
```

---

### 4. Explicit Return Types for Exported Functions

All exported functions MUST have explicit return types.

#### ❌ FORBIDDEN

```typescript
export function getCourses() { // ❌ No return type
  return container.courseRepository.findAll();
}
```

#### ✅ REQUIRED

```typescript
export function getCourses(): Promise<Course[]> {
  return container.courseRepository.findAll();
}
```

**Why:** Explicit return types prevent accidental API changes and improve IDE autocomplete.

---

### 5. Avoid Non-Null Assertions (`!`)

Use non-null assertions (`!`) sparingly and only when you've verified the value exists.

#### ❌ DANGEROUS

```typescript
const course = courses.find(c => c.id === id)!; // What if not found?
course.title; // Runtime error if undefined
```

#### ✅ SAFE: Verify First

```typescript
const course = courses.find(c => c.id === id);
if (!course) {
  throw new Error(`Course ${id} not found`);
}
course.title; // ✅ Safe
```

#### ✅ ACCEPTABLE: After Index Validation

```typescript
const index = courses.findIndex(c => c.id === id);
if (index === -1) {
  throw new Error('Not found');
}
const course = courses[index]!; // ✅ OK: index validated
```

---

### 6. Prefer `unknown` Over `any`

Never use `any`. Use `unknown` for truly unknown types, then narrow with type guards.

#### ❌ FORBIDDEN

```typescript
function processData(data: any) { // ❌ Never use any
  return data.something;
}
```

#### ✅ REQUIRED

```typescript
function processData(data: unknown) {
  if (isUser(data)) {
    return data.name; // ✅ Type narrowed
  }
  throw new Error('Invalid data');
}
```

---

### 7. Use Discriminated Unions for Variants

For types with multiple variants, use discriminated unions.

```typescript
// ✅ CORRECT: Discriminated union
type ContentBlock =
  | { type: 'markdown'; content: string }
  | { type: 'definition'; term: string; definition: string }
  | { type: 'infobox'; variant: 'info' | 'warning'; content: string }
  | { type: 'code'; language: string; code: string };

function renderBlock(block: ContentBlock) {
  switch (block.type) {
    case 'markdown':
      return <Markdown>{block.content}</Markdown>;
    case 'definition':
      return <Definition term={block.term}>{block.definition}</Definition>;
    case 'infobox':
      return <InfoBox variant={block.variant}>{block.content}</InfoBox>;
    case 'code':
      return <Code language={block.language}>{block.code}</Code>;
  }
}
```

**Why:** TypeScript narrows the type based on the discriminant field (`type`).

---

## Utility Types

### Use Built-in Utility Types

TypeScript provides many useful utility types:

```typescript
// Pick: Select subset of properties
type CoursePreview = Pick<Course, 'id' | 'title' | 'description'>;

// Omit: Exclude properties
type CreateCourseInput = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;

// Partial: Make all properties optional
type UpdateCourseInput = Partial<Course>;

// Required: Make all properties required
type RequiredCourse = Required<Course>;

// Record: Object with specific key/value types
type CourseMap = Record<string, Course>;

// Readonly: Immutable version
type ImmutableCourse = Readonly<Course>;
```

---

## Zod + TypeScript Integration

Derive TypeScript types from Zod schemas for single source of truth:

```typescript
const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

// Derive TypeScript type from schema
type Course = z.infer<typeof CourseSchema>;

// Now you have both runtime validation and compile-time types
const course: Course = CourseSchema.parse(data);
```

**Benefit:** Schema and type stay in sync automatically.

---

## Error Handling with Zod

### Throwing on Invalid Data

```typescript
try {
  const course = CourseSchema.parse(data);
  // Use course
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation failed:', error.errors);
  }
}
```

### Safe Parsing

```typescript
const result = CourseSchema.safeParse(data);

if (result.success) {
  const course = result.data; // Typed as Course
  // Use course
} else {
  const errors = result.error.errors;
  // Handle validation errors
}
```

---

## Rules Summary

1. **NEVER** use `as` type assertions → Use Zod or type guards
2. **ALWAYS** validate external data with Zod
3. **NEVER** use `any` → Use `unknown` and narrow with type guards
4. **ALWAYS** handle `undefined` for indexed access (use `.find()`)
5. **ALWAYS** add explicit return types for exported functions
6. **MINIMIZE** use of non-null assertions (`!`) → Verify first
7. **ALWAYS** use discriminated unions for variant types
8. **PREFER** Zod type inference (`z.infer`) for schema-driven types

---

## TypeScript Compilation

### Check for Errors

```bash
pnpm tsc --noEmit
```

**Policy:** Zero TypeScript errors before commit.

### Fix Auto-Fixable Issues

```bash
pnpm eslint --fix .
```

---

## IDE Setup

**Recommended:** Use VSCode with these extensions:
- **ESLint:** Real-time linting
- **Prettier:** Code formatting
- **TypeScript:** Built-in TypeScript support

**Settings:**
- Format on save: Enabled
- TypeScript strict mode: Enabled
- Show inline type hints: Enabled
