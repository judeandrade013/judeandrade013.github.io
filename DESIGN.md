# Design notes

The visual identity is unchanged: the paper/terracotta/sage palette, Newsreader with Hanken Grotesk
and DM Mono, the paper grain and ring textures, the per-case colour bands, the illustration and
photographs, and all copy. Colours live only in the two token blocks at the top of `site.css`.

In November 2026 a set of **structural and usability patterns** was added, borrowed from
[carlwrightdesign.com](https://carlwrightdesign.com/) for their clarity, not their look. They live in
section 11 of `site.css` and in `site.js`, and use only the existing tokens.

| Pattern | Where | What it does |
|---|---|---|
| Phone menu | every page, under 640px | Links collapse into "Menu", which opens a full-screen list; Escape closes it and focus returns to the button |
| Header on scroll | every page | The sticky nav slides away while scrolling down and returns on the way up or on keyboard focus |
| Section rail | case studies, from 900px | The four stages listed in the label column, with a terracotta line showing reading progress and the current stage underlined |
| Stage titles | case studies | Each stage opens with its number and name, then the story's first heading as a title, so the page can be skimmed by heading |
| Reading depth | taxi, digital services, memorial park, fees | *Quick Look* keeps each stage's title, opening paragraph, turning point and exhibits; *Full Story* is everything (default); *Deep Dive* also opens the source notes, offered only where they add a minute or more. Not offered on KOALA, which is already short. The choice is remembered; a link into hidden text opens its stage |
| Section bar | case studies, under 900px | A bar fixed at the bottom shows progress and the current stage, and opens a list of stages |
| Résumé side panel | résumé | Experience leads; profile, skills, education and tools sit in a panel beside it (below it on phones). Prints on two pages |

Layout values reused throughout: `--rail` 13rem label column, `--rail-gap` 32–64px, `--measure`
38rem reading width, 1120px page width, section spacing `--space-section`.
