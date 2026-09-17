---
title: Testing and validation
domain: guides
tags: [vitest, validation, accessibility, responsive]
status: current
last_updated: 2026-09-16
---

# Testing and validation

Run the gate from the repository root using the Node version in `.nvmrc`:

```sh
npm run check:ai
npm run typecheck
npm run lint
npm run format:check
npm run test:ci
npm run build
```

`check:ai` checks the adopted pack, wiki, native adapter configuration, shell
syntax, and local requirement metadata. Its behavioral tests use temporary
repositories and do not switch the application checkout. CI runs the gate
through tests; deployment jobs additionally build before uploading assets.

## Useful automated coverage

Vitest with Testing Library and jsdom covers content validation, date/order
helpers, theme behavior, and contact interactions. Tests live beside the code;
`src/test/setup.ts` supplies browser/test setup. Use `npm run test` for watch
mode or `npm run test:ci -- path/to/file.test.ts` for a focused run.

Test meaningful behavior and failure boundaries: invalid dates/links/IDs,
ordering ties, current-role selection, denied clipboard or storage access,
theme/motion preference updates, tall-card reading positions, and effect cleanup.
Do not add tests that duplicate markup or
merely verify a library. Follow the shared
[testing workflow](../../ai/workflows/testing-quality.md).

## Browser checks for visual changes

jsdom does not verify layout or scroll animation. Review the production build
on phone and desktop, with representative widths from 320px to 1440px and a
short landscape viewport. Check:

- No horizontal overflow, clipped copy, or fixed-navigation overlap.
- Current appears only on the selected role; all date ranges stay readable.
- Headings pin while their achievements scroll and release for the next entry.
- On the stack experiment, each card's full text passes through the reading
  area before fading; reverse scrolling restores it. Test unequal card heights,
  narrow phones, direct fragment links from later chapters, and initial deep
  links. Reduced motion, short screens and print must reveal all highlights.
- Light/dark themes, saved and system preferences, and readable contrast.
- Reduced motion, the pause control, keyboard navigation, mobile menu, section
  links, skill filters, and contact actions.
- Browser console errors and broken assets.

Use available browser tooling; do not require a script from someone's `/tmp`
folder. Store screenshots and one-off measurements outside tracked source.
Documentation-only changes do not need a fresh visual regression run.

## Failure handling

Read actual failures; preserve the failing command's exit status when filtering
output. Do not weaken tests or skip checks to make a gate green. Distinguish
environment restrictions from application failures and report incomplete
checks accurately. Release verification follows the
[deployment guide](../operations/ci-cd-and-deployment.md).
