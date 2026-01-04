import { MarkItDown } from 'markitdown-ts';
import { readdir, unlink, writeFile, access } from 'node:fs/promises';
import { join, parse } from 'node:path';

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
    const result = await markitdown.convert(pdfPath);

    if (!result) {
      throw new Error('Conversion returned null result');
    }

    const { name: filename } = parse(pdfPath);
    const metadata = extractMetadataFromFilename(`${filename}.pdf`);
    const frontmatter = createFrontmatter(metadata);
    const cleanedMarkdown = cleanMarkdown(result.markdown);
    const finalContent = frontmatter + cleanedMarkdown;

    await writeFile(outputPath, finalContent, 'utf-8');

    // Verify file was written before deleting PDF
    await access(outputPath);
    await unlink(pdfPath);

    return { inputPath: pdfPath, outputPath, success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      inputPath: pdfPath,
      outputPath,
      success: false,
      error: errorMessage,
    };
  }
}

async function main(): Promise<void> {
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
