---
name: testing-quality
use_when: Creating, editing, reviewing, or validating tests.
---

# Testing Quality Workflow

Use this workflow when creating, editing, reviewing, or validating tests.

## Context First

Before writing tests:

1. Read `wiki/index.md` if it exists.
2. Read any wiki page about testing, quality, architecture, domain behavior, or the feature under test.
3. Review nearby existing tests for local patterns and utilities.
4. Inspect source code narrowly after the wiki and existing tests establish context.

If the project has no testing wiki page and the work is test-heavy, consider creating or updating one.

## QA Mindset

Act like a critical QA engineer, not a test-count maximizer.

Tests should try to catch real bugs:

- important happy paths,
- edge cases and boundary values,
- invalid inputs and error paths,
- authorization or permission boundaries,
- state transitions,
- persistence or serialization behavior,
- concurrency, ordering, timing, or async behavior when relevant,
- regressions implied by the requirement.

## Avoid Low-Value Tests

Do not add tests that mainly verify:

- the programming language works,
- the framework behaves as documented,
- mocks return values they were configured to return,
- trivial getters/setters with no behavior,
- implementation details that can change without changing behavior.

## Integrity Rules

- A test exposing a real bug should fail until the bug is fixed.
- Do not silently skip, weaken, or rewrite a failing test just to pass.
- Do not update expected values without understanding whether behavior intentionally changed.
- Prefer deterministic tests over sleeps, fixed delays, real clocks, or external services.
- Name tests for behavior and condition, not implementation mechanics.

## Coverage Strategy

Start from the risk created by the requirement. Cover behavior that could break, not every line mechanically.

For each meaningful change, ask:

- What should now work?
- What should still be rejected?
- What boundary might be mishandled?
- What existing behavior must not regress?
- What integration boundary is most likely to fail?

## Running Tests

Use project-specific commands discovered from docs, package scripts, or CI configuration.

Use `ai/workflows/command-execution.md` for concise output. If tests fail and filtered output is insufficient, rerun the failing file, test name, package, or full command with enough output to debug.

Before finalizing test-related work, use `ai/workflows/code-review.md` to review whether tests cover meaningful behavior and whether any failing tests were weakened or skipped.
