#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd "$(dirname "$0")" && pwd)
HELPER="$SCRIPT_DIR/wiki-reminder-context.sh"
[ -x "$HELPER" ] || exit 0
# Instructions still work without hook support or a Node runtime.
command -v node >/dev/null 2>&1 || exit 0
context=$("$HELPER")
[ -n "$context" ] || exit 0

printf '%s' "$context" | node --input-type=module -e '
import { readFileSync } from "node:fs";
const context = readFileSync(0, "utf8");
const [event, mode] = process.argv.slice(1);
const result = mode === "copilot"
  ? { additionalContext: context }
  : { hookSpecificOutput: { hookEventName: event, additionalContext: context } };
process.stdout.write(JSON.stringify(result) + "\n");
' "${1:-UserPromptSubmit}" "${2:-native}"
