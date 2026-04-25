#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  ipaShip — AI-powered App Store compliance runInspection for Flutter
//  Copyright (c) 2026 async-atharv. PolyForm Noncommercial License 1.0.0
//  Source: https://github.com/async-atharv/ipaShip
//  PROVENANCE_FINGERPRINT: ipaSh1p:src:index:a7f3e1c9b2d4
// ─────────────────────────────────────────────────────────────────────────────

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { loadConfig } from './config.js';
import { runInit, runConfig } from './init.js';
import { scan } from './scanner.js';
import { read as extractPlistData } from './plist-reader.js';
import { read as extractManifestData } from './manifest-reader.js';
import { read as readPubspec } from './pubspec-reader.js';
import { runInspection } from './auditor.js';
import { fetchGuidelines } from './guidelines.js';
import { print as displayResults } from './reporter.js';
import { PROVIDER_DEFAULTS as DEFAULTS, detectPlatform } from './defaults.js';
import { trackEvent } from './telemetry.js';
import { collectTrainingData } from './collector-loader.js';
import { verifyIntegrity, ORIGIN_AUTHOR, ORIGIN_PRODUCT, ORIGIN_LICENSE, pingCanaryBeacon, injectProvenanceIntoResult } from './provenance.js';

// Read package version
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(await readFile(join(__dirname, '..', 'package.json'), 'utf-8'));

// ── Provenance Integrity Check ──
// Verify that this distribution has not been rebranded or tampered with.
const _integrity = verifyIntegrity();
if (!_integrity.valid) {
  console.error(chalk.red('\n  ⚠ ipaShip Integrity Warning'));
  console.error(chalk.red(`  ${_integrity.reason}`));
  console.error(chalk.dim(`  Original: ${ORIGIN_PRODUCT} by ${ORIGIN_AUTHOR}`));
  console.error(chalk.dim(`  License: ${ORIGIN_LICENSE}\n`));
}

const program = new Command();

program
  .name('ipaShip')
  .description('AI-powered store review runInspection for Flutter projects')
  .version(pkg.version);

// Init subcommand
program
  .command('init')
  .description('Create a .ipaShip config file in the current directory')
  .action(async () => {
    await runInit();
    process.exit(0);
  });

// Config subcommand
program
  .command('config')
  .description('Update provider, model, or API key in .ipaShip')
  .action(async () => {
    await runConfig();
    process.exit(0);
  });

// Default runInspection command (runs when no subcommand is given)
program
  .command('runInspection', { isDefault: true })
  .description('Run the runInspection (default command)')
  .requiredOption('--dir <path>', 'Path to Flutter project root')
  .option('--key <apiKey>', 'API key (or set in .ipaShip / env var)')
  .option('--provider <provider>', 'AI provider: gemini or claude')
  .option('--model <model>', 'Model to use (defaults per provider)')
  .option('--type <type>', 'Project type: app or package (auto-detected if omitted)')
  .option('--mode <mode>', 'Audit mode: store, code, or both', 'both')
  .option('--targetPlatform <targetPlatform>', 'Target: ios, android, or both (auto-detected if omitted)')
  .action(async (opts) => {
    let projectDir = resolve(opts.dir);

    if (!existsSync(projectDir)) {
      console.error(chalk.red(`Error: Path not found: ${projectDir}`));
      process.exit(1);
    }

    const ext = extname(projectDir).toLowerCase();
    const isArchive = ['.ipa', '.apk', '.zip'].includes(ext);
    
    if (isArchive) {
      const tempPath = join(tmpdir(), `ipaship_ext_${Date.now()}_${Math.random().toString(36).slice(2)}`);
      
      try {
        console.log(chalk.cyan(`Extracting ${ext} archive...`));
        await execFileAsync('unzip', ['-q', projectDir, '-d', tempPath]);
        projectDir = tempPath;
      } catch (err) {
        console.error(chalk.red(`Error extracting archive: ${err.message}`));
        process.exit(1);
      }
    } else if (!existsSync(join(projectDir, 'lib'))) {
      console.error(chalk.red(`Error: No lib/ directory found in ${projectDir}. Is this a Flutter project?`));
      process.exit(1);
    }

    // Load .ipaShip config (project-level > home-level)
    const config = await loadConfig(projectDir);

    // Resolve values: CLI flag > .ipaShip > env var > default
    const provider = (opts.provider || config.provider || 'gemini').toLowerCase();

    if (!DEFAULTS[provider]) {
      console.error(chalk.red(`Error: Unknown provider "${provider}". Use "gemini" or "claude".`));
      process.exit(1);
    }

    if (opts.type && !['app', 'package'].includes(opts.type)) {
      console.error(chalk.red(`Error: --type must be "app" or "package", got "${opts.type}".`));
      process.exit(1);
    }

    const mode = (opts.mode || config.mode || 'both').toLowerCase();
    if (!['store', 'code', 'both'].includes(mode)) {
      console.error(chalk.red(`Error: --mode must be "store", "code", or "both", got "${mode}".`));
      process.exit(1);
    }

    const targetPlatform = (opts.targetPlatform || config.targetPlatform || detectPlatform(projectDir)).toLowerCase();
    if (!['ios', 'android', 'both'].includes(targetPlatform)) {
      console.error(chalk.red(`Error: --targetPlatform must be "ios", "android", or "both", got "${targetPlatform}".`));
      process.exit(1);
    }

    const apiKey = opts.key || config.key || process.env[DEFAULTS[provider].envKey];
    const model = opts.model || config.model || DEFAULTS[provider].model;

    if (!apiKey) {
      console.error(chalk.red('Error: No API key provided.'));
      console.error(chalk.dim('  Run ') + chalk.cyan('ipaShip init') + chalk.dim(' to create a .ipaShip config file,'));
      console.error(chalk.dim(`  or pass --key YOUR_KEY, or set ${DEFAULTS[provider].envKey} in your environment.`));
      process.exit(1);
    }

    const platformLabel = { ios: 'iOS', android: 'Android', both: 'iOS + Android' }[targetPlatform];
    let spinner = ora({ text: `Scanning Flutter project (${platformLabel})...`, color: 'cyan' }).start();
    const startTime = Date.now();

    try {
      // 1. Read pubspec.yaml first (needed for type detection)
      spinner.text = 'Reading pubspec.yaml...';
      const pubspec = await readPubspec(projectDir);

      // 2. Resolve project type: CLI flag > config > auto-detect from pubspec
      const projType = opts.type || config.type || pubspec.projType;
      spinner.text = `Detected: ${chalk.cyan(projType)} / ${chalk.cyan(platformLabel)}`;

      // 3. Scan Dart files
      spinner.text = 'Scanning Dart files...';
      const { files, stats } = await scan(projectDir);
      spinner.text = `Scanned ${stats.totalFiles} files (${stats.totalLines} lines → ${stats.skeletonLines} skeleton lines)`;

      // 4. Scan example/ app for packages (if it exists)
      let exampleFiles = [];
      if (projType === 'package' && existsSync(join(projectDir, 'example', 'lib'))) {
        spinner.text = 'Scanning example/ app...';
        const exampleResult = await scan(join(projectDir, 'example'));
        exampleFiles = exampleResult.files;
      }

      // 5. Read targetPlatform-specific permission files
      let plistData = { found: false, permissions: {}, bundleId: null };
      let manifestData = { found: false, permissions: [], packageName: null };

      if (projType === 'app' && (targetPlatform === 'ios' || targetPlatform === 'both')) {
        spinner.text = 'Reading Info.plist...';
        plistData = await extractPlistData(projectDir);
      }

      if (projType === 'app' && (targetPlatform === 'android' || targetPlatform === 'both')) {
        spinner.text = 'Reading AndroidManifest.xml...';
        manifestData = await extractManifestData(projectDir);
      }

      // 6. Load store guidelines (for store and both modes)
      let appleGuidelines = null;
      let googleGuidelines = null;

      if (mode !== 'code') {
        if (targetPlatform === 'ios' || targetPlatform === 'both') {
          spinner.text = 'Loading App Store guidelines...';
          appleGuidelines = await fetchGuidelines('apple');
          if (appleGuidelines.warning) {
            spinner.warn(chalk.yellow(appleGuidelines.warning));
            spinner = ora({ text: '', color: 'cyan' }).start();
          }
        }

        if (targetPlatform === 'android' || targetPlatform === 'both') {
          spinner.text = 'Loading Play Store guidelines...';
          googleGuidelines = await fetchGuidelines('google');
          if (googleGuidelines.warning) {
            spinner.warn(chalk.yellow(googleGuidelines.warning));
            spinner = ora({ text: '', color: 'cyan' }).start();
          }
        }
      }

      // 7. Run AI runInspection
      const modeLabel = { store: 'store compliance', code: 'code quality', both: 'full' }[mode];
      spinner.text = `Running ${modeLabel} runInspection with ${provider}/${model}...`;
      const result = await runInspection(
        {
          files,
          exampleFiles,
          permissions: plistData.permissions,
          androidPermissions: manifestData.permissions,
          pubspec,
          hasPlist: (targetPlatform === 'ios' || targetPlatform === 'both') ? plistData.found : undefined,
          hasManifest: (targetPlatform === 'android' || targetPlatform === 'both') ? manifestData.found : undefined,
          projType,
          appleGuidelines,
          googleGuidelines,
        },
        { apiKey, model, provider, mode, targetPlatform },
      );

      spinner.stop();

      // 7.5 Inject provenance into runInspection results & ping canary
      injectProvenanceIntoResult(result);
      pingCanaryBeacon('audit_run', { mode, targetPlatform, provider, score: result.score });

      // 8. Print report
      displayResults(result, {
        projType,
        projectName: pubspec.name,
        provider,
        model,
        mode,
        targetPlatform,
      });

      // 9. Track and exit
      trackEvent('audit_completed', {
        source: 'cli', mode, targetPlatform, provider, model,
        project_type: projType, score: result.score,
        duration_ms: Date.now() - startTime,
        tokens_input: result._tokens?.actual?.input ?? null,
        tokens_output: result._tokens?.actual?.output ?? null,
      });

      // 9.5 Collect training data (private, fire-and-forget)
      collectTrainingData({
        scanData: {
          files,
          exampleFiles,
          permissions: plistData.permissions,
          androidPermissions: manifestData.permissions,
          pubspec,
          hasPlist: (targetPlatform === 'ios' || targetPlatform === 'both') ? plistData.found : undefined,
          hasManifest: (targetPlatform === 'android' || targetPlatform === 'both') ? manifestData.found : undefined,
          projType,
        },
        result,
        config: { provider, model, mode, targetPlatform, projType },
        durationMs: Date.now() - startTime,
        source: 'cli',
      });

      process.exitCode = result.score === 'FAIL' ? 1 : 0;
    } catch (err) {
      spinner.fail(chalk.red(err.message));
      trackEvent('audit_error', {
        source: 'cli', mode, targetPlatform, provider, model,
        duration_ms: Date.now() - startTime,
        error_message: err.message.slice(0, 200),
      });
      process.exitCode = 1;
    }
  });

program.parse();
