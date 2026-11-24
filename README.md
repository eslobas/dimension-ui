# Dimension UI

[![CI](https://github.com/eslobas/dimension-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/eslobas/dimension-ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785?logo=storybook&logoColor=white)](https://eslobas.github.io/dimension-ui/)

Design tokens and accessible React components extracted from my portfolio, [dimension.pt](https://dimension.pt).
Documented in Storybook, tested for WCAG 2.1 AA in CI.

**Live Storybook:** https://eslobas.github.io/dimension-ui/

## What's in it

| | |
|---|---|
| **Tokens** | `tokens/tokens.json` (W3C DTCG-style) compiled by a small script into CSS custom properties and a typed TS object. Primitive tokens (`blue.600`) feed semantic tokens (`action`), which is what components use. Dark and light themes via `data-theme`. |
| **Components** | `Button`, `Tag`, `Card`, `TextField`, `Tabs`, `Dialog`, `CopyButton`. Each follows the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) where a pattern exists. |
| **Storybook** | Autodocs, controls, theme switcher, `play` interaction tests and the a11y addon set to fail on violations. |
| **Tests** | Vitest + React Testing Library + axe-core for behaviour; Playwright for real-browser checks. |

## Accessibility decisions

These are things the tests enforce, not just intentions:

- **Colour contrast is tested per token pair.** `src/tokens/contrast.test.ts` checks every text/background pair in both themes against 4.5:1 (text) or 3:1 (borders, focus ring). It caught two real problems:
  - the site's primary button used white on the brand blue `#4f8cff`, which is **3.2:1** and fails AA. Buttons now use a separate `action` token (`#2f6fe0`, 4.7:1) and the brand blue stays for accents;
  - in the light theme, the accent on card surfaces was below 4.5:1, so it moved one step darker.
- **Every story is audited with axe in both themes in a real browser** (`e2e/a11y.spec.ts`), so contrast is measured on rendered pixels, not just tokens.
- **Keyboard:** `Tabs` uses a roving tabindex with arrow keys, Home/End and disabled tabs skipped; `Dialog` uses native `showModal()` for the focus trap and inert background, closes on Escape and returns focus to the trigger (checked in Playwright).
- **Forms:** `TextField` always has a visible `<label>`, links hint and error through `aria-describedby`, sets `aria-invalid`, and shows errors with icon + text, never colour alone.
- **Targets and motion:** 44px minimum for primary controls (24px for the tag remove button, the WCAG 2.2 minimum); spotlight and transitions are disabled under `prefers-reduced-motion`.
- **Loading buttons** keep focus and use `aria-busy` instead of `disabled`, so keyboard users don't lose their place.

## Usage

```tsx
import { Button, Card, Tag } from '@dimension/ui';
import '@dimension/ui/styles.css';

export function Project() {
  return (
    <Card spotlight href="/projects/ac-flowers" eyebrow="E-commerce" title="AC Flowers"
      footer={<><Tag>Next.js</Tag><Tag>Stripe</Tag></>}>
      Bouquet builder with live pricing and Stripe Checkout.
    </Card>
  );
}
```

Set the theme on any ancestor: `<html data-theme="light">`. Dark is the default.

## Scripts

```bash
npm install
npm run dev              # Storybook on http://localhost:6006
npm test                 # Vitest: unit, behaviour, axe, token contrast
npm run build-storybook  # static Storybook
npm run test:e2e         # Playwright against the static build (desktop + mobile)
npm run lint             # ESLint incl. jsx-a11y (strict)
npm run typecheck
npm run build            # ESM bundle + CSS + .d.ts in dist/
npm run tokens           # regenerate src/tokens/* from tokens/tokens.json
```

## Structure

```
tokens/tokens.json          source of truth for design tokens
scripts/build-tokens.mjs    tokens -> CSS variables + typed TS
src/tokens/                 generated tokens + contrast tests
src/components/<Name>/      component, styles, stories, tests
src/docs/                   Storybook MDX pages (intro, tokens)
e2e/                        Playwright: axe on every story, keyboard and focus flows
.github/workflows/          CI and Storybook deploy to GitHub Pages
```

## Stack

React 19 · TypeScript · Vite · Storybook 10 · Vitest · React Testing Library · axe-core · Playwright · ESLint (jsx-a11y) · GitHub Actions

## Roadmap

- Publish to npm and consume it from [dimension-site](https://github.com/eslobas/dimension-site)
- Figma variables ↔ tokens sync
- React Native counterparts for `Button` and `TextField` sharing the same tokens

---

MIT © Diogo Vieira Monteiro
