#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd "$(dirname "$0")" && pwd)
cd "$SCRIPT_DIR/../.."

for script in ai/scripts/*.sh; do
  sh -n "$script"
done
ai/scripts/audit-adoption.sh
ai/scripts/wiki-lint.sh --strict-placeholders
ai/scripts/lint-requirements.sh
node --test ai/tests/pack.mjs
