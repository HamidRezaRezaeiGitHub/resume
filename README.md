# Resume — hamid-rezaei.com

A mobile-first resume with light and dark modes, one chronological timeline,
scrolling achievements under sticky job titles, a filterable toolkit, and contact
links. Category labels, icons, and colors distinguish professional experience,
personal projects, education, and teaching.

## Tech stack

| Area        | Choice                                                                 |
| ----------- | ---------------------------------------------------------------------- |
| Build tool  | [Vite](https://vite.dev/) + React 19 + TypeScript                      |
| Styling     | Custom responsive CSS with [Tailwind CSS v4](https://tailwindcss.com/) |
| Animation   | [Motion](https://motion.dev/) (scroll-linked timeline)                 |
| UI          | Custom React components and Lucide icons                               |
| Testing     | [Vitest](https://vitest.dev/) + Testing Library                        |
| Lint/Format | ESLint + Prettier                                                      |
| Hosting     | Cloudflare Workers (static assets)                                     |

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

## Editing resume content

Career content lives in `src/data/resume.json`. The page has four sections:
hero, experience, toolkit, and contact. All roles, projects, education, and
teaching records belong in the single `timeline` array.

- `category` is `experience`, `project`, `education`, or `teaching`.
- `startDate` and optional `endDate` accept `YYYY-MM` or `YYYY`. Use `"present"`
  for an ongoing entry. If a start date is unknown, omit both dates: the entry
  displays **Date not listed** after the dated entries. Never invent a month.
- `currentRoleId` references an ongoing professional entry and keeps it first.
  Everything else sorts by start date, newest first. Overlapping dates are
  retained; equal dates and undated records keep their supplied order.
- Set `dateBasis: "repository"` for project dates established from meaningful
  Git history. The page labels these as **From repository history**, rather
  than claiming they are confirmed project inception dates.
- `title`, `organization`, `team`, and `summary` describe the entry. `stage`,
  `location`, `tags`, and external `links` are optional.
- Nested `highlights` hold a role's work examples. Each has a unique `id`, a
  plain-language `title`, and `body`. Optional `details` add short bullets, and
  `tags` identify the technologies involved.
- An achievement's optional `metric` has both `value` and `label`. Keep any
  qualification with the result, such as one selected trade type during a
  defined evaluation period.
- `skillOverview` selects the opening skill cloud. Every value must also appear
  in `skillGroups`, which supply the discipline filters.
- `careerNote` keeps the FDM-to-HSBC employment change separate from team moves.

The schema in `src/data/resume.schema.ts` validates the JSON before development
and production builds. It checks dates, navigation, categories, links, metrics,
skill membership, and globally unique entry/achievement IDs. Validation is kept
out of the browser bundle.

Project records can be positioned using confirmed dates or clearly identified
repository evidence. Platform/AI work remains its own undated HSBC entry until its parent role
is confirmed; its highlights can then be moved into that role's `highlights`.

## Interaction and accessibility

Each timeline entry contains its own sticky heading. On desktop, it stays beside
the achievements; on phones, it stays below the navigation. The heading leaves
with its entry, letting the next one take its place. Achievements move and fade
as they pass through the viewport, while their content remains in the document.
Short landscape screens use normal headings to leave room for reading.

Theme buttons in the header expose light and dark modes. The initial theme uses
the system preference unless the visitor has saved a choice. `public/theme.js`
applies that choice before the first paint; `useTheme` manages changes. Blocked
browser storage does not prevent theme selection.

Navigation, theme controls, skill filters, and contact actions support keyboards
and touch. Category icons and labels supplement color. Reduced motion disables
parallax, achievement movement, fades, smooth scrolling, and decorative loops.
The pause control stops decorative loops. System fonts avoid remote font loads.

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
