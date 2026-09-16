---
name: workflow-dispatch
use_when: Before acting on a request or switching tasks.
---

# Workflow dispatch

Choose the smallest useful process before broad source search.

- **Quick:** a question, typo, or small reversible edit. No requirement workspace
  or interview unless it resolves a real blocker.
- **Standard:** a feature, bug fix, refactor, or investigation. Use a local plan
  and findings so another session can resume.
- **Large:** multiple areas or meaningful uncertainty. Add explicit phases and
  architecture, validation, and review checkpoints.
- **Risky:** publication of private facts, secrets, deployment routes, production,
  or irreversible actions. Resolve actual authorization gaps before those actions.

Existing user authorization and branch/workspace instructions take precedence.
Do not infer permission to spawn agents merely from a large task classification.

| Situation                                      | Read                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| Standard, large, or risky work                 | `ai/workflows/requirement-planning.md`; existing PLAN.md then FINDINGS.md |
| Outcome-oriented or vague request              | `ai/workflows/vibe-coding-translation.md`                                 |
| Bug, failing check, or regression              | `ai/workflows/systematic-debugging.md`                                    |
| Component boundaries, schema, dependencies     | `ai/workflows/architecture.md`                                            |
| React, TypeScript, CSS, themes, motion         | `wiki/guides/react-typescript.md`                                         |
| Resume JSON, dates, copy, project scope        | `wiki/guides/resume-content.md`                                           |
| Tests or visual verification                   | `wiki/guides/testing.md`; `ai/workflows/testing-quality.md`               |
| Commands                                       | `ai/workflows/command-execution.md`                                       |
| Shared configuration, instructions, deployment | `ai/workflows/protected-boundaries.md`                                    |
| Durable project knowledge                      | `ai/workflows/wiki-documentation.md`                                      |
| Implementation completion                      | `ai/workflows/ci-validation.md`; `ai/workflows/code-review.md`            |
| Commit or release                              | `ai/workflows/pre-commit-validation.md`                                   |

For non-quick work, record complexity, workflows used/skipped, validation, and
any unresolved escalation trigger in the plan. Read only relevant wiki pages.
Ask only for missing information that cannot be inferred safely from context.
