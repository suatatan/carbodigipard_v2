#!/usr/bin/env node
/**
 * CARBODIGIPARD — Image Optimization Script
 *
 * Reads images from ./raw-images/ and outputs optimized WebP + JPEG versions
 * into ./public/uploads/. Maintains original filenames with new extensions.
 *
 * Usage:
 *   node scripts/optimize-images.js
 *   node scripts/optimize-images.js --input ./raw-images --output ./public/uploads
 *
 * Dependencies: sharp (npm install sharp)
 */

import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// --- Config ---
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};

const INPUT_DIR = path.resolve(ROOT, getArg('--input') ?? 'raw-images');
const OUTPUT_DIR = path.resolve(ROOT, getArg('--output') ?? 'public/uploads');

const SIZES = [
  { suffix: '', width: 1200 },       // Full width
  { suffix: '-card', width: 600 },   // Card thumbnails
  { suffix: '-thumb', width: 300 },  // Small thumbnails
];

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif']);

const JPEG_OPTIONS = { quality: 82, progressive: true };
const WEBP_OPTIONS = { quality: 80 };

// --- Main ---
async function run() {
  if (!existsSync(INPUT_DIR)) {
    console.error(`[ERROR] Input directory not found: ${INPUT_DIR}`);
    console.info('Create the "raw-images/" folder and add images to process.');
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(INPUT_DIR);
  const images = files.filter((f) => SUPPORTED_EXTENSIONS.has(path.extname(f).toLowerCase()));

  if (images.length === 0) {
    console.info('[INFO] No images found in input directory.');
    return;
  }

  console.info(`[INFO] Processing ${images.length} image(s)...`);

  let processed = 0;
  let errors = 0;

  for (const file of images) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = path.parse(file).name;

    for (const { suffix, width } of SIZES) {
      const outBase = `${baseName}${suffix}`;

      try {
        const pipeline = sharp(inputPath).resize({ width, withoutEnlargement: true });

        // WebP
        const webpOut = path.join(OUTPUT_DIR, `${outBase}.webp`);
        await pipeline.clone().webp(WEBP_OPTIONS).toFile(webpOut);

        // JPEG (fallback)
        const jpegOut = path.join(OUTPUT_DIR, `${outBase}.jpg`);
        await pipeline.clone().jpeg(JPEG_OPTIONS).toFile(jpegOut);

        console.info(`  [OK] ${outBase} (${width}px) → WebP + JPEG`);
        processed++;
      } catch (err) {
        console.error(`  [ERR] ${file} (${width}px): ${err.message}`);
        errors++;
      }
    }
  }

  console.info(`\n[DONE] ${processed} variants created, ${errors} error(s).`);
  console.info(`Output: ${OUTPUT_DIR}`);
}

run().catch((err) => {
  console.error('[FATAL]', err.message);
  process.exit(1);
});
