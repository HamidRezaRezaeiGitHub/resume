# Project wiki

## Overview

Hamid Rezaei's personal resume website is a static React application for
recruiters and hiring managers. It presents an animated, mobile-friendly
timeline, a toolkit, and contact links in light and dark modes.
This wiki owns durable project knowledge. Local task state lives in ignored
`requirements/` workspaces; shared agent workflows live in `ai/`.

## Architecture

- [System overview](architecture/system-overview.md): runtime, stack, source
  layout, content flow, and browser integrations.
- [Decisions](architecture/decisions.md): timeline ordering, content validation,
  component boundaries, motion, and pack scope.

## Working on the site

- [React and TypeScript](guides/react-typescript.md): component design, state,
  effects, timeline card motion, accessibility, and local development.
- [Resume content](guides/resume-content.md): public writing, dates, selected
  projects, schema rules, and a page/component/JSON terminology guide.
- [Testing](guides/testing.md): CI commands, useful regression coverage, and
  phone/desktop visual checks.
- [CI and deployment](operations/ci-cd-and-deployment.md): branches,
  environments, GitHub configuration, and release verification.
- [AI pack maintenance](guides/ai-pack.md): native entry points, hooks,
  local requirements, validation, and safe upgrades.

## Evidence and history

- [Project evidence](evidence/project-evidence.md): dated research supporting
  project copy; includes excluded projects as a research archive only.
- [Application review](reviews/2026-09-16-application.md): the completed React,
  content validation, accessibility, and maintainability review.
- [Wiki log](log.md): meaningful project and documentation changes.
