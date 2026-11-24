import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from '../Tag/Tag';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    eyebrow: 'E-commerce',
    title: 'AC Flowers: online shop',
    children:
      'Flower-by-flower bouquet builder with live pricing, delivery slots, Stripe payments and an admin dashboard for the florist.',
    footer: (
      <>
        <Tag>Next.js</Tag>
        <Tag>TypeScript</Tag>
        <Tag>Supabase</Tag>
        <Tag>Stripe</Tag>
      </>
    ),
  },
  decorators: [(Story) => <div style={{ maxWidth: 380 }}><Story /></div>],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {};
export const Linked: Story = { args: { href: '#ac-flowers' } };
export const Spotlight: Story = {
  args: { href: '#ac-flowers', spotlight: true },
  parameters: { docs: { description: { story: 'Move the mouse over the card. Disabled for touch input and `prefers-reduced-motion`.' } } },
};

export const Grid: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 'none' }}><Story /></div>],
  render: () => (
    <div className="sb-grid">
      <Card spotlight href="#1" eyebrow="E-commerce" title="AC Flowers" footer={<Tag>Next.js</Tag>}>
        Online shop with bouquet builder and Stripe Checkout.
      </Card>
      <Card spotlight href="#2" eyebrow="Healthcare" title="Traceability platform" footer={<Tag tone="success">In production</Tag>}>
        Case traceability for a dental laboratory, used daily.
      </Card>
      <Card spotlight href="#3" eyebrow="Portfolio" title="Dimension" footer={<Tag>SSG</Tag>}>
        Bilingual portfolio with generated Open Graph images.
      </Card>
    </div>
  ),
};
