---
allowed-tools: Bash(ai/scripts/start-requirement.sh:*), Bash(git branch:*), Bash(git status:*), Read, Edit
description: Start or resume a local requirement workspace following the canonical planning workflow.
---

# Start requirement

Follow `ai/workflows/requirement-planning.md` for `$ARGUMENTS`.
Inspect the branch and working tree first. Use existing user branch instructions;
when staying in the current checkout is authorized, pass `--stay-on-current-branch`.
Otherwise the script defaults to `codex/<slug>` from `master`.
Read the resulting PLAN.md and FINDINGS.md, replace placeholders, and continue.
