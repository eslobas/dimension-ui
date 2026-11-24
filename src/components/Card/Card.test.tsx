import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Card } from './Card';

it('uses an article with a real heading at the requested level', () => {
  render(<Card title="AC Flowers" headingLevel={2} />);
  expect(screen.getByRole('article')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'AC Flowers' })).toBeInTheDocument();
});

it('exposes exactly one link, named by the title, when href is set', () => {
  render(
    <Card title="AC Flowers" href="/projects/ac-flowers">
      Online shop for a flower atelier.
    </Card>,
  );
  const links = screen.getAllByRole('link');
  expect(links).toHaveLength(1);
  expect(links[0]).toHaveAccessibleName('AC Flowers');
  expect(links[0]).toHaveAttribute('href', '/projects/ac-flowers');
});

it('has no axe violations', async () => {
  const { container } = render(
    <Card title="Traceability platform" eyebrow="Healthcare" href="#" spotlight footer={<span>Next.js</span>}>
      In production for a dental laboratory.
    </Card>,
  );
  expect(await axeViolations(container)).toEqual([]);
});
