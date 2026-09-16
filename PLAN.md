# Project research and timeline enrichment

## Current revision

Research the sibling projects under `/Users/hamid/Documents/Coding` with a
separate sub-agent for each project. Read their wiki, implementation, and Git
history without changing those repositories. Record the evidence for useful
project details and dates, distinguishing starter commits from substantive work.

1. Inventory and research the sibling projects. Identify owned projects,
   templates, experiments, and any repositories that should not be presented as
   original work.
2. Make the current HSBC role the explicit first timeline entry. Sort the other
   entries chronologically, and label project dates derived from repository
   history. Validate and commit the ordering/content contract.
3. Enrich project content with short, specific descriptions and supported
   milestones. Keep research evidence in the repository and avoid presenting
   unfinished functionality as shipped. Commit the content update.
4. Run the complete CI gate and mobile/desktop browser checks. Push master and
   verify the UAT workflow before handing the result back for phone review.

## Completed implementation

- Researched all sibling project folders using sub-agent assignments, including
  both reusable templates. Preserved every sibling working tree.
- Committed explicit current-role ordering and visible repository-date
  provenance after its independent validation gate passed.
- Expanded the existing three projects and added eight project/template entries.
  Smaller tools use compact entries; larger projects have scrolling highlights.
- Added optional month/year milestone dates and kept all content in the JSON.
- Recorded source paths, commit dates, unfinished work, and exclusions in
  `docs/project-evidence.md`.
- Typecheck, lint, formatting, all 34 tests, and the production build pass.
- Production-browser checks pass at 320, 375, 390, 430, 768, 1024, and 1440px
  across every timeline entry. Role and project headings pin and release,
  dates render, both themes persist, and reduced motion and navigation work.
  No horizontal overflow or browser errors; phone/desktop screenshots reviewed.

## Final release checks

Commit the content, push master, and confirm GitHub CI plus UAT deployment
before phone review. Release status is recorded by the GitHub Actions run for
the pushed commit.

## Remaining content uncertainty

Dates from Git establish recorded development, not a confirmed date of project
inception. The separate HSBC platform/AI work still needs its parent role and
period confirmed. No dates or employer details were inferred from personal
repositories. Existing month/year career dates and the September 2023
FDM-to-permanent conversion remain as supplied.
