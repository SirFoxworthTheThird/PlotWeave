# Where the pictures and the text in this book come from

## The text

Chapters, chapter titles, characters, places and events follow the complete
hundred-chapter Chinese text of 西遊記 at
[Chinese Wikisource](https://zh.wikisource.org/wiki/西遊記), read chapter by
chapter. The reading record — 479 beats, with the location and cast of each —
is kept in the repository at `scripts/journey-to-the-west/scene-ledger.md`, and
the hundred couplet titles are transcribed verbatim in
`scripts/journey-to-the-west/chapters.json`.

The novel and its author, Wu Cheng'en (c. 1500–1582), are long out of copyright
everywhere. **No prose from the novel is reproduced in this world**, in Chinese
or in translation (rule `EX-007`). Every summary, description and status note
is original structural writing about the book.

The chapter titles shown in the app are English renderings of the book's own
couplets, both halves joined with a middle dot. They are the author's titles,
not editorial signposts added by a later hand, so `EX-008` does not apply. The
verbatim Chinese ships beside the generator rather than in the world, because a
couplet is a piece of the book and a translation of one is not.

## The pictures

**The original 119 images were AI-generated and supplied by the owner of this
repository, who states they are their own work.** They are not presented as
public-domain material or illustrations from an edition of the novel.
That original set comprises 8 maps, 55 character portraits, 30 places, 23 items,
2 faction plates and 1 lore plate.

They arrived in two batches and are in two visibly different styles. The first
— the seven route and place maps, the four pilgrims and the other early
portraits — is flatter and cleaner. The second is a painted, aged-paper style
with a Chinese title cartouche and a block of explanatory text on almost every
plate, several of them citing the chapters they illustrate. The original files
are retained as references; the seven submaps now use the replacement sheets
described below rather than the original flatter maps.

### Period-inspired replacement submaps

Seven `maps/*-manuscript.png` sheets were generated with OpenAI's built-in image
tool at the author's request. They preserve the broad supplied layouts while
replacing cartoon figures, bright colours, English text boxes and modern
infographic decorations with mature ink-and-mineral-wash cartography on aged
paper. The Four Continents root chart is unchanged.

The art direction evokes late-Ming pictorial gazetteers, the period of the
novel's publication, while the depicted settings are Tang-era and mythological.
These are modern interpretations, not authentic period maps. References for
the tradition include the Library of Congress's
[Illustrated Album of Yangzhou Prefecture](https://blogs.loc.gov/international-collections/2019/06/the-illustrated-album-of-yangzhou-prefecture/)
and [Ming shan tu](https://www.loc.gov/item/2001530431/).

Full prompts, dimensions and top-left pixel landmark anchors are recorded in
`scripts/journey-to-the-west/generated-map-manifest.json`. All seven final
images were opened and inspected. The generator rescales inherited road
approximations and uses explicit new anchors for the detailed maps. This is
not a claim of completed in-app validation: marker checks at useful zoom,
deep gateways and playback are still pending because the browser connection
returned no available browser. See `scripts/journey-to-the-west/MAP-REVIEW.md`.

Six supplied plates draw more than one subject, and five of those split
honestly down the seam, each half keeping its own name-card:
`manjusri`/`samantabhadra`, `national-preceptor`/`fox-beauty`,
`human-seed-bag`/`golden-cymbals`, `wuji-king`/`blue-lion-impostor` and
`squire-kou`/`mistress-kou`. The three kings of Lion Camel Ridge could not be:
the lion, the elephant and the roc overlap in one composition, and any vertical
cut puts the elephant's name-card on the lion. That plate is therefore the
cover of a faction rather than three portraits.

Two plates deliberately draw two objects and stay whole, because the world
models them as one thing each: the gourd and the jade vase are a single item
here, as Laozi's pair, and so are the peaches.

Each supplied plate was opened and looked at against the entity it is attached
to before assignment (rule `EX-301`). Every item already had an illustration.
The original set left 66 character, 116 location and 7 faction images missing.

### Additional generated illustrations

At the author's request, 189 additional standalone entity illustrations were
created using OpenAI's built-in image generation tool: 66 character portraits,
116 location illustrations and 7 faction covers, with supplied plates as
style references. These are modern artistic interpretations, not documentary
portraits, historical maps or illustrations from the original edition.

Each accepted addition is visually reviewed for its subject, composition and
style before linking it to the corresponding entity. The original images and
map layers are preserved. The new plates use the mature ink-and-mineral-wash
look on aged paper; captions may be omitted so the application supplies the
entity's name without potentially inaccurate in-image lettering.

`scripts/journey-to-the-west/generated-art-manifest.json` records the file,
subject slug, generation prompt and visual-review status for every addition.
`scripts/journey-to-the-west/ART-REQUESTS.md` is regenerated from the PWK and
records the current coverage and remaining gaps, including one-scene entities
and gateways. A successful file/link check is not a claim of browser QA.

The final inventory has no missing character, location, item or faction images.
All 189 additions were opened and reviewed individually, with unsuitable drafts
corrected before assignment. The original world cover, item art and eight maps
were not replaced. Browser validation remains pending because the browser
connection exposed no available browser during this artwork pass.

### The cover

`art/cover.jpg` is the exception, and the only genuinely period image here. It
is the left leaf of a double-page opening from the **Shidetang Hall of Jinling
imprint, Wanli 20 (1592)** — 新刻出像官板大字西遊記, the edition in which this
novel was first printed with illustrations. The leaf shows Sun Wukong with the
gold-banded cudgel planted in the ground, under the Plantain Cave's own
sign-board (芭蕉洞), captioned 調芭蕉扇, "fetching the plantain fan" — the
episode this world models at chapters 59 to 61.

It was downloaded from Wikimedia Commons
([The Journey to the West, Shidetang Hall of Jinling in 1592.jpg](https://commons.wikimedia.org/wiki/File:The_Journey_to_the_West,_Shidetang_Hall_of_Jinling_in_1592.jpg)),
cropped to the left leaf and re-encoded at 760px wide. Both the book and the
1592 blocks are long out of copyright, and Commons records the file as public
domain. It is committed here rather than linked, so a downloaded copy of this
book draws its cover from the same origin as the app and contacts nobody.

### Known problems with the images that are here

These are recorded rather than quietly worked around, because a reader looking
at a plate should be told when it disagrees with the record beside it.

| File | What is wrong with it |
| --- | --- |
| `maps/four-continents.jpg` | Nothing wrong with it — but it is a cosmological chart, not a survey, and the five layers that hang under it are placed by its captions rather than by any measured position. |
| `maps/celestial-court.jpg` | Carries mangled English labels, among them "Lotasr's Combina" for what should be Laozi's furnace room. |
| `maps/pilgrimage-route.jpg` | Labels a temple "THUNOERBOLT TEMPLE" — a misspelling of Thunderbolt — beside a cave glyph. It sits on the road east of Vulture Peak, and the world uses it for the Little Thunderclap Monastery, since a false Thunderclap before the real one fits both the label and the position. |
| `maps/pilgrimage-route.jpg` | Duplicates the Gao Village and Tang Border labels, and places both **inside** the Tang frontier. The book puts Gao Village a long way past it. |

All four plates that were wrong in the first batch have since been replaced —
the fillet drawn as a lotus crown, the three bells drawn as one temple bell,
the Purple Cinnabar banner with misspelt Roman lettering, and the Lotus Cave
that read as a quiet hillside shrine. The originals are not kept.

### The layer tree

The world map is the parent of five of the other seven layers, and it is the
chart's own captions that say so: the eastern continent's panel names
Flower-Fruit Mountain, the southern one says "our Tang land is here", the note
beside Mount Sumeru says the thirty-three heavens are on its summit, and each
of the four seas is captioned with its dragon palace. Chang'an and Vulture
Peak therefore sit three layers deep, under the road, under the world.

The one gateway on that map the chart does not draw is the way down to the
courts of the dead. It is pinned below the southern continent, which is what
the underworld is under, and it is an approximation like the sixteen below.

### How markers are placed on the maps

Where the road painting names a feature, the marker sits on that name, even
where the book's own order would put it elsewhere (`EX-206`). That is why the
road doubles back east once, between the Guanyin Monastery and Gao Village.
The chapter order, not the line on the map, is the record of where the party
went.

Sixteen places the paintings do not draw at all are pinned along the drawn road
between the two features that bracket them in the text, or — for the four that
are nowhere near it — on plausible unlabelled terrain. They are approximations
of position, not readings of the artwork:

- On the road map: the Cave of the Slanting Moon and Three Stars (Subhuti's, in
  the Western Continent, which the painting does not reach), the Jing River,
  the Hong River ford, the Jinshan Temple, the six brigands' stretch of road,
  the Abbey of the Three Pure Ones, the water palace under the Heaven-Reaching
  River, the wooden immortals' hermitage, the Cleansing Spring, the Lion Camel
  Cave, Tiger Mouth Cave, the Nine-Fold Winding Cave, the Mysterious Yin Cave,
  the Golden Lamp Bridge and the Kou mansion.
- On Flower-Fruit Mountain: the Water-Belly Cave, which the book puts north of
  the island and the painting does not show.

No layer carries a scale, and nothing in these maps should be read as a
distance. The book's own figures — a hundred and eight thousand li to the west,
eight hundred li of river, eight hundred li of thorn — are formulas rather than
measurements.

## The chronology

Day 0 in this world is the first day of Zhenguan 1, taken as 627 CE. The
pilgrimage runs 639–653, which is the book's own count: the travel rescript is
issued in the thirteenth year of Zhenguan and handed back in the twenty-seventh,
and fourteen years on the road are stated over and over. It is **not** the
historical count — the real Zhenguan era ended in its twenty-third year, and the
historical Xuanzang left in 629 and returned in 645 without an imperial
passport.

The frame chapters run on a second timeline and on negative day numbers,
reconstructed from the book's own arithmetic: the underworld register gives the
monkey's age as 342, Heaven is repeatedly said to run one day to the world's
year, and five hundred years pass under the mountain. Worked backwards from the
year he is freed, that puts his birth in the third century BCE. Read the frame
dates as a reconstruction with the working shown, not as claims — a Lore page
in the world says the same thing.
