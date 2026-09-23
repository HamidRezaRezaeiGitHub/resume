---
title: React and TypeScript guide
domain: guides
tags: [react, typescript, accessibility, motion]
status: current
last_updated: 2026-09-23
---

# React and TypeScript

## Development

Use the Node version in `.nvmrc`, then run `npm ci` and `npm run dev`.
`npm run build` validates content, checks types, and creates `dist/`;
`npm run preview` serves that production build locally. Follow the
[testing guide](testing.md) for the complete quality gate.

## Component boundaries

- Keep components focused on one rendering or interaction concern. Compose
  sections from typed props instead of importing global content in every child.
- Keep date formatting and timeline ordering in pure helpers. Keep static
  content in `src/data/resume.json` with its [schema](resume-content.md).
- Keep state close to its consumers; derive values instead of duplicating
  state. Prefer discriminated unions and exhaustive category mappings to casts.
- Effects synchronize with browser APIs. Clean up observers/listeners, handle
  blocked browser storage or clipboard access, and respect React Strict Mode.
- Reuse established technology-list and category-icon renderers. Extract a
  shared abstraction when there is a real second caller, not for hypothetical
  extension points. SOLID principles guide responsibility and dependency
  boundaries; they do not require classes in this React app.
- Keep strict TypeScript enabled. Fix type mismatches at their source rather
  than adding `any`, non-null assertions, or double casts.

## Styling and motion

Use existing CSS variables for both themes. `src/index.css` is the responsive
layout authority; Tailwind scans `src/` so wiki and agent examples do not add
styles to the browser bundle. Use system fonts and preserve narrow-phone layouts.

Keep the hero at the top and toolkit/contact at the bottom. All dated career
and project content belongs on the unified timeline. Sticky headings must
release at the end of their chapter and remain usable on short screens.
Use content-driven spacing; do not add viewport-height padding to make effects
last longer. Scroll motion should not trap navigation or gate access to copy.

The accepted design is the original production presentation from `f9d2152`:
highlights use a subtle vertical reveal and opacity change, with sticky entry
headings and compact, content-driven spacing. The static list item measures
scroll progress while its content transforms. Reduced motion and print retain
readable static content. The slide/tilt and stacked-card experiments were
declined on September 23 and are not part of the maintained release.

## Accessibility and phone review

Use semantic headings, lists, buttons, links, labels, and visible keyboard focus.
Category labels and icons supplement color. Keep touch targets comfortable;
check menu Escape/focus behavior and section anchors below the fixed navigation.
Both themes must remain readable. Support reduced motion throughout and keep
the decorative pause control effective. Review visual changes on phones and
desktop, including short landscape screens, using the [browser checklist](testing.md).
