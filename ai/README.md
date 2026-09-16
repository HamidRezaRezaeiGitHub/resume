# AI agent pack

Adapted from BuyOrRent's installed man-agent-ment pack 0.4.12. `ai/pack.yaml`
records upstream provenance and this project's adaptation revision.

Start with [AGENTS.md](../AGENTS.md) and
[workflow dispatch](workflows/workflow-dispatch.md). Durable project facts live
in the [wiki](../wiki/index.md); local task state lives in ignored `requirements/`.

```sh
ai/scripts/start-requirement.sh "Requirement title"
ai/scripts/start-requirement.sh --stay-on-current-branch "Requirement title"
ai/scripts/list-requirements.sh --open
ai/scripts/list-requirements.sh --stats
npm run check:ai
```

The default setup creates `codex/<slug>` from `master`; use the explicit
stay flag when existing user instructions authorize the current branch.
It never fetches, commits, pushes, or deploys. Do not run it just for a typo.

Shared [handoff](skills/handoff/SKILL.md) and
[interview-questions](skills/interview-questions/SKILL.md) skills have thin native
adapters. Reusable [session prompts](prompts/session/) cover starting, planning,
continuing, reviewing, and summarizing local requirements.

See [AI pack maintenance](../wiki/guides/ai-pack.md) for native discovery paths,
hook behavior, intentionally omitted backend surfaces, checks, and upgrade rules.
