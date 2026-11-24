import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Email', type: 'email', placeholder: 'name@example.com' },
  decorators: [(Story) => <div className="sb-stack"><Story /></div>],
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'We only use it to reply to you.' } };
export const Required: Story = { args: { required: true } };
export const WithError: Story = {
  args: { defaultValue: 'diogo@', error: 'Enter an email address like name@example.com.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Email' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(/Enter an email address/);
  },
};

export const LabelFocusesInput: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Email'));
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};
