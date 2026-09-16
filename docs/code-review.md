# Application review

Reviewed the React components, browser hooks, editable content contract,
TypeScript/build configuration, responsive CSS, accessibility behavior, theme
bootstrap, and CI workflow on 2026-09-16.

## Findings addressed

- **Type safety:** enabled strict TypeScript checks for the app and Vite
  configuration. Removed the unnecessary double assertion at the JSON boundary;
  the schema still validates content before development and production builds
  without shipping Zod to the browser.
- **Component responsibilities:** split chapter composition, heading rendering,
  and achievement animation into `TimelineItem`, `TimelineHeading`, and
  `TimelineAchievement`. The section owns content lookup and ordering. Child
  components receive explicit typed props instead of reading global content.
- **Consistent presentation:** category icons now have one exhaustive typed
  mapping; technology lists have one renderer. `currentRoleId` determines both
  the large Current label and current-role badge, removing duplicated status
  from the JSON.
- **Skill selection:** selecting a filter stores its actual option, eliminating
  a non-null assertion after a lookup by title. The content contract rejects
  duplicate filter names and the reserved Overview name.
- **Content integrity:** anchor IDs must be usable fragments and cannot collide
  with generated headings or reserved navigation IDs. External links use
  HTTP(S), with unique labels and URLs within each list. Repeated string-list
  values are rejected before they can produce duplicate React keys.
- **Behavioral coverage:** added regression checks for those content failures,
  denied clipboard access, system-theme updates, explicit theme preference,
  and media-query listener cleanup.
- **Build scope:** restricted Tailwind class detection to application source so
  research and review documents do not add generated styles to the website.

## Design assessment

The app uses composition and small prop contracts to separate responsibilities.
Pure date/ordering functions stay outside components. Browser effects remain in
their owning hooks or components, with observer/listener cleanup. State stays
local to the feature using it. Static content is validated at the build boundary.
These choices apply SOLID's intent to a small React app without requiring an
object-oriented service hierarchy.

The review also checked semantic headings and lists, category text alongside
color, keyboard navigation, theme persistence when storage is unavailable,
reduced motion, and viewport behavior. CSS controls reading density; motion
does not create artificial scroll space or remove content from the document.

## Validation

Local strict typecheck, lint, formatting, all 49 tests, and the production build
passed. Browser checks passed across seven widths from 320px to 1440px after the
refactor, with no overflow or JavaScript errors.

The release gate includes strict typecheck, ESLint, Prettier, the full Vitest
suite, content validation, and the production build. Browser checks cover
320–1440px widths, current-role labeling, dates, sticky headings, navigation,
all skill filters, theme persistence, reduced motion, and JavaScript errors.
The final pushed commit must also pass GitHub CI and the UAT deployment; its
workflow run is the release record.
