import { test, expect } from '@playwright/test'
import { resetDB } from './helpers/reset'

/**
 * NEW-1 and SEL-2: two pieces of the first ten minutes.
 *
 * The full rail sat beside the first-run guide, so every one of a dozen empty
 * screens was one click away from a flow trying to walk you through four steps.
 * And the world selector explained the import file formats permanently, in the
 * header, for an action nobody had started.
 */
test.describe('The first ten minutes', () => {
  test.describe.configure({ timeout: 120_000 })

  async function blankWorld(page: import('@playwright/test').Page) {
    await page.goto('/')
    await resetDB(page)
    await page.getByRole('button', { name: 'New World' }).click()
    await page.getByLabel('Name').fill('First Run')
    await page.getByRole('button', { name: 'Create World' }).last().click()
    await expect(page).toHaveURL(/#\/worlds\//)
    await expect(page.getByRole('navigation', { name: 'Wizard progress' })).toBeVisible({ timeout: 30_000 })
  }

  test('NEW-1: the guide is not competing with ten empty screens', async ({ page }) => {
    await blankWorld(page)
    const rail = page.getByRole('navigation', { name: 'Main navigation' })

    // The ten extended routes have nothing in them until the guide has run.
    for (const label of ['Corkboard', 'Calendar', 'Structure', 'Items', 'Relations', 'Arc', 'Lore', 'Factions', 'Knowledge', 'Settings']) {
      await expect(rail.getByRole('link', { name: label, exact: true }),
        `${label} is empty during onboarding and should not be offered`).toHaveCount(0)
    }

    // The five core routes stay: leaving the guide by the rail is a legitimate
    // thing to want, and taking navigation away entirely would make the guide
    // modal in all but name. Paired with the absences above.
    for (const label of ['Dashboard', 'Timeline', 'Characters', 'Maps']) {
      await expect(rail.getByRole('link', { name: label, exact: true }),
        `${label} should still be reachable`).toBeVisible()
    }

    // And once the guide is done, everything comes back — so the absence above
    // is the guide's doing, not a route that stopped existing. Skipping a step
    // is not finishing: the guide is still on screen at "Done", and the rail
    // stays reduced until it is actually left.
    await page.getByLabel('Timeline name').fill('Main Timeline')
    await page.getByRole('button', { name: 'Begin' }).click()
    await expect(page.getByRole('button', { name: /Skip/i }).first()).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: /Skip/i }).first().click()
    await expect(page.getByRole('button', { name: 'Go to my Timeline' })).toBeVisible({ timeout: 15_000 })
    await expect(rail.getByRole('link', { name: 'Arc', exact: true })).toHaveCount(0)

    await page.getByRole('button', { name: 'Go to my Timeline' }).click()
    await expect(rail.getByRole('link', { name: 'Arc', exact: true })).toBeVisible({ timeout: 15_000 })
    await expect(rail.getByRole('link', { name: 'Factions', exact: true })).toBeVisible()
  })

  test('SEL-2: the import formats are explained when you ask to import', async ({ page }) => {
    await page.goto('/')
    await resetDB(page)

    // Absent from the header, where it described an action nobody had started.
    const header = page.locator('header').first()
    await expect(header).not.toContainText('.pwb')
    await expect(header).not.toContainText('Select a')

    // Present at the moment it can be acted on — the ask that opens the picker.
    await page.getByRole('button', { name: 'Import World' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 15_000 })
    await expect(dialog).toContainText('.pwk')
    await expect(dialog).toContainText('.pwb')
    await expect(dialog.getByRole('button', { name: 'Choose file…' })).toBeVisible()

    // Backing out leaves the shelf as it was.
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(page.getByRole('main')).toContainText('No worlds yet')
  })
})
