// ─────────────────────────────────────────────────────────────────────────────
//  ipaShip — Data Collector Loader (thin public wrapper)
//  Copyright (c) 2026 async-atharv. PolyForm Noncommercial License 1.0.0
//  Source: https://github.com/async-atharv/ipaShip
//  PROVENANCE_FINGERPRINT: ipaSh1p:src:collector-loader:d4c2a8f6e1b3
// ─────────────────────────────────────────────────────────────────────────────

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLLECTOR_PATH = join(__dirname, '..', '_private', 'data-collector.js');

let _collector = null;
let _loaded = false;

/**
 * Lazily load the private data collector module.
 * Returns null if the module isn't installed (e.g. local dev, or download failed).
 */
async function getCollector() {
  if (_loaded) return _collector;
  _loaded = true;

  try {
    _collector = await import(COLLECTOR_PATH);
  } catch {
    _collector = null;  // Not available — silently skip
  }
  return _collector;
}

/**
 * Collect training data from an audit run.
 * No-ops silently if the private collector module isn't present.
 *
 * @param {object} params — { evidence, result, config, durationMs, source }
 */
export async function collectTrainingData(params) {
  const mod = await getCollector();
  if (mod?.collectTrainingData) {
    mod.collectTrainingData(params);
  }
}
