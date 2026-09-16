---
name: protected-boundaries
use_when: Editing shared configuration, agent hooks, public content, or deployment settings.
---

# Protected boundaries

Use existing user authorization. A file appearing here means inspect its wider
impact; it does not mean asking again for an already authorized change.

| Boundary                                                            | Required care                                                                                                                                              |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wrangler.jsonc`, `.github/workflows/`                              | Preserve environment separation. Confirm the intended branch, route, and trigger. Do not deploy production without an explicit production request.         |
| `AGENTS.md`, native settings/hooks, `ai/`                           | Preserve current user instructions and tool settings. Keep adapters thin; validate hooks and scripts. Never import credentials or broad permission grants. |
| `src/data/resume.json`, evidence, public assets                     | Preserve factual accuracy and publication scope. Do not infer employer metrics or publish private source material.                                         |
| `index.html`, `public/theme.js`, `src/main.tsx`                     | Verify bootstrap, metadata, accessibility, and both themes when changed.                                                                                   |
| Schema, package scripts/dependencies, TypeScript/Vite/ESLint config | Review all affected consumers and run the complete validation gate.                                                                                        |

Ordinary component, styling, test, and wiki edits can proceed within task scope.
Do not use instruction maintenance to overwrite deployment workflows or personal
settings wholesale. Add dependencies or shared abstractions only for a concrete need.

If authorization is genuinely missing for a consequential action, finish the
safe preparatory work, show the concrete change, and ask only about that action.
Follow `ai/workflows/pre-commit-validation.md` before commit/completion.
