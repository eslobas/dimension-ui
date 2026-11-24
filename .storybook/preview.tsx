import type { Preview } from '@storybook/react-vite';
import '../src/styles/base.css';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (Story, context) => (
      <div data-theme={context.globals.theme} className="sb-canvas">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i } },
    // Fail the a11y panel (and the test runner) on violations instead of only warning.
    a11y: { test: 'error' },
    options: { storySort: { order: ['Introduction', 'Foundations', 'Components'] } },
  },
};
export default preview;
