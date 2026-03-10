#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SHARED_DIR="$ROOT_DIR/templates/shared"
ROLE_DIR="$ROOT_DIR/templates/roles"
COMPANY_FILE="$ROOT_DIR/templates/companies/billybee.md"

if [[ ! -f "$COMPANY_FILE" ]]; then
  echo "Missing company overlay: $COMPANY_FILE" >&2
  exit 1
fi

write_role_file() {
  local role="$1"
  local role_file="$ROLE_DIR/$role.md"
  local out_file="$ROOT_DIR/AGENTS.$role.md"

  if [[ ! -f "$role_file" ]]; then
    echo "Missing role overlay: $role_file" >&2
    exit 1
  fi

  {
    echo "# AGENTS.$role.md"
    echo
    cat "$ROOT_DIR/AGENTS.md"
    echo
    cat "$SHARED_DIR/paperclip-invariants.md"
    echo
    cat "$SHARED_DIR/engineering-standards.md"
    echo
    cat "$SHARED_DIR/communication.md"
    echo
    cat "$COMPANY_FILE"
    echo
    cat "$role_file"
  } > "$out_file"

  echo "Generated $out_file"
}

write_role_file "founding-engineer"
write_role_file "integrations-engineer"
write_role_file "qa-demo-engineer"
