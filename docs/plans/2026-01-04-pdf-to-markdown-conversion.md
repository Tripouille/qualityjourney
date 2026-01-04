# PDF to Markdown Conversion System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create automated TypeScript tooling to convert all ISTQB PDF documentation to clean, structured Markdown with permanent workflow integration.

**Architecture:** Node.js script using `markitdown-ts` library for PDF parsing, with post-processing pipeline for YAML frontmatter injection, artifact cleanup, and format standardization. Integrated as npm script with accompanying skill documentation.

**Tech Stack:** TypeScript, tsx runtime, markitdown-ts, Node.js fs/path APIs

---

## Context

**Current State:**
- 9 PDFs in `docs/istqb/CTFL_V4/`:
  - `ISTQB_CTFL_Syllabus_v4.0.1.pdf`
  - Sample Exam A/B/C/D (Questions + Answers)
- No automated conversion pipeline
- Manual PDF reading slows content extraction

**Target State:**
- All PDFs converted to `.md` files with same name
- Original PDFs deleted
- Markdown includes YAML frontmatter (title, source, version)
- Clean formatting (no artifacts)
- Reusable workflow via npm script + skill documentation

**Library Selection Rationale:**

Primary: **markitdown-ts** ([npm](https://www.npmjs.com/package/markitdown-ts))
- Latest update: 12 days ago (actively maintained)
- TypeScript-first with simple API
- Local processing (no external API costs)
- Supports file paths, URLs, buffers

Fallback: **pdf2md-ts** (simpler, returns page array)

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json` (devDependencies section)
- Modify: `pnpm-lock.yaml` (auto-generated)

**Step 1: Install markitdown-ts**

Run: `pnpm add -D markitdown-ts`

Expected:
```
+ markitdown-ts 0.0.7
```

**Step 2: Install tsx runtime**

Run: `pnpm add -D tsx`

Expected:
```
+ tsx <version>
```

**Step 3: Verify installations**

Run: `pnpm list markitdown-ts tsx`

Expected: Both packages listed in devDependencies tree

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: add PDF to Markdown conversion dependencies"
```

---

## Task 2: Create Conversion Script Core

**Files:**
- Create: `scripts/pdf-to-markdown.ts`

**Step 1: Write script skeleton**

```typescript
import { MarkItDown } from 'markitdown-ts';
import { readdir, unlink, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';

interface ConversionResult {
  inputPath: string;
  outputPath: string;
  success: boolean;
  error?: string;
}

async function convertPdfToMarkdown(
  pdfPath: string
): Promise<ConversionResult> {
  const { dir, name } = parse(pdfPath);
  const outputPath = join(dir, `${name}.md`);

  try {
    const markitdown = new MarkItDown();
    const markdown = await markitdown.convert(pdfPath);

    // Placeholder - will add post-processing in next task
    await writeFile(outputPath, markdown, 'utf-8');

    // Delete original PDF
    await unlink(pdfPath);

    return { inputPath: pdfPath, outputPath, success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      inputPath: pdfPath,
      outputPath,
      success: false,
      error: errorMessage,
    };
  }
}

async function main() {
  const targetDir = process.argv[2] || 'docs/istqb';

  try {
    const entries = await readdir(targetDir, {
      recursive: true,
      withFileTypes: true,
    });

    const pdfFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.pdf'))
      .map((entry) => join(entry.parentPath, entry.name));

    if (pdfFiles.length === 0) {
      console.log(`No PDF files found in ${targetDir}`);
      return;
    }

    console.log(`Found ${pdfFiles.length} PDF file(s) to convert`);

    const results = await Promise.all(
      pdfFiles.map((pdfPath) => convertPdfToMarkdown(pdfPath))
    );

    const succeeded = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`\n✓ Successfully converted ${succeeded.length} file(s)`);
    succeeded.forEach((r) =>
      console.log(`  ${r.inputPath} → ${r.outputPath}`)
    );

    if (failed.length > 0) {
      console.error(`\n✗ Failed to convert ${failed.length} file(s):`);
      failed.forEach((r) => console.error(`  ${r.inputPath}: ${r.error}`));
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
```

**Step 2: Test script with dry run**

Run: `npx tsx scripts/pdf-to-markdown.ts docs/istqb/CTFL_V4`

Expected: Script runs, lists PDFs, attempts conversion (may have formatting issues - that's OK for now)

**Step 3: Commit**

```bash
git add scripts/pdf-to-markdown.ts
git commit -m "feat: add basic PDF to Markdown conversion script"
```

---

## Task 3: Add Markdown Post-Processing

**Files:**
- Modify: `scripts/pdf-to-markdown.ts` (add processing functions)

**Step 1: Add frontmatter extraction helper**

Insert after imports:

```typescript
interface PdfMetadata {
  title: string;
  source: string;
  version: string;
}

function extractMetadataFromFilename(filename: string): PdfMetadata {
  // ISTQB_CTFL_Syllabus_v4.0.1.pdf → title: "ISTQB CTFL Syllabus", version: "4.0.1"
  // ISTQB_CTFL_v4.0_Sample-Exam-A-Questions_v1.7.pdf → title: "Sample Exam A Questions", version: "1.7"

  const match = filename.match(/ISTQB_CTFL(?:_Syllabus)?_v?(\d+\.\d+(?:\.\d+)?)_?(.+)?_v(\d+\.\d+(?:\.\d+)?)/);

  if (match) {
    const [, , titlePart, version] = match;
    const title = titlePart
      ? titlePart.replace(/-/g, ' ').replace(/_/g, ' ')
      : 'ISTQB CTFL Syllabus';
    return {
      title,
      source: filename,
      version,
    };
  }

  // Fallback for simple filenames
  return {
    title: filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
    source: filename,
    version: 'unknown',
  };
}

function createFrontmatter(metadata: PdfMetadata): string {
  return `---
title: "${metadata.title}"
source: "${metadata.source}"
version: "${metadata.version}"
converted: "${new Date().toISOString().split('T')[0]}"
---

`;
}
```

**Step 2: Add markdown cleanup helper**

Insert after frontmatter functions:

```typescript
function cleanMarkdown(rawMarkdown: string): string {
  let cleaned = rawMarkdown;

  // Remove excessive blank lines (3+ consecutive → 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Fix common artifacts from PDF extraction
  cleaned = cleaned.replace(/\f/g, ''); // Form feed characters
  cleaned = cleaned.replace(/\u00A0/g, ' '); // Non-breaking spaces

  // Normalize list formatting
  cleaned = cleaned.replace(/^[\s]*[-*]\s+/gm, '- '); // Unordered lists
  cleaned = cleaned.replace(/^[\s]*(\d+)\.\s+/gm, '$1. '); // Ordered lists

  // Ensure proper spacing around headers
  cleaned = cleaned.replace(/^(#{1,6}\s+.+)$/gm, '\n$1\n');

  // Trim trailing whitespace per line
  cleaned = cleaned
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');

  // Ensure file ends with single newline
  cleaned = cleaned.trim() + '\n';

  return cleaned;
}
```

**Step 3: Update convertPdfToMarkdown to use post-processing**

Replace the content writing section in `convertPdfToMarkdown`:

```typescript
// OLD:
// await writeFile(outputPath, markdown, 'utf-8');

// NEW:
const { name: filename } = parse(pdfPath);
const metadata = extractMetadataFromFilename(`${filename}.pdf`);
const frontmatter = createFrontmatter(metadata);
const cleanedMarkdown = cleanMarkdown(markdown);
const finalContent = frontmatter + cleanedMarkdown;

await writeFile(outputPath, finalContent, 'utf-8');
```

**Step 4: Test with single PDF**

Run: `npx tsx scripts/pdf-to-markdown.ts docs/istqb/CTFL_V4`

Expected: Markdown files created with YAML frontmatter, clean formatting

**Step 5: Manual inspection**

Run: `head -20 docs/istqb/CTFL_V4/ISTQB_CTFL_Syllabus_v4.0.1.md`

Expected:
```
---
title: "ISTQB CTFL Syllabus"
source: "ISTQB_CTFL_Syllabus_v4.0.1.pdf"
version: "4.0.1"
converted: "2026-01-04"
---

# [First heading from PDF]
...
```

**Step 6: Commit**

```bash
git add scripts/pdf-to-markdown.ts
git commit -m "feat: add markdown post-processing with frontmatter and cleanup"
```

---

## Task 4: Add NPM Script

**Files:**
- Modify: `package.json` (scripts section)

**Step 1: Add convert:pdf script**

Edit `package.json`, add to `scripts` object:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "convert:pdf": "tsx scripts/pdf-to-markdown.ts"
  }
}
```

**Step 2: Test npm script**

Run: `pnpm convert:pdf docs/istqb`

Expected: Script runs successfully via package manager

**Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add npm script for PDF conversion"
```

---

## Task 5: Convert All Existing PDFs

**Files:**
- Delete: All `docs/istqb/CTFL_V4/*.pdf` files (9 total)
- Create: Corresponding `.md` files (9 total)

**Step 1: Backup git state (safety)**

Run: `git status`

Expected: Clean working directory (previous changes committed)

**Step 2: Run conversion on all PDFs**

Run: `pnpm convert:pdf docs/istqb`

Expected:
```
Found 9 PDF file(s) to convert
✓ Successfully converted 9 file(s)
  docs/istqb/CTFL_V4/ISTQB_CTFL_Syllabus_v4.0.1.pdf → .../ISTQB_CTFL_Syllabus_v4.0.1.md
  ...
```

**Step 3: Verify PDFs deleted**

Run: `find docs/istqb -name "*.pdf" -type f`

Expected: No output (all PDFs deleted)

**Step 4: Verify Markdown created**

Run: `ls -1 docs/istqb/CTFL_V4/*.md`

Expected: 9 `.md` files listed

**Step 5: Quality check sample files**

Run: `head -30 docs/istqb/CTFL_V4/ISTQB_CTFL_Syllabus_v4.0.1.md`

Expected: Valid YAML frontmatter + readable content

Run: `head -30 docs/istqb/CTFL_V4/ISTQB_CTFL_v4.0_Sample-Exam-A-Questions_v1.7.md`

Expected: Valid YAML frontmatter + readable content

**Step 6: Commit**

```bash
git add docs/istqb/
git commit -m "feat: convert all ISTQB PDFs to Markdown"
```

---

## Task 6: Create Skill Documentation

**Files:**
- Create: `.claude/skills/pdf-to-markdown.md`

**Step 1: Write skill document**

```markdown
# PDF to Markdown Conversion

## When to Use

**Immediately** when you encounter ANY PDF file in `docs/istqb/` or related documentation directories.

**Triggers:**
- New PDF added to docs
- Request to extract PDF content
- Need to analyze ISTQB documentation

## Rule

**PDFs are temporary artifacts. Always convert to Markdown immediately.**

## Process

### 1. Check for PDFs

```bash
find docs/istqb -name "*.pdf" -type f
```

### 2. Run Conversion

```bash
pnpm convert:pdf docs/istqb
```

**What it does:**
- Extracts text and structure from all PDFs in target directory
- Generates clean Markdown with YAML frontmatter
- Deletes original PDF files
- Reports success/failure per file

### 3. Verify Output

Check generated Markdown:

```bash
ls docs/istqb/**/*.md
```

Inspect frontmatter and content:

```bash
head -30 docs/istqb/path/to/file.md
```

### 4. Commit

```bash
git add docs/istqb/
git commit -m "docs: convert ISTQB PDFs to Markdown"
```

## YAML Frontmatter Format

All converted Markdown files include:

```yaml
---
title: "Human-Readable Title"
source: "Original-Filename.pdf"
version: "X.Y.Z"
converted: "YYYY-MM-DD"
---
```

**Extraction Logic:**
- Title: Derived from filename (removes ISTQB prefix, version suffix)
- Source: Original PDF filename
- Version: Extracted from filename pattern (e.g., `v4.0.1`)
- Converted: ISO date of conversion

## Post-Processing Applied

The script automatically:

1. **Adds frontmatter** with metadata
2. **Cleans artifacts:**
   - Removes form feed characters (`\f`)
   - Converts non-breaking spaces to regular spaces
   - Normalizes list formatting
3. **Fixes structure:**
   - Reduces excessive blank lines
   - Adds spacing around headers
   - Trims trailing whitespace
4. **Ensures consistency:**
   - Single trailing newline
   - Consistent indentation

## Customization

**Convert specific directory:**

```bash
pnpm convert:pdf docs/istqb/CTFL_V4
```

**Script location:** `scripts/pdf-to-markdown.ts`

## Troubleshooting

**No PDFs found:**
- Verify directory path exists
- Check file extensions (case-sensitive)

**Conversion fails:**
- Check PDF is valid (not corrupted)
- Ensure write permissions on target directory
- Review error message for specifics

**Markdown quality issues:**
- Edit `cleanMarkdown()` function in script
- Add custom regex patterns for artifacts
- Update metadata extraction for new filename patterns

## Remember

**Never commit PDFs to the repository after this workflow exists.**

If you receive a PDF:
1. Place it temporarily in appropriate `docs/` subdirectory
2. Run conversion immediately
3. Delete PDF
4. Commit Markdown
```

**Step 2: Test skill is readable**

Run: `cat .claude/skills/pdf-to-markdown.md`

Expected: Full content displayed, valid Markdown

**Step 3: Commit**

```bash
git add .claude/skills/pdf-to-markdown.md
git commit -m "docs: add PDF to Markdown conversion skill"
```

---

## Task 7: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (Critical Rules section)

**Step 1: Read current CLAUDE.md**

Locate the "Critical Rules (Non-Negotiable)" section.

**Step 2: Add PDF conversion rule**

Insert new rule after existing rules:

```markdown
8. **NEVER** commit PDFs to `docs/` → Run `pnpm convert:pdf docs/istqb` immediately
```

**Step 3: Update Quick Links section**

Add to "Quick Links" section:

```markdown
**Converting PDFs:**
- Found a PDF? → [.claude/skills/pdf-to-markdown.md](.claude/skills/pdf-to-markdown.md)
```

**Step 4: Verify formatting**

Run: `head -60 CLAUDE.md`

Expected: New rule visible in Critical Rules section

**Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add permanent PDF conversion rule to CLAUDE.md"
```

---

## Task 8: Verification & Documentation

**Files:**
- No file changes (verification only)

**Step 1: Verify workflow end-to-end**

Create test PDF (mock):

```bash
echo "Test PDF content" > docs/istqb/test.pdf
```

Run conversion:

```bash
pnpm convert:pdf docs/istqb
```

Expected:
- `test.pdf` deleted
- `test.md` created with frontmatter

Clean up:

```bash
rm docs/istqb/test.md
```

**Step 2: Verify npm script works**

Run: `pnpm convert:pdf --help || echo "No help flag, that's OK"`

Expected: Script runs (even if no help output)

**Step 3: Verify skill is discoverable**

Run: `ls .claude/skills/`

Expected: `pdf-to-markdown.md` listed

**Step 4: Document library choice**

Create summary comment:

**Library Selection:** `markitdown-ts`

**Rationale:**
- **Active maintenance:** Updated 12 days ago
- **TypeScript-first:** Native types, no @types needed
- **Local processing:** No API costs or external dependencies
- **Simple API:** Single function call for conversion
- **Serverless-ready:** Works in edge environments (future-proof)

**Alternatives considered:**
- `pdf2md-ts`: Simpler but less maintained
- `@opendocsg/pdf2md`: Browser-only, not suitable for Node scripts
- `pdf2md-js`: Requires AI APIs (cost overhead)

**Step 5: Final commit**

No changes needed - verification only.

---

## Success Criteria

- [ ] All 9 ISTQB PDFs converted to Markdown
- [ ] No PDFs remain in `docs/istqb/`
- [ ] All Markdown files have YAML frontmatter
- [ ] `pnpm convert:pdf` script works
- [ ] Skill documented in `.claude/skills/`
- [ ] CLAUDE.md updated with permanent rule
- [ ] Workflow is repeatable for future PDFs

---

## Notes

**Library Used:** `markitdown-ts` (v0.0.7+)

**Format Standards:**
- YAML frontmatter with title, source, version, converted date
- Clean markdown (no PDF artifacts)
- Normalized list formatting
- Proper header spacing
- Single trailing newline

**Maintenance:**
- Update `cleanMarkdown()` if new artifacts discovered
- Extend `extractMetadataFromFilename()` for new filename patterns
- Consider adding table preservation if PDFs contain complex tables
