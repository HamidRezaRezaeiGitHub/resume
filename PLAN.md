# Unified resume timeline

## Requested revision

Keep the hero first and toolkit/contact last. Combine professional roles, their
work examples, education, teaching, and independent projects into one timeline.
Use plain, specific copy. Add light/dark themes and scroll chapters whose titles
stay pinned until their achievements have passed.

## Implementation order

1. Restore theme selection, saved preferences, and theme-aware color tokens.
   Validate and commit this independently.
2. Consolidate content into timeline entries with nested achievements. Rebuild
   the timeline around sticky chapter headers and scroll-linked achievement
   movement. Keep categories identifiable by label, icon, and color. Commit.
3. Verify the content contract, interaction behavior, responsive layout, reduced
   motion, and the complete CI gate. Push master and confirm UAT deployment.

## Content precision

Keep the supplied month/year dates and the separate September 2023 employment
conversion. Ask for missing independent-project start dates and confirmation of
which role owns the platform/AI examples. Until supplied, keep those entries
explicitly undated rather than assigning a speculative date or role.

## Verification

TypeScript, ESLint, Prettier, Vitest, production build, theme persistence and
storage fallback, unified timeline coverage, structured date validation,
scroll chapter behavior, and successful GitHub CI/UAT deployment.
