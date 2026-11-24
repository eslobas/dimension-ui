import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { CopyButton } from './CopyButton';

it('copies the value and announces success politely', async () => {
  const user = userEvent.setup();
  const onCopied = vi.fn();
  render(<CopyButton value="hello@dimension.pt" label="Copy email" onCopied={onCopied} />);
  await user.click(screen.getByRole('button', { name: 'Copy email' }));
  await expect(navigator.clipboard.readText()).resolves.toBe('hello@dimension.pt');
  expect(onCopied).toHaveBeenCalledWith('hello@dimension.pt');
  expect(screen.getByRole('button')).toHaveAccessibleName('Copied');
  expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard');
});

it('tells the user what to do when the clipboard is unavailable', async () => {
  const user = userEvent.setup();
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'));
  render(<CopyButton value="x" />);
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  expect(screen.getByRole('status')).toHaveTextContent('Could not copy');
});

it('resets to the idle label after the timeout', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(<CopyButton value="x" resetAfter={1000} />);
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  expect(screen.getByRole('button')).toHaveAccessibleName('Copied');
  await act(() => vi.advanceTimersByTimeAsync(1100));
  expect(screen.getByRole('button')).toHaveAccessibleName('Copy');
  vi.useRealTimers();
});
