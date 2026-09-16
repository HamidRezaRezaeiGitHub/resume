# Resume website redesign

## Direction

Create an editorial, mobile-first resume with warm ivory, charcoal, lime accents,
large typography, and a restrained systems-inspired visual. Lead with concrete
impact; make the career easy to scan and deeper evidence optional to expand.
Keep all career claims grounded in the supplied JSON.

## Phases

1. Refine copy and add structured dates, impact highlights, and case-study teasers.
   Validate the content contract and commit.
2. Rebuild responsive navigation, hero, dated scroll timeline, work, projects,
   floating skills, and contact. Respect reduced motion and keyboard navigation.
   Check the implementation and commit.
3. Inspect desktop and phone layouts, verify interactions and the complete CI
   gate, fix any issues, and commit the review-ready result.
4. Push master, watch the UAT workflow, and verify the deployed page.

## Verification

- Content validation, TypeScript, ESLint, Prettier, Vitest, production build.
- Phone and desktop: overflow, readable typography, navigation, expandable
  details, links, scroll effects, reduced motion, and browser errors.
- Verify GitHub CI and UAT deployment against the pushed commit.

## Date precision

HSBC roles have supplied month/year dates. Education and teaching retain
year-only dates until more precise dates are supplied. The September 2023
employment conversion remains distinct from the June 2023 team transition.

## Completed implementation and local verification

- Content and structured chronology committed separately from the visual rebuild.
- Desktop and touch-browser layouts inspected at 320, 375, 390, 430, 768, 1024,
  and 1440 pixels; the production build has no horizontal overflow.
- Verified navigation, live career dates, native disclosures, all skill filters
  at 320 pixels, decorative-motion pause, and reduced-motion rendering.
- No browser JavaScript errors. Typecheck, lint, formatting, 19 tests, and the
  production build pass.
- Review target: `https://uat.hamid-rezaei.com`. Deployment confirmation belongs
  to the GitHub Actions `Deploy UAT` run for the pushed release commit.
