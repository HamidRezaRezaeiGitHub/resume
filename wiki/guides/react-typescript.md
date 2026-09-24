---
title: React and TypeScript development
domain: guides
tags: [react, typescript, themes, accessibility]
status: current
last_updated: 2026-09-24
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
- State belongs near its consumers: theme, clipboard status and graph interactions.
  Effects synchronize browser APIs and clean up listeners.
- Prefer composition and real shared callers over classes, dependency containers
  or speculative abstractions. Maintain strict TypeScript without `any` or
  double casts. Build validation keeps malformed content out of releases.

## Layout and interaction

The current design is a minimal resume with Summary, Experiences, Projects,
Skills, Education and Let's Talk. Neutral theme tokens, serif display headings,
plain bullets, compact spacing and thin rules establish hierarchy in the middle
sections. The hero uses larger name typography, a soft background wash and direct
experience/download calls to action. Let's Talk closes with a contrasting green
band, large heading, email action and a second résumé download trigger. Their styles are scoped to those sections.
No category colors, sticky entry headings or scroll-linked reveals. Skills is the
interactive network. Entries with bullet details use independent disclosures.

`ResumeEntry` starts each bullet list collapsed and shows a plus/minus indicator
centered vertically at the right of the entry header on every viewport.
A real button inside the heading uses a stretched hit area across the header;
Enter/Space toggles it, `aria-expanded` exposes state and `aria-controls` identifies
the list. Entries without bullets have no control. Stage and project links remain
visible outside the toggle target. Bullet fragment URLs reveal the matching list
and scroll below the fixed header; listeners and scheduled frames clean up.
Print displays all lists and removes toggle decorations without changing screen
state. There is no exclusive accordion state or persisted expansion.

The fixed navigation exposes all four middle-section links on every viewport.
On phones the links occupy a second row; there is no hamburger menu. Native
fragment links support direct URLs, browser history and smooth scrolling.
Focusable section targets preserve keyboard context; scroll padding keeps them
below the fixed header. There is no scroll-spy state or scroll event listener.

All content remains readable without animation. Smooth scrolling respects reduced
motion. Skills has no ambient animation or mouse-follow transform; interaction
transitions respect reduced motion. Print replaces the graph with all skill groups,
using static, light-colored content without navigation. The declined animation experiments
are historical branches, not maintained presentation variants.

## Accessibility and review

Use semantic sections, headings, lists, description lists, time elements, links,
buttons and visible keyboard focus. Keep phone touch targets comfortable and
prevent horizontal overflow. Theme selection must work when storage is blocked;
email links must still work when clipboard access fails. Test light/dark,
narrow phones and short landscape using the [browser checklist](testing.md).

## Skills network

Keep graph data/layout, interaction state and presentation separate. The automatic
layout uses common deterministic seeds, link attraction, charge repulsion and a
bounded force simulation on copied data, followed by rectangular label spacing.
There are no fixed topic anchors. Membership and extra ecosystem links form one
undirected adjacency map before layout. Every node uses the same normalized degree curve, bounded from 22 to 72 graph
units (before zoom), with exponent 1.35 to emphasize well-connected words. Connected nodes tend to
cluster, while spacing keeps long labels readable; not every pair can be adjacent.
No coordinates, proficiency weights or named-node overrides are authored in JSON.
Nodes render as text only, including hover/selection; their invisible rectangles
retain pointer hit areas. An SVG mask cuts gaps in connection lines behind labels
without painting a tile. Focus is underlined; hover/selection changes text color
and weight. There is no dropdown, selected-node panel, neighbor list or explanatory
legend. Only a keyboard hint appears below the graph (hidden for coarse pointers
and narrow phones). The shared intro suits both Network and List.
The complete list/print view retains its content groupings.

`useGraphInteraction` owns temporary node positions, camera state, pointer capture
and pinch tracking. Dragging a node moves it and its edges; background dragging
pans. A second touch switches to pinch, never moving the previously grabbed node.
A drag release must not trigger click selection or blank-space deselection. Fit
uses current positions; Reset restores the automatic layout and fits it. Initial
and resized views fit all nodes on phones and desktops. Only real resize events
refit the camera, not state updates during node dragging.

Mouse hover previews direct connections without moving the camera or changing
persistent selection. Clicking pins a selection; blank clicks and Escape clear
it. Keyboard focus reveals an offscreen node without changing selection. There is no drifting,
parallax, live force simulation, looping edge animation or pause control.

Buttons and Ctrl/Command-wheel zoom; ordinary wheel input scrolls the page.
Touch defaults to native page scrolling; Explore graph opts into node dragging,
pan and pinch. Done or Escape exits capture. Tab enters the canvas and then one
node; arrows on that node cycle alphabetically, Home/End jump to the first/last,
and Enter/Space selects. The first alphabetical node is the initial node tab stop;
no particular technology must exist. Tab exits without traversing every node. Arrows on the
canvas pan; Shift+arrows moves a focused node; +/− zoom; 0 resets. Toolbar
hints appear on mouse hover or focus, dismiss with Escape, and clean up their
listeners. Skills inherits the same container width as the other sections.

The List/print view derives nine PDF groups from graph category mappings, with
no repeated skill within one group. Never require gestures to access resume facts.

## Résumé chooser

`ResumeDownload` owns a native `<dialog>` with labelled Compact/Long download
links. Desktop placement follows the trigger and flips above it when space is
limited; CSS turns it into a bottom sheet at 600px. Native modality handles
keyboard containment, Escape and focus restoration. Close button, complete
outside click and download selection dismiss it. Root scroll locking and resize
listeners are restored on close/unmount. Opening motion respects reduced motion;
print hides triggers, dialog and backdrop. Use the existing theme tokens.
