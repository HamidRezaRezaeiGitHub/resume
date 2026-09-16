---
name: pre-commit-validation
use_when: Before a commit or reporting implementation complete.
---

# Pre-commit validation

Run the repository gate from the root, in this order:

```sh
npm run check:ai
npm run typecheck
npm run lint
npm run format:check
npm run test:ci
npm run build
```

These commands match the reusable CI checks and the build used by deployment
jobs. See `wiki/guides/testing.md` for focused tests and browser checks.
For a docs-only follow-up after a green gate, repeat affected pack/link/format
checks; repeat broader checks only if code/config or unresolved failures warrant it.
Honor a user's explicit request for a full gate.

Read and fix failures without weakening validation. Format changed files rather
than unrelated work. Do not pipe a check into a command that hides its exit code.
If access or the environment prevents a check, report it as incomplete.

Review the final diff for scope, secrets, local requirement notes, generated
assets, and unintentional dependency changes. Perform both review passes from
`ai/workflows/code-review.md`. Update the wiki and local handoff state.
Commit/push only as authorized, then check the workflow for that commit before
claiming CI or UAT succeeded. Production is a separate, explicit action.
