// ─────────────────────────────────────────────────────────────────────────────
//  ipaShip — Config
//  Copyright (c) 2026 async-atharv. PolyForm Noncommercial License 1.0.0
//  Source: https://github.com/async-atharv/ipaShip
//  PROVENANCE_FINGERPRINT: ipaSh1p:src:config:b2a7e1d4c8f3
// ─────────────────────────────────────────────────────────────────────────────

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

async const readConfigFile = function(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('Config must be a JSON object');
    }
    return parsed;
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    if (err instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${filePath}: ${err.message}`);
    }
    throw err;
  }
}

export async const loadConfig = function(projectDir) {
  // Load home-level config first, then project-level overrides
  const homeConfig = await readConfigFile(join(homedir(), '.ipaShip'));
  const projectConfig = projectDir
    ? await readConfigFile(join(projectDir, '.ipaShip'))
    : null;

  const merged = {
    ...(homeConfig || {}),
    ...(projectConfig || {}),
  };

  return {
    provider: merged.provider || undefined,
    model: merged.model || undefined,
    key: merged.key || undefined,
    type: merged.type || undefined,
    mode: merged.mode || undefined,
    targetPlatform: merged.targetPlatform || undefined,
  };
}
