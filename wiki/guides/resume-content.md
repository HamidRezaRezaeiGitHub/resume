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

## Page anatomy and JSON terminology

A **section** is a major region of the page. A **component** is the React code
that renders a region or a smaller reusable piece. A **field** is a named JSON
property. `[]` below means an item in a list, rather than a literal field name.

| What you see                                  | What to call it                         | JSON source                                                                        | React component                  |
| --------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------- |
| Top navigation and page links                 | Navigation / navbar                     | `navigation[]` has `label` and `sectionId`                                         | `Nav`                            |
| Opening name, introduction, and graphic       | Hero section                            | `hero` and `profile`                                                               | `Hero`                           |
| Small text above a section heading            | Eyebrow                                 | `sections.timeline.eyebrow`, `sections.skills.eyebrow`, `sections.contact.eyebrow` | `Timeline`, `Section`, `Contact` |
| Section headline and short introduction       | Section heading / description           | `sections.*.title` and `sections.*.description`                                    | Same as above                    |
| Full career history                           | Timeline                                | `timeline[]`                                                                       | `Timeline`                       |
| One role, project, degree, or teaching record | Timeline entry; called a chapter in CSS | One `timeline[]` object                                                            | `TimelineItem`                   |
| Role/project title that stays in view         | Sticky entry heading                    | Entry title, organization, team, location, dates, category, and stage              | `TimelineHeading`                |
| Introductory paragraph under an entry         | Entry summary                           | `timeline[].summary`                                                               | `TimelineItem`                   |
| Each numbered achievement or milestone        | Highlight / achievement                 | `timeline[].highlights[]`                                                          | `TimelineAchievement`            |
| Smaller bullets inside a highlight            | Details / supporting bullets            | `timeline[].highlights[].details[]`                                                | `TimelineAchievement`            |
| Prominent result such as 100% output parity   | Metric callout                          | Highlight `metric.value` and `metric.label`                                        | `TimelineAchievement`            |
| Small technology names separated by slashes   | Technology tags                         | Entry or highlight `tags[]`                                                        | `TechnologyList`                 |
| Category key and colored markers              | Category legend / markers               | `categories[]`: `id` and `label`; entry `category` selects one                     | `Timeline`, `TimelineHeading`    |
| Tools near the bottom                         | Toolkit / skills section                | `sections.skills`, `skillOverview[]`, `skillGroups[]`                              | `Skills`                         |
| Backend, Frontend, etc. buttons               | Skill filters                           | `skillGroups[].title`; Overview is a built-in filter                               | `Skills`                         |
| Floating words below the filters              | Skill cloud                             | `skillOverview[]` or selected `skillGroups[].skills[]`                             | `Skills`                         |
| Let's talk and email links                    | Contact section                         | `sections.contact`, `profile.email`, `profile.location`, `profile.links[]`         | `Contact`                        |
| Copyright and build credit                    | Footer                                  | `profile.name`, `footer.builtWith`; year is generated                              | `Footer`                         |

### Hero and shared profile fields

- `hero.title`: the two lines of large display text, currently Hamid's name.
- `hero.kicker`: the small introductory label above the hero, currently Toronto.
- `profile.headline`: the professional label, currently Full-Stack Software Engineer.
- `profile.tagline`: the short personal introduction below the large name.
- `hero.technologies[]`: floating technology labels around the hero illustration.
- `hero.scrollLabel`: the hero button's text; `hero.contactLabel`: the contact
  button in the navigation. These buttons are **calls to action**, or **CTAs**.
- `profile.name`, `location`, `email`, and `links[]`: shared identity/contact
  information. Each link contains a visible `label` and destination `url`.

### Fields inside a timeline entry

`id` is a stable anchor identifier, such as `hsbc-agency-lending`; it also allows
a direct URL ending in `#hsbc-agency-lending`. `category` selects experience,
project, education, or teaching. `title` names the role/project/degree;
`organization`, `team`, and `location` provide context. `startDate` and `endDate`
form the date range. `stage` is an optional status label, such as a project's
development stage. `summary` introduces the entry, `tags[]` lists technologies,
`links[]` contains external links, and `highlights[]` contains its achievements.

`currentRoleId` is a top-level pointer to the current professional entry. It
controls the first position and Current label; it is not a second date field.
The large **year label**, chapter number, and vertical **timeline rail** are
derived presentation elements, not separately editable JSON fields.

### Fields inside a highlight

`id` is its anchor; `title` is its heading; `body` is its main explanatory text.
Optional `date` gives a milestone date; `metric` gives a result and its context;
`details[]` adds smaller bullets; `tags[]` lists relevant technologies. The 01,
02, etc. **highlight numbers** are generated from the list order.

For example: “In the current HSBC entry, shorten the platform proof-of-concept
highlight's body, keep its metric, and make the supporting details less prominent.”
Or: “Make highlight reveals quicker, but keep the sticky entry heading.”

### Motion terms

**Scroll-linked** means the animation follows scroll position, including when
scrolling backwards. **Reveal** means content enters view. **Stagger** means
parts arrive at different moments. **Sticky** means a heading stays pinned
while its chapter passes. **Parallax** means layers move at different speeds.
**Reduced motion** is the user's accessibility preference for static or simpler
presentation. The navigation pause button controls decorative looping motion;
scroll-linked highlights follow scrolling and respect reduced motion.
