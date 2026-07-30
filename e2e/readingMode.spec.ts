import { test, expect, type Page } from '@playwright/test'
import { resetDB } from './helpers/reset'

// Reading mode and spoiler gating, driven through the example library so the
// test exercises the same path a reader takes. The reveal maths itself is unit
// tested in src/lib/__tests__/spoilers.test.ts.

const settleNav = (page: Page) => page.mouse.move(700, 400).then(() => page.waitForTimeout(150))

/**
 * How many characters the roster is showing, read from the count beside the
 * title — the same number the reader sees, rather than a guess at the markup.
 */
async function shownCount(page: Page): Promise<number> {
  const badge = page.getByRole('heading', { name: 'Characters', level: 1 }).locator('+ span')
  return Number((await badge.innerText()).trim())
}

/** The world id of whichever library world the test downloaded. */
async function worldPath(page: Page): Promise<string> {
  return new URL(page.url()).hash.replace(/^#/, '').split('/').slice(0, 3).join('/')
}

async function downloadFirstLibraryWorld(page: Page) {
  await page.goto('/')
  await resetDB(page)
  await page.getByRole('button', { name: 'Example Library' }).click()
  await page.getByRole('button', { name: /^Download \(/ }).first().click()
  await expect(page).toHaveURL(/#\/worlds\//, { timeout: 60_000 })
  await page.waitForTimeout(1000)
}

test('a library world arrives in reading mode and hides the writing screens', async ({ page }) => {
  await downloadFirstLibraryWorld(page)

  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  await expect(nav.getByRole('link', { name: 'Characters' })).toBeVisible()
  // The manuscript is writing-only, and a library world carries no prose at all.
  await expect(nav.getByRole('link', { name: 'Manuscript' })).toHaveCount(0)
  await expect(nav.getByRole('link', { name: 'Structure' })).toHaveCount(0)
})

test('the roster shows only characters the reader has met', async ({ page }) => {
  await downloadFirstLibraryWorld(page)
  await page.getByRole('link', { name: /characters/i }).first().click()
  await settleNav(page)

  // At "all chapters" the reader has explicitly asked for everything. Poll:
  // the count renders as 0 until the live query resolves.
  await expect.poll(() => shownCount(page), { timeout: 15_000 }).toBeGreaterThan(10)
  const total = await shownCount(page)

  // Step onto the opening moment: almost the whole cast is still unmet.
  await page.getByRole('button', { name: 'Next moment' }).click()
  await expect(page.getByRole('note')).toContainText(/not yet met by chapter 1 are hidden/)

  await expect.poll(() => shownCount(page), { timeout: 15_000 }).toBeLessThan(total)
  expect(await shownCount(page)).toBeGreaterThan(0)
})

test('a hidden character is revealed by moving the cursor forward', async ({ page }) => {
  await downloadFirstLibraryWorld(page)
  await page.getByRole('link', { name: /characters/i }).first().click()
  await settleNav(page)

  await page.getByRole('button', { name: 'Next moment' }).click()
  await expect(page.getByRole('note')).toBeVisible()
  await expect.poll(() => shownCount(page), { timeout: 15_000 }).toBeGreaterThan(0)
  const atOpening = await shownCount(page)

  // Walking forward can only ever reveal more — never fewer.
  for (let i = 0; i < 12; i++) {
    await page.getByRole('button', { name: 'Next moment' }).click()
  }
  await expect.poll(() => shownCount(page), { timeout: 15_000 }).toBeGreaterThan(atOpening)
})

test('reading mode offers no way to add to the cast, and can be turned off', async ({ page }) => {
  await downloadFirstLibraryWorld(page)
  await page.getByRole('link', { name: /characters/i }).first().click()
  await settleNav(page)
  await expect(page.getByRole('button', { name: 'Add Character' })).toHaveCount(0)

  // Turning it off is the escape hatch for anyone who wants to edit. Settings
  // lives in the collapsed half of the nav rail, so go there directly — the
  // rail's own behaviour is not what this test is about.
  await page.goto(`/#${await worldPath(page)}/settings`)
  await settleNav(page)
  await page.getByRole('button', { name: 'Reading mode is on' }).click()
  await expect(page.getByRole('button', { name: 'Turn on reading mode' })).toBeVisible()

  await page.goto(`/#${await worldPath(page)}/characters`)
  await settleNav(page)
  await expect(page.getByRole('button', { name: 'Add Character' }).first()).toBeVisible()
  await expect(page.getByRole('note')).toHaveCount(0)
})

test('the dashboard does not give away the body count', async ({ page }) => {
  await downloadFirstLibraryWorld(page)
  // "7 dead" in chapter one tells you the toll of a book you have not read.
  await expect(page.getByRole('main')).not.toContainText('dead')
})
