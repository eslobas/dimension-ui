import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'Next.js' },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'accent', 'success', 'danger'] } },
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Tones: Story = {
  render: () => (
    <div className="sb-row">
      <Tag>Neutral</Tag>
      <Tag tone="accent">In progress</Tag>
      <Tag tone="success">In production</Tag>
      <Tag tone="danger">Overdue</Tag>
    </div>
  ),
};

export const Removable: Story = {
  render: function Render() {
    const [tags, setTags] = useState(['React', 'Next.js', 'TypeScript', 'Tailwind CSS']);
    return (
      <div className="sb-row">
        {tags.map((t) => (
          <Tag key={t} onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
            {t}
          </Tag>
        ))}
      </div>
    );
  },
};
