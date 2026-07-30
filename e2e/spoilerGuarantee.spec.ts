import { test, expect, type Page } from '@playwright/test'
import { resetDB } from './helpers/reset'

/**
 * The promise reading mode makes, checked as one property rather than screen by
 * screen: with the cursor at the opening moment, no name the reader has not met
 * appears anywhere in the app.
 *
 * Gating each view by hand would leave the *next* view unguarded — this is what
 * notices. It walks every world-scoped route, so a screen added later is
 * covered without anyone remembering to add it here.
 */

test.describe.configure({ timeout: 180_000 })

const ROUTES = [
  '', 'timeline', 'corkboard', 'calendar', 'characters', 'maps', 'items',
  'relationships', 'arc', 'lore', 'factions', 'knowledge',
]

interface Unmet {
  characters: string[]
  items: string[]
  locations: string[]
}

/** Names the reader has not met, read from the store rather than assumed. */
async function unmetNames(page: Page): Promise<Unmet> {
  return page.evaluate(`(() => new Promise((resolve) => {
    const req = indexedDB.open('PlotWeaveDB')
    req.onsuccess = () => {
      const db = req.result
      const read = (s) => new Promise((r) => {
        const q = db.transaction(s, 'readonly').objectStore(s).getAll()
        q.onsuccess = () => r(q.result)
      })
      Promise.all([
        read('events'), read('chapters'), read('characters'), read('items'),
        read('locationMarkers'), read('characterSnapshots'), read('itemPlacements'),
        read('itemSnapshots'), read('locationSnapshots'),
      ]).then(([events, chapters, characters, items, markers, cs, ip, isn, ls]) => {
        const chapNum = new Map(chapters.map(c => [c.id, c.number]))
        const key = new Map(events.map(e => [e.id, (chapNum.get(e.chapterId) ?? 0) + e.sortOrder / 1e6]))
        const cursorId = JSON.parse(localStorage.getItem('plotweave-ui') || '{}')?.state?.activeEventId
        const cursor = key.get(cursorId)
        const first = new Map()
        const add = (id, evId) => {
          const k = key.get(evId); if (k === undefined || !id) return
          const cur = first.get(id); if (cur === undefined || k < cur) first.set(id, k)
        }
        for (const e of events) {
          for (const id of e.involvedCharacterIds || []) add(id, e.id)
          add(e.povCharacterId, e.id)
          for (const id of e.involvedItemIds || []) add(id, e.id)
          add(e.locationMarkerId, e.id)
        }
        for (const s of cs) {
          add(s.characterId, s.eventId); add(s.currentLocationMarkerId, s.eventId)
          for (const i of s.inventoryItemIds || []) add(i, s.eventId)
        }
        for (const p of ip) add(p.itemId, p.eventId)
        for (const s of isn) add(s.itemId, s.eventId)
        for (const s of ls) add(s.locationMarkerId, s.eventId)
        const hidden = (rec) => { const f = first.get(rec.id); return f !== undefined && f > cursor }
        resolve({
          characters: characters.filter(hidden).map(c => c.name),
          items: items.filter(hidden).map(i => i.name),
          locations: markers.filter(hidden).map(m => m.name),
        })
      })
    }
  }))()`)
}

/**
 * Text that names things regardless of reading mode, and legitimately so: the
 * book's own title and description, and its chapter titles, which are printed
 * on the contents page of the physical copy. PlotWeave showing them gives away
 * nothing the reader's own book does not.
 */
async function benignText(page: Page): Promise<string> {
  const parts = await page.evaluate(`(() => new Promise((resolve) => {
    const req = indexedDB.open('PlotWeaveDB')
    req.onsuccess = () => {
      const db = req.result
      const read = (s) => new Promise((r) => {
        const q = db.transaction(s, 'readonly').objectStore(s).getAll(); q.onsuccess = () => r(q.result)
      })
      Promise.all([read('chapters'), read('worlds')]).then(([chapters, worlds]) =>
        resolve([
          ...chapters.map(c => c.title || ''),
          ...worlds.flatMap(w => [w.name || '', w.description || '']),
        ]))
    }
  }))()`) as string[]
  return parts.join(' \n ').toLowerCase()
}

test('no unmet name appears anywhere in reading mode', async ({ page }) => {
  await page.goto('/')
  await resetDB(page)
  await page.getByRole('button', { name: 'Example Library' }).click()
  await page.getByRole('button', { name: /^Download \(/ }).first().click()
  await expect(page).toHaveURL(/#\/worlds\//, { timeout: 60_000 })
  await page.waitForTimeout(1500)
  const worldId = new URL(page.url()).hash.split('/')[2]

  // Step onto the opening moment, where nearly the whole book is still unread.
  await page.getByRole('button', { name: 'Next moment' }).click()
  await page.waitForTimeout(1200)

  const unmet = await unmetNames(page)
  const benign = await benignText(page)
  expect(unmet.characters.length, 'the fixture should leave plenty unmet').toBeGreaterThan(10)

  // Names long enough that a match is a real leak rather than a coincidence,
  // and not already given away by the book's own contents page.
  const needles = [
    ...unmet.characters.map((n) => ['character', n] as const),
    ...unmet.items.map((n) => ['item', n] as const),
    ...unmet.locations.map((n) => ['location', n] as const),
  ].filter(([, n]) => n && n.trim().length >= 5 && !benign.includes(n.toLowerCase()))

  const leaks: string[] = []
  for (const route of ROUTES) {
    await page.goto(`/#/worlds/${worldId}/${route}`)
    await page.waitForTimeout(1200)
    const text = (await page.evaluate(`(() => document.querySelector('main')?.innerText ?? '')()`)) as string
    for (const [kind, name] of needles) {
      const pattern = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (pattern.test(text)) leaks.push(`/${route || 'dashboard'} → ${kind} “${name}”`)
    }
  }

  expect(leaks, `unmet names on screen:\n${leaks.join('\n')}`).toEqual([])
})
