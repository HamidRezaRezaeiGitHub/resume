---
title: System overview
domain: architecture
tags: [react, static-site, content, data-flow]
status: current
last_updated: 2026-09-16
---

# System overview

This is a single-page resume. React renders a hero, one timeline containing
professional roles, personal projects, education and teaching, a filterable
toolkit, and contact links. Cloudflare serves the compiled static assets; there
is no application API, database, authentication service, or MCP server here.

## Stack and runtime

Vite builds React 19 and strict TypeScript. Styling combines Tailwind v4 with
custom CSS. Motion handles scroll effects; Lucide provides icons. Vitest and
Testing Library run in jsdom. ESLint, Prettier, and TypeScript form the quality
gate. Zod validates the editable content during development/build checks.
Use the Node version in `.nvmrc` and dependency versions in `package-lock.json`.

`index.html` loads `public/theme.js` before React for the initial theme.
`src/main.tsx` mounts the app. The [deployment guide](../operations/ci-cd-and-deployment.md)
describes the static-assets Worker and environment routes.

## Content flow and ownership

1. `src/data/resume.json` contains public copy, dates, links, skills, and the
   selected current role. `src/data/resume.schema.ts` defines its contract.
2. `validate:content` runs the schema checks before `dev` and `build`. The
   content module exposes typed data; Zod is not shipped to the browser.
3. `src/lib/dates.ts` and `src/lib/timeline.ts` format and order entries.
4. `Timeline` resolves data and order. `TimelineItem` composes each chapter;
   `TimelineHeading` renders its heading and `TimelineAchievement` owns
   achievement motion. Children receive explicit props.
5. CSS controls reading density and responsive layout. Motion changes
   presentation without creating artificial reading distance.

Use the [content guide](../guides/resume-content.md) before changing the JSON
contract, publication scope, date precision, or timeline ordering.

## Source map

| Path                       | Responsibility                                                |
| -------------------------- | ------------------------------------------------------------- |
| `src/components/`          | Page sections, navigation, and shared presentation            |
| `src/components/timeline/` | Timeline chapters, headings, and achievements                 |
| `src/hooks/`               | Browser behavior such as theme preference                     |
| `src/data/`                | Editable content, schema, typed exports, and validation tests |
| `src/lib/`                 | Pure date/ordering helpers and utilities                      |
| `src/index.css`            | Theme tokens, responsive layout, and visual styling           |
| `public/`                  | Public assets, including the pre-paint theme bootstrap        |
| `ai/`                      | Shared agent workflows, scripts, skills, and templates        |
| `wiki/`                    | Durable project knowledge; never imported into the page       |

## Browser integrations

Theme preference uses local storage with system preference as the default and
a fallback when storage is unavailable. Navigation uses an intersection
observer; effects clean up listeners and observers. Contact copying handles
clipboard failure. Contact and project links lead to external destinations.
No secret belongs in browser code or Vite-exposed configuration.
