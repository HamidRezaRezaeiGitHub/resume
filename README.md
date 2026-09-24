# Resume — hamid-rezaei.com

A mobile-first personal resume with light/dark themes, separate experience,
project, skill and education sections, and direct section navigation.

Use the Node version in `.nvmrc`, then:

```sh
npm ci
npm run dev
```

Start with the [project wiki](wiki/index.md) for architecture, content editing,
testing, and deployment. Public copy lives in `src/data/resume.json`.

The [content guide](wiki/guides/resume-content.md#editing-and-extension) includes
an example entry and explains skill graph references. Editors use the linked JSON
Schema for field hints; `npm run validate:content` checks the full contract. After
changing `resume.schema.ts`, run `npm run generate:content-schema` to refresh those
hints. PDF downloads remain separately maintained assets in `public/resumes/`.

Agent entry points share [AGENTS.md](AGENTS.md). The [AI pack guide](ai/README.md)
explains local requirement workspaces and the reusable workflow tooling.
