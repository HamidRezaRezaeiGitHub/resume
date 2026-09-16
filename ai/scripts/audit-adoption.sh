#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd "$(dirname "$0")" && pwd)
cd "$SCRIPT_DIR/../.."
status=0
count=0
while IFS= read -r path; do
  [ -n "$path" ] || continue
  count=$((count + 1))
  if [ ! -f "$path" ]; then
    echo "missing $path"
    status=1
  fi
done < ai/manifest.txt

for path in ai/scripts/*.sh; do
  if [ ! -x "$path" ]; then
    echo "missing executable bit: $path"
    status=1
  fi
done

if [ "$status" -eq 0 ]; then
  echo "Adoption audit passed: $count installed files."
fi
exit "$status"
