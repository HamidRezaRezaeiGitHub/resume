# Wiki log

## 2026-09-24 — update — Expandable entry details

Entries with bullets now start collapsed and expand independently through an
accessible heading control with a plus/minus icon. Optional bullets work uniformly
for roles, projects and degrees; missing or empty lists keep a simple entry. Skills,
entry identity and project links stay visible. Bullet deep links reveal their entry,
and print includes all details. Removed Spring AI connections to React and Developer
Workflow. Updated the editor schema and content, interaction and testing guides.
Release scope is UAT; production awaits the user's review.

## 2026-09-23 — update — Content maintainability

Moved the navigation monogram into profile JSON and derived HTML metadata and
fallback contact from that profile with safe escaping. Generated an editor JSON
Schema from Zod, with field descriptions and a drift check. SkillsNetwork now
accepts a graph model and starts keyboard focus alphabetically; content changes
reset the interaction session. Behavior tests use fictional fixtures while live
content retains structural, reference, asset and layout validation. Removed six
unused template dependencies and the unused class-name helper. Documented the
JSON editing path and its boundary with UI labels, layout and authored PDFs.

## 2026-09-23 — update — Agent Skills and Context Engineering

Added the two approved AI keywords. Agent Skills connects the coding agents,
instructions, Bash and enterprise workflow integrations. Context Engineering
connects instructions, skills, hooks and Confluence. Existing group mappings and
degree-driven layout continue to apply.

## 2026-09-23 — update — AI and Google Cloud skill connections

Added AI, Agent Instructions and Hooks, connecting the existing coding agents,
MCP, Spring AI and Bash into an AI workflow neighborhood. Added GCP as a separate
provider linked to Cloud Run, Cloud SQL, BigQuery, Firebase and Logs Explorer;
Logs Explorer also connects to Observability and Cloud Run. Preserved the nine
list groups, shared degree sizing and automatic layout. No PDF or role-copy changes.

## 2026-09-23 — update — Résumé downloads

Added the shared Compact/Long chooser to Hero and Let's Talk. Desktop uses an
anchored native dialog; phones use a bottom sheet. User-supplied PDFs are preserved
unchanged in root public/resumes, with attachment and cache-revalidation headers.
JSON/schema own the download labels and paths; validation checks published assets.
Documented keyboard behavior, file replacement and deployment verification.

## 2026-09-23 — update — Minimal Skills graph

Removed node tiles, dropdown, selection/neighbor panel and explanatory legend.
Text highlighting, transparent hit regions and edge masks keep the graph readable.
Degree sizing now spans 22–72 graph units with stronger contrast for highly
connected words. Roving keyboard navigation replaces the dropdown; offscreen
focus is revealed, and only keyboard tips remain below the graph. Updated the
shared Network/List eyebrow to “What I work with”; removed the declined
Java/Spring summary paragraph and obsolete JSON copy fields.

## 2026-09-23 — update — Connected skills graph

Added explicit undirected ecosystem relationships, including Jenkins–Groovy,
Backend–APIs and Java–Spring. All keywords now use one node style, a shared
unique-neighbor sizing rule and relationship-driven placement without topic
anchors. Removed graph kind/count labels; kept list/print grouping and existing
interaction controls. Added relationship validation and regression coverage.
The user authorized deploying the final master revision to DEV, UAT and PROD.

## 2026-09-23 — update — Skills graph interaction refinement

Replaced drift/parallax with mouse-hover connection highlighting. Added individual
node dragging with attached edges, blank-space deselection, accessible control
tooltips, and a full-graph initial fit on every viewport. Skills now inherits the
normal section width; category dots are removed. Fifteen separate graph topics
map to the existing nine PDF/list groups, preserving grouped contents without
duplicates. Node positions are automatic initially and temporary when dragged.
DEV/UAT only; no production promotion.

## 2026-09-23 — update — Interactive skills network

Added category hubs and unique shared technology nodes, degree-based label sizing,
selection, pan/zoom, pointer parallax and opt-in phone gestures. Retained a complete
list/print view, pause and reduced-motion support. Normalized skills into one
validated JSON source and added selected LinkedIn-verified tools. Removed the
footer technology credit. Updated architecture, content terminology and interaction
checks. Release scope is DEV and UAT only; production awaits user approval.

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
