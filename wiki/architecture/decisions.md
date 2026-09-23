---
title: Architecture and product decisions
domain: architecture
tags: [decisions, sections, accessibility, agent-pack]
status: current
last_updated: 2026-09-23
---

# Architecture and product decisions

## D-001: Separate resume sections (supersedes the unified timeline)

On September 23 the user requested a layout close to the long PDF resume.
Summary, Experiences, Projects, Skills, Education and Let's Talk now render in
that order. Each entry list preserves JSON order; professional roles remain
newest first, with the current HSBC role first. Projects follow the PDF order.
No cross-category sorting or color coding is necessary. The four middle sections
are directly linked from the fixed top bar, including on phones.
See the [content contract](../guides/resume-content.md).

## D-002: Static content with a validation boundary

JSON keeps editing straightforward without a CMS or runtime service. Build-time
validation catches malformed dates, links, IDs, and required copy before
deployment. Pure helpers own date formatting; components own rendering.
See the [data flow](system-overview.md).

## D-003: Small React components and local state

Use composition, explicit typed props, pure helpers, and focused browser hooks.
No class hierarchy, service container, or global state framework is needed for
this site. Extract shared behavior when actual callers need it.
The [application review](../reviews/2026-09-16-application.md) records the
concrete refactor and regression coverage.

## D-004: A stable reading surface (supersedes animated chapters)

Ordinary bullets remain visible and entries scroll normally. Compact spacing
replaces the animated achievement blocks. Smooth anchor navigation respects
reduced motion; print preserves all content. There are no sticky entry headings,
reveal effects in the resume entries. Skills has a separately scoped exception
under D-006. This follows the user's request for a more
minimal and professional resume rather than another animation experiment.

## D-005: Adapt the agent pack to the site

Adopt the reusable workflows, requirements, hooks, and native adapters from
BuyOrRent's installed man-agent-ment pack. Keep one canonical instruction file
and a compact wiki. Combine stack, data flow, and integration information in the
system overview; omit backend API/MCP guidance and the financial domain wiki.
Do not copy credentials, source-project task history, or its deployment files.
Local adaptations and upgrade rules live in the [pack guide](../guides/ai-pack.md).

## D-006: An explorable Skills network

On September 23 the user requested a graph as the website's playful discovery
section, while preserving the accepted resume layout. The PDF's nine categories
become hubs; canonical technology nodes can belong to multiple categories.
Connection count controls label size uniformly, never indicating proficiency.
A bounded D3 layout and rectangular collision pass run once per module load;
SVG renders the result. Native pointer/camera helpers keep gestures testable.
Pointer parallax and subtle drift stop when paused, offscreen, hidden, or reduced
motion is requested. Touch capture is opt-in. A complete list and print view
preserve scanability and accessible alternatives. The footer build credit was
removed at the user's request. This feature is approved for DEV/UAT review only;
production promotion requires fresh explicit user approval.
