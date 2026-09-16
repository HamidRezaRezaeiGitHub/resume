---
title: AI pack maintenance
domain: guides
tags: [agents, hooks, requirements, tooling]
status: current
last_updated: 2026-09-16
---

# AI pack maintenance

The shared pack comes from BuyOrRent's installed man-agent-ment 0.4.12, adapted
for this static React site. [Pack metadata](../../ai/pack.yaml) records the
upstream version separately from the local adaptation revision.

## Native entry points

| Tool           | Entry points                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Codex          | `AGENTS.md`, `.agents/skills/`, `.codex/hooks.json`                                                               |
| Claude Code    | `CLAUDE.md`, `.claude/commands/start-requirement.md`, `.claude/skills/`, `.claude/settings.json`                  |
| Gemini CLI     | `GEMINI.md`, `.gemini/skills/`, `.gemini/settings.json`                                                           |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/`, `.github/skills/`, `.github/hooks/wiki-reminder.json` |

Native adapters point to shared workflows/skills under `ai/`; they do not own
separate copies of project policy. Codex uses `.agents/skills` according to its
[skill discovery documentation](https://learn.chatgpt.com/docs/build-skills).
Its project hooks use the current `timeout` field; the
[hook documentation](https://learn.chatgpt.com/docs/hooks) explains project and
hook trust. Installing files does not grant that trust automatically.

The read-only hooks add a short wiki reminder at prompt/session or subagent
start. They never modify files, grant permissions, spawn agents, commit, or
deploy. Node serializes the output; no npm install is needed to run the hook.
Shared instructions still work if a client disables hooks or Node is absent.
Claude, Gemini, and Copilot adapters follow their respective
[Claude hook](https://code.claude.com/docs/en/hooks),
[Gemini hook](https://geminicli.com/docs/hooks/reference/), and
[Copilot hook](https://docs.github.com/en/copilot/reference/hooks-reference)
formats. The scripts target POSIX shells on macOS/Linux.

## Local requirements

Use [workflow dispatch](../../ai/workflows/workflow-dispatch.md) first. Small
edits do not require a workspace. For substantial work:

```sh
ai/scripts/start-requirement.sh "Requirement title"
ai/scripts/start-requirement.sh --stay-on-current-branch "Requirement title"
ai/scripts/list-requirements.sh --open
ai/scripts/list-requirements.sh --stats
ai/scripts/lint-requirements.sh
```

The default branch is `codex/<slug>`, based on local `master` (or
`origin/master` if no local branch exists). `REQUIREMENT_BASE_BRANCH` overrides
the base. The script does not fetch; verify the base is appropriate before
starting. It supports regular clones and Git worktrees, refuses to switch a
dirty tracked tree, and checks an existing plan's expected branch.
Use the stay flag when authorized to remain on the current branch.

`requirements/` is ignored by Git and Prettier. PLAN and FINDINGS hold local
status, evidence, validation, and next steps. The generic Phase 0 and closing
checks remain available; trim irrelevant middle phases. Commit durable facts
to the wiki instead of committing working notes.

## Intentional adaptations

- Frontend/content guidance replaces TypeScript/Hono/MCP adapters. No backend
  financial wiki, HTTP examples, secrets, server configuration, or sibling
  requirement history was copied.
- System overview combines stack, data flow, and integrations. Content
  vocabulary lives in the resume guide rather than a separate domain glossary.
- Existing project evidence and the application review moved into the wiki.
  The completed root plan became a local archived requirement.
- `ci-cd.instructions.md` and `testing.instructions.md` retain the source
  project's adapter names. Do not install duplicates under alternative names.
- Existing authorization overrides generic approval prompts. Pack changes do
  not authorize production deployment or autonomous subagent creation.

## Validation and upgrades

Run `npm run check:ai`. The adoption audit checks the installed file manifest
and executable scripts; the wiki linter checks metadata, file links, index
entries, and unfinished placeholders. Behavioral tests cover requirement
setup/resume, branch safety, worktrees, hooks, and broken documentation. Native
hook commands are exercised locally; this does not prove every client has
enabled or trusted them. Application checks remain in the
[testing guide](testing.md).

For an upgrade, compare the source pack with this adaptation before copying.
Manually merge native settings/hooks; preserve local permissions, hooks, agent
skills, workflow overrides, and GitHub delivery files. Update the checked-in
`ai/manifest.txt` when intentionally adding/removing an installed surface.
Keep provenance accurate and run the full gate after executable/config changes.
