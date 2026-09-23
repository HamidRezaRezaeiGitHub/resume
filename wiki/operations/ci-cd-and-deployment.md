---
title: CI and deployment
domain: operations
tags: [github-actions, cloudflare, deployment]
status: current
last_updated: 2026-09-23
---

# CI and deployment

The integration branch is `master`. Use `codex/<slug>` for new agent branches
unless the user specifies another branch. Existing user instructions may
authorize working directly on `master`; do not switch it behind their back.

## Delivery flow

| Workflow          | Trigger                                          | Destination                                     |
| ----------------- | ------------------------------------------------ | ----------------------------------------------- |
| `ci.yml`          | Pull requests to master; reusable workflow calls | Verification                                    |
| `deploy-dev.yml`  | Push to a non-master branch; manual dispatch     | [DEV](https://dev.hamid-rezaei.com/)            |
| `deploy-uat.yml`  | Push to master; manual dispatch                  | [UAT](https://uat.hamid-rezaei.com/)            |
| `deploy-prod.yml` | Manual dispatch only                             | [Production](https://hamid-rezaei.com/) and www |

The push/PR workflows currently ignore changes consisting only of Markdown
files. Run local checks even when a remote run is skipped. Each deployment
calls the reusable CI job, then installs dependencies, builds, and deploys.
See the [validation gate](../guides/testing.md). Do not infer successful
deployment from a successful push: inspect the workflow run for that commit.

## Static assets and configuration

`wrangler.jsonc` defines a static-assets Worker serving `dist/`, with SPA
fallback and environment-specific names, custom-domain routes, and variables.
It does not wire a Hono service, MCP endpoint, or database. Runtime Worker
variables do not automatically become Vite client configuration.

Use `npm run deploy:dev`, `npm run deploy:uat`, or `npm run deploy:prod` only
when authorized; build first. Never deploy production merely because UAT is
ready for review. Avoid changing routes or deployment triggers for a UI task.

## GitHub setup

The workflows reference repository secrets `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`, and environments `dev`, `uat`, and `production`.
Configure a narrowly scoped Cloudflare token for the named account and domains;
never put its value into source, wiki, command output, or browser bundles.
Production reviewer/protection rules are configured in GitHub settings;
the existence of the YAML environment name alone does not prove approval
protection is enabled.

For delivery changes, inspect current workflow and Wrangler configuration,
check current official provider documentation when necessary, and follow
[protected boundaries](../../ai/workflows/protected-boundaries.md). Preserve
environment separation and validate the intended commit before release.

## PDF download assets

Vite copies `public/resumes/*.pdf` and `public/_headers` into `dist`. Cloudflare
serves the PDFs directly with `application/pdf`, `Content-Disposition: attachment`
and the original filename. Revalidation (`max-age=0, must-revalidate`) keeps stable
URLs current after a replacement. No Worker code, R2 bucket or API is needed.

Vite preview serves the files but does not apply Cloudflare's `_headers` rules.
Use Wrangler local preview or the deployed environment to verify HTTP headers.
After release, check both PDF responses and compare their bytes with the source;
a missing path may otherwise return the SPA HTML fallback with status 200.
