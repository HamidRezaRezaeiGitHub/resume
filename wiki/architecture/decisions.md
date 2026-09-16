---
title: Architecture and product decisions
domain: architecture
tags: [decisions, timeline, accessibility, agent-pack]
status: current
last_updated: 2026-09-16
---

# Architecture and product decisions

## D-001: One timeline, with the current role first

The current professional role is pinned first through `currentRoleId`; every
other entry sorts by descending start date. Its large rail label says Current
while its actual date range remains visible. This avoids a misleading 2025
heading above 2026 projects. Categories use text and icons alongside color.
See the [content contract](../guides/resume-content.md).

## D-002: Static content with a validation boundary

JSON keeps editing straightforward without a CMS or runtime service. Build-time
validation catches malformed dates, links, IDs, and skill memberships before
deployment. Pure helpers own ordering and formatting; components own rendering.
See the [data flow](system-overview.md).

## D-003: Small React components and local state

Use composition, explicit typed props, pure helpers, and focused browser hooks.
No class hierarchy, service container, or global state framework is needed for
this site. Extract shared behavior when actual callers need it.
The [application review](../reviews/2026-09-16-application.md) records the
concrete refactor and regression coverage.

## D-004: Animation supports reading

Headings stay sticky while achievements pass beneath them, then release for
the next chapter. Achievements use content-driven spacing, not viewport-sized
minimum heights. Reduced motion retains readable static content; decorative
motion has a pause control. Short landscape screens use normal heading flow.
Phone readability takes priority over theatrical scrolling.

## D-005: Adapt the agent pack to the site

Adopt the reusable workflows, requirements, hooks, and native adapters from
BuyOrRent's installed man-agent-ment pack. Keep one canonical instruction file
and a compact wiki. Combine stack, data flow, and integration information in the
system overview; omit backend API/MCP guidance and the financial domain wiki.
Do not copy credentials, source-project task history, or its deployment files.
Local adaptations and upgrade rules live in the [pack guide](../guides/ai-pack.md).
