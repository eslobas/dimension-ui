import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyButton } from './CopyButton';

const meta = {
  title: 'Components/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  args: { value: 'diogovieiramonteiro@gmail.com', label: 'Copy email' },
  parameters: {
    docs: { description: { component: 'The result is announced through a polite live region, so screen reader users hear "Copied to clipboard".' } },
  },
} satisfies Meta<typeof CopyButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm', variant: 'ghost' } };
