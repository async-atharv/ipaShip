#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
#  ipaShip — CI/CD Runner Script
#  Drop this into any pipeline to run a compliance audit.
#
#  Usage:
#    ./scripts/run-audit.sh [OPTIONS]
#
#  Environment Variables (all optional, flags take precedence):
#    IPASHIP_DIR         Project directory          (default: ./)
#    IPASHIP_PROVIDER    gemini | claude             (default: gemini)
#    IPASHIP_MODEL       Model override              (default: per provider)
#    IPASHIP_PLATFORM    ios | android | both        (default: both)
#    IPASHIP_MODE        store | code | both         (default: both)
#    IPASHIP_KEY         API key
#    GEMINI_API_KEY      Gemini API key fallback
#    ANTHROPIC_API_KEY   Claude API key fallback
#
#  Exit codes:
#    0  All checks passed
#    1  Audit found failures or script error
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

# ── Defaults from env ────────────────────────────────────────
DIR="${IPASHIP_DIR:-.}"
PROVIDER="${IPASHIP_PROVIDER:-gemini}"
MODEL="${IPASHIP_MODEL:-}"
PLATFORM="${IPASHIP_PLATFORM:-both}"
MODE="${IPASHIP_MODE:-both}"
KEY="${IPASHIP_KEY:-}"

# ── Parse CLI overrides ──────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir)      DIR="$2"; shift 2 ;;
    --provider) PROVIDER="$2"; shift 2 ;;
    --model)    MODEL="$2"; shift 2 ;;
    --platform) PLATFORM="$2"; shift 2 ;;
    --mode)     MODE="$2"; shift 2 ;;
    --key)      KEY="$2"; shift 2 ;;
    --help|-h)
      echo "Usage: $0 [--dir PATH] [--provider gemini|claude] [--model MODEL] [--platform ios|android|both] [--mode store|code|both] [--key API_KEY]"
      exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# ── Resolve API key ──────────────────────────────────────────
if [ -z "$KEY" ]; then
  case "$PROVIDER" in
    gemini)  KEY="${GEMINI_API_KEY:-}" ;;
    claude)  KEY="${ANTHROPIC_API_KEY:-}" ;;
  esac
fi

if [ -z "$KEY" ]; then
  fail "No API key found. Set IPASHIP_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY."
fi

# ── Banner ───────────────────────────────────────────────────
echo -e "\n${BOLD}  ipaShip CI Audit${RESET}"
echo -e "${DIM}  ────────────────────────────────${RESET}"
echo -e "  ${DIM}Directory :${RESET} ${DIR}"
echo -e "  ${DIM}Provider  :${RESET} ${PROVIDER}"
echo -e "  ${DIM}Model     :${RESET} ${MODEL:-default}"
echo -e "  ${DIM}Platform  :${RESET} ${PLATFORM}"
echo -e "  ${DIM}Mode      :${RESET} ${MODE}"
echo -e "${DIM}  ────────────────────────────────${RESET}"

# ── Ensure ipaShip is available ──────────────────────────────
header "Checking ipaShip"

if command -v ipaShip &>/dev/null; then
  success "ipaShip found: $(which ipaShip)"
else
  warn "ipaShip not found globally. Using npx."
  NPX_MODE=true
fi

# ── Run the audit ────────────────────────────────────────────
header "Running audit"

CMD_ARGS=(--dir "$DIR" --provider "$PROVIDER" --platform "$PLATFORM" --mode "$MODE" --key "$KEY")
if [ -n "$MODEL" ]; then
  CMD_ARGS+=(--model "$MODEL")
fi

if [ "${NPX_MODE:-false}" = "true" ]; then
  npx --yes @async-atharv/ipaship "${CMD_ARGS[@]}"
else
  ipaShip "${CMD_ARGS[@]}"
fi

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo -e "\n${BOLD}${GREEN}  ✔ Audit passed${RESET}\n"
else
  echo -e "\n${BOLD}${RED}  ✖ Audit failed (exit code $EXIT_CODE)${RESET}\n"
fi

exit $EXIT_CODE
