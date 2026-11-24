import { describe, expect, it } from 'vitest';
import { themes, type ThemeName } from './tokens';

/** WCAG 2.x relative luminance and contrast ratio. */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio, why]
const pairs: [string, string, number, string][] = [
  ['fg', 'bg', 4.5, 'body text'],
  ['fg', 'surface', 4.5, 'text on cards'],
  ['fg-muted', 'bg', 4.5, 'secondary text'],
  ['fg-muted', 'surface', 4.5, 'secondary text on cards'],
  ['on-action', 'action', 4.5, 'primary button label'],
  ['on-action', 'action-hover', 4.5, 'primary button label on hover'],
  ['accent', 'bg', 4.5, 'accent text and links'],
  ['accent', 'surface', 4.5, 'accent tags on cards'],
  ['danger', 'bg', 4.5, 'error messages'],
  ['danger', 'surface', 4.5, 'error messages in dialogs'],
  ['success', 'surface', 4.5, 'success tags'],
  ['border-strong', 'bg', 3, 'input borders (WCAG 1.4.11 non-text contrast)'],
  ['focus', 'bg', 3, 'focus ring (WCAG 1.4.11)'],
];

describe.each(Object.keys(themes) as ThemeName[])('%s theme meets WCAG 2.1 AA contrast', (theme) => {
  const t = themes[theme] as Record<string, string>;
  it.each(pairs)('%s on %s >= %s:1 (%s)', (fg, bg, min) => {
    expect(contrast(t[fg]!, t[bg]!)).toBeGreaterThanOrEqual(min);
  });
});

it('documents why the brand blue is not used behind white text', () => {
  // The original site used white on #4f8cff: 3.2:1, which fails AA for normal text.
  expect(contrast('#ffffff', '#4f8cff')).toBeLessThan(4.5);
});
