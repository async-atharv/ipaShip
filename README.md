# ipaShip

[![npm version](https://img.shields.io/npm/v/@async-atharv/ipaship)](https://www.npmjs.com/package/@async-atharv/ipaship)
[![license](https://img.shields.io/npm/l/@async-atharv/ipaship)](LICENSE)

**Website:** [https://async-atharv.github.io/ipaShip/](https://async-atharv.github.io/ipaShip/)

## What is ipaShip?

**ipaShip** is an open-source, AI-powered CLI tool that audits Flutter mobile app source code against **Apple App Store Review Guidelines** and **Google Play Developer Policies**. It catches missing permissions, privacy violations, and compliance issues before you submit — preventing costly app store rejections that can delay releases by days or weeks.

ipaShip scans your Dart source files, `pubspec.yaml`, `Info.plist` (iOS), and `AndroidManifest.xml` (Android), then uses AI (Google Gemini or Anthropic Claude) to produce a structured **PASS / WARNING / FAIL** report with specific guideline citations and actionable fix suggestions.

## Features

- **Dual Store Support** — Audit against Apple App Store and Google Play, together or individually.
- **Two Audit Modes** — Store compliance, code quality, or both in a single run.
- **AI-Powered** — Choose between Google Gemini or Anthropic Claude. Bring your own API key.
- **Up-to-Date Policies** — Ships with the latest Apple and Google Play store policies. Works offline.
- **Auto-Detection** — Automatically detects project type and target platform from your project structure.
- **Zero Setup** — No compiled artifacts needed. Point it at your Flutter project and run.
- **CI-Ready** — Designed for automation. Integrates with any CI/CD pipeline.
- **Browser Version** — No install needed. Run audits directly at [async-atharv.github.io/ipaShip/app.html](https://async-atharv.github.io/ipaShip/app.html).

> **Want to publish this tool?** See the [Publishing Guide](PUBLISHING.md) for step-by-step instructions on making `ipaShip` available on NPM, PyPI, Dart Pub, Crates.io, NuGet, Go, RubyGems, PHP Composer, and Homebrew.

## How to Install ipaShip

**Node.js (NPM) — Primary**
```bash
npm install -g @async-atharv/ipaship
```
*Requires Node.js 18 or later.*

**One-line install (curl | bash)**
```bash
curl -fsSL https://raw.githubusercontent.com/async-atharv/ipaShip/main/scripts/install.sh | bash
```

**Docker (no Node.js required)**
```bash
docker run --rm -v $(pwd):/app -e GEMINI_API_KEY=xxx ipaship --dir /app
```

**Python (PyPI)**
```bash
pip install ./wrappers/python
```

**Rust (Cargo)**
```bash
cargo install --path ./wrappers/rust
```

**Go**
```bash
cd wrappers/go && go install
```

**Dart / Flutter**
Add this to your `pubspec.yaml`:
```yaml
dependencies:
  ipaship:
    path: wrappers/dart
```

**C# / .NET**
```bash
dotnet tool install --global --add-source ./wrappers/csharp ipaship
```

**macOS / Linux (Homebrew)**
```bash
brew install --build-from-source ./wrappers/homebrew/ipaship.rb
```

**Ruby (RubyGems)**
```bash
cd wrappers/ruby && gem build ipaship.gemspec && gem install ipaship-1.3.0.gem
```

**Java (Maven)**
```bash
cd wrappers/java && mvn clean package && java -jar target/ipaship-1.3.0.jar
```

**Kotlin (Gradle)**
```bash
cd wrappers/kotlin && gradle build && java -jar build/libs/ipaship-1.3.0.jar
```

**PHP (Composer)**
Add to your `composer.json` repository:
```json
{
  "repositories": [
    {
      "type": "path",
      "url": "wrappers/php"
    }
  ],
  "require": {
    "async-atharv/ipaship": "*"
  }
}
```

**Swift / Objective-C**
Include the `Package.swift` or CocoaPods `.podspec` from `wrappers/swift` or `wrappers/cocoapods`.

**C & C++**
```bash
# C
gcc -o ipaship wrappers/c/main.c && ./ipaship

# C++
g++ -std=c++17 -o ipaship wrappers/cpp/main.cpp && ./ipaship
```

## How to Use ipaShip

### Quick Start

```bash
# One-time setup — select provider, model, and enter API key
ipaShip init

# Run full audit (auto-detects platform)
ipaShip --dir ./

# iOS App Store only
ipaShip --dir ./ --platform ios --mode store

# Google Play only
ipaShip --dir ./ --platform android --mode store

# Code quality only
ipaShip --dir ./ --mode code
```

### Commands

| Command | Description |
|---------|-------------|
| `ipaShip init` | Create a `.ipaShip` config file interactively |
| `ipaShip config` | Update provider, model, or API key |
| `ipaShip --dir <path>` | Run the audit (default command) |

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--dir <path>` | Path to Flutter project root | *required* |
| `--key <key>` | API key | `.ipaShip` / env var |
| `--provider <name>` | `gemini` or `claude` | `gemini` |
| `--model <model>` | Model override | per provider |
| `--type <type>` | `app` or `package` | auto-detected |
| `--mode <mode>` | `store`, `code`, or `both` | `both` |
| `--platform <platform>` | `ios`, `android`, or `both` | auto-detected |

### Configuration

Run `ipaShip init` to create a `.ipaShip` config file, or create one manually:

```json
{
  "provider": "claude",
  "key": "sk-ant-...",
  "model": "claude-sonnet-4-6",
  "platform": "both"
}
```

The CLI looks for `.ipaShip` in two places:

1. **Project-level** — in the `--dir` path (highest priority)
2. **Global** — in your home directory `~/.ipaShip`

Resolution order: CLI flags > project `.ipaShip` > global `~/.ipaShip` > env vars > defaults.

> Add `.ipaShip` to your `.gitignore` — it contains your API key.

Use `ipaShip config` to update settings anytime.

### Supported Models

| Provider | Models |
|----------|--------|
| Claude | opus-4-6, sonnet-4-6, opus-4-5, sonnet-4-5, haiku-4-5, opus-4-1, opus-4, sonnet-4, sonnet-3-7, haiku-3-5, sonnet-3-5 |
| Gemini | 3.1-pro, 3.1-flash-lite, 3-flash, 2.5-flash, 2.5-pro, 2.5-flash-lite, 1.5-pro, 1.5-flash |

## What Does ipaShip Check?

### App Store (iOS)

| Category | Examples |
|----------|---------|
| Privacy & Permissions | Undeclared sensitive APIs, missing usage descriptions |
| Data Collection & Tracking | Tracking transparency, analytics disclosure |
| Content & Design | Minimum functionality, UI compliance |
| In-App Purchases | Payment method compliance |
| Legal & Compliance | Privacy policy, export compliance |
| Prohibited Behaviors | Dynamic code loading, hot-patching |

### Play Store (Android)

| Category | Examples |
|----------|---------|
| Permissions & Data Safety | Unnecessary permissions, data safety declarations |
| Data Collection & Privacy | Privacy policy, user data handling |
| Content & Behavior | Restricted content, deceptive behavior |
| Billing & Monetization | Payment method compliance |
| API Level & Compatibility | Target API requirements, version compatibility |
| Security & Abuse | Malware patterns, abusive behavior |

### Code Quality

| Category | Examples |
|----------|---------|
| Security | Hardcoded credentials, insecure connections |
| Architecture | State management, separation of concerns |
| Error Handling | Exception coverage, crash handling |
| Performance | Memory leaks, unnecessary rebuilds |
| Best Practices | Lifecycle handling, null safety |
| Dependencies | Outdated packages, version constraints |

### Package Auditing

| Category | Examples |
|----------|---------|
| API Surface & Documentation | Export hygiene, entry points |
| Platform Declarations | Channel consistency, missing platforms |
| Consumer Guidance | Undocumented permission requirements |
| Dependency Hygiene | Constraint quality, misplaced dependencies |
| Example App Quality | Missing or incomplete examples |

## MCP Server / Claude Skill

ipaShip includes a built-in [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server, so AI coding assistants like Claude Code, Cursor, and Windsurf can run audits directly inside your editor. This effectively makes `ipaShip` a native **Claude Skill**.

You can also use the integrated `claude_skill.json` to define it within an enterprise Skill registry.

### Step 1 — Install globally

```bash
npm install -g @async-atharv/ipaship
```

Verify: `ipaShip --version` and `which ipaShip-mcp`.

### Step 2 — Add the MCP server

**Option A: Claude Code CLI (recommended)**

```bash
# Using Claude as the AI provider
claude mcp add ipaShip \
  --transport stdio \
  --env IPASHIP_PROVIDER=claude \
  --env IPASHIP_MODEL=claude-haiku-4-5 \
  --env ANTHROPIC_API_KEY=your-api-key \
  -- ipaShip-mcp
```

```bash
# Using Gemini as the AI provider
claude mcp add ipaShip \
  --transport stdio \
  --env IPASHIP_PROVIDER=gemini \
  --env IPASHIP_MODEL=gemini-2.5-flash \
  --env GEMINI_API_KEY=your-api-key \
  -- ipaShip-mcp
```

**Option B: Manual JSON config**

Add to `~/.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "ipaShip": {
      "command": "ipaShip-mcp",
      "env": {
        "IPASHIP_PROVIDER": "claude",
        "IPASHIP_MODEL": "claude-haiku-4-5",
        "ANTHROPIC_API_KEY": "your-api-key"
      }
    }
  }
}
```

For Cursor/Windsurf, add the same config to your editor's MCP settings.

### Step 3 — Restart and verify

Restart Claude Code (or run `/mcp` in chat) to pick up the new server. You should see `ipaShip` listed with its two tools.

### Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `ipaShip_store_audit` | Run store compliance audit against Apple App Store and/or Google Play guidelines | `projectDir` (required), `platform` (optional: `ios`, `android`, `both`) |
| `ipaShip_code_review` | Run code quality and security review | `projectDir` (required) |

Both tools return structured JSON with PASS/WARNING/FAIL scores and specific guideline citations.

### Usage

Once configured, ask your AI assistant:

```
"Run a store audit on /path/to/my-flutter-app"
"Review the code quality of this Flutter project"
```

The assistant will call the appropriate ipaShip MCP tool and return the results inline.

## Shell Scripts

ipaShip ships with ready-to-use shell scripts in the `scripts/` directory:

```bash
# One-line install (curl | bash)
curl -fsSL https://raw.githubusercontent.com/async-atharv/ipaShip/main/scripts/install.sh | bash

# CI environment bootstrap (installs Node + ipaShip if missing)
curl -fsSL https://raw.githubusercontent.com/async-atharv/ipaShip/main/scripts/ci-setup.sh | bash

# Run an audit (supports env vars + CLI flags)
./scripts/run-audit.sh --dir ./ --provider gemini

# Uninstall
./scripts/uninstall.sh
```

### Shell Script — Environment Variables

The `run-audit.sh` script reads these env vars automatically (no flags needed in CI):

| Variable | Description | Default |
|----------|-------------|---------|
| `IPASHIP_DIR` | Project directory | `./` |
| `IPASHIP_PROVIDER` | `gemini` or `claude` | `gemini` |
| `IPASHIP_MODEL` | Model override | per provider |
| `IPASHIP_PLATFORM` | `ios`, `android`, or `both` | `both` |
| `IPASHIP_MODE` | `store`, `code`, or `both` | `both` |
| `IPASHIP_KEY` | API key (highest priority) | — |
| `GEMINI_API_KEY` | Gemini key fallback | — |
| `ANTHROPIC_API_KEY` | Claude key fallback | — |

CLI flags take precedence over env vars. Exit code `0` = pass, `1` = fail.

## Docker

Run ipaShip without installing Node.js on the host:

```bash
# Build the image
docker build -t ipaship .

# Audit a local project
docker run --rm \
  -v $(pwd):/app \
  -e GEMINI_API_KEY=your-key \
  ipaship --dir /app --platform ios --mode both --provider gemini --key $GEMINI_API_KEY

# Or use Docker Compose
GEMINI_API_KEY=your-key docker compose run audit
```

## CI/CD Integration

The CLI exits with code `1` on failure, making it easy to gate deployments. Ready-made pipeline templates are in `ci-templates/`.

### GitHub Actions

```yaml
# .github/workflows/ipaship-audit.yml
name: ipaShip Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        platform: [ios, android]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npx --yes @async-atharv/ipaship --dir ./ --platform ${{ matrix.platform }} --mode both --provider gemini --key ${{ secrets.GEMINI_API_KEY }}
```

### GitLab CI

```yaml
# .gitlab-ci.yml
ipaship:
  image: node:20-alpine
  script:
    - npm install -g @async-atharv/ipaship
    - ipaShip --dir ./ --platform both --mode both --provider gemini --key $GEMINI_API_KEY
```

### Bitbucket Pipelines

```yaml
# bitbucket-pipelines.yml
image: node:20
pipelines:
  default:
    - step:
        script:
          - npm install -g @async-atharv/ipaship
          - ipaShip --dir ./ --provider gemini --key $GEMINI_API_KEY
```

### Jenkins

```groovy
// Jenkinsfile
pipeline {
  agent { docker { image 'node:20-alpine' } }
  environment { GEMINI_API_KEY = credentials('gemini-api-key') }
  stages {
    stage('Audit') {
      steps { sh 'npx --yes @async-atharv/ipaship --dir ./ --provider gemini --key $GEMINI_API_KEY' }
    }
  }
}
```

### CircleCI

```yaml
# .circleci/config.yml
version: 2.1
jobs:
  audit:
    docker: [{ image: cimg/node:20.0 }]
    steps:
      - checkout
      - run: npm install -g @async-atharv/ipaship
      - run: ipaShip --dir ./ --provider gemini --key $GEMINI_API_KEY
workflows:
  main: { jobs: [audit] }
```

### Azure DevOps

```yaml
# azure-pipelines.yml
pool: { vmImage: 'ubuntu-latest' }
steps:
  - task: NodeTool@0
    inputs: { versionSpec: '20.x' }
  - script: npx --yes @async-atharv/ipaship --dir ./ --provider gemini --key $(GEMINI_API_KEY)
```

> **Full templates** with parallel platform jobs, caching, and artifact upload are in `ci-templates/`.

## Telemetry

ipaShip collects anonymous usage metrics to help improve the tool. No project data, file contents, API keys, or personally identifiable information is ever collected.

**What's collected:** audit mode, platform, provider, model, pass/fail score, duration, token counts, OS, and CLI version.

## Frequently Asked Questions

### What is ipaShip?

ipaShip is an open-source CLI tool that uses AI (Google Gemini or Anthropic Claude) to audit Flutter mobile app source code against Apple App Store Review Guidelines and Google Play Developer Policies. It catches compliance issues before you submit your app, preventing costly rejections.

### How do I install ipaShip?

Install ipaShip globally via npm: `npm install -g @async-atharv/ipaship`. Requires Node.js 18 or later. Also available via pip (Python), cargo (Rust), dart pub (Flutter), go install, gem (Ruby), brew (Homebrew), dotnet tool, Docker, and curl one-liner.

### How does ipaShip prevent App Store rejections?

ipaShip scans your Flutter project's Dart source files, pubspec.yaml, Info.plist (iOS), and AndroidManifest.xml (Android). It checks against the latest Apple and Google Play store policies for missing permissions, privacy violations, IAP compliance, prohibited behaviors, and more. Results are PASS/WARNING/FAIL with specific guideline citations and fix suggestions.

### Can I use ipaShip in CI/CD pipelines?

Yes. ipaShip is designed for CI/CD. It exits with code 1 on failure and 0 on pass, making it easy to gate deployments. Ready-made templates are provided for GitHub Actions, GitLab CI, Jenkins, CircleCI, Bitbucket Pipelines, and Azure DevOps. It also ships with shell scripts and a Docker image for containerized pipelines.

### Which AI models does ipaShip support?

ipaShip supports Google Gemini models (3.1-pro, 3.1-flash-lite, 3-flash, 2.5-flash, 2.5-pro, 2.5-flash-lite, 1.5-pro, 1.5-flash) and Anthropic Claude models (opus-4-6, sonnet-4-6, opus-4-5, sonnet-4-5, haiku-4-5, opus-4-1, opus-4, sonnet-4, sonnet-3-7, haiku-3-5, sonnet-3-5). You bring your own API key.

### Does ipaShip work with Claude Code, Cursor, or Windsurf?

Yes. ipaShip includes a built-in MCP (Model Context Protocol) server with two tools: `ipaShip_store_audit` and `ipaShip_code_review`. It integrates directly with Claude Code, Cursor, and Windsurf so AI assistants can run audits inside your editor.

### Is ipaShip free and open source?

Yes. ipaShip is free, open source, and licensed under MIT. You need your own API key for Google Gemini or Anthropic Claude to power the AI analysis.

### What does ipaShip check for iOS apps?

For iOS, ipaShip checks: Privacy & Permissions (undeclared APIs, missing NSUsageDescription), Data Collection & Tracking (ATT dialog, analytics disclosure), Content & Design (minimum functionality), In-App Purchases (StoreKit compliance), Legal & Compliance (privacy policy, export compliance), and Prohibited Behaviors (dynamic code loading, hot-patching).

### What does ipaShip check for Android apps?

For Android, ipaShip checks: Permissions & Data Safety (unnecessary permissions, data safety declarations), Data Collection & Privacy (privacy policy, user data handling), Content & Behavior (restricted content, deceptive behavior), Billing & Monetization (Google Play Billing), API Level & Compatibility (target API requirements), and Security & Abuse (malware patterns).

### How is ipaShip different from Fastlane or other tools?

Fastlane automates building and deploying iOS/Android apps. ipaShip is different — it focuses solely on **pre-submission compliance auditing** using AI. It reads your source code and checks it against store guideline policies to catch rejection-causing issues before you even build. They complement each other: use ipaShip to audit, then Fastlane to ship.

### Does ipaShip support Flutter packages and plugins?

Yes. ipaShip auto-detects Flutter packages and plugins from `flutter: plugin:` in `pubspec.yaml`. Package audits focus on API surface quality, platform declarations, consumer guidance, dependency hygiene, and example app completeness.

## License & IP Protection

**PolyForm Noncommercial License 1.0.0** — Free for personal, educational, research, and non-commercial use. Commercial use requires separate licensing.

### Source Provenance

ipaShip embeds cryptographic fingerprints and provenance markers throughout its source code and CLI output:

- **Build Fingerprints** — Every distribution carries an HMAC-SHA256 fingerprint derived from immutable origin constants.
- **Integrity Verification** — The CLI runs automated checks at startup to detect rebranding or tampering. Altered copies display a visible warning.
- **Steganographic Watermarks** — CLI output contains invisible Unicode provenance markers that prove origin authorship.
- **Per-File Fingerprints** — Each source file carries a unique `PROVENANCE_FINGERPRINT` comment that identifies it as part of the ipaShip project.

### What's Allowed

✅ Personal use, hobby projects, research, education
✅ Use by non-profits, government, and public institutions
✅ Forking and modifying for non-commercial purposes (with attribution)
✅ Contributions back to the project

### What's Not Allowed

❌ Selling ipaShip or offering it as a paid service
❌ Bundling with commercial products
❌ Rebranding or removing provenance markers
❌ Presenting the code as your own original work

For commercial licensing inquiries, contact [async-atharv on GitHub](https://github.com/async-atharv).

See [LICENSE](LICENSE) for the full text.
