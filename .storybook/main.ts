import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Served from https://eslobas.github.io/dimension-ui/ on GitHub Pages.
  viteFinal: (cfg) => ({ ...cfg, base: process.env.STORYBOOK_BASE ?? cfg.base }),
};
export default config;
