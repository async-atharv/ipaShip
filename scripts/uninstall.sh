#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
#  ipaShip — Uninstaller
# ──────────────────────────────────────────────────────────────
set -euo pipefail

BOLD="\033[1m"
GREEN="\033[32m"
RED="\033[31m"
DIM="\033[2m"
RESET="\033[0m"

echo -e "\n${BOLD}  ipaShip Uninstaller${RESET}\n"

if npm list -g @async-atharv/ipaship &>/dev/null; then
  npm uninstall -g @async-atharv/ipaship
  echo -e "  ${GREEN}✔${RESET} @async-atharv/ipaship removed"
else
  echo -e "  ${DIM}@async-atharv/ipaship not found globally${RESET}"
fi

# Clean up config files
if [ -f "$HOME/.ipaShip" ]; then
  read -p "  Remove ~/.ipaShip config? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm "$HOME/.ipaShip"
    echo -e "  ${GREEN}✔${RESET} ~/.ipaShip removed"
  fi
fi

echo -e "\n${GREEN}  Done.${RESET}\n"
