---
name: command-execution
use_when: Running terminal commands.
---

# Command execution

Use narrow searches (`rg`, `rg --files`) and bounded output. Run independent
reads/checks together when safe, but serialize mutations and dependent work.
Preserve current processes and unrelated files.

Keep each command's exit status. Avoid `command | tail` for a required gate
unless the shell has pipefail enabled. Prefer redirecting to a temporary log,
checking the original status, then reading the useful lines. Read enough of a
failure to understand it; narrow a rerun by file or test when possible.

Quote paths and arguments. Treat shell text as code; JSON encoding is not shell
escaping. Do not print secrets. Use temporary files for multiline CLI bodies.
Use normal tool escalation when permissions block required work; do not bypass
sandbox restrictions. Summarize results rather than pasting complete logs.
