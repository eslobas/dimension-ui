import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Button } from '../Button/Button';
import { Dialog } from './Dialog';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete account</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete account?"
        description="This removes all your data and cannot be undone."
        footer={<Button onClick={() => setOpen(false)}>Cancel</Button>}
      />
    </>
  );
}

it('is labelled and described by its title and description', async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(screen.getByRole('button', { name: 'Delete account' }));
  const dialog = screen.getByRole('dialog', { name: 'Delete account?' });
  expect(dialog).toHaveAccessibleDescription('This removes all your data and cannot be undone.');
});

it('closes from the close button and returns focus to the trigger', async () => {
  const user = userEvent.setup();
  render(<Harness />);
  const trigger = screen.getByRole('button', { name: 'Delete account' });
  await user.click(trigger);
  await user.click(screen.getByRole('button', { name: 'Close dialog' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it('closes on Escape (the native cancel event)', async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(screen.getByRole('button', { name: 'Delete account' }));
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('has no axe violations when open', async () => {
  const user = userEvent.setup();
  const { container } = render(<Harness />);
  await user.click(screen.getByRole('button', { name: 'Delete account' }));
  expect(await axeViolations(container)).toEqual([]);
});
