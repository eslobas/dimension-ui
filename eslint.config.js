import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';

export default tseslint.config(
  { ignores: ['dist', 'storybook-static', 'coverage', 'playwright-report', 'test-results', '!.storybook'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.strict,
  reactHooks.configs.flat.recommended,
  ...storybook.configs['flat/recommended'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
);
