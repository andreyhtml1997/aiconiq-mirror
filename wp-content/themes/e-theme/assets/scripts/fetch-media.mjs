#!/usr/bin/env node
/**
 * Pre-downloads heavy media assets that aren't checked into git into
 * `public/assets/...` so the WordPress seeder + the front-end can both
 * use them offline. Run once after `npm install`.
 *
 *   npm run fetch-media
 *
 * The list mirrors the videos that have no local copy in the repo. If
 * `aiconiq.io` ever moves these files, update REMOTE_BASE / FILES below.
 * Idempotent: skips files already present on disk.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { fileURLToPath } from 'node:url';

const REMOTE_BASE = 'https://aiconiq.io';
const FILES = [
  '/assets/main_video_new.mp4',
  '/assets/INVENTIVE_AICONIQ_Hero-Video_20260127_16x9_1080p_FINAL_x264.mp4',
  '/assets/interview-101.mp4',
  '/assets/mainmumdat.mp4',
];

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function fetchOne(rel) {
  const dest = join(PUBLIC_DIR, rel.replace(/^\//, ''));
  if (await exists(dest)) {
    console.log(`✓ already present: ${rel}`);
    return;
  }
  await mkdir(dirname(dest), { recursive: true });
  const url = REMOTE_BASE + rel;
  process.stdout.write(`↓ downloading ${rel} … `);
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  await pipeline(res.body, createWriteStream(dest));
  console.log('done');
}

let failures = 0;
for (const rel of FILES) {
  try {
    await fetchOne(rel);
  } catch (err) {
    failures++;
    console.error(`✗ ${rel}: ${err.message}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} of ${FILES.length} failed. Re-run when network is available.`);
  process.exit(1);
}
console.log('\nAll media available locally — seeder can run offline.');
