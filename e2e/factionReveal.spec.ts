import { test, expect } from '@playwright/test'
import { resetDB } from './helpers/reset'

/**
 * The Factions roster and the search palette must agree about which factions a
 * reader has met.
 *
 * They did not: search gated factions by membership, the roster did not gate at
 * all, so the same faction could be hidden in search and listed on the Factions
 * page at the same cursor — descriptions included. A faction name is among the
 * sharpest things a world holds; "Voldemort and His Servants" on the roster in
 * chapter one is the whole book.
 */
test.describe('Faction reveal', () => {
  test.describe.configure({ timeout: 180_000 })

  const UNMET = ['Voldemort and His Servants', 'Slytherin House']
  const MET = 'The Dursley Household'

  test('the roster hides factions the reader has met nobody in', async ({ page }) => {
    await page.goto('/')
    await resetDB(page)
    await page.getByRole('button', { name: 'Library', exact: true }).click()
    await page.getByRole('button', { name: /^Download \(/ }).first().click()
    await expect(page).toHaveURL(/#\/worlds\//, { timeout: 60_000 })
    await page.waitForTimeout(1500)
    const worldId = new URL(page.url()).hash.split('/')[2]

    // Step onto the opening moment, where nearly the whole book is unread.
    await page.getByRole('button', { name: 'Next moment' }).click()
    await page.waitForTimeout(1200)

    await page.goto(`/#/worlds/${worldId}/factions`)
    await page.waitForTimeout(2000)

    // Present: the reader has met all four Dursleys by now.
    await expect(page.getByText(MET).first(), `"${MET}" should be listed`).toBeVisible()

    // Absent: nobody in either has appeared yet. Paired with the above, so this
    // cannot pass because the roster simply failed to render.
    for (const name of UNMET) {
      await expect(page.getByText(name), `"${name}" should not be listed at chapter one`).toHaveCount(0)
    }

    // Search must give the same answer at the same cursor.
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(500)
    await page.getByRole('textbox').first().fill('house')
    await page.waitForTimeout(900)
    const results = (await page.locator('[role="dialog"], .fixed').first().innerText().catch(() => '')) || ''
    expect(results, 'search and the roster disagree about Slytherin House')
      .not.toContain('Slytherin House')
  })
})
