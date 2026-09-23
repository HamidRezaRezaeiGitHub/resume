---
title: System overview
domain: architecture
tags: [react, static-site, content, data-flow]
status: current
last_updated: 2026-09-23
---

# System overview

This static React resume presents Summary, Experiences, Projects, Skills,
Education and Let's Talk. Cloudflare serves compiled assets; there is no API,
database, authentication service or MCP server in this repository.

## Runtime

Vite builds React 19 and strict TypeScript. Tailwind v4 and custom CSS provide
styling; Lucide supplies icons. Vitest/Testing Library run in jsdom. Zod validates
editable content at build time. Use versions in `.nvmrc` and the lockfile.
The current design has no Motion runtime imports or scroll-linked animations.
Skills uses `d3-force` for a bounded deterministic layout, then SVG and native
Pointer Events for interaction; no continuously running physics simulation.

`index.html` loads `public/theme.js` for the initial theme before React mounts
through `src/main.tsx`. Theme colors in CSS, the bootstrap and `useTheme` agree.
See the [deployment guide](../operations/ci-cd-and-deployment.md) for routes.

## Content flow

1. `src/data/resume.json` owns identity, copy, dates, links, entries and skills.
2. `resume.schema.ts` validates before dev/build and in CI. The typed
   `resume.ts` export uses a build-validated cast, keeping Zod out of the browser.
3. `App` composes six sections. Experiences, Projects and Education map their
   authored lists to a shared `ResumeEntry` with explicit typed props.
4. `ResumeEntry` renders headings, semantic dates, ordinary bullets and links.
   `src/lib/dates.ts` preserves date precision. There is no runtime sorting.
5. `src/index.css` owns compact reading density, responsive layout, themes,
   reduced-motion scrolling and print. Skills-specific CSS stays in
   `src/components/skills/skills.css`.
6. `Skills` switches between the network and a derived definition list. The
   graph module builds uniform nodes, undirected adjacency and pure camera calculations.
   `useGraphInteraction` owns node positions, camera gestures and touch capture.
   Mouse hover is transient presentation state, separate from persistent selection.
   Graph topics map to PDF/list groups through `skillCategories[].groupId`;
   `src/data/skills.ts` derives group membership and combines membership edges with
   `skillRelationships`. Total degree controls all label sizes; link forces shape
   neighborhoods without fixed topic anchors. No ambient motion loop runs.
   Observers, pointer capture and tooltip listeners clean up appropriately.

The [content guide](../guides/resume-content.md) owns fields and publication rules.

## Source map

| Path                     | Responsibility                                                    |
| ------------------------ | ----------------------------------------------------------------- |
| `src/components/`        | Sections, shared entries, navigation and contact                  |
| `src/components/skills/` | Graph model, SVG presentation, interaction hook and scoped styles |
| `src/hooks/`             | Theme preference and browser synchronization                      |
| `src/data/`              | JSON, schema, typed export and contract tests                     |
| `src/lib/`               | Pure date formatting and utilities                                |
| `src/index.css`          | Theme tokens, responsive layout and print                         |
| `public/`                | Public assets and pre-paint theme bootstrap                       |
| `ai/`                    | Agent workflows, scripts, skills and templates                    |
| `wiki/`                  | Durable project knowledge, never imported into the page           |

## Browser integrations

Theme uses local storage with a system default and graceful storage denial.
Navigation uses ordinary anchor links and focusable section targets. Contact copying handles clipboard denial. Theme preference listeners clean up. External profile/project links open their public destinations.
No secrets belong in the client or Vite-exposed configuration.
