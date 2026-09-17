---
title: React and TypeScript guide
domain: guides
tags: [react, typescript, accessibility, motion]
status: current
last_updated: 2026-09-16
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

The `codex/timeline-scene-transitions` experiment uses a stack of sticky cards.
Each highlight holds a reading position, then scales down and fades behind the
next. Headings rise into view and recede at chapter boundaries; outlined year
labels distinguish the desktop treatment. Card spacing follows content height.

`TimelineAchievements` measures the static list's scroll progress.
`useTimelineDeck` observes card/heading sizes; the pure `layoutTimelineDeck`
helper computes reading positions. Only the card's inner content transforms.
Tall cards expose their bottom before their exit starts. Fragment links target
the original card position rather than its already-sticky position. Observers
and listeners clean up when unmounted. Reduced motion, screens at most 600px
high, and print use normal card flow with all text visible.
The timeline subscribes to live system motion-preference changes and explicitly
resets animated values when entering the static fallback.

For the September 16 comparison, production preserves the original animation
at `f9d2152`; master/UAT contains the first slide/tilt experiment at `525105d`.
The new stack is isolated on its feature branch for DEV review. Deployment
routes and verification are documented in the [deployment guide](../operations/ci-cd-and-deployment.md).

## Accessibility and phone review

Use semantic headings, lists, buttons, links, labels, and visible keyboard focus.
Category labels and icons supplement color. Keep touch targets comfortable;
check menu Escape/focus behavior and section anchors below the fixed navigation.
Both themes must remain readable. Support reduced motion throughout and keep
the decorative pause control effective. Review visual changes on phones and
desktop, including short landscape screens, using the [browser checklist](testing.md).
