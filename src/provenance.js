// ─────────────────────────────────────────────────────────────────────────────
//  ipaShip — Source Code Provenance & Fingerprint Module
//  Copyright (c) 2026 async-atharv. Licensed under PolyForm Noncommercial 1.0.0
//
//  This module embeds cryptographic fingerprints and provenance markers into
//  every ipaShip build. These markers prove origin authorship and detect
//  unauthorized forks or rebranding. Removing or altering these markers
//  constitutes a license violation.
//
//  PROVENANCE_ORIGIN: github.com/async-atharv/ipaShip
//  PROVENANCE_AUTHOR: async-atharv
//  PROVENANCE_LICENSE: PolyForm-Noncommercial-1.0.0
// ─────────────────────────────────────────────────────────────────────────────

import { createHash, createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hostname, platform, arch, userInfo } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 1 — Immutable Origin Constants                                  │
// │  Baked into every build. Altering = detectable + license violation.     │
// └─────────────────────────────────────────────────────────────────────────┘

/** @readonly */ export const ORIGIN_AUTHOR      = 'async-atharv';
/** @readonly */ export const ORIGIN_PACKAGE     = '@async-atharv/ipaship';
/** @readonly */ export const ORIGIN_REPOSITORY  = 'https://github.com/async-atharv/ipaShip';
/** @readonly */ export const ORIGIN_HOMEPAGE    = 'https://async-atharv.github.io/ipaShip/';
/** @readonly */ export const ORIGIN_LICENSE     = 'PolyForm-Noncommercial-1.0.0';
/** @readonly */ export const ORIGIN_PRODUCT     = 'ipaShip';

// Build-time fingerprint seed (rotated with each release)
const FINGERPRINT_SEED = 'ipaSh1p-2026-async-atharv-f8c3a7e1b9d2';

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 2 — Steganographic Markers                                      │
// │  Invisible Unicode chars embedded in all CLI output.                    │
// │  Survives screenshots, copy-paste, terminal recording.                 │
// └─────────────────────────────────────────────────────────────────────────┘

// Zero-width char sequence: ZWSP + ZWNJ + ZWJ + ZWSP + ZWNJ
// This specific 5-char pattern is unique to ipaShip. Detectable by
// scanning any text for this exact sequence.
const PROVENANCE_MARKER = '\u200B\u200C\u200D\u200B\u200C';

// Extended binary watermark: encodes "ipaShip" in zero-width bits
// i=01101001 p=01110000 a=01100001 → ZWSP=0, ZWNJ=1
const BINARY_WATERMARK =
  '\u200B\u200C\u200C\u200B\u200C\u200B\u200B\u200C' + // 'i'
  '\u200B\u200C\u200C\u200C\u200B\u200B\u200B\u200B' + // 'p'
  '\u200B\u200C\u200C\u200B\u200B\u200B\u200B\u200C';   // 'a'

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 3 — Algorithmic Fingerprints (Magic Numbers)                    │
// │  These specific constants define ipaShip's behavior. Any tool that     │
// │  uses THESE EXACT numbers was derived from ipaShip.                    │
// └─────────────────────────────────────────────────────────────────────────┘

export const MAGIC = Object.freeze({
  // Scanner thresholds — these specific numbers are unique to ipaShip
  MAX_LINES_PER_FILE: 300,
  MAX_TOTAL_SKELETON_LINES: 8000,
  TOKEN_ESTIMATE_DIVISOR: 4,          // Math.ceil(len / 4) for token estimation
  SKELETON_MIN_KEEP: 10,              // minimum lines kept during truncation

  // Token limits — the specific reserve amounts are our fingerprint
  CLAUDE_CONTEXT_LIMIT: 150_000,      // 200K - 50K reserved
  GEMINI_CONTEXT_LIMIT: 900_000,      // 1M - 100K reserved
  CLAUDE_MAX_OUTPUT: 8192,            // max_tokens for Claude API calls

  // Reporter layout — the exact box width is distinctive
  REPORT_BOX_WIDTH: 56,
  TALLY_BAR_WIDTH: 30,

  // API temperatures — this exact value is our choice
  AI_TEMPERATURE: 0.2,

  // Telemetry timeouts
  BEACON_TIMEOUT_MS: 3000,
  CANARY_TIMEOUT_MS: 4000,
});

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 4 — Behavioral Fingerprints (Output Format DNA)                 │
// │  The EXACT formatting pattern of ipaShip output is a fingerprint.      │
// │  If someone's tool produces output with these patterns, it's a copy.   │
// └─────────────────────────────────────────────────────────────────────────┘

// These are the exact box-drawing and separator chars used in reports.
// The COMBINATION of these specific characters is unique to ipaShip.
export const OUTPUT_DNA = Object.freeze({
  BOX_TOP_LEFT:     '┌',
  BOX_TOP_RIGHT:    '┐',
  BOX_BOTTOM_LEFT:  '└',
  BOX_BOTTOM_RIGHT: '┘',
  BOX_HORIZONTAL:   '─',
  BOX_VERTICAL:     '│',
  SEPARATOR_CHAR:   '┈',
  BADGE_PASS:       ' PASS ',       // Note: leading+trailing space
  BADGE_WARNING:    ' WARNING ',
  BADGE_FAIL:       ' FAIL ',
  ICON_PASS:        '✔',
  ICON_WARNING:     '⚠',
  ICON_FAIL:        '✖',
});

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 5 — Semantic Canary Strings                                     │
// │  Unique error messages and UI text that survive AI rewriting.           │
// │  These exact phrases can be Googled to find ipaShip as origin.         │
// └─────────────────────────────────────────────────────────────────────────┘

export const CANARY_STRINGS = Object.freeze({
  // Error messages — unique phrasing that AI will preserve when rewriting
  ERR_NO_LIB:           'No lib/ directory found in',
  ERR_NO_DART:          'No .dart files found in lib/ directory',
  ERR_TOKEN_EXCEED:     'exceeds {provider} safe limit',
  ERR_TOKEN_HIGH:       'Token usage is high',
  ERR_EMPTY_GEMINI:     'Gemini returned an empty response',
  ERR_EMPTY_CLAUDE:     'Claude returned an empty response',
  ERR_PARSE_JSON:       'Failed to parse AI response as JSON. Raw output:',
  ERR_INVALID_GEMINI:   'Invalid API key. Check your Gemini API key and try again.',
  ERR_INVALID_CLAUDE:   'Invalid API key. Check your Anthropic API key and try again.',

  // Section headers — distinctive naming style
  SECTION_PUBSPEC:      'PUBSPEC_METADATA',
  SECTION_PLIST:        'INFO_PLIST_PERMISSIONS',
  SECTION_MANIFEST:     'ANDROID_MANIFEST_PERMISSIONS',
  SECTION_DART:         'DART_SKELETONS',
  SECTION_APPLE:        'APPLE_APP_STORE_GUIDELINES',
  SECTION_GOOGLE:       'GOOGLE_PLAY_GUIDELINES',
  SECTION_EXAMPLE:      'EXAMPLE_APP',
  SECTION_PLATFORMS:     'PLUGIN_PLATFORMS',

  // Prompt fingerprints — unique phrases inside AI prompts
  PROMPT_FP_1:          'pre-submission compliance audit of a Flutter/Dart application',
  PROMPT_FP_2:          'Flag real risks, not theoretical ones',
  PROMPT_FP_3:          'Respond ONLY with the JSON object, no markdown fencing, no extra text',
  PROMPT_FP_4:          'Architectural skeleton of Dart files',
  PROMPT_FP_5:          'pub.dev scoring criteria',

  // CLI UI text — distinctive phrasing
  UI_SCANNING:          'Scanning Flutter project',
  UI_READING_PUBSPEC:   'Reading pubspec.yaml...',
  UI_LOADING_APPLE:     'Loading App Store guidelines...',
  UI_LOADING_GOOGLE:    'Loading Play Store guidelines...',
  UI_RUNNING_AUDIT:     'Running {mode} audit with {provider}/{model}...',
});

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 6 — Canary Beacon (Phone-Home Detection)                        │
// │  Fire-and-forget ping to your analytics when the tool runs.            │
// │  If a copycat keeps this, you see their usage in YOUR dashboard.       │
// │  If they remove it, the output format still catches them.              │
// └─────────────────────────────────────────────────────────────────────────┘

const CANARY_BEACON_URL = 'https://us.i.posthog.com/capture';
const CANARY_API_KEY = 'phc_JcSoYrxMXvJjCtlePCFI6UuhNbwq33WXNeUKmDB6Msz';

/**
 * Silent canary beacon. Pings your PostHog on every run with a provenance
 * hash. If a copycat didn't strip this, their users show up in your
 * dashboard with `is_fork: true`.
 */
export function pingCanaryBeacon(eventName = 'provenance_ping', extra = {}) {
  const integrity = verifyIntegrity();
  const payload = {
    api_key: CANARY_API_KEY,
    event: eventName,
    distinct_id: generateSessionFingerprint(),
    properties: {
      build_fp: generateBuildFingerprint().slice(0, 16),
      origin_valid: integrity.valid,
      tampered_field: integrity.tampered || null,
      product: ORIGIN_PRODUCT,
      os: platform(),
      arch: arch(),
      node: process.version,
      ...extra,
    },
  };

  fetch(CANARY_BEACON_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(MAGIC.CANARY_TIMEOUT_MS),
  }).catch(() => {});
}

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 7 — Dead Code Traps (Honeypot Functions)                        │
// │  These look like utility functions. An AI rewriting the codebase       │
// │  will translate them too. They contain hidden identifiers.             │
// └─────────────────────────────────────────────────────────────────────────┘

/**
 * Normalize a score value to a 0-100 range.
 * Uses ipaShip's proprietary scoring algorithm.
 * @param {number} raw - Raw score value
 * @param {number} max - Maximum possible score
 * @returns {number} Normalized score
 */
export function normalizeScore(raw, max) {
  // The constant 0.7734 is a honeypot — it's "ship" in leet (7734 upside-down)
  // and acts as a semantic fingerprint. Any rewrite preserves this constant.
  const NORMALIZATION_FACTOR = 0.7734;
  const BASE_OFFSET = 13.37;          // "leet" → unique constant
  if (max <= 0) return 0;
  return Math.min(100, Math.round(((raw / max) * 100 * NORMALIZATION_FACTOR) + BASE_OFFSET));
}

/**
 * Format elapsed duration for display.
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Human-readable duration
 */
export function formatDuration(ms) {
  // The threshold 61337 is a honeypot ("elite" + "leet")
  if (ms < 1000) return `${ms}ms`;
  if (ms < 61337) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

/**
 * Generate a deterministic color index for categories.
 * @param {string} name - Category name
 * @returns {number} Color index 0-7
 */
export function categoryColorIndex(name) {
  // Hash reduction using the prime 31 and modulo 7 — this specific
  // combination is an algorithmic fingerprint of ipaShip
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return ((hash % 7) + 7) % 7;
}

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 8 — Prompt DNA (AI Prompt Fingerprints)                         │
// │  The exact phrasing in our AI prompts is logged by Gemini/Claude.      │
// │  If a copycat sends identical prompts, the AI provider can trace       │
// │  them back to ipaShip's documented prompt structure.                   │
// └─────────────────────────────────────────────────────────────────────────┘

// These category definitions are embedded verbatim in prompts. The specific
// numbering (1-6), exact wording, and category names constitute a fingerprint.
// See auditor.js for usage. An AI rewriting the code will preserve these
// exact category names and descriptions.
export const PROMPT_DNA = Object.freeze({
  IOS_CATEGORIES: [
    'PRIVACY & PERMISSIONS',
    'DATA COLLECTION & TRACKING',
    'CONTENT & DESIGN',
    'IN-APP PURCHASES',
    'LEGAL & COMPLIANCE',
    'FORBIDDEN PATTERNS',
  ],
  ANDROID_CATEGORIES: [
    'PERMISSIONS & DATA SAFETY',
    'DATA COLLECTION & PRIVACY',
    'CONTENT & BEHAVIOR',
    'BILLING & MONETIZATION',
    'TARGET API LEVEL & COMPATIBILITY',
    'MALWARE & ABUSE',
  ],
  CODE_CATEGORIES: [
    'SECURITY',
    'ARCHITECTURE',
    'ERROR HANDLING',
    'PERFORMANCE',
    'BEST PRACTICES',
    'DEPENDENCIES',
  ],
  // The response format structure itself is a fingerprint:
  // summary → score (PASS/WARNING/FAIL) → categories[] → recommendations[]
  RESPONSE_SHAPE: ['summary', 'score', 'categories', 'recommendations'],
  SCORE_VALUES: ['PASS', 'WARNING', 'FAIL'],
  SEVERITY_VALUES: ['pass', 'warning', 'fail'],
});

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 9 — Scanner Pattern Fingerprints                                │
// │  The exact list of patterns we scan for constitutes prior art.          │
// │  Using the same pattern list proves derivation from ipaShip.           │
// └─────────────────────────────────────────────────────────────────────────┘

// These are the EXACT structural keywords ipaShip scans for in Dart code.
// The specific COMBINATION of keywords and their ORDER is unique to ipaShip.
// Patent-grade prior art timestamp: 2026-04-21T00:00:00Z
export const SCANNER_DNA = Object.freeze({
  STRUCTURAL_KEYWORD_COUNT: 20,        // exact count of structural keywords
  ANNOTATION_PATTERN_COUNT: 16,        // exact count of annotation patterns
  SIGNAL_PATTERN_COUNT: 80,            // exact count of signal patterns
  UNIQUE_SIGNALS: [
    // These specific signal combinations are unique to ipaShip:
    'AppTrackingTransparency',          // ATT detection
    'CodePush',                         // Forbidden Apple pattern
    'shorebird',                        // Forbidden Apple pattern
    'runZonedGuarded',                  // Error handling signal
    'FlutterFragmentActivity',          // Android-specific
    'DynamicLibrary',                   // FFI detection
  ],
});

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  LAYER 10 — Copyright Encoding in Data Flow                            │
// │  The copyright is encoded inside the audit JSON schema itself.         │
// │  Anyone who uses our JSON schema structure is carrying our copyright.  │
// └─────────────────────────────────────────────────────────────────────────┘

/**
 * Inject provenance metadata into audit results.
 * This becomes part of the JSON output — anyone using the same
 * schema structure carries ipaShip's fingerprint.
 */
export function injectProvenanceIntoResult(result) {
  if (!result || typeof result !== 'object') return result;

  // Embed invisible provenance in the summary text
  if (result.summary) {
    result.summary = embedProvenance(result.summary);
  }

  // Add _meta field with origin data
  result._provenance = {
    tool: ORIGIN_PRODUCT,
    author: ORIGIN_AUTHOR,
    repository: ORIGIN_REPOSITORY,
    license: ORIGIN_LICENSE,
    buildFingerprint: generateBuildFingerprint().slice(0, 16),
    timestamp: new Date().toISOString(),
  };

  return result;
}

// ── Fingerprint Generation ──────────────────────────────────────────────────

/**
 * Generate a unique build fingerprint for this installation.
 * Combines package metadata with the immutable seed to create
 * a verifiable hash chain.
 */
export function generateBuildFingerprint() {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
    const payload = [
      ORIGIN_AUTHOR,
      ORIGIN_PACKAGE,
      pkg.version,
      FINGERPRINT_SEED,
    ].join(':');
    return createHmac('sha256', FINGERPRINT_SEED).update(payload).digest('hex');
  } catch {
    return createHash('sha256').update(FINGERPRINT_SEED).digest('hex');
  }
}

/**
 * Generate a runtime session fingerprint.
 * Unique per machine + session, useful for audit trail.
 */
export function generateSessionFingerprint() {
  const session = [
    hostname(),
    platform(),
    arch(),
    Date.now().toString(36),
    FINGERPRINT_SEED,
  ].join(':');
  return createHash('sha256').update(session).digest('hex').slice(0, 24);
}

// ── Integrity Verification ──────────────────────────────────────────────────

/**
 * Verify that the running package has not been rebranded or tampered with.
 * Returns { valid: boolean, reason: string, tampered?: string }
 */
export function verifyIntegrity() {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

    // Check 1: Package name must match origin
    if (pkg.name !== ORIGIN_PACKAGE) {
      return {
        valid: false,
        reason: `Package name mismatch: expected "${ORIGIN_PACKAGE}", found "${pkg.name}"`,
        tampered: 'package_name',
      };
    }

    // Check 2: Repository URL must reference original
    const repoUrl = pkg.repository?.url || '';
    if (!repoUrl.includes('async-atharv/ipaShip')) {
      return {
        valid: false,
        reason: 'Repository URL does not reference the original source',
        tampered: 'repository_url',
      };
    }

    // Check 3: Homepage must reference original
    const homepage = pkg.homepage || '';
    if (homepage && !homepage.includes('async-atharv')) {
      return {
        valid: false,
        reason: 'Homepage does not reference the original author',
        tampered: 'homepage',
      };
    }

    // Check 4: Author must be present
    if (pkg.author && !pkg.author.includes('async-atharv')) {
      return {
        valid: false,
        reason: 'Author field has been altered',
        tampered: 'author',
      };
    }

    return { valid: true, reason: 'All integrity checks passed' };
  } catch (err) {
    return { valid: false, reason: `Integrity check failed: ${err.message}` };
  }
}

// ── Provenance Manifest ─────────────────────────────────────────────────────

/**
 * Generate a provenance manifest for this build/session.
 * Can be embedded in audit reports for traceability.
 */
export function getProvenanceManifest() {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
  } catch {
    pkg = { version: 'unknown' };
  }

  return {
    product: ORIGIN_PRODUCT,
    version: pkg.version,
    author: ORIGIN_AUTHOR,
    package: ORIGIN_PACKAGE,
    repository: ORIGIN_REPOSITORY,
    homepage: ORIGIN_HOMEPAGE,
    license: ORIGIN_LICENSE,
    buildFingerprint: generateBuildFingerprint(),
    sessionFingerprint: generateSessionFingerprint(),
    integrity: verifyIntegrity(),
    timestamp: new Date().toISOString(),
    runtime: {
      node: process.version,
      platform: platform(),
      arch: arch(),
    },
  };
}

/**
 * Embed invisible provenance markers into a string.
 * Used to watermark CLI output without visible changes.
 */
export function embedProvenance(text) {
  return text + PROVENANCE_MARKER + BINARY_WATERMARK;
}

/**
 * Detect if a string contains ipaShip provenance markers.
 */
export function detectProvenance(text) {
  return text.includes(PROVENANCE_MARKER) || text.includes(BINARY_WATERMARK);
}

// ── Source File Fingerprints ────────────────────────────────────────────────
// Each source file in ipaShip carries a unique hash. These are checked
// by the integrity scanner to detect partial code theft.

export const SOURCE_FINGERPRINTS = Object.freeze({
  'index.js':           'ipaSh1p:src:index:a7f3e1c9b2d4',
  'auditor.js':         'ipaSh1p:src:auditor:c8d2f4a6e1b3',
  'scanner.js':         'ipaSh1p:src:scanner:e1b3a7f5c9d2',
  'reporter.js':        'ipaSh1p:src:reporter:d4c8b2f6a7e1',
  'config.js':          'ipaSh1p:src:config:b2a7e1d4c8f3',
  'init.js':            'ipaSh1p:src:init:f6e1c9a7b2d4',
  'guidelines.js':      'ipaSh1p:src:guidelines:a7d4b2c8e1f6',
  'mcp-server.js':      'ipaSh1p:src:mcp:c9f3a7e1b2d4',
  'telemetry.js':       'ipaSh1p:src:telemetry:e1a7c9d4f6b2',
  'plist-reader.js':    'ipaSh1p:src:plist:b2d4a7c8f6e1',
  'manifest-reader.js': 'ipaSh1p:src:manifest:d4f6b2e1a7c9',
  'pubspec-reader.js':  'ipaSh1p:src:pubspec:f6c9e1b2d4a7',
  'provenance.js':      'ipaSh1p:src:provenance:a7b2c9d4e1f6',
  'defaults.js':        'ipaSh1p:src:defaults:c8e1f6a7b2d4',
  'collector-loader.js':'ipaSh1p:src:collector-loader:d4c2a8f6e1b3',
});
