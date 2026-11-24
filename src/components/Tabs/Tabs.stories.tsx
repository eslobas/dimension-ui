import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    label: 'Services',
    items: [
      { id: 'web', label: 'Websites', content: 'Pages and components in React and Next.js, built from the design.' },
      { id: 'apps', label: 'Web apps', content: 'Full applications connected to REST APIs, databases and payments.' },
      { id: 'mobile', label: 'Mobile', content: 'React Native with Expo.', disabled: true },
      { id: 'consulting', label: 'Consulting', content: 'Stack choices, architecture reviews and audits.' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          'Follows the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): one Tab stop, arrow keys between tabs, Home/End, disabled tabs skipped.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Automatic: Story = {};
export const Manual: Story = { args: { activation: 'manual' } };

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('tab', { name: 'Websites' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Web apps' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    // "Mobile" is disabled, so focus skips to "Consulting".
    await expect(canvas.getByRole('tab', { name: 'Consulting' })).toHaveFocus();
  },
};
