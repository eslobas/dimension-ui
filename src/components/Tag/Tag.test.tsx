import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Tag } from './Tag';

it('renders plain text with no interactive element when not removable', () => {
  render(<Tag>React</Tag>);
  expect(screen.getByText('React')).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('gives the remove button a name that says what it removes', async () => {
  const user = userEvent.setup();
  const onRemove = vi.fn();
  render(<Tag onRemove={onRemove}>TypeScript</Tag>);
  await user.click(screen.getByRole('button', { name: 'Remove TypeScript' }));
  expect(onRemove).toHaveBeenCalledOnce();
});

it('has no axe violations', async () => {
  const { container } = render(
    <>
      <Tag>Neutral</Tag>
      <Tag tone="accent" onRemove={() => {}}>
        Accent
      </Tag>
    </>,
  );
  expect(await axeViolations(container)).toEqual([]);
});
