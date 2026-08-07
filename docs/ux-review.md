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

## Triage — decisions taken

Settled on 2026-08-07. Three cross-cutting questions were answered first,
because they change how a dozen screens read and would otherwise force rework.

| Question | Decision |
|---|---|
| **X-1** the watermark | **Drop it entirely.** Empty states become the loudest thing on an empty screen, which is what they are for. |
| **X-2** wide screens | **Use the width.** Content and panels expand rather than huddling into a left column. |
| **X-3** the nav rail | **Labels always visible.** Icon + word for every item; the guessing ends. Pairs with the width freed by X-2. |

### Buckets

**A — fix now (18).** Unambiguous defects; no design decision needed. In hand.

`OP-1` `OP-5` `DASH-1` `DASH-2` `DASH-5` `MS-1` `MS-3` `MS-5` `TL-6` `TL-3`
`OP-3` `OP-4` `OP-6` `EV-2` `EV-4` `EV-5` `CB-3` `CB-4` `X-6`

Ordered by value: **OP-1** first (it loses a half-filled form today), then
**OP-5** (every new user is left without a cursor), then the rest.

**B — design work, direction now set (7).** `X-1` `X-2` `X-3` are decided above
and can proceed. `EV-1` (event-card disclosure), `SEL-1` (selector entry
points), `TL-1` (pacing curve), `ST-1` (structure proportion) still need their
own shape before they can be built.

**C — verify before deciding (3).** `CB-1` and the two operations left unproven
in section 10. Cheap; folded into the next pass over those screens.

**D — closed or downgraded (4).** `OP-7` closed as corrected. `OP-2` downgraded:
a modal intercepting clicks is defensible on its own, and only looked wrong
next to OP-1. `SEL-4` (tagline) and `X-5`/`W-2` (permanent help text) are
house-voice calls rather than defects, and wait for someone with an opinion
about the voice.

**OP-2's downgrade was half wrong.** It was filed as "an open palette traps
you" and downgraded on the grounds that a modal intercepting clicks is normal.
That part stands. What did not stand is the assumption behind it — that the
palette was a well-behaved modal. It also survived navigation, which is
**OP-9**, now fixed. The trapping is by design; the outliving was not.

---

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
| X-7 | high | open | **Clickable things that are not controls.** The 18 item cards on the Items roster are not links or buttons — a query for `a, button` inside the main region returns only *Generate with AI*. The corkboard's status pill is the same (**CB-1**). These are `div`s with click handlers: unreachable by keyboard, invisible to a screen reader, and not focusable. It is a pattern rather than an oversight, so it wants one decision and one sweep. |
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
| OP-1 | high | **done** | **One Escape closes two layers.** Open a dialog (Add Character), press Ctrl+K, and the search palette opens *on top of it*. A single Escape then dismisses **both** — verified: palette `false`, dialog `false` after one press. A user who searches for a name mid-form and presses Escape to get back loses the half-filled dialog and its input. Escape should dismiss the topmost layer only. |
| OP-2 | med | open | **An open palette traps you.** With the palette up, the nav rail is unreachable: the link resolves but the click is intercepted by the overlay, so the only way out is Escape. That is defensible for a modal on its own, but combined with OP-1 it means overlay layering is not being managed deliberately — the palette will happily stack on anything, and Escape does not respect the stack. |
| OP-3 | med | open | **The first-run guide creates more than it says.** Step 1 asks only for a timeline name, under the heading *"Your story begins with a moment"*. Verified by reading IndexedDB straight after: naming a timeline and a character leaves **1 chapter, 1 event, and 1 character** in the world. The chapter and the event were never named, shown, or mentioned — the user then meets a "Ch. 1" and an untitled scene they did not knowingly make. Either say so, or let them name the scene, which is what the heading already promises. |
| OP-4 | low | open | **Two buttons whose names both begin with "Add", adjacent.** On the character step, *"Add a description (optional)"* (a disclosure) sits directly above the primary *"Add them to the story"*. Clicking the wrong one silently expands a field instead of submitting, with no feedback that nothing happened. It cost this review a whole run. |

| OP-5 | high | open | **Finishing the first-run guide leaves no time cursor set.** The pill reads *"All chapters"* the moment the guide ends — verified twice, and visible in the capture. Step 3 of that same guide is headed *"Where does their story begin?"* and places the character at Ch. 1, so the guide selects a moment on the user's behalf and then hands them an app that has forgotten it. Everything cursor-dependent is consequently switched off for a brand-new user who has done everything they were asked. |
| OP-9 | high | **done** | **The search palette outlived the screen it was opened on.** Choosing a result closed it, but arriving anywhere by any other route did not — so a modal sat over an unrelated screen, swallowing every click until Escape. It derailed three separate runs of this review before being recognised as a fault rather than a fluke, which is about as strong a usability signal as a review can produce. Now closed on route change. |
| OP-8 | med | **done** | **Opening search took focus on a 50ms timer.** Whatever had focus kept it until the timer fired, so a keystroke in that window went to the screen behind the palette — open search from a half-filled form, type straight away, and the first characters landed in the form. Found while testing OP-1, not from the screen sweep. Now focused synchronously: the palette renders nothing until it is open, so by the time the effect runs the input is mounted and there is nothing to wait for. **Shipped without a regression test** — see below. |
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

## 6. Timeline

Driven on *The Fellowship of the Ring* (22 chapters, 91 scenes).

| ID | Severity | Status | Finding |
|---|---|---|---|
| TL-1 | high | open | **The pacing curve cannot be read, only glanced at.** No y-axis, no scale, no legend. Dots sit at varying heights in green, yellow and blue with nothing saying what high means, what the colours encode, or which chapter a peak belongs to. The shape is suggestive; the chart is unreadable as data. |
| TL-2 | med | open | **`Set Active` on all 22 chapter rows.** A text button repeated down the page whose meaning — *move the time cursor here* — is not in its label, competing for attention with the open-detail and delete icons beside it. |
| TL-3 | med | open | **A bare trash icon on every chapter row**, immediately beside open-detail. Twenty-two chances to misclick the most destructive action on the screen, with nothing in the affordance suggesting weight. |
| TL-4 | med | open | **Chapter rows carry a truncated summary and nothing else.** No scene count, no word count, no status roll-up. The row repeats prose you already wrote instead of telling you the state of the chapter. |
| TL-5 | low | open | **Thread pills wrap unbounded.** Nine threads already take two rows and ~80px above the content; the strip grows with every thread added. |
| TL-6 | low | open | **The beat marker on the curve reads "Incite"** — a truncation of *Inciting Incident* that is not a word in this sense. |

## 7. Corkboard

The strongest screen reviewed so far: dense, scannable, and the drag affordance is clear.

| ID | Severity | Status | Finding |
|---|---|---|---|
| CB-1 | med | open | **The status pill is not a button.** The guide says to change a scene's status "right on the card with the status pill", but there is no control with that accessible name — a click driven at it finds nothing. It reads as a static badge, and is one to keyboard and screen-reader users. |
| CB-2 | med | open | **No sense of how much board there is.** Five of twenty-two chapter columns are visible, with no scrollbar, count, or overview to say seventeen more exist off-screen. |
| CB-3 | low | open | **Cards carry no length signal.** The corkboard is where scene length should be comparable at a glance; there is no word count on the card. |
| CB-4 | low | open | **Column headers omit their scene count** — "Chapter 1 · A Long-expected Party", but not how many scenes are in it. |

## 8. Manuscript

| ID | Severity | Status | Finding |
|---|---|---|---|
| MS-1 | high | open | **Find & replace and Export are live on an empty manuscript.** With *0 of 91 scenes written · 0 words*, both remain enabled. Export would compile an empty book; find has nothing to search. |
| MS-2 | med | open | **A bare `0` badge beside the title.** Zero what — words, scenes, chapters? The subtitle answers it a line below, which is where the badge should have got its label. |
| MS-3 | med | open | **`Goal —`** puts an em-dash in a control that looks like an input, the same "reads as broken" pattern as the Continuity tile (**DASH-1**). |
| MS-4 | med | open | **The empty state gives a downloaded book the wrong instruction.** It says *"Write scene prose on your events"* — but library worlds ship deliberately without prose, and nobody is going to type Tolkien's. On a reading-mode world this screen should explain why it is empty, not hand out a task. |

**Credit:** the chapter bar on this screen — named chapters with per-chapter progress ticks — is the best version of that bar anywhere in the app.

## 9. Structure board

| ID | Severity | Status | Finding |
|---|---|---|---|
| ST-1 | high | open | **The board shows sequence but not proportion.** A beat sheet exists to reveal whether Act 2 sags, and this is a flat list of equal-height rows. Nothing conveys that Climax and Resolution both landed in Ch. 22 out of 22, or that Act 1 covers two chapters while Act 2 covers twelve. The one question the screen is for is the one it does not answer. |
| ST-2 | med | open | **Rows are ~1400px wide with content at both ends** and nothing between (see **X-2**). |
| ST-3 | low | open | **The template switcher is a native select** styled unlike the app's own Select components used elsewhere. |

## 10. What actually happens when you use them

The findings above were written from looking at the writing screens. Going back
and *operating* them — writing prose into scenes, dragging a card between
chapters, replacing a term across the manuscript, exporting a file — changed
the picture, mostly in the product's favour.

**Confirmed working, each with a real check:**

| Operation | Result |
|---|---|
| Prose written on a scene appears in the Manuscript | Verified by asserting the sentence itself appears |
| Find & replace across every scene | Opens, counts matches, replaces across scenes |
| Dragging a scene into another chapter on the corkboard | Verified end to end: *The Birthday Party* moved from Ch.1 to Ch.2 **and the move persisted to IndexedDB**, not just the DOM |
| The export dialog | Format tabs, two options, and a **live word and scene count before you commit** — one of the better-designed dialogs in the app |

That last one matters for how the earlier notes should be read: the corkboard
was called the strongest screen in section 7 *without its main verb having been
tried*. It survives the test.

| ID | Severity | Status | Finding |
|---|---|---|---|
| MS-5 | low | open | **"1 scenes"** in the export dialog's count. Unpluralised. |

**OP-8 has no regression test, deliberately.** Three approaches were tried and
each was rejected: typing immediately after the shortcut is a race against a
50ms window and would be flaky; a frozen `page.clock` turned out **not** to
discriminate at all — the test passed with the timer restored, which makes it
worse than no test; and asserting on the absence of a `setTimeout` tests the
implementation rather than the behaviour. The fix is a small, obviously-correct
simplification and the existing focus assertion in the OP-1 test still covers
"focus lands at all", but nothing guards the *timing*. Recorded rather than
papered over.

**Still unproven, either way:** assigning a beat on the Structure board, the
scene reorder arrows in chapter detail, and whether **CB-1** (the status pill
not being a control) holds up — the pill has no accessible name, which is why
a driven click cannot find it, but that has not been separated from "it is a
button with a different label".

**Method note.** Five of the fourteen operations in this run failed on the
harness, not the app: a card selector that matched a status pill, mouse events
where HTML5 drag needed `dragTo`, and an export click that hit the format tab
rather than the download button. Each was chased down before anything was
written here, because the first instinct — that a failed step is a product
fault — was wrong every single time in this run.

---

## 11. Across the writing screens

| ID | Severity | Status | Finding |
|---|---|---|---|
| W-1 | med | open | **The chapter bar is present on Timeline and Manuscript but absent on Corkboard and Structure**, while the top-bar cursor pill still shows a chapter on all four. The global cursor's main control disappears on two of the screens that are most about story order. |
| W-2 | med | open | **Every screen opens with a title and a line of instruction** — *"Drag scene cards to reorder them…"*, *"The classic seven-beat, three-act spine."* — costing ~110px of vertical space permanently for a sentence read once (see **X-5**). |

---

## 12. The world-element screens

Characters, Items, Lore, Factions and Knowledge share a shape — a counted
roster leading to a detail view — so they are best read against each other.
Driven on *The Fellowship of the Ring*; all eight character tabs render, roster
filtering works, and Lore, Factions and Knowledge all open.

### Character detail

| ID | Severity | Status | Finding |
|---|---|---|---|
| CH-1 | med | open | **The Overview tab hides most of the character.** It shows the name and biography only. Aliases, map/Arc colour and birth date live behind **Edit**, so you cannot tell whether a character even *has* aliases without entering edit mode. A read view that omits the data is not a read view. |
| CH-2 | med | open | **The name is printed twice** — in the header beside the portrait, and again as a heading directly under the tabs. |
| CH-3 | med | open | **Tabs carry no counts.** Eight tabs, and a character with no goals, no lore and no factions looks identical to one with three of each. Every sibling screen in this group counts things — the rosters, the map sidebar sections — except the one place it would save the most clicking. |
| CH-4 | med | open | **Delete stands alone in the header** as the only icon, top right, with nothing implying weight. Compare Lore, which reveals its delete on hover (see LORE-1). |
| CH-5 | low | open | **The portrait's upload and link controls are two ~10px icons** crowded onto the bottom edge of a 48px avatar. |

### Items

| ID | Severity | Status | Finding |
|---|---|---|---|
| IT-1 | high | open | **The cards are not controls** — see **X-7**, of which this is the clearest instance. |
| IT-2 | med | open | **The roster shows nothing about where anything is.** Items have per-event placement and condition, and the list shows type and description only, so with a cursor set you still cannot see what is where. The map sidebar manages a condition dot per item; the screen devoted to items does not. |

**Credit:** thumbnails, name, category and description make this the most scannable roster in the app.

### Lore

| ID | Severity | Status | Finding |
|---|---|---|---|
| LORE-1 | — | **good** | **Delete appears on hover**, not permanently. This is the pattern **TL-3** and **CH-4** should adopt rather than a trash icon sitting on every row forever. |
| LORE-2 | med | open | **Nothing on a card says whether it is gated.** *Revealed at* is a headline lore feature; a page revealed in chapter 17 is indistinguishable from one visible from the start. Knowledge solves the same problem with "known by 4 / 45". |
| LORE-3 | low | open | **Every card shows the same unlabelled US-format date** (`4/7/2026`) — the import date, on all 25 (see **X-6**). |

### Factions

| ID | Severity | Status | Finding |
|---|---|---|---|
| FAC-1 | med | open | **Faction-to-faction stances are invisible.** Cards carry a member count only, yet stances are a headline feature — and for a story like this one, who is hostile to whom is the whole point. |
| FAC-2 | med | open | **No search box**, while Items, Knowledge, Lore and Characters all have one in the same position. Fine at ten factions; the inconsistency is the finding. |
| FAC-3 | low | open | **Card titles truncate while their descriptions wrap.** *"The Fellowship of the R…"* is cut at 29 characters directly above two full lines of body text. |

### Knowledge

The best-designed screen reviewed so far.

| ID | Severity | Status | Finding |
|---|---|---|---|
| KN-1 | — | **good** | **"Suggested from your story"** proposes real work — *"+ Barrow-wight is dead · Ch. 8"* — and adds it in one click. The strongest affordance in the app; the pattern the dashboard wants (see the DASH rebuild note). |
| KN-2 | — | **good** | **"known by 4 / 45"** on every card: a number that means something at a glance. |
| KN-3 | med | open | **The *when* is missing from the screen about when.** The strapline is "track who knows what, **and when they learn it**", and no card shows when the reader learns a fact or when the first character does. Only the count is shown. |
| KN-4 | low | open | **No ordering control** — 21 facts in a fixed order, with no way to sort by reveal point or by how widely known they are. |

**Not established:** the "open a fact" step passed against a verify that matched
`known by` text already on the roster, so it proved nothing about the detail
view. Knowledge detail is therefore **unreviewed**, not reviewed-and-fine.

---

## 13. Arc grid, Maps, Relationships, Continuity

### Character Arc grid

The best use of screen width in the app, and the counter-example to **X-2**:
full-bleed columns, a legend at the foot, and the interaction spelled out
(*"Click a column to set cursor · Click a notes cell to expand"*).

| ID | Severity | Status | Finding |
|---|---|---|---|
| ARC-1 | med | open | **Empty rows drown the signal.** 45 characters × 22 chapters, and a dozen rows (Arwen, Boromir, Cave-troll, Celeborn, Durin's Bane…) are entirely blank. There is no way to hide characters with no recorded state, so the grid is mostly emptiness at exactly the scale it is meant for. |
| ARC-2 | med | open | **Inherited state is styled like recorded state.** Bilbo shows *"Argues with Gan…"* verbatim in all eleven visible chapters. A small clock glyph marks the carried-forward cells, but the text reads at full weight, so eleven inherited cells look like eleven decisions. |
| ARC-3 | low | open | **Alphabetical only.** Barrow-wight and Bill the Pony sort above Frodo; no ordering by appearances or by importance. |

### Maps

| ID | Severity | Status | Finding |
|---|---|---|---|
| MAP-1 | high | open | **The default view is illegible.** Opened at *All chapters* on the shipped example, roughly fifteen label pills pile onto one another across the north of the map — *"16 characters"*, *"3 characters"*, *"Glorfindel"*, *"The Watcher in the Water"*, *"Trollshaws"* — several completely hidden behind others. There is no collision avoidance, no decluttering, and no zoom-dependent thinning. This is the arrival state of the app's most visually impressive screen. |
| MAP-2 | med | open | **The floating toolbar sits on top of content.** *+ Location / Label / Measure / ⋯* overlaps a marker and its label in the top-right corner. |
| MAP-3 | med | open | **The sidebar contradicts itself.** It says *"Select an event from the timeline bar below to place characters onto the map"* while listing every character with a location beneath it (*Aragorn · Weathertop*). Both are true — placement needs a cursor, display does not — but read together they do not make sense. |

### Relationships graph

| ID | Severity | Status | Finding |
|---|---|---|---|
| REL-1 | high | open | **The graph does not survive its own example.** 45 characters produce a knot in the upper third with unreadable overlapping edge labels, while unconnected characters are flung hundreds of pixels away — so distance reads as meaning when it carries none. Both side thirds are empty. There is no re-layout, no clustering, no filter to one character's neighbourhood, and no way to reduce what is drawn. |
| REL-2 | med | open | **The minimap is unreadable** — a smear of dim blue on near-black with no visible viewport rectangle, in the one situation where a minimap should be earning its place. |

### Continuity Checker

Well built: grouped by category with counts, a suppress control and a jump
control on every row, and keyboard hints at the foot (*↑↓ navigate · Enter go
to event*).

| ID | Severity | Status | Finding |
|---|---|---|---|
| CC-1 | high | open | **The model has no notion of a thing there is more than one of, and the checker reports it as an error.** *"Barrow-blades appears in multiple places in Ch. 12 — Held by: Meriadoc, Peregrin, Samwise, Frodo"*. There are four barrow-blades, one each. Same for *Elven Cloak* and *Lembas*, held by six characters apiece. Almost all of the 79 item errors are this class. It is a modelling gap surfacing as a wall of false positives, and false positives are how a checker teaches people to ignore it. |
| CC-2 | high | open | **The shipped example reports 72 errors and 25 warnings.** Someone who downloads *The Fellowship of the Ring* and clicks the shield meets 97 problems in a world they did not write. Either the example is wrong or the checks are, and either way that is the first impression the feature makes. |
| CC-3 | med | open | **No triage within a category.** *Items 79* is one repeated fault; nothing groups by kind, so the real findings are buried under the noise from CC-1. |

**Correctly caught, for the record:** *"Gandalf the Grey is alive in Ch. 22 after
dying in Ch. 17"* is exactly right for this book, and the eye icon beside it is
the right answer.

---

## 14. Using the map as a writer

Not looking at the map — working it. Opening the shipped *Fellowship*, asking
where everyone is at a given chapter, following one character, drilling into a
city, playing the story back, and stepping the cursor forward to watch the cast
move.

**What works, measured rather than assumed.** The map genuinely tracks the
story: markers drawn fall **43 → 31 → 24 → 16** as the cursor moves from *All
chapters* to Ch.6, Ch.11 and Ch.21. Drilling into *Minas Tirith* works and
returns cleanly. Playback runs and redraws. The bottom chapter bar — segments
with per-scene ticks, the current chapter picked out, the active scene named
beside it — is the best navigation in the product, and on this screen it is
doing real work.

| ID | Severity | Status | Finding |
|---|---|---|---|
| MW-1 | high | open | **Label collision is not just an *All chapters* problem.** With the cursor on Ch.6 the north of the map still stacks *Trollshaws* / *Rivendell* / *High Pass* / *The Bruinen Ford* on one another, and *Dimrill Dale* / *Lothlórien* / *Dol Guldur* on each other. Setting a moment — the app's whole premise — does not make the map readable. This extends **MAP-1** rather than repeating it. |
| MW-2 | high | open | **Two contradictory scales are on screen at once.** The breadcrumb states *1 km = 2 px*, while the map artwork carries its own printed scale bar in **miles**. A writer measuring a leg of the journey has no way to know which one the answer will come back in, and the two cannot both be right. |
| MW-3 | med | open | **"Who is where" is buried in a list of everyone.** With the cursor on Ch.6 the sidebar lists all 45 characters at equal weight, each with a placement crosshair, but only a handful carry a location beneath their name. The question the screen exists to answer — *who is on stage now* — is a minority of the rows, undistinguished from the rest. |
| MW-4 | med | open | **Regions are labelled twice.** *Rohan* appears as a polygon label and again as a marker pin reading *Rohan · Region*; *Mordor* likewise, with the two labels overlapping. |

### The three that were unproven — now settled

All three work. Each was measured rather than eyeballed.

| Feature | Result |
|---|---|
| **Journeys** | Works, and needs no character selected. Overlay paths go **5 → 17 → 5** across off/on/off, so the lines are genuinely drawn and genuinely removed. |
| **Measure** | Works. Two points on the Middle-earth map report **"101 km"**. |
| **Film strip** | Works on a *single-character* pin. Clicking Radagast at Rhosgobel lists his stop as *"Ch.14 — The Council of Elrond"*. |

Chasing them turned up three new faults and hardened a fourth.

| ID | Severity | Status | Finding |
|---|---|---|---|
| MW-5 | high | open | **Measure mode does not take exclusive control of the canvas.** With Measure armed, the first click both places the point **and selects the region polygon underneath**, opening its detail panel over the right of the map — verified: a region panel was open and the tool was still in Measure mode. On the first attempt that panel covered the spot intended for the second point and swallowed the click entirely, so the measurement could not be completed at all. A mode that says "click two points on the map" has to own those two clicks. |
| MW-6 | med | open | **A cluster popup renders off the top of the viewport.** Clicking a "16 characters" pin opens a list whose first entry (*Meriadoc Brandybuck*) is cut off above the canvas, behind the toolbar. It is not scrolled into view and cannot be reached. |
| MW-7 | med | open | **"(sub-map)" tells you nothing useful.** Fourteen of the sixteen names in that list read *"Frodo Baggins (sub-map)"*, *"Sauron (sub-map)"*. It presumably means the character is really on a child map and is being shown at the parent pin — but it does not say **which** map, and repeated on nearly every row it reads as noise rather than information. |
| MW-8 | low | open | **A cluster pin and a character pin do different things without saying so.** A single pin opens the film strip; a cluster opens a plain member list with no strip and no way to reach one. |

**MW-2 is now firmer, not weaker.** The measurement came back in **kilometres**
on a map whose own printed scale bar is in **miles**. Both are on screen at
once and they disagree.

---

## 15. Worlds with several timelines

Driven on two shipped examples, deliberately of different kinds: **The Two
Towers** (parallel storylines) and **The Name of the Wind** (frame narrative).
The guide says these get different bottom bars, and they do.

**Correct, and verified rather than assumed:**

- The **scope selector** is present on the parallel world and **absent** on the
  frame narrative, which instead gets two stacked tracks — exactly as
  documented, checked both ways.
- The **All timelines** tab is offered in both.
- Timeline tabs carry colour dots, and the **arc grid** offers matching pills
  (*All · The Road to Mordor · Rohan and Isengard*), so the same colour means
  the same storyline in two places.
- **Link Timelines** appears in the header only when there is more than one.

| ID | Severity | Status | Finding |
|---|---|---|---|
| MT-1 | high | open | **In the frame-narrative bar, the outer track loses its chapter titles while the inner keeps them.** The top track reads `0 1 2 3 4 5 6 13 17 25 45 48 57 75 88 92 93` — bare numbers — directly above an inner track reading *8 · Thie…*, *12 · Puz…*, *22 · A Time for…*. The same component renders at two densities side by side because segment width follows event count, so the *frame* of a frame narrative is the half you cannot read. |
| MT-2 | med | open | **Two play buttons, one per track, with nothing to say what either does.** Neither is labelled for its track, and nothing states whether playing one moves the other, or which one is "play the story". |
| MT-3 | med | open | **The stacked bar costs roughly 150px of height permanently** — two rows on every screen in the world, on a surface where the map and the manuscript both want the vertical space. |
| MT-4 | low | open | **A timeline's chapter count and its first chapter number disagree on sight.** *The Road to Mordor (10 chapters)* opens at **Ch. 12**, because numbering runs globally across timelines rather than per timeline. That is right for a book published as two halves, but nothing on the screen says so, and "10 chapters" starting at twelve reads as missing data. |

### Sync points and the "ghost cursor line"

| ID | Severity | Status | Finding |
|---|---|---|---|
| MT-5 | high | **done** | **The guide described a feature that does not exist.** It said a *"ghost cursor line marks the corresponding moment on the other track"*. There is no such line. `syncPoints` appears in exactly one place in the source — `useTimelinePlayback.ts` — and `StackedTrack` is never given the sync-point data, so it could not draw one. Confirmed in the running app: with the cursor set to Ch.6 of the outer timeline, there are **zero** dashed, dotted or ghost-styled elements anywhere on the page. `docs/GUIDE.md` now describes what sync points actually do. |
| MT-6 | med | open | **Sync points only work one way, and only while playing.** They fire when playback advances the **inner** track onto a paired event, moving a hidden outer cursor that only the **map** reads (for ghost pins). Playing the outer track syncs nothing, and moving the cursor by hand syncs nothing in either direction. A writer who pairs nine moments and then scrubs between them sees no effect at all. |
| MT-7 | med | open | **Nothing on the bar shows which moments are paired.** Having set up sync points, there is no mark on either track saying "this one is linked" — so the only way to know a pairing exists is to open the relationship editor and read the list. |

**What sync points really do**, for the record: during playback of the inner
timeline, reaching a paired event sets `activeOuterEventId`, which
`useMapViewState` uses to resolve the outer timeline's snapshots and draw its
cast as ghost pins on the map. That is a genuinely good feature — cutting back
to the frame while the map shows both casts — and it is invisible everywhere
except the map, during playback, in one direction.

---

## 16. The map sidebar, and the panels that open on the right

Asked for directly, and fairly — the left bar had one finding against it
(**MW-3**) and the right-hand panels had never been looked at.

### The left sidebar

Sections: Map Layers · Characters · Locations · Items · Routes · Regions, each
with a count in its header, which is the right idea and done well.

| ID | Severity | Status | Finding |
|---|---|---|---|
| SB-1 | high | open | **Opening the sections produces one unbounded scroll.** They are not an accordion and their headers do not stick, so with Items expanded (18 rows) *Map Layers*, *Characters* and *Locations* have all scrolled off the top. In a 22-chapter world with 29 locations and 45 characters, opening two sections makes the third unreachable without hunting. |
| SB-2 | med | open | **Names are truncated far earlier than the column requires.** *The Witch-kin…*, *Samwise Gam…*, *Radagast the …*, *Bow of the Galad…*, *The Mirror of Gal…* — cut at roughly fourteen characters in a 280px column. *The Witch-king of Angmar* and *The Witch-king of the North* would be indistinguishable. |
| SB-3 | low | open | **Only some rows carry their per-event state.** At a given chapter a handful of characters and items show a location line and the rest show nothing, at identical weight — the list version of **MW-3**. |

**Example-data note:** at Ch.12 the sidebar reads *Sauron · Bag End*. That is the
shipped Fellowship example, not the UI, but it is the kind of thing a reader
will screenshot.

### The location panel

| ID | Severity | Status | Finding |
|---|---|---|---|
| LP-1 | high | open | **Delete is the loudest thing in the panel.** *Delete Location* is a full-width, saturated red bar pinned to the bottom, more visually dominant than the location's own name. Lore hides its delete until hover (**LORE-1**); this is the opposite extreme, on the panel a writer opens most often. |
| LP-2 | med | open | **The panel is clipped by its own delete bar.** *Upload Sub-map* is cut in half by it, so the last section cannot be read or reached at the default height. |
| LP-3 | med | open | **Three sections in a row send you somewhere else and none of them takes you there.** *Characters here* wants an event; *Controlling Faction* says "create one in the Factions view"; *Lore* says "open a lore page and use the link button". The copy is clear and correct — and there is not a single link among the three. |
| LP-4 | low | open | **The name is shown twice and the header carries neither.** The map popup reads *Saltmouth · City*, the panel repeats *Saltmouth · City* immediately beside it, and the panel's own header says only *"Location"*. |

**Credit:** the empty states here are among the better-written in the app —
they say what is missing *and* why, rather than just reporting absence.

**Still not reviewed: the character and region panels.** Four attempts to open
them in this pass all failed on selectors — one click set the time cursor
instead, another toggled a section shut. The location panel above came from an
earlier run. Nothing is claimed about the other two, and the user's question
about them is not yet answered.

---

## Screens not yet reviewed

Chapter detail · knowledge detail · settings · writer's brief · calendar

These five were **captured but not yet read**. The screenshots exist and each
screen was driven successfully — knowledge detail was verified this time
against text that only appears in the detail view, not the roster — but nobody
has looked at the images, so nothing is claimed about them either way.

Also outstanding: **reading mode**, **phone widths**, and the **library**
download flow.

---

## Bugs found incidentally

Not UX, but surfaced while capturing.

| ID | Finding |
|---|---|
| BUG-1 | `Cannot update a component (TopBar) while rendering a different component (MapExplorerView)` — a setState-during-render on the Maps screen. |
| BUG-2 | `Encountered two children with the same key, 'lotr-ev-last-alliance'` — duplicate React key, in the Fellowship example data or its render. |
