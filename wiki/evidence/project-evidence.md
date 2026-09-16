---
title: Personal project evidence
domain: evidence
tags: [projects, provenance, publication]
status: current
last_updated: 2026-09-16
---

# Personal project evidence

Read-only review of sibling repositories on 2026-09-16. One research assignment
per project, using the available sub-agents in successive rounds. Source paths
below are relative to `/Users/hamid/Documents/Coding/`. No sibling files were
changed and no sibling test suites were run.

## Current publication scope

The user selected **BuyOrRent, man-agent-ment, and Buildean only**. The other
project sections below are retained as research records, not website entries.
BuyOrRent's public copy focuses on its new backend and MCP tools, with the
Flutter frontend explicitly in progress. Its September 2025 project date stays;
the backend milestones start in August 2026.

The latest user-supplied resume image confirms that the platform proof of
concept, in-product assistant, and agent adoption work belong to the current
Agency Securities Lending role. It supplies January–December 2019 for the
master's degree and September 2013–December 2017 for the bachelor's degree.
The website retains the previously established functional-team transitions
within the earlier HSBC period, which the one-page resume groups together.

## How dates are used

The current HSBC role remains first through `currentRoleId`. Other timeline
entries sort by start date. Date provenance is documented here only, with no
research labels or metadata in the website content. These dates describe
recorded work, not a claimed date of conception. README-only and scaffold commits
are distinguished from substantive work. A historical end date means the last
recorded implementation period, not a formal abandonment date. Documentation
updates alone do not extend that period.

Existing user-supplied career facts remain the source for HSBC roles and the
Buildean co-founder/beta status. Git history is not evidence of employer work,
real user counts, business impact, or project launch. The user has now confirmed
the current role as the parent for the HSBC platform and AI achievements.

## Buildean

- Repository: `buildean/buildean-backend`.
- `f41861f4` (2025-06-28): README and ignore file; `f1493a7e` (2025-07-08): Java
  scaffold. `98fb870c` (2025-07-18): first substantive estimation domain,
  including projects, estimates, lines, quotes, and work items. Use **Jul 2025**.
- `ca40e5bf` (2026-05-19): UAT/cloud delivery milestone. `3e16f1b0` (2026-09-10):
  current-task scenario creation retaining compatible base values. Continued
  implementation through `93d3100a` (2026-09-12) supports ongoing work.
- `wiki/domain/product-context.md:12-42`: construction estimation and early
  beta/MVP scope; broader contracts, payments and scheduling are deferred.
- `wiki/domain/estimation-engine.md:35-42,86-95`: task changes, scenario
  estimates, compatible manual pricing preservation.
- `wiki/operations/ci-cd.md:12,54-83`: build once, promote the same image,
  Cloud Run DEV/UAT. No claim of production deployment.
- `wiki/architecture/tech-stack.md:14-33`: Java/Spring, PostgreSQL/Flyway.
- Only the backend was available locally. Do not attribute the separate
  frontend to Hamid. No verified public product link was added.

## BuyOrRent

- Repositories: `buy-or-rent/buy-or-rent-react-demised`,
  `buy-or-rent/buy-or-rent-frontend`, `buy-or-rent/buy-or-rent-backend`.
- React: `9fca4c5` (2025-09-22) is README-only; `71c2f25` (2025-09-23) changes
  real mortgage calculations. Use **Sep 2025** for the project as a whole.
- Flutter: `f9a09d0` (2026-04-01) input models; `00d7da2` (2026-04-02) financial
  calculators; `b062a93` (2026-04-14) composite results; `5c07378` (2026-04-15)
  CSV export. Use **Apr 2026** for this milestone.
- Backend: `d93bdbd`, `e81d9da`, `dfc1981` (2026-08-23) money, rent, and MCP
  foundations. APIs expanded in September: mortgage `ac25aa0`/`15738ca`,
  investment `c398d76`/`3bcfd3d`, expense `6db566f`/`08062a9`. The August
  milestone marks the start of the API work, not completion of every API.
- Frontend `wiki/overview.md:11-27` and `wiki/architecture/system-overview.md:17`:
  Flutter comparison app calculates locally; backend integration unfinished.
- Backend `wiki/overview.md:20-25,79-95`: atomic financial APIs, unfinished full
  comparison, Hono/HTTP/MCP on Cloudflare workerd (not Node).
- Public web/API docs URLs come from frontend overview and backend deployment
  wiki. Repository links already present in the resume are retained.

## TeamKeeper

- Repository: `team-keeper`; original Hamid-authored history.
- `4bc9a64` and `cda1703` (2024-09-15): README/scaffold. `7b2dc01` on the same
  day adds Person/Player domain and persistence/security. Use **Sep 2024**.
- Most additional domain/services/controllers/tests are uncommitted local
  work. They support the current prototype description but have no verifiable
  implementation dates. Their working tree was preserved.
- `pom.xml:11-15,32-67`: recreational teams, Java/Spring/JPA/H2.
- `src/main/java/dev/hrrezaei/team_keeper/controller/v1/TeamController.java:20-58`
  and `service/TeamService.java:40-65,105-117`: team endpoints and assignments.
- `domain/Match.java:27-54`, `domain/Payment.java:31-56` beneath that Java package:
  matches and payment records. Recording payments is not payment processing.
- No deployment, launch, or ongoing status claim.

## QueryFusion

- Repository: `query-fusion`; visible history authored by Hamid, no upstream
  fork evidence.
- `fbfb769` (2023-10-20) first real editor UI; `272fcf1` (2023-11-17) validation;
  `9e8e184` (2023-12-08) formatting; `e8dfb9e`/`bcbe8c5` (2023-12-27/28) query
  services; `24c4c99` (2023-12-30) final application change. Use **Oct–Dec 2023**.
  September 2025 commits only update docs.
- `src/components/content/ContentPanel.tsx:64-115`: upload, format, validate.
- `src/services/query/JsonQuerent.ts:6-32` and `XmlQuerent.ts:7-53`: JSONPath and
  XPath implementations. They are not connected to the UI; the copy says so.
- No automated test or production-readiness claim.

## RecallWatch — foundation only

- Repository: `recall-watch/recall-watch-backend`.
- `f2a052a` (2026-08-23) README-only; `d3dd47e` on the same day imports the
  framework baseline. `dd35080` (2026-09-05) adds custom error/validation
  infrastructure and tests. This is meaningful infrastructure, not product work.
- `wiki/overview.md:11-19`: product domain undefined, example concept only.
- `wiki/operations/ci-cd-and-deployment.md:11-12,40-48`: deployments disabled.
- Research supports **Sep 2026 · Early foundation**, describing only
  the custom infrastructure work. No recall-monitoring or notification
  capability is inferred from the name, and no ongoing/product-launch claim.

## XML Sorter

- Repository: `xml-sorter`; 13 visible commits authored by Hamid, no upstream
  fork evidence. `README.md:182-183` identifies it as a personal project.
- `e0d2e472` (2024-10-19) custom sorter interface; `30ba3133` (2024-10-20)
  implementation/comparators; `05671dd` repeated-output tests; `4c64df2`
  (2024-10-21) endpoints/controller tests. Use **Oct 2024**.
- `README.md:3-6,69-84,156-165`: purpose, raw XML/file uploads, test scenarios.
- `src/main/java/dev/hrrezaei/xml/sorter/service/XmlSorterImpl.java:43-144`:
  parsing, sorting, and output. No live service or maintenance claim.

## HTML Cleaner

- Repository: `HTML-Cleaner`, Hamid-owned original utility with AI-assisted
  implementation. No upstream fork evidence.
- `cba0798` (2026-01-13) README-only; `8ec73c8` first parser/CLI (Copilot author);
  Hamid's `8c75fff` expands removal logic, `b750801` adds empty-element cleanup.
  Use **Jan 2026**. Existing uncommitted SVG cleanup was left untouched.
- `html_cleaner.py:24-55,90-117,287-403`: removal categories, attribute cleanup,
  empty-element cleanup, input/parse/output. Committed HEAD has the same main
  pipeline beginning at line 326.
- `README.md:28-57`: CLI and standard-library dependencies. No sanitizer,
  universal content-preservation, deployment, or test-suite claim.

## Blackjack Simulation

- Repository: `BlackjackSimulation`; Hamid-authored/attributed history.
- `a8b6d229` (2024-12-26) contains the substantive application in its first
  commit. This proves work existed by **Dec 2024**, not when coding began.
  `ff49aced` the same day only updates Maven tooling.
- `src/main/java/dev/hrrezaei/blackjack/model/Game.java:20-41` samples outcomes
  from configured probabilities; it is not a card-by-card blackjack engine.
- `model/CappedMartingale.java:25-53`, `model/Simulation.java:87-124`, and
  `service/SimulationService.java:29-37` beneath that package show the implemented
  strategy, bankroll tracking, rounds, and repeated simulations.
- `configuration/BettingStrategyConfig.java:22-30` leaves Flat betting
  unsupported. No multiple-strategy comparison, financial advice, or validated
  profitability claim. An experiment, excluded from the current website.

## Obsidian-Zip — excluded

- Repository: `Obsidian-Zip`; `README.md:1` only contains the title.
- `cad5fe5`/`1bb8588` (2026-04-13) store a zipped third-party Obsidian installer.
  No original code or engineering work. Repository ownership does not imply
  authorship of Obsidian. The archive was neither opened nor executed.

## Spring Service Blueprint

- Repository: `templates/my-spring-service-blueprint`, incremental Hamid-authored
  history. `b237330c`/`967886bd` (2026-08-13) are README/scaffold; `6d05beae`
  (2026-08-14) adds substantial API/persistence infrastructure. Use **Aug 2026**.
- `3710fa68` (2026-08-14) provider boundaries, `8c25bb9a` same day REST/MCP/AI,
  `54db52b` and `c9934fd3` (2026-08-17) architecture/security checks. Latest
  recorded change `63f20d1` (2026-08-17); no ongoing status claimed.
- `README.md:3-6,18-23,38-49`: demo endpoints, optional providers, disabled
  deployments. `wiki/architecture/system-overview.md:11-15`: service boundaries.
- `wiki/integrations/mcp-ai.md:11-17`, `wiki/guides/testing.md:11-15`, and
  `wiki/guides/adopting-template.md:11-22`: adapters, test layers, adoption guide.
- Template, not a launched product. No adoption counts or time-savings metric.

## React Common

- Repository: `templates/react-common`. `5730987`/`45d54d0` (2025-09-24) are
  README/setup. `0e2ba84` the same day adds custom theme/router/tests;
  `8d34ed2` (2025-09-30) adds reusable forms/navigation/validation. **Sep 2025**.
- BuyOrRent React commit `7bdd6d9` (2025-10-01) explicitly replaces its source
  with React Common components. Matching validation hook confirms reuse
  direction. This is not BuyOrRent implementation counted as an unrelated app.
- `src/components/address/FlexibleAddressForm.tsx:19-80`,
  `src/services/validation/useSmartFieldValidation.ts:14-74`, and
  `src/contexts/ThemeContext.tsx:33-98`: forms, validation, persisted themes.
- Built on shadcn/ui/Radix. `src/components/auth/LoginForm.tsx:174-202` only
  supplies UI/callbacks, not a backend. `package.json:2` is private/version 0.0.0;
  no published package or production-readiness claim.

## my-dot-files — excluded

- Metadata only was inspected; no configuration values read. Four tracked
  shell/editor/Git configuration files, no README/wiki or distinct application.
- Hamid-authored history from `74e661a` (2023-09-26) through `a553823`
  (2024-09-01). Personal configuration is not presented as a separate product.

## man-agent-ment

- Repository: `man-agent-ment`; all 74 visible commits attributed to Hamid.
- `6efebb3` (2026-04-27) is a substantive first commit: agent adapters,
  shared instructions, templates, installer, and adoption docs. **Apr 2026**.
- `2856361` (2026-05-24) wiki reminder hooks; `cd66089` the same day portable
  requirement handoff; `707a3de` (2026-06-30) session prompts. Latest local
  commit `014e9d9` (2026-07-05), no ongoing date claim.
- `README.md:3-20`: shared workflows across Codex, Claude Code, Copilot, Gemini.
- `wiki/architecture/system-overview.md:27-42`: install/audit flow, preserving
  target files. `wiki/architecture/integration-points.md:15-32`: native adapters
  and no runtime service dependency. `wiki/architecture/tech-stack.md:13-28`:
  Markdown, shell, Git, no app framework.
- Removed the misleading MCP technology tag. No license was found, so replaced
  the former open-source label with developer tooling. The existing GitHub URL
  matches the remote; public visibility was not independently established.
