import { expect, test } from '@playwright/test';

const story = (id: string) => `/iframe.html?id=${id}&viewMode=story&globals=a11y.manual:!true`;

/** Open a story and wait until it has rendered, so keyboard input reaches it. */
async function open(page: import('@playwright/test').Page, id: string) {
  await page.goto(story(id));
  await page.locator('#storybook-root > *').first().waitFor();
}

test.describe('Dialog', () => {
  test('traps focus, closes on Escape and returns focus to the trigger', async ({ page }) => {
    await open(page, 'components-dialog--confirm');
    const trigger = page.getByRole('button', { name: 'Delete account' });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Delete your account?' });
    await expect(dialog).toBeVisible();

    // Cycle through more Tab presses than there are controls. Focus must never reach the page
    // behind the modal. (Chrome may briefly move it to the browser UI, where activeElement is body.)
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const leaked = await dialog.evaluate(
        (el) => document.activeElement !== document.body && !el.contains(document.activeElement),
      );
      expect(leaked).toBe(false);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('closes when the backdrop is clicked', async ({ page }) => {
    await open(page, 'components-dialog--confirm');
    await page.getByRole('button', { name: 'Delete account' }).click();
    await page.mouse.click(5, 5);
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});

test.describe('Tabs', () => {
  test('is fully keyboard operable', async ({ page }) => {
    await open(page, 'components-tabs--automatic');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tab', { name: 'Websites' })).toBeFocused();
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: 'Consulting' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('architecture reviews');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tabpanel')).toBeFocused();
  });
});

test.describe('Card', () => {
  test('the whole card surface follows the link', async ({ page }) => {
    await open(page, 'components-card--linked');
    const card = page.getByRole('article');
    const box = (await card.boundingBox())!;
    // Click the bottom-right corner, far from the title text.
    await page.mouse.click(box.x + box.width - 8, box.y + box.height - 8);
    await expect(page).toHaveURL(/#ac-flowers$/);
  });
});

test.describe('Reduced motion', () => {
  test.use({ colorScheme: 'dark', reducedMotion: 'reduce' });
  test('disables the card spotlight', async ({ page }) => {
    await open(page, 'components-card--spotlight');
    const display = await page
      .getByRole('article')
      .evaluate((el) => getComputedStyle(el, '::before').display);
    expect(display).toBe('none');
  });
});

test('focus is always visible on keyboard navigation', async ({ page }) => {
  await open(page, 'components-button--primary');
  await page.keyboard.press('Tab');
  const outline = await page.getByRole('button').evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe('none');
});
