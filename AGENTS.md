# AGENTS.md

Canonical agent instructions. `CLAUDE.md`, `GEMINI.md`, and
`.github/copilot-instructions.md` point here.

## Start here

- Classify the task with `ai/workflows/workflow-dispatch.md`; use only the
  workflows it routes to. Small edits do not need a requirement workspace.
- For substantial work, resume or create local `requirements/<slug>/PLAN.md`
  and `FINDINGS.md` using `ai/workflows/requirement-planning.md`. Read those
  before repeating research. Honor explicit branch/workspace instructions.
- Start project lookup at `wiki/index.md`; check `wiki/log.md` for recent changes.
  The wiki owns durable project knowledge; requirement files own task state.
- Inspect the current branch, working tree, and relevant files before editing.
  Preserve unrelated changes and existing processes.

## Project guidance

- React, TypeScript, component boundaries, themes, animation, and accessibility:
  `wiki/guides/react-typescript.md`.
- Resume facts, writing, dates, and the editable JSON contract:
  `wiki/guides/resume-content.md`. Do not invent dates, impact, or credentials.
- Tests and visual checks: `wiki/guides/testing.md` and
  `ai/workflows/testing-quality.md`.
- Branches, environments, CI, and deployment:
  `wiki/operations/ci-cd-and-deployment.md`.
- Wiki changes: `ai/workflows/wiki-documentation.md`.
- Project guidance takes precedence over generic pack examples. This is a
  static React site; descriptions of backend projects are resume content,
  not services implemented in this repository.

## Completion and boundaries

- Read `ai/workflows/protected-boundaries.md` for shared configuration, agent
  hooks, public content, or deployment changes. Existing user authorization
  applies; do not ask for the same approval again.
- Follow `ai/workflows/pre-commit-validation.md` before committing or declaring
  implementation complete. Update relevant wiki pages when behavior changes.
- Commit and push only within the user's authorized scope. Pushing `master`
  normally deploys UAT; production requires an explicit production request.
- Never commit credentials, machine-specific settings, local requirement notes,
  or private employer material.
