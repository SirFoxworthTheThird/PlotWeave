# UX review — working document

A screen-by-screen review of PlotWeave's interface, started after v1.0.0. The
premise is that a released version is exactly when reworking is affordable, so
nothing here is constrained to small fixes: where a screen would be better built
differently, that is what the entry says.

**This is a working document, not user documentation.** It is a shared list to
argue with, tick off, and eventually delete.

---

## Method

Screens were captured from the real app driven by Playwright at
`deviceScaleFactor: 2`, 1440×900, against two worlds:

- **A populated world** — *The Fellowship of the Ring* imported from
  `example/` with its `.pwb` images. That file carries no `readingMode` flag, so
  it opens in **writing mode**; the dashboard shows the alive/dead split, Scene
  Status, and Writing Progress, all three of which reading mode removes. The
  populated screens are therefore the writer's UI, not the reader's.
- **A brand-new empty world** — created through the real *New World* flow, then
  built up one chapter, one event, and one character at a time, capturing each
  empty screen and each creation dialog on the way.

Reading mode has **not** been reviewed yet, and neither have phone widths.

## Legend

| | |
|---|---|
| **Severity: high** | Actively misleads, blocks, or makes the product look broken |
| **Severity: med** | Costs the user time or confidence every time they meet it |
| **Severity: low** | Polish; worth doing when the surrounding area is touched |
| **Status** | `open` · `agreed` · `doing` · `done` · `rejected` |

---

## Cross-cutting

These recur on nearly every screen, so they are worth settling once rather than
per page.

| ID | Severity | Status | Finding |
|---|---|---|---|
| X-1 | high | open | **The watermark competes with the content.** A very large PW logo over a map illustration sits behind every screen. On populated screens it shows through the gaps; on empty screens it is the loudest thing in view, with far more visual mass than the actual message. Empty screens read as decorative rather than actionable. |
| X-2 | high | open | **Wide viewports are largely unused.** Content columns stop around 55–65% of a 1440px window, leaving a third of the screen as wallpaper, while the panels that *are* shown get cramped. |
| X-3 | med | open | **14 unlabelled nav icons, one faint divider.** Corkboard, Structure, and Arc are three abstract grid glyphs in a row and cannot be told apart without hovering each. The guide describes a "More" divider separating everyday screens from the rest; visually that split barely registers. |
| X-4 | med | open | **Empty states are inconsistent.** Some are excellent (Arc: heading, explanation, and a CTA routing to the prerequisite). Others are italic grey sentences sitting where a control should be ("No characters assigned.") with no affordance to act. Others are simply blank panels. |
| X-5 | med | open | **Permanent help text.** Explanatory sentences under form fields never go away. The writing is good, but once learned it is noise on every future visit. |
| X-6 | low | open | **Dates are unlabelled and US-format.** `4/1/2026` on a world card — created or edited, April or January? |

---

## 1. World selector

| ID | Severity | Status | Finding |
|---|---|---|---|
| SEL-1 | high | open | **Five equal-weight entry points, no hierarchy.** Library / Generate from AI / Import World / Import Manuscript / New World. Three mean "I already have something", two mean "I'm starting fresh", and nothing groups them. A newcomer must read all five to find themselves. |
| SEL-2 | high | open | **Permanent instructional text in the header** explaining the import file formats — an action nobody has started, described with two extensions (`.pwk`, `.pwb`) a new user has never seen. Belongs inside the import dialog. |
| SEL-3 | med | open | **The world card is poorer than the Library card.** Name, an unlabelled date, a truncated description. No chapter or cast count, no cover art — even for a world whose images were imported. The card seen a hundred times tells less than the one seen once. |
| SEL-4 | med | open | **"Story Tracker" undersells the product.** The guide's own framing — *a story bible for fiction writers* — is more specific and more appealing. |
| SEL-5 | low | open | **"New World" appears twice**, as a header button and as a dashed tile, with no stated relationship. |

**If rebuilt:** two zones. *Start something* — one primary action plus a quiet
"or bring in a draft you already have" that opens a single chooser for
import/manuscript/AI. Then *your shelf*, with cover art, chapter and scene
counts, and relative dates.

---

## 2. World dashboard

| ID | Severity | Status | Finding |
|---|---|---|---|
| DASH-1 | high | open | **The Continuity tile shows `—`.** Every other tile shows a number; the one tile whose entire purpose is to warn you says nothing, and a dash reads as broken or still loading rather than "not run yet". |
| DASH-2 | med | open | **"Character Arc / snapshot coverage / 100%"** — the title names a screen while the metric measures something else. Two concepts in one tile. |
| DASH-3 | med | open | **Recent Events has ambiguous reading order.** Two columns running Ch 6 → 12 → 21 on the left and Ch 1 → 2 on the right; column-major or row-major is unclear, and "recent" is never defined. |
| DASH-4 | low | open | **Ragged tile grid** — four over three, with a hole where the eye expects a fourth. |
| DASH-5 | low | open | **A generic person glyph represents the world**, even when the world has images. |

**If rebuilt:** the dashboard's question is *"what should I do next?"*, not
*"how big is my world?"*. Lead with continuity problems, scenes still in
Idea/Outline, and threads that have gone quiet. Demote raw counts to a thin
strip.

---

## 3. First run — the four-step setup guide

| ID | Severity | Status | Finding |
|---|---|---|---|
| NEW-1 | high | open | **The full 14-icon nav rail is present during onboarding**, so every one of a dozen empty screens is one click away from a flow that is trying to guide you. The guide and the freedom undercut each other. |
| NEW-2 | med | open | **The step indicator is four bare numbers.** You cannot see what you are committing to, how long it is, or what step 3 will ask. |
| NEW-3 | med | open | **"Begin" is the label on step 1 of 4** — it reads as "start the wizard", but the wizard has already started; it means "next". |
| NEW-4 | med | open | **Content occupies the top-left third**; the remaining two-thirds is watermark (see X-1, X-2). At this moment — the very first screen of a new world — the impression is emptiness rather than invitation. |
| NEW-5 | low | open | **No way back.** There is a forward action and "Skip and explore on my own", but no step-back once you are past step 1. |

**Credit:** the copy is genuinely good — *"Your story begins with a moment"*,
and placeholders like *"The Age of Embers, The Long Road, Act One…"* teach by
example rather than instruction.

---

## 4. The expanded event card

The densest form in the app, and the one a writer meets most often.

| ID | Severity | Status | Finding |
|---|---|---|---|
| EV-1 | high | open | **Roughly a dozen sections, flat and all expanded at once** — description, scene draft, tags, characters, mentions, elapsed time, flashback, story beat, and more below the fold. A scene that has just been created and needs only a title and some prose presents its full ontology immediately. |
| EV-2 | high | open | **The Character States panel is a large empty column** with no empty state at all — no heading explanation, no "assign characters to see them here". It is simply blank. |
| EV-3 | med | open | **The most important field is third.** Scene Draft sits below Description, and Description renders as italic "No description." — which reads as a read-only note rather than something you can click and type into. |
| EV-4 | med | open | **Characters has no visible add control** in the expanded card; just the sentence "No characters assigned." |
| EV-5 | med | open | **Delete sits in the header beside the status pill and the reorder arrows**, giving a destructive action the same weight and neighbourhood as routine ones. |
| EV-6 | low | open | **Focus mode is a very small text affordance** ("Focus  0 words") for one of the nicer features in the product. |
| EV-7 | low | open | **The chapter bar looks broken with one chapter.** A truncated "1 · T…" segment and a clipped "+" read as a rendering fault rather than an empty track. |

**If rebuilt:** title and prose first, everything else progressively disclosed —
a quiet row of "add location / cast / thread / beat" chips that expand on
demand. The full ontology stays available and stops being the default view.

---

## 5. Doing things — findings from driving a real session

These came from operating the app rather than looking at it: creating a world
through the guide, adding a cast, uploading images, and reaching for the
everyday tools. Each was then **re-verified in isolation**, because the first
run's failures turned out to be mostly bad selectors in the harness rather than
faults in the product. Only what survived that second check is listed.

| ID | Severity | Status | Finding |
|---|---|---|---|
| OP-1 | high | open | **One Escape closes two layers.** Open a dialog (Add Character), press Ctrl+K, and the search palette opens *on top of it*. A single Escape then dismisses **both** — verified: palette `false`, dialog `false` after one press. A user who searches for a name mid-form and presses Escape to get back loses the half-filled dialog and its input. Escape should dismiss the topmost layer only. |
| OP-2 | med | open | **An open palette traps you.** With the palette up, the nav rail is unreachable: the link resolves but the click is intercepted by the overlay, so the only way out is Escape. That is defensible for a modal on its own, but combined with OP-1 it means overlay layering is not being managed deliberately — the palette will happily stack on anything, and Escape does not respect the stack. |
| OP-3 | med | open | **The first-run guide creates more than it says.** Step 1 asks only for a timeline name, under the heading *"Your story begins with a moment"*. Verified by reading IndexedDB straight after: naming a timeline and a character leaves **1 chapter, 1 event, and 1 character** in the world. The chapter and the event were never named, shown, or mentioned — the user then meets a "Ch. 1" and an untitled scene they did not knowingly make. Either say so, or let them name the scene, which is what the heading already promises. |
| OP-4 | low | open | **Two buttons whose names both begin with "Add", adjacent.** On the character step, *"Add a description (optional)"* (a disclosure) sits directly above the primary *"Add them to the story"*. Clicking the wrong one silently expands a field instead of submitting, with no feedback that nothing happened. It cost this review a whole run. |

| OP-5 | high | open | **Finishing the first-run guide leaves no time cursor set.** The pill reads *"All chapters"* the moment the guide ends — verified twice, and visible in the capture. Step 3 of that same guide is headed *"Where does their story begin?"* and places the character at Ch. 1, so the guide selects a moment on the user's behalf and then hands them an app that has forgotten it. Everything cursor-dependent is consequently switched off for a brand-new user who has done everything they were asked. |
| OP-6 | med | open | **A disabled primary button with no reason given.** *Add Location* is greyed until Name is filled, with no required marker, no helper text, and no message on hover. Nothing says which field is blocking it. |
| OP-7 | low | corrected | **Map placement is gated on the time cursor — and the app says so.** `MapSidebar.tsx` renders the crosshair only inside `{activeEventId && …}`, so with no cursor there is no placement control and no drag. This was first written up as a silent lockout; that was wrong. The sidebar prints *"Select an event from the timeline bar below to place characters onto the map."* The gate is deliberate and explained, so what is left is minor: the 60%-opacity card is a weak signal next to a clear sentence, and the sentence points at the bar rather than offering a way to act. |

**Note on method.** The first attempt at this journey produced fourteen failing
steps that looked like a damning list and were not: a stray palette opened
early, swallowed every click, and everything downstream failed for that one
reason. The rewritten harness makes every step assert **its own effect** rather
than merely not throwing — the earlier version happily reported `OK` for a
click that expanded a disclosure instead of submitting a form. On the second
run **21 of 22 steps passed**, with zero page or console errors.

**OP-7 was overstated and has been corrected.** It was first filed as a silent
lockout, on a reading of the source alone. Checking the running app turned up
an explanatory sentence in the sidebar that the code read had missed, so the
finding drops from *med* to *low* and changes character entirely. It is left in
the table rather than deleted, because the correction is the useful part.

The consequence for **OP-5** sharpens, though: a new user who finishes the guide
lands with no cursor, and the message that tells them what to do points at the
chapter bar — which in a one-chapter world is the clipped, truncated strip filed
as **EV-7**, too small to hit reliably even from a script. The instruction is
correct and the target is poor.

**Still to drive:** the relationship editor, export/import round-trip, chapter
diff, the corkboard and structure boards with real content, and the whole of
this at phone width.

---

## Screens not yet reviewed

Timeline · chapter detail · corkboard · manuscript · structure board ·
characters roster and detail · arc grid · maps · items · relationships · lore ·
factions · knowledge · settings · search palette · writer's brief · continuity
checker · calendar

Also outstanding: **reading mode**, **phone widths**, and the **library**
download flow.

---

## Bugs found incidentally

Not UX, but surfaced while capturing.

| ID | Finding |
|---|---|
| BUG-1 | `Cannot update a component (TopBar) while rendering a different component (MapExplorerView)` — a setState-during-render on the Maps screen. |
| BUG-2 | `Encountered two children with the same key, 'lotr-ev-last-alliance'` — duplicate React key, in the Fellowship example data or its render. |
