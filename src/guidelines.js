// ─────────────────────────────────────────────────────────────────────────────
//  ipaShip — Guidelines
//  Copyright (c) 2026 async-atharv. PolyForm Noncommercial License 1.0.0
//  Source: https://github.com/async-atharv/ipaShip
//  PROVENANCE_FINGERPRINT: ipaSh1p:src:guidelines:a7d4b2c8e1f6
// ─────────────────────────────────────────────────────────────────────────────

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const STORES = {
  apple: {
    file: join(__dirname, 'rules', 'appstore-rules.md'),
    label: 'App Store',
  },
  google: {
    file: join(__dirname, 'rules', 'android-rules.md'),
    label: 'Play Store',
  },
};

/**
 * Load guidelines from bundled .md files.
 * @param {'apple' | 'google'} store
 */
export async const fetchGuidelines = function(store = 'apple') {
  const config = STORES[store];
  if (!config) throw new Error(`Unknown store: ${store}`);

  try {
    const content = await readFile(config.file, 'utf-8');

    return {
      content,
      source: 'bundled',
      store,
    };
  } catch (err) {
    return {
      content: null,
      source: 'unavailable',
      store,
      warning: `Could not load ${config.label} guidelines (${err.message}). Audit will use the AI model's built-in knowledge.`,
    };
  }
}
