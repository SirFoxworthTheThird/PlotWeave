/* TEMPORARY — the AI generation flow, as a writer meets it. Delete. */
import { test, expect, type Page } from '@playwright/test'
import { resetDB } from './helpers/reset'

const OUT = '/tmp/claude-0/-home-user-PlotWeave/0059390a-1dc2-55c6-9e96-a775864ab3c7/scratchpad/uxai'

test.use({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, actionTimeout: 10_000 })
test.describe.configure({ timeout: 900_000 })

const log: string[] = []
function note(s: string) { log.push(s); console.log('AI: ' + s) }
async function shot(page: Page, name: string) {
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/${name}.png` })
}

/** What a decent assistant would actually hand back for this prompt. */
const GOOD = JSON.stringify({
  format: 'plotweave-characters',
  characters: [
    { name: 'Sera Aldwyn', aliases: ['Sera'], description: 'A salt-trader who has never been north of the estuary.', tags: ['protagonist'], alive: true },
    { name: 'Odrun Vale', aliases: [], description: 'Harbourmaster, and the last person to see the boats.', tags: ['ally'], alive: true },
    { name: 'Maren Cole', aliases: ['The Cutter'], description: 'Rival trader who profits from every wreck.', tags: ['antagonist'], alive: true },
  ],
}, null, 2)

/** What a real assistant hands back about half the time. */
const FENCED = '```json\n' + GOOD + '\n```'

test('generating a cast the way a writer would', async ({ page }) => {
  await page.goto('/')
  await resetDB(page)
  await page.getByRole('button', { name: 'New World' }).click()
  await page.getByLabel('Name').fill('The Salt Road')
  await page.getByRole('button', { name: 'Create World' }).last().click()
  await expect(page).toHaveURL(/#\/worlds\//)
  const id = page.url().match(/#\/worlds\/([^/]+)/)![1]

  await page.goto(`/#/worlds/${id}/characters`, { waitUntil: 'load' })
  await page.getByRole('button', { name: /generate with ai/i }).click()
  // Not getByRole('dialog') — the app's Dialog renders a bare div with no role.
  await expect(page.getByText('Generate Characters with AI')).toBeVisible()
  await shot(page, '01-dialog-open')

  const box = page.getByRole('textbox', { name: 'characters JSON' })

  // ── Nonsense: what does it say? ──────────────────────────────────────────
  await box.fill('here you go!')
  await page.waitForTimeout(700)
  const err1 = await page.getByRole('alert').innerText().catch(() => '(no error shown)')
  note(`plain prose      → "${err1.replace(/\s+/g, ' ').trim()}"`)
  await shot(page, '02-error-prose')

  // ── Valid JSON, wrong shape ──────────────────────────────────────────────
  await box.fill('{"people": [{"name": "Sera"}]}')
  await page.waitForTimeout(700)
  const err2 = await page.getByRole('alert').innerText().catch(() => '(no error shown)')
  note(`wrong key        → "${err2.replace(/\s+/g, ' ').trim()}"`)

  // ── Wrapped in a markdown fence, which assistants do constantly ──────────
  await box.fill(FENCED)
  await page.waitForTimeout(900)
  const fencedErr = await page.getByRole('alert').innerText().catch(() => null)
  const fencedOk = await page.getByText(/ready to import/i).count()
  note(`markdown fences  → ${fencedErr ? `ERROR "${fencedErr.replace(/\s+/g, ' ').trim()}"` : `accepted, preview ${fencedOk ? 'shown' : 'MISSING'}`}`)
  await shot(page, '03-fenced')

  // ── The clean case ───────────────────────────────────────────────────────
  await box.fill(GOOD)
  await page.waitForTimeout(900)
  const preview = await page.getByText(/ready to import/i).innerText().catch(() => '(none)')
  note(`clean JSON       → "${preview.replace(/\s+/g, ' ').trim()}"`)
  await shot(page, '04-preview')

  await page.getByRole('button', { name: /^add/i }).last().click()
  await page.waitForTimeout(2000)
  const banner = await page.getByRole('status').innerText().catch(() => '(no result banner)')
  note(`after import     → "${banner.replace(/\s+/g, ' ').trim()}"`)
  await shot(page, '05-imported')

  // Did they actually arrive?
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1200)
  const arrived = await page.getByRole('main').getByText('Sera Aldwyn').count()
  note(`"Sera Aldwyn" on the roster: ${arrived > 0}`)
  await shot(page, '06-roster')

  // ── The documented promise: re-running never duplicates ──────────────────
  await page.getByRole('button', { name: /generate with ai/i }).click()
  await page.getByRole('textbox', { name: 'characters JSON' }).fill(GOOD)
  await page.waitForTimeout(900)
  await page.getByRole('button', { name: /^add/i }).last().click()
  await page.waitForTimeout(2000)
  const banner2 = await page.getByRole('status').innerText().catch(() => '(none)')
  note(`re-import banner → "${banner2.replace(/\s+/g, ' ').trim()}"`)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1200)
  const count = await page.getByRole('main').getByText('Sera Aldwyn').count()
  note(`"Sera Aldwyn" rows after re-import: ${count}`)
  await shot(page, '07-after-reimport')

  expect(count, 're-importing the same cast must not duplicate').toBe(1)

  console.log('\n===== LOG =====\n' + log.join('\n'))
})
