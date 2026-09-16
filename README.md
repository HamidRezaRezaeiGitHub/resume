# Resume — hamid-rezaei.com

An interactive, scroll-driven single-page resume. As you scroll, a color-coded
timeline reveals professional experience, personal projects, education, and
more.

## Tech stack

| Area        | Choice                                                            |
| ----------- | ---------------------------------------------------------------- |
| Build tool  | [Vite](https://vite.dev/) + React 19 + TypeScript                |
| Styling     | [Tailwind CSS v4](https://tailwindcss.com/) (shadcn-style tokens)|
| Animation   | [Motion](https://motion.dev/) (scroll-linked timeline)           |
| UI          | Custom components + shadcn/ui primitives                         |
| Testing     | [Vitest](https://vitest.dev/) + Testing Library                  |
| Lint/Format | ESLint + Prettier                                                |
| Hosting     | Cloudflare Workers (static assets)                               |

## Local development

```bash
nvm use            # Node 24.19.0 (see .nvmrc)
npm install
npm run dev        # start Vite dev server
```

### Useful scripts

```bash
npm run typecheck      # tsc -b
npm run lint           # eslint
npm run format         # prettier --write
npm run format:check   # prettier --check (used in CI)
npm run test           # vitest watch
npm run test:ci        # vitest run
npm run build          # type-check + production build to dist/
npm run preview        # preview the production build
```

Editing content: update `src/data/resume.ts` (profile + timeline entries).
Categories and their colors are defined in `CATEGORIES` there and in
`src/index.css` (the `--cat-*` tokens).

## Deployment (Cloudflare)

Hosted as a static-assets Worker. Environments are defined in `wrangler.jsonc`:

| Env  | Command               | Domain                 |
| ---- | --------------------- | ---------------------- |
| DEV  | `npm run deploy:dev`  | dev.hamid-rezaei.com   |
| UAT  | `npm run deploy:uat`  | uat.hamid-rezaei.com   |
| PROD | `npm run deploy:prod` | hamid-rezaei.com / www |

Custom domains (DNS + TLS) are provisioned automatically by Cloudflare on the
first deploy of each environment.

## CI/CD

GitHub Actions mirrors a trunk-based flow:

- **CI** (`ci.yml`) — reusable verify job (typecheck, lint, format:check,
  test). Runs on PRs into `master` and is called by every deploy workflow.
- **Deploy DEV** (`deploy-dev.yml`) — every push to a non-`master` branch → DEV.
- **Deploy UAT** (`deploy-uat.yml`) — every push to `master` → UAT.
- **Deploy PROD** (`deploy-prod.yml`) — manual (`workflow_dispatch`), gated by
  the GitHub `production` environment.

### Required GitHub configuration

Repository **secrets** (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — a Cloudflare API token with Workers + DNS edit
  permissions.
- `CLOUDFLARE_ACCOUNT_ID` — `b7a7b0eabf80b4f605f87632d460a229`.

Repository **environments** (Settings → Environments) — create `dev`, `uat`,
and `production`. Add required reviewers / protection rules to `production` for
a manual approval gate before prod deploys.
