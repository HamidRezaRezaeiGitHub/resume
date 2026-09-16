---
title: Resume content and publication
domain: guides
tags: [content, timeline, dates, publication]
status: current
last_updated: 2026-09-16
---

# Resume content

Edit public copy in `src/data/resume.json`; keep its contract in
`src/data/resume.schema.ts` and meaningful validation cases in
`src/data/resume.test.ts`. Run `npm run validate:content` before previewing.

## Voice and publication scope

Write concise, natural English for recruiters and hiring managers. Describe
what Hamid built and why it mattered. Avoid long paragraphs, inflated claims,
repeated slogans, or research labels such as “From repository history.”
The hero describes Hamid's strengths independently of his employer; keep
`index.html` metadata consistent with that positioning.

The selected personal projects are **BuyOrRent, man-agent-ment, and Buildean**.
BuyOrRent focuses on the new backend and MCP tools; the Flutter frontend is in
progress. Do not automatically publish other repositories. The
[project evidence archive](../evidence/project-evidence.md) records the basis
for these descriptions and dates, including research that is excluded from
the website. Repository history supports implementation dates, not launch,
adoption, business impact, or employer claims.

Use user-supplied career facts. Do not invent metrics, exact dates, skills,
tenure, or ownership. Keep private employer material out of committed files
and public content. Ask for missing facts when they affect accuracy.

## Timeline rules

- `currentRoleId` selects one ongoing professional experience and places it
  first. It determines the Current rail label and role badge. Keep the real
  date range visible. All remaining entries sort newest start date first.
- Entries use experience, project, education, or teaching categories, with
  text/icons as well as color. Every top-level entry needs a start date.
- Dates use year precision or year-month precision. Preserve known months;
  do not manufacture January to fill a year-only date. An end may be a date
  or `present`; omitted ends represent point-in-time entries.
- Undated work belonging to a role is a nested highlight of that role, not
  an undated timeline entry. The platform proof of concept, in-product
  assistant, and AI adoption work belong to the current HSBC role.
- Functional team transitions remain distinct. Do not reintroduce the prose
  note about joining HSBC through FDM and becoming permanent; chronology
  belongs in the timeline itself.

## Contract details

The schema validates required text, date ranges, current-role selection,
unique IDs, and skill memberships. IDs use lowercase hyphenated fragments and
cannot collide with section anchors or generated heading IDs. External links
use HTTP(S) and have unique labels/URLs per list. String lists cannot repeat
values. Skill group names are unique and cannot use the reserved Overview
filter name. Check the schema for the exact current fields rather than copying
an old example into a new shape.

Schema and React components can evolve together when requested. Update affected
content, consumers, validation, and this guide in the same change.
