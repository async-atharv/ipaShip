#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
#  ipaShip — One-line installer
#  curl -fsSL https://raw.githubusercontent.com/async-atharv/ipaShip/main/scripts/install.sh | bash
# ──────────────────────────────────────────────────────────────
set -euo pipefail

VERSION="${IPASHIP_VERSION:-latest}"
BOLD="\033[1m"
GREEN="\033[32m"
CYAN="\033[36m"
YELLOW="\033[33m"
RED="\033[31m"
DIM="\033[2m"
RESET="\033[0m"

header() { echo -e "\n${BOLD}${CYAN}  ▸ $1${RESET}"; }
success() { echo -e "  ${GREEN}✔${RESET} $1"; }
warn() { echo -e "  ${YELLOW}⚠${RESET} $1"; }
fail() { echo -e "  ${RED}✖ $1${RESET}" >&2; exit 1; }

echo -e "\n${BOLD}  ipaShip Installer${RESET}"
echo -e "${DIM}  AI-powered App Store compliance audit${RESET}\n"

# ── Check prerequisites ──────────────────────────────────────
header "Checking prerequisites"

if ! command -v node &>/dev/null; then
  fail "Node.js is not installed. Install Node.js 18+ from https://nodejs.org"
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  fail "Node.js $NODE_VERSION detected. ipaShip requires Node.js 18+."
fi
success "Node.js $(node -v)"

if ! command -v npm &>/dev/null; then
  fail "npm is not installed."
fi
success "npm $(npm -v)"

# ── Install ──────────────────────────────────────────────────
header "Installing ipaShip"

if [ "$VERSION" = "latest" ]; then
  npm install -g @async-atharv/ipaship
else
  npm install -g "@async-atharv/ipaship@$VERSION"
fi

# ── Verify ───────────────────────────────────────────────────
header "Verifying installation"

if command -v ipaShip &>/dev/null; then
  success "ipaShip $(ipaShip --version 2>/dev/null || echo 'installed')"
else
  warn "ipaShip binary not found in PATH. You may need to configure your npm global bin directory."
fi

if command -v ipaShip-mcp &>/dev/null; then
  success "ipaShip-mcp (MCP server)"
fi

echo -e "\n${BOLD}${GREEN}  Done!${RESET}\n"
echo -e "${DIM}  Get started:${RESET}"
echo -e "    ${CYAN}ipaShip init${RESET}          ${DIM}# configure provider & API key${RESET}"
echo -e "    ${CYAN}ipaShip --dir ./${RESET}      ${DIM}# audit your Flutter project${RESET}"
echo ""
