# Design system

How this site is built, and why. Reference for interface discipline:
[carlwrightdesign.com](https://carlwrightdesign.com/) (studied November 2026). What was borrowed is
his *system* — type scale, grid, spacing rhythm, navigation and reading tools — not his branding,
colour, typefaces for display, or writing.

## 1. Audit: what was different

Measured from both sites' CSS and from screenshots at 1440×900 and 390×844.

| Area | Carl Wright | This site, before | Change |
|---|---|---|---|
| Type families | 2: Outfit (display 300–600), Instrument Sans (text 400–700) | 3: Newsreader, Hanken Grotesk, DM Mono | 2 families. Keep Newsreader for display, take Instrument Sans for text, drop the mono |
| Body size | 17px, 18px from 900px; line-height 1.6 | 16.5px sans on pages, 19px serif in case studies | 17 / 18px sans everywhere; one reading voice |
| Heading scale | h1 34–60, h2 26–38, h3 19–23, all `clamp()` | h1 40–68 (home), 32–54 (case), section titles 28–40, ad hoc per component | One scale: h1 38–64, h2 28–40, h3 20–24 |
| Labels | 12px / 500 / .18em caps, in the interactive colour | 12px / 500 / .16em caps, muted grey | Same spec as Carl, in cobalt |
| Content width | 1440px max, fluid gutter `clamp(16px,5vw,72px)`, 12-col grid | 1120px max, fixed 24px gutter, no grid | 1440 / fluid gutter / 12 columns |
| Reading measure | 62ch prose | 38rem (~70ch) | 62ch |
| Home | Masthead panel (identity, contact, proof) beside the work | Sparse hero, then a 3-column hairline list | Cobalt masthead beside an editorial work index |
| Case hero | Plain page, title + summary + meta row + reading-depth control | Tinted band with ring texture, facts as a rail table | Plain page, meta grid, depth control |
| Case body | Sticky numbered rail with progress; each stage = title left, summary right | Sticky text label per chapter | Numbered rail with progress; stage heads |
| Mobile nav | "Menu" → full-screen dialog | Links wrap under the name (2 rows) | Menu dialog under 780px |
| Mobile case nav | Bottom bar: current section, progress, section sheet | None | Same |
| Résumé | Masthead band; 300px side panel (profile, skills, education, tools); experience column; case links | Single column with label rail | Same structure, Jude's facts |
| Decoration | None beyond panels and hairlines | Ring textures, per-case tints, arch number swatches | Removed. Paper grain kept, quieter |

## 2. Typography

- **Display — Newsreader** (Google Fonts, variable, optical size 6–72). Kept from the existing site:
  it is the most recognisable part of the identity and gives the editorial, research-journal tone.
  Weight 400 for headings, 300 for the large masthead statement. Carl's principle — light display
  weight, slight negative tracking, `text-wrap:balance` — applies unchanged.
- **Text — Instrument Sans** (Google Fonts, 400/500/600). This is Carl's text face. It replaces Hanken
  Grotesk because it holds up better at 15–18px, has real tabular figures (so the mono face for
  numbers can go), and its 500/600 weights carry labels and navigation cleanly.
- **Not used — Outfit.** Carl's display face is the most identifiable part of his brand; copying it
  would make the site read as his.

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `.h1` | clamp(38px, 4.4vw, 64px) / 1.06 | Newsreader 400 | Page titles |
| `.statement` | clamp(40px, 4vw, 60px) / 1.04 | Newsreader 300 | Masthead name/greeting |
| `.h2` | clamp(28px, 2.8vw, 40px) / 1.14 | Newsreader 400 | Section and stage titles |
| `.h3` | clamp(20px, 1.6vw, 24px) / 1.28 | Newsreader 400 | Sub-sections, list titles, roles |
| `.lead` | clamp(18px, 1vw + 10px, 21px) / 1.5 | Sans 400 | Summaries, deks |
| body | 17px → 18px at ≥900px / 1.6 | Sans 400 | Everything you read |
| `.sub` (h4) | 17–18px / 1.4 | Sans 600 | Headings inside a stage |
| `.meta` | 15px / 1.5 | Sans 400, muted | Dates, captions, supporting lines |
| `.overline` | 12px / 1.3, tracking .18em, caps | Sans 500, cobalt | Section labels, fact labels |
| small | 13.5–14px / 1.45 | Sans 400–600 | Diagram labels, tags |

Prose measure: 62ch. Headings use `text-wrap:balance`; paragraphs `text-wrap:pretty`.

## 3. Colour

Five brand colours, each with one job. Nothing else is introduced except tints of these.

| Token | Light | Dark | Job |
|---|---|---|---|
| `--canvas` | #F5F2EA page cream | #141414 | Page |
| `--panel` | #EBE7DC panel cream | #1F1E1B | Bands, side panels, data panels |
| `--surface` | #FBF9F4 | #1A1917 | Diagrams and raised rows |
| `--ink` | #141414 | #F5F2EA | Text |
| `--muted` | #5B5850 (6.4:1) | #B3AEA3 | Secondary text |
| `--cobalt` | #1A44C2 (7.1:1 on cream) | #8EA6F2 (7.8:1) | Everything interactive; masthead |
| `--yellow` | #FFD21F | #FFD21F | Small marks only: masthead labels, current-section dot, highlights in diagrams |
| `--mast` | #1A44C2 | #1B3A99 | Masthead bands and footer (white text 7.9:1 / 10:1) |

Rules borrowed from Carl: anything clickable is cobalt; tags and facts are not. Yellow is never text
on cream (1.3:1) — it appears on cobalt (5.5:1), or as a fill behind ink.

Diagram palette: "before / problem" = yellow tint, "proposed / neutral" = panel cream,
"result" = cobalt tint with a cobalt outline.

## 4. Space and layout

- Max width 1440px; gutter `clamp(16px, 5vw, 72px)`; 12 columns, gap `clamp(16px, 2vw, 32px)`.
- Spacing steps: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Section padding `clamp(64px, 8vw, 120px)`; case stage padding `clamp(44px, 5vw, 80px)`.
- Header 72px, 58px once scrolled; hides on scroll down, returns on scroll up.
- Hairlines: 1px `--rule`. Radius: 4px controls, 8px diagrams, 14px masthead panels. No shadows
  except on hover of the masthead buttons.

Breakpoints:

| Width | What changes |
|---|---|
| ≤1100px | Home masthead stacks above the work list; case rail becomes the bottom bar |
| ≤900px | Body 18 → 17px; résumé and About side panels move below the main column |
| ≤780px | Navigation collapses to "Menu" + full-screen dialog |
| ≤620px | Case meta grid to one column; contact rows stack |
| ≤520px | Reading-depth control fills the width |

## 5. Components

- **Header** — name (Newsreader 20px) left; Work, About, Résumé, Contact (sans 500 15px, 44px targets,
  animated 1.5px cobalt underline for hover and current page); theme button.
- **Masthead** (`.mast`) — cobalt panel: yellow overline, statement, tagline, contact list with
  hairline dividers, lead, two buttons (light + ghost), three facts.
- **Work index** (`.work-list`) — one hairline row per case: number, overline, Newsreader title,
  summary, status line, "Read case study →". No card containers.
- **Case meta** — `<dl>` on the 12-column grid (long values span 6, short span 3), hairlines above and
  below; reading-depth segmented control under it.
- **Reading depth** — *Quick Look* (stage titles, opening paragraphs, key turns, exhibits),
  *Full Story* (everything, the default), *Deep Dive* (also opens every expandable source note; only
  offered where a case has them). Minutes are computed from word counts. Choice is remembered.
  In Quick Look each stage gets "Read this section".
- **Rail** — sticky numbered list with a cobalt progress line; labels appear on hover or for the
  current stage. Under 1100px: fixed bottom bar with progress, current stage and a section sheet.
- **Stage** — overline "01 · Context", title left (5 cols), opening paragraph right (7 cols, lead
  size), then the story at 62ch.
- **Insight** — Newsreader 22–26px, 1.5px cobalt rule above, 40ch.
- **Exhibit** — surface background, 1px rule, 8px radius, overline + h3 title, caption below.
- **Expandable** (`details.more`) — "+" disc, cobalt label, hairlines above and below.
- **Résumé** — masthead band; 300px panel (Profile, Research & strategy, Education, Tools); experience
  with dated roles, cobalt role titles, short cobalt dash bullets; links to the case studies.
- **Footer** — cobalt band: name, title, page links, contact, colophon.

## 6. Motion

160ms for colour and small shifts, 240ms for underlines and header, 480ms max. Easing
`cubic-bezier(.2,0,0,1)`. All movement is removed under `prefers-reduced-motion`.

## 7. Accessibility

44px minimum targets; visible 2px focus ring (cobalt, white on cobalt); skip link; the menu and the
section sheet are native `<dialog>`s (focus trapped, Escape closes); the depth control is a
`radiogroup` with arrow-key support; everything hidden by Quick Look is still in the page for print
and returns automatically if a link points into it.
