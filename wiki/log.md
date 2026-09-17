# Wiki log

## [2026-09-16] update | Three-way animation comparison

Deployed the original master `f9d2152` to production (successful run
[35156531863](https://github.com/HamidRezaRezaeiGitHub/resume/actions/runs/35156531863)),
then merged the first slide/tilt experiment `525105d` into master for UAT
(successful run [35157020031](https://github.com/HamidRezaRezaeiGitHub/resume/actions/runs/35157020031)).
Both live versions passed phone smoke checks. This supersedes the earlier
entry's pending-approval status for the first experiment.

The new `codex/timeline-scene-transitions` DEV experiment uses stacked highlight
cards that shrink/fade away, chapter heading transitions, and outlined year
labels. Documented geometry ownership, tall-card reading behavior, direct-link
restoration, and static reduced-motion/short-screen/print fallbacks. Resume
content and its JSON contract are unchanged.

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
