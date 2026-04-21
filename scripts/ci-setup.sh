#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
#  ipaShip — Setup script for CI environments
#  Installs Node.js (if needed) + ipaShip in headless environments.
#
#  curl -fsSL https://raw.githubusercontent.com/async-atharv/ipaShip/main/scripts/ci-setup.sh | bash
# ──────────────────────────────────────────────────────────────
set -euo pipefail

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

echo -e "\n${BOLD}  ipaShip CI Setup${RESET}"
echo -e "${DIM}  Automated environment bootstrap for CI/CD pipelines${RESET}\n"

# ── Detect OS ────────────────────────────────────────────────
header "Detecting environment"
OS="$(uname -s)"
ARCH="$(uname -m)"
success "OS: $OS / $ARCH"

# ── Install Node if missing ──────────────────────────────────
if ! command -v node &>/dev/null; then
  header "Installing Node.js 20 LTS"
  case "$OS" in
    Linux)
      if command -v apt-get &>/dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
      elif command -v yum &>/dev/null; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
        yum install -y nodejs
      elif command -v apk &>/dev/null; then
        apk add --no-cache nodejs npm
      else
        fail "Unsupported Linux distro. Install Node.js 18+ manually."
      fi
      ;;
    Darwin)
      if command -v brew &>/dev/null; then
        brew install node@20
      else
        fail "Install Homebrew first: https://brew.sh"
      fi
      ;;
    *)
      fail "Unsupported OS: $OS"
      ;;
  esac
  success "Node.js $(node -v) installed"
else
  NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -lt 18 ]; then
    warn "Node.js v$(node -v) is too old. ipaShip requires 18+."
  else
    success "Node.js $(node -v) (already installed)"
  fi
fi

# ── Install ipaShip ──────────────────────────────────────────
header "Installing ipaShip"
npm install -g @async-atharv/ipaship
success "ipaShip $(ipaShip --version 2>/dev/null || echo 'installed')"

echo -e "\n${BOLD}${GREEN}  ✔ CI environment ready${RESET}"
echo -e "${DIM}  Run: ipaShip --dir ./ --provider gemini --key \$GEMINI_API_KEY${RESET}\n"
