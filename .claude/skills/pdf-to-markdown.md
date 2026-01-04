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
