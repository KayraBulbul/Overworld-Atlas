import { expect, test, type Page } from '@playwright/test'

const routes = [
  { name: 'home', path: '/' },
  { name: 'map', path: '/map' },
  { name: 'players', path: '/players' },
  { name: 'stories', path: '/stories' },
  { name: 'events', path: '/events' },
  { name: 'screenshots', path: '/screenshots' },
  { name: 'not-found', path: '/missing-page' },
]

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'compact-desktop', width: 1024, height: 900 },
  { name: 'tablet', width: 900, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'minimum-mobile', width: 320, height: 800 },
]

async function waitForPage(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      Array.from(document.images, (image) =>
        image.complete
          ? image.decode()
          : new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true })
              image.addEventListener('error', () => resolve(), { once: true })
            }),
      ),
    )
  })
}

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport })

    for (const route of routes) {
      for (const theme of ['light', 'dark'] as const) {
        test(`${route.name} ${theme}`, async ({ page }) => {
          await page.goto(route.path)
          if (theme === 'dark') {
            await page
              .getByRole('button', { name: 'Switch to dark mode' })
              .click()
          }
          await waitForPage(page)

          await expect(page).toHaveScreenshot(
            `${route.name}-${theme}-${viewport.name}.png`,
            { fullPage: true },
          )
        })
      }
    }
  })
}

test.describe('responsive boundaries', () => {
  for (const width of [1153, 1152, 929, 928, 705, 704]) {
    test(`home at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await waitForPage(page)

      await expect(page).toHaveScreenshot(`home-boundary-${width}.png`, {
        fullPage: true,
      })
    })
  }
})

test.describe('interactive states', () => {
  test('open mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.locator('[aria-controls="primary-navigation"]').click()
    await waitForPage(page)

    await expect(page).toHaveScreenshot('mobile-navigation-open.png')
  })

  test('join dialog', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Join', exact: true }).click()
    await waitForPage(page)

    await expect(page).toHaveScreenshot('join-dialog.png')
  })

  test('login dialog in dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Switch to dark mode' }).click()
    await page.getByRole('button', { name: 'Log In' }).click()
    await waitForPage(page)

    await expect(page).toHaveScreenshot('login-dialog-dark-mobile.png')
  })

  test('keyboard focus', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/')
    await page.keyboard.press('Tab')
    await waitForPage(page)

    await expect(page).toHaveScreenshot('skip-link-focused.png')
  })

  test('sticky header after scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/')
    await waitForPage(page)
    await page.evaluate(() => window.scrollTo(0, 1200))
    await page.waitForFunction(() => window.scrollY >= 1200)

    await expect(page).toHaveScreenshot('sticky-header-scrolled.png')
  })
})
