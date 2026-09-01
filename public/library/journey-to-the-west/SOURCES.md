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

**Every image in this folder is AI-generated, and was supplied by the owner of
this repository, who states it is their own work.** None of it is public
domain, and none of it comes from any edition of the novel. There are 50
images: 7 maps, 24 character portraits, 12 places and 7 items.

Each was opened and looked at against the entity it is attached to before it
was assigned (rule `EX-301`). Entities with no suitable picture were left
without one rather than given a near-miss (`EX-302`): 97 of the 121 characters,
124 of the 136 places, 15 of the 22 items and the world cover have no
illustration at all. What is still wanted, and why, is listed in
`scripts/journey-to-the-west/ART-REQUESTS.md`.

### Known problems with the images that are here

These are recorded rather than quietly worked around, because a reader looking
at a plate should be told when it disagrees with the record beside it.

| File | What is wrong with it |
| --- | --- |
| `art/items/golden-fillet.jpg` | Captioned in frame as 金蓮冠, a lotus crown. The object in the book is a plain gold band with no ornament, which is the whole point of it. |
| `art/items/purple-gold-bells.jpg` | Draws one hung temple bell. The book's object is three small bells on a cord at a belt, which shake out fire, smoke and sand. |
| `art/places/purple-cloud-kingdom.jpg` | The banner in frame carries misspelt Roman lettering. |
| `art/places/lotus-cave.jpg` | Reads as a quiet hillside shrine; the Lotus Cave is a demon stronghold. |
| `maps/celestial-court.jpg` | Carries mangled English labels, among them "Lotasr's Combina" for what should be Laozi's furnace room. |
| `maps/pilgrimage-route.jpg` | Labels a temple "THUNOERBOLT TEMPLE" — a misspelling of Thunderbolt — beside a cave glyph. It sits on the road east of Vulture Peak, and the world uses it for the Little Thunderclap Monastery, since a false Thunderclap before the real one fits both the label and the position. |
| `maps/pilgrimage-route.jpg` | Duplicates the Gao Village and Tang Border labels, and places both **inside** the Tang frontier. The book puts Gao Village a long way past it. |

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
