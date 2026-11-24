import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { TextField } from './TextField';

it('associates the label with the input', async () => {
  const user = userEvent.setup();
  render(<TextField label="Email" />);
  await user.click(screen.getByText('Email'));
  expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
});

it('describes the input with hint and error, and marks it invalid', () => {
  render(<TextField label="Email" hint="We reply within a day." error="Enter a valid email address." />);
  const input = screen.getByRole('textbox', { name: 'Email' });
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('We reply within a day. Enter a valid email address.');
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
});

it('keeps a caller-provided aria-describedby', () => {
  render(
    <>
      <p id="extra">Extra help</p>
      <TextField label="Name" aria-describedby="extra" />
    </>,
  );
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Extra help');
});

it('marks required fields natively, not only with an asterisk', () => {
  render(<TextField label="Name" required />);
  expect(screen.getByRole('textbox', { name: 'Name' })).toBeRequired();
});

it('has no axe violations', async () => {
  const { container } = render(
    <>
      <TextField label="Name" required />
      <TextField label="Email" type="email" error="Required" />
    </>,
  );
  expect(await axeViolations(container)).toEqual([]);
});
