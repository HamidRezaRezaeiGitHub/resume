# Wiki log

## 2026-09-23 — update — Website-style hero and contact

Refined the page bookends with a split hero, larger name typography, a soft
background wash, experience/contact calls to action, and a contrasting Let's
Talk band. The four middle resume sections keep their compact layout and content.
New labels live in JSON; themes, phone navigation, clipboard fallback and print
remain supported. Updated the component/content guide for the new fields.

## 2026-09-23 — update — Resume sections and minimal presentation

Replaced the unified timeline with Summary, Experiences, Projects, Skills,
Education and Let's Talk following the user's revised direction. Migrated JSON
to section-specific lists, plain bullets and the PDF's nine skill categories.
Added visible phone/desktop section navigation; removed sticky chapters,
floating skills and animation-only components. Kept PDF functional team dates
and the qualified parity result; confirmed teaching months against LinkedIn.
Updated architecture, React, testing and the content/JSON terminology guide.

## [2026-09-23] update | Latest resume content

Updated JSON from the supplied two-page long resume: Data Service Layer title,
legacy migration and production support, project implementation details,
Buildean's June 2025 start and beta link, man-agent-ment's ongoing status and
60+ versioned assets, the master's field, and nine toolkit groups. Kept the
current role first, the three selected projects, compatible prior facts, and
the existing parity qualification. The previous request to omit FDM transition
prose still applies. No source document or local source path is committed.

## [2026-09-23] update | Production design retained

The user selected the original production design at `f9d2152` and declined the
other scroll experiments. Restored its exact highlight component and stylesheet
on the content-refresh branch. Kept the JSON terminology guide and AI pack.
The resume update will use this design consistently across DEV, UAT and PROD.

## [2026-09-16] update | DEV highlight animation and terminology

Documented the feature-branch experiment with staggered slide/tilt reveals,
an accent stroke, static scroll measurement, and reduced-motion/print fallback.
Added a page anatomy and JSON glossary so design requests can distinguish
timeline entries, highlights, supporting details, metrics, tags, and sections.
The experiment is for DEV review; the accepted master/UAT design is preserved.

## [2026-09-16] ingest | Resume site and AI pack

Adopted the reusable man-agent-ment pack from BuyOrRent and tailored routing,
native adapters, hooks, validation, and planning to the static React site.
Created the compact architecture, content, development, testing, deployment,
and pack-maintenance guides. Moved existing project evidence and the completed
application review into the wiki; archived the completed root plan locally.

## [2026-09-16] ingest | Timeline and application review release

Recorded the existing release in the application review: Current labeling,
employer-independent hero, compact achievement spacing, focused components,
strict types, and stronger content/browser regression coverage. Commit
`92f8737` passed CI and deployed to UAT in
[run 35135806620](https://github.com/HamidRezaRezaeiGitHub/resume/actions/runs/35135806620).
