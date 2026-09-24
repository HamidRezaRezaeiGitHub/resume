---
title: Testing and validation
domain: guides
tags: [vitest, validation, accessibility, responsive]
status: current
last_updated: 2026-09-24
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

Vitest with Testing Library and jsdom covers content validation, date
helpers, independent entry disclosures, bullet-fragment reveal, keyboard toggles,
optional detail validation, theme behavior, contact interactions, and graph relationships/camera
math, undirected edge validation, shared degree sizing, deterministic clustering,
grouped membership, hover/selection, individual node dragging, gesture
boundaries and tooltips. Tests live beside the code;
`src/test/setup.ts` supplies browser/test setup. Use `npm run test` for watch
mode or `npm run test:ci -- path/to/file.test.ts` for a focused run.

Application and interaction tests use small fictional fixtures in
`src/test/contentFixtures.ts`, so editing real role counts, bullets or graph degrees
does not require changing behavior tests. Content validation, grouped completeness
and graph layout/fit checks still run against the published JSON. Editor-schema
drift and escaped HTML metadata/fallback rendering are covered by
`src/test/contentTooling.test.ts` and included in `validate:content`.

Test meaningful behavior and failure boundaries: invalid dates/links/IDs,
cross-section anchor collisions, navigation focus, denied clipboard or storage access,
theme updates, and effect cleanup. Do not add tests that duplicate markup or
merely verify a library. Follow the shared
[testing workflow](../../ai/workflows/testing-quality.md).

## Browser checks for visual changes

jsdom does not verify layout or anchor scrolling. Review the production build
on phone and desktop, with representative widths from 320px to 1440px and a
short landscape viewport. Check:

- No horizontal overflow, clipped copy, or fixed-navigation overlap.
- Roles, projects, skills and degrees appear in their own sections; dates remain readable.
- Entries with bullets start collapsed with a plus icon; clicking the header or
  pressing Enter/Space toggles only that entry. Several can stay open. No overflow,
  misplaced focus rings or overlap with project links at 320px, desktop or landscape.
  Above 800px the toggle aligns under the date in one right column; at/below 800px
  it is centered beside the header. Check both sides of the breakpoint.
- Entries without bullets (including the current degrees) have no toggle. Skills
  remains available. Opening a bullet fragment URL reveals and scrolls to its text.
- Print includes all bullets even when every screen entry is collapsed; no toggle icons.
- Light/dark themes, saved and system preferences, and readable contrast.
- Every top-bar section link is visible on phones and scrolls up/down to an
  unobscured target, preserving keyboard focus.
- Skills: Java connects to Spring/modules; Jenkins to Groovy; Backend to APIs.
  Trace links in both directions; clicking a keyword must update the selection.
- Every node is text-only (also on hover/selection); no filled tiles, dropdown,
  selection/neighbor panel, explanation or type/count labels. The only footer copy
  is keyboard tips. The shared introduction works in Network and List.
- Font size stays within 22–72 graph units and gives highly connected words more
  contrast. Edge masks stay aligned with labels while dragging.
- Graph zoom limits/reset, mouse pan, modifier-wheel zoom, and ordinary wheel scrolling.
- Phone: default swipe scrolls the page; Explore graph enables node drag/pan/pinch; Done restores scrolling.
- Keyboard: one node tab stop, arrow browsing, Home/End, Enter/Space selection,
  +/-/0, Shift+arrows movement, focus underline, offscreen-node reveal and Tab exit.
  Tooltips and the complete List view remain accessible.
- Hover highlights a node and its direct edges without changing camera or selection.
- Node drag moves only that node and its edges; background drag pans without deselecting.
- A blank click clears selection; Fit includes moved nodes; Reset restores the layout.
- Initial fit contains every node at 320px and desktop; section container widths match.
- No idle motion or node dots; reduced motion disables interaction transitions.
- Tooltip hover/focus, Escape dismissal, contrast and clipping on narrow screens.
- Print shows all nine skill groups instead of the interactive graph; contact still works.
- Résumé chooser from Hero and Contact: both choices, native keyboard containment,
  Escape/close/outside dismissal, focus return, no page-scroll lock after closing.
  Check desktop anchoring, phone bottom sheet, 320px and short landscape fit.
- Download both PDFs, verify filenames, PDF bytes, content type and attachment
  headers in Wrangler/deployed environments. Vite preview does not apply headers.
  Confirm reduced-motion and print hide/disable the relevant download UI.
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
