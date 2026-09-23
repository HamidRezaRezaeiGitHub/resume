# Project wiki

## Overview

Hamid Rezaei's personal resume website is a static React application for
recruiters and hiring managers. It presents a minimal, mobile-friendly
resume with separate experience, project, skill and education sections, plus
a distinctive hero and contact section in light and dark modes. Skills adds an
interactive network with shared tools, hover highlighting, draggable nodes,
pan/zoom and a readable grouped list.
This wiki owns durable project knowledge. Local task state lives in ignored
`requirements/` workspaces; shared agent workflows live in `ai/`.

## Architecture

- [System overview](architecture/system-overview.md): runtime, stack, source
  layout, content flow, and browser integrations.
- [Decisions](architecture/decisions.md): section ordering, content validation,
  component boundaries, motion, and pack scope.

## Working on the site

- [React and TypeScript](guides/react-typescript.md): component design, state,
  effects, responsive navigation, accessibility, and local development.
- [Resume content](guides/resume-content.md): public writing, dates, selected
  projects, latest resume source, schema rules, and a page/component/JSON terminology guide.
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
