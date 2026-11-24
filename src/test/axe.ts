import axe from 'axe-core';

/**
 * Runs axe on a container and returns readable violations.
 * Colour contrast is skipped here because jsdom does not compute styles;
 * it is checked by the token contrast test and by Playwright in a real browser.
 */
export async function axeViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length} node(s))`);
}
