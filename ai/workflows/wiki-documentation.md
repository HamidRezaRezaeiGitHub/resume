---
name: wiki-documentation
use_when: Reading, maintaining, or promoting durable project knowledge.
---

# Wiki documentation

Start at `wiki/index.md`; read only the pages relevant to the task. The wiki
owns stable project knowledge. Code/config remain the implementation authority.
Task-specific or tentative discoveries belong in local `FINDINGS.md` first.

Promote reusable discoveries into existing wiki pages: architecture boundaries,
content rules, validation commands, delivery behavior, and recurring failure
modes. Do not publish raw logs, transient task notes, or speculative claims.

## Keep this wiki small

The system overview combines stack, data flow, and browser integrations. The
content guide owns timeline vocabulary and public copy rules. Add another page
only when it helps readers find a substantial distinct topic. There is no need
for backend API documentation or a financial domain glossary in this site.

## Topic pages

Use `ai/templates/wiki/page.md`, with frontmatter fields `title`, `domain`,
`tags`, `status`, and `last_updated`. Domain matches the folder; status is
current, draft, or stale. Index/log can omit frontmatter.

When meaningful knowledge changes:

1. Update the owning page, date, and inline relative links.
2. Update `wiki/index.md` so it lists every topic page with a short summary.
3. Append a dated entry to `wiki/log.md` using action create, update, ingest,
   lint, or query. Keep historical evidence identified as historical.
4. Run `ai/scripts/wiki-lint.sh --strict-placeholders` or `npm run check:ai`.

Keep pages concise and factual. Do not duplicate project facts in AGENTS,
README, native adapters, or workflow files. Link to their owning wiki page.
If a task produces no durable knowledge change, record that briefly in its plan.
