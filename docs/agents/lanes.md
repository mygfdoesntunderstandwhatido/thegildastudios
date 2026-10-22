# Lanes and parallel waves

Each issue is fixed to one lane (`agent:claude` or `agent:codex`). The waves below come from the **Depends on** lists: everything in a wave can run at the same time once the waves before it are merged. Within a wave, Claude and Codex work in parallel.

The live source of truth is GitHub: the `status:ready` label means every dependency is closed.

## Waves

| Wave | Claude Code   | Codex cloud        |
| ---- | ------------- | ------------------ |
| 1    | #1            | —                  |
| 2    | #2            | #3, #5             |
| 3    | #4            | —                  |
| 4    | —             | #6                 |
| 5    | #8            | #7                 |
| 6    | #9, #12       | #10, #11, #13, #14 |
| 7    | #15, #18, #26 | #16, #20, #21      |
| 8    | #17, #24      | #22, #23, #32      |
| 9    | #19, #25      | —                  |
| 10   | #27           | —                  |
| 11   | #28           | —                  |
| 12   | #29, #30      | —                  |
| 13   | #31           | —                  |
| 14   | #33           | —                  |

A wave can start early if its own dependencies are already closed. `status:ready` tracks this per issue. A batch PR can also run on into the next wave: if it already covers an issue's open dependencies in the same lane, that issue joins the same PR (`AGENTS.md`, step 1).

## Files to watch for conflicts in the same wave

- **Wave 6:** #9 (header) and #10 (footer) both get included in the base layout. Each adds only its own include line, and the second PR rebases.
- **Wave 7:** #20 and #21 (Codex) and #26 (Claude) each add a page and a content schema. Use one schema file per collection, and add one registration line each to `src/content.config.ts`.
- **Wave 8:** #22 and #23 both extend the Services page from #21. They're in the same lane, so run them one after the other.

## Every issue

| Issue | Lane   | Title                                                                                      | Depends on                       |
| ----- | ------ | ------------------------------------------------------------------------------------------ | -------------------------------- |
| #1    | Claude | [1.1] Scaffold the project with the chosen stack, linting, formatting and a CI build check | —                                |
| #2    | Claude | [1.2] Set up deployment with preview deploys on PRs                                        | #1                               |
| #3    | Codex  | [2.1] Port the design tokens into CSS custom properties                                    | #1                               |
| #4    | Claude | [2.2] Self-host the fonts with preload                                                     | #1, #3                           |
| #5    | Codex  | [2.3] Add and optimise the logos, mark pieces, illustrations and graphics                  | #1                               |
| #6    | Codex  | [2.4] Add the base styles: reset, body type, links, band backgrounds and rules             | #3, #4                           |
| #7    | Codex  | [3.1] Build the core primitives: Button, Label and Chip                                    | #6                               |
| #8    | Claude | [3.2] Build the brand components: Mark, Wordmark, Lockup and BranchDots                    | #5, #6                           |
| #9    | Claude | [3.3] Build the site header with desktop nav and a mobile menu                             | #7, #8                           |
| #10   | Codex  | [3.4] Build the site footer with the link structure from the design                        | #7, #8                           |
| #11   | Codex  | [3.5] Build the section header: numbered mono label with a hairline to the edge            | #7                               |
| #12   | Claude | [3.6] Build the collapsible "What is included" disclosure                                  | #6, #7                           |
| #13   | Codex  | [3.7] Build the testimonial component with a link to the related case study                | #6, #7                           |
| #14   | Codex  | [3.8] Build the "We'll take it from here" CTA band                                         | #6, #7, #8                       |
| #15   | Claude | [4.1] Build the dark hero with the interactive gilda mark                                  | #5, #8, #9                       |
| #16   | Codex  | [4.2] Build the "Where the name comes from" section                                        | #8, #11                          |
| #17   | Claude | [4.3] Build the Plan / Build / Grow branch overview                                        | #15                              |
| #18   | Claude | [4.4] Build the testimonial rotator                                                        | #13                              |
| #19   | Claude | [4.5] Assemble the homepage and check it against the design                                | #2, #10, #16, #17, #18           |
| #20   | Codex  | [5.1] Build the About page: founding story and team bios                                   | #9, #10, #11, #14                |
| #21   | Codex  | [5.2] Build the Services page shell and the Plan section                                   | #9, #10, #11, #12, #14           |
| #22   | Codex  | [5.3] Build the Services page Build section (web design in six phases)                     | #21                              |
| #23   | Codex  | [5.4] Build the Services page Grow section (social media and marketing)                    | #12, #21                         |
| #24   | Claude | [5.5] Build the case study template                                                        | #9, #10, #11, #12, #13, #14, #18 |
| #25   | Claude | [5.6] Build the Projects index and the three case studies                                  | #24                              |
| #26   | Claude | [5.7] Design and build the Contact / booking page                                          | #7, #9, #10, #11                 |
| #27   | Claude | [6.1] Move page copy, services, case studies and testimonials into Keystatic               | #19, #20, #23, #25, #26          |
| #28   | Claude | [6.2] Add meta tags, Open Graph images, sitemap, robots.txt, icons and structured data     | #5, #27                          |
| #29   | Claude | [7.1] Run an accessibility pass to WCAG 2.2 AA                                             | #28                              |
| #30   | Claude | [7.2] Run a performance pass to Lighthouse 95+                                             | #28                              |
| #31   | Claude | [7.3] Run cross-browser and device QA against the design at 375, 768, 1280 and 1440px      | #29, #30                         |
| #32   | Codex  | [8.1] Set up the contact form backend, analytics, a 404 page and redirects                 | #2, #26                          |
| #33   | Claude | [8.2] Write a launch checklist and go live on the production domain                        | #31, #32                         |

## Why the lanes are split this way

- **Claude Code** runs locally, with a browser preview and access to your Netlify and GitHub accounts. So it takes:
  - account setup: #1, #2, #27, #33
  - the interactive pieces: #9 mobile menu, #12 disclosures, #15 and #17 hero mark and strip, #18 rotator, #24 and #25 case studies with filters
  - the undesigned contact page (#26)
  - the font sourcing that needs internet (#4)
  - visual assembly and QA: #19, #29, #31
- **Codex cloud** runs offline from the repo, so it takes well-specified builds with exact copy: tokens (#3), assets (#5), base styles (#6), static components (#7, #10, #11, #13, #14), content pages (#16, #20–#23), SEO (#28), the performance pass (#30) and the form, 404 and redirects (#32).
- To move an issue to the other lane, swap its label on GitHub and update this table.
- #28 and #30 moved from Codex to Claude Code on 22 October 2026, when Codex ran out of capacity. Claude Code took over their open PR's work and finished it in the same batch as #29.
