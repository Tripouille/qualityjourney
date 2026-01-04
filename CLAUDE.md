# QualityJourney.dev - Command Center

## Vision

QualityJourney.dev is the reference platform for Modern QA Engineers.

**Core Principles:**
- Mobile-First Development (non-negotiable)
- Mastery through Deliberate Practice (exhaustive quizzes, 100% pass requirement)
- Absolute Type Safety (TypeScript strictest, Zod everywhere)
- Repository Pattern (in-memory → any migration without friction)

---

## Superpowers MCP (Enhanced Capabilities)

You have access to advanced capabilities through the Superpowers MCP:

**Research & Verification:**
- **Web Search** - Verify ISTQB terminology, find real-world case studies, check current best practices
- **Web Fetch** - Read full documentation pages, technical articles, official sources
- **Browse with Playwright** - Automated browser testing and page verification

**ISTQB Content Workflow:**
- **PDF Conversion** - Use `pnpm convert:pdf docs/istqb` when PDFs are encountered
- **Direct Markdown Access** - Read full ISTQB syllabus files without size limits
- **Content Transformation** - Create lessons from syllabus (never copy-paste)

**Behavioral Rules (Updated):**
1. **ALWAYS** research before asking - Search web, read docs, fetch pages yourself
2. **VERIFY** ISTQB terminology against source markdown files in `docs/istqb/`
3. **NEVER** ask for information you can find independently
4. **NEVER** leave PDFs in `docs/istqb/` - Convert immediately using the skill
5. **TRANSFORM** content like a teacher adapting a textbook - inspire, don't duplicate
6. **RESEARCH** first, then create - Understand concepts deeply before teaching them

**Autonomy Mandate:**
- You can now answer your own questions through research
- Verify facts before stating them
- Cross-reference multiple sources when uncertain
- Use primary sources (ISTQB syllabus) over assumptions

---

## Documentation Map

All knowledge is externalized in:

- **`docs/business/`** - Business rules, product philosophy, ISTQB structure
  - [product-vision.md](docs/business/product-vision.md)
  - [educational-philosophy.md](docs/business/educational-philosophy.md)
  - [istqb-structure.md](docs/business/istqb-structure.md)
  - [k-level-system.md](docs/business/k-level-system.md)

- **`docs/tech/`** - Technical decisions, architecture, patterns
  - [stack.md](docs/tech/stack.md)
  - [architecture.md](docs/tech/architecture.md)
  - [typescript-rules.md](docs/tech/typescript-rules.md)
  - [ui-styling-rules.md](docs/tech/ui-styling-rules.md)
  - [state-management.md](docs/tech/state-management.md)
  - [repository-pattern.md](docs/tech/repository-pattern.md)
  - [naming-conventions.md](docs/tech/naming-conventions.md)
  - [shell-commands.md](docs/tech/shell-commands.md)

- **`.claude/skills/`** - Operational procedures (repeatable tasks)
  - [code-review.md](.claude/skills/code-review.md)
  - [create-repository.md](.claude/skills/create-repository.md)
  - [mobile-first-validation.md](.claude/skills/mobile-first-validation.md)
  - [create-quiz-questions.md](.claude/skills/create-quiz-questions.md)
  - [istqb-content-workflow.md](.claude/skills/istqb-content-workflow.md)
  - [pdf-to-markdown.md](.claude/skills/pdf-to-markdown.md)

**CRITICAL:** If you don't find the answer in these docs, they are incomplete. Update them immediately.

---

## Survival Protocol (MANDATORY)

### Rule 1: Self-Update After Every Task

After completing ANY task, you MUST:
1. Check if the task revealed missing documentation
2. Check if a new repeatable pattern emerged
3. Update relevant docs OR create a new Skill
4. **If you skip this, you will forget and fail next time**

### Rule 2: Skills Creation (Autonomous)

If you perform a task more than once, create a Skill in `.claude/skills/`:
- Code review checklist
- Repository creation steps
- Mobile-first validation
- Quiz question standards
- ANY repeatable procedure

**DO NOT ask permission. Create the Skill immediately.**

### Rule 3: Documentation First

Before starting any task:
1. Check `.claude/skills/` for existing procedure
2. Check `docs/tech/` for architecture rules
3. Check `docs/business/` for business constraints
4. **If docs conflict with reality, fix the docs first**

---

## Critical Rules (Non-Negotiable)

1. **NEVER** use `as` type assertions → Use Zod
2. **ALWAYS** mobile-first CSS → Base classes = mobile, breakpoints = desktop
3. **NEVER** import `infrastructure/` in `domain/`
4. **ALWAYS** create a Skill for any repetitive task
5. **ALWAYS** validate external data with Zod
6. **NEVER** use Windows CMD commands in bash → Use Unix commands only
7. **NEVER** redirect to `nul` → Use `/dev/null`
8. **ALWAYS** update documentation after architectural changes
9. **NEVER** commit PDFs to `docs/` → Run `pnpm convert:pdf docs/istqb` immediately

---

## Quick Links

**Before you code:**
- Mobile-first? → [docs/tech/ui-styling-rules.md](docs/tech/ui-styling-rules.md)
- TypeScript strict? → [docs/tech/typescript-rules.md](docs/tech/typescript-rules.md)
- Need a repository? → [.claude/skills/create-repository.md](.claude/skills/create-repository.md)

**Before you commit:**
- Run checklist → [.claude/skills/code-review.md](.claude/skills/code-review.md)

**Working with ISTQB content:**
- Transform syllabus content → [.claude/skills/istqb-content-workflow.md](.claude/skills/istqb-content-workflow.md)
- Create quiz questions → [.claude/skills/create-quiz-questions.md](.claude/skills/create-quiz-questions.md)
- Convert PDFs → [.claude/skills/pdf-to-markdown.md](.claude/skills/pdf-to-markdown.md)

---

**You are autonomous. The project can only grow if you grow with it.**
