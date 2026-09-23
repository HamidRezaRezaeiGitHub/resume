---
title: React and TypeScript development
domain: guides
tags: [react, typescript, themes, accessibility]
status: current
last_updated: 2026-09-23
---

# React and TypeScript

Use the Node version in `.nvmrc`, then `npm ci` and `npm run dev`.
`npm run build` validates content, checks types and creates `dist/`;
`npm run preview` serves it. Follow the [testing guide](testing.md) for the gate.

## Component boundaries

- Keep public copy in [the JSON contract](resume-content.md). Section components
  select content; the shared `ResumeEntry` receives typed presentation props.
- Keep date formatting in pure helpers. Entries render in the authored JSON
  order rather than sorting professional roles together with projects.
- State belongs near its consumers: theme and clipboard status.
  Effects synchronize browser APIs and clean up listeners.
- Prefer composition and real shared callers over classes, dependency containers
  or speculative abstractions. Maintain strict TypeScript without `any` or
  double casts. Build validation keeps malformed content out of releases.

## Layout and interaction

The current design is a minimal resume with Summary, Experiences, Projects,
Skills, Education and Let's Talk. Neutral theme tokens, serif display headings,
plain bullets, compact spacing and thin rules establish hierarchy. No category
colors, sticky entry headings, floating skill cloud or scroll-linked reveals.

The fixed navigation exposes all four middle-section links on every viewport.
On phones the links occupy a second row; there is no hamburger menu. Native
fragment links support direct URLs, browser history and smooth scrolling.
Focusable section targets preserve keyboard context; scroll padding keeps them
below the fixed header. There is no scroll-spy state or scroll event listener.

All content remains readable without animation. Smooth scrolling respects reduced
motion; there is no looping animation or pause control. Print uses static,
light-colored content without navigation. The declined animation experiments
are historical branches, not maintained presentation variants.

## Accessibility and review

Use semantic sections, headings, lists, description lists, time elements, links,
buttons and visible keyboard focus. Keep phone touch targets comfortable and
prevent horizontal overflow. Theme selection must work when storage is blocked;
email links must still work when clipboard access fails. Test light/dark,
narrow phones and short landscape using the [browser checklist](testing.md).
