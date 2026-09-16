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

## Implementation and local verification completed

- Theme selection, saved preference, system default, and blocked-storage fallback.
- One timeline containing every role, work example, education record, teaching
  role, and personal project; direct copy replaces the previous section slogans.
- Chapter headings pin and release correctly at 390px and 1440px. Layout checks
  pass at 320, 375, 390, 430, 768, 1024, and 1440 pixels without overflow.
- Production-browser checks pass for theme persistence, navigation, skill
  filters, reduced motion, and JavaScript errors.
- Typecheck, lint, formatting, 28 tests, and the production build pass.
- Project start dates and the role for the platform/AI examples remain
  unconfirmed. Those records are explicitly undated, ready for JSON updates.

The UAT release result is recorded by the GitHub Actions run for the pushed
commit at `https://uat.hamid-rezaei.com`.
