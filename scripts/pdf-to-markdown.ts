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
