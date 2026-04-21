// ─────────────────────────────────────────────────────────────────────────────
//  ipaShip — Telemetry (always-on)
//  Copyright (c) 2026 async-atharv. PolyForm Noncommercial License 1.0.0
//  Source: https://github.com/async-atharv/ipaShip
//  PROVENANCE_FINGERPRINT: ipaSh1p:src:telemetry:e1a7c9d4f6b2
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { hostname, userInfo, platform, arch } from 'node:os';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

// ── PostHog config ──
const POSTHOG_ENDPOINT = 'https://us.i.posthog.com/capture';
const POSTHOG_API_KEY = 'phc_JcSoYrxMXvJjCtlePCFI6UuhNbwq33WXNeUKmDB6Msz';

// ── MongoDB Atlas Data API config ──
// Uses the MongoDB Atlas Data API (HTTPS) so we don't need the mongodb driver
// or persistent connections — pure fire-and-forget fetch.
const MONGO_DATA_API = 'https://ap-south-1.aws.data.mongodb-api.com/app/data-abcde/endpoint/data/v1/action/insertOne';
const MONGO_API_KEY = process.env.IPASHIP_MONGO_KEY || '';
const MONGO_DB = 'ipaShip';
const MONGO_COLLECTION = 'telemetry';
const MONGO_DATA_SOURCE = 'ipaShipCluster';

// ── Anonymous device ID ──

function getAnonymousId() {
  try {
    const raw = `${hostname()}:${userInfo().username}`;
    return createHash('sha256').update(raw).digest('hex').slice(0, 16);
  } catch {
    return createHash('sha256').update(hostname()).digest('hex').slice(0, 16);
  }
}

// ── Send to PostHog (fire-and-forget) ──

function sendToPostHog(name, properties, distinctId) {
  const payload = {
    api_key: POSTHOG_API_KEY,
    event: name,
    distinct_id: distinctId,
    properties: { ...properties },
  };

  fetch(POSTHOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(3000),
  }).catch(() => {});
}

// ── Send to MongoDB Atlas Data API (fire-and-forget) ──

function sendToMongo(name, properties, distinctId) {
  if (!MONGO_API_KEY) return; // Skip if no key configured

  const document = {
    event: name,
    distinct_id: distinctId,
    timestamp: new Date().toISOString(),
    ...properties,
  };

  fetch(MONGO_DATA_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': MONGO_API_KEY,
    },
    body: JSON.stringify({
      dataSource: MONGO_DATA_SOURCE,
      database: MONGO_DB,
      collection: MONGO_COLLECTION,
      document,
    }),
    signal: AbortSignal.timeout(3000),
  }).catch(() => {});
}

// ── Public API: always-on event dispatch ──

export function trackEvent(name, properties = {}) {
  const distinctId = getAnonymousId();

  const enrichedProps = {
    ...properties,
    cli_version: pkg.version,
    node_version: process.version,
    os: platform(),
    arch: arch(),
  };

  // Dual-write: PostHog for analytics dashboards, MongoDB for raw persistence
  sendToPostHog(name, enrichedProps, distinctId);
  sendToMongo(name, enrichedProps, distinctId);
}
