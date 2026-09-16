# Resume content refinement

## Requested changes

Keep only BuyOrRent, man-agent-ment, and Buildean as personal projects. Focus
BuyOrRent on the new backend and MCP tools, with Flutter explicitly in progress.
Remove repository-history labels from the website. Move the platform/AI work
under the current HSBC role, as confirmed by the user and supplied resume image.
Use that image to refine professional content, skills, and education dates.

## Implementation order

1. Update the JSON and content contract. Require dates for timeline chapters;
   work examples without separate dates belong within their confirmed role.
   Remove the provenance field and UI, keeping research evidence in docs only.
2. Refine the three project entries, current HSBC achievements, skill groups,
   and month/year education dates. Preserve the established functional-team
   chronology and the qualified scope of the platform proof-of-concept result.
3. Validate the content, CI checks, production build, and responsive scrolling.
   Commit the coherent revision, push master, and verify CI/UAT before review.

## Verification

Only the three selected personal projects render; every chapter has a date;
platform/AI highlights appear once under the current role; no research labels
appear in the UI. Check the longer current-role chapter on phones and desktop,
light/dark mode, sticky release, navigation, and reduced motion. Run typecheck,
lint, formatting, tests, and build, then confirm the deployed UAT content.

## Completed local verification

- Only three selected projects render; all nine timeline chapters are dated.
- Platform/AI highlights render under the current HSBC role, with no duplicate
  standalone entry or public research label.
- Typecheck, lint, formatting, 34 tests, and the production build pass.
- Browser checks pass at 320, 375, 390, 430, 768, 1024, and 1440px: no overflow,
  correct sticky pin/release through the moved AI content, both themes,
  navigation, every skill filter, reduced motion, and no JavaScript errors.
- Phone and desktop screenshots reviewed. Release status is tracked in the
  GitHub Actions run for the pushed commit.
