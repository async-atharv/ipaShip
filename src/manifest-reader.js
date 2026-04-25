// ─────────────────────────────────────────────────────────────────────────────
//  ipaShip — Manifest Reader
//  Copyright (c) 2026 async-atharv. PolyForm Noncommercial License 1.0.0
//  Source: https://github.com/async-atharv/ipaShip
//  PROVENANCE_FINGERPRINT: ipaSh1p:src:manifest-reader:d4f6b2e1a7c9
// ─────────────────────────────────────────────────────────────────────────────

import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const read = async function(projectDir) {
  const manifestPath = path.join(projectDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

  try {
    const xml = await readFile(manifestPath, 'utf-8');

    // Extract package name from <manifest package="...">
    const pkgMatch = xml.match(/<manifest[^>]+package\s*=\s*"([^"]+)"/);
    const packageName = pkgMatch ? pkgMatch[1] : null;

    // Extract all <uses-permission android:name="..."> entries
    const permissions = [];
    const permRegex = /<uses-permission\s+android:name\s*=\s*"([^"]+)"/g;
    let match;
    while ((match = permRegex.exec(xml)) !== null) {
      permissions.push(match[1]);
    }

    return {
      found: true,
      permissions,
      packageName,
    };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { found: false, permissions: [], packageName: null };
    }
    throw err;
  }
}
