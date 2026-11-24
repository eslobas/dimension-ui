import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

type IndexEntry = { id: string; type: 'story' | 'docs'; title: string; name: string };
const index = JSON.parse(readFileSync('storybook-static/index.json', 'utf8')) as {
  entries: Record<string, IndexEntry>;
};
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

// Every story, in both themes, in a real browser: this is where colour contrast is checked,
// since jsdom cannot compute styles.
for (const theme of ['dark', 'light'] as const) {
  test.describe(`axe · ${theme} theme`, () => {
    for (const story of stories) {
      test(`${story.title} / ${story.name}`, async ({ page }) => {
        // a11y.manual stops the Storybook addon running its own axe pass at the same time as ours.
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
        await page.locator('#storybook-root > *').first().waitFor();
        // Let play functions finish so we audit the final state.
        await page.waitForLoadState('networkidle');
        const results = await new AxeBuilder({ page })
          .include('#storybook-root')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
      });
    }
  });
}
