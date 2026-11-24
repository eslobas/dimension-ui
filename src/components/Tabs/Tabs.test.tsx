import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../../test/axe';
import { Tabs, type TabItem } from './Tabs';

const items: TabItem[] = [
  { id: 'web', label: 'Web', content: 'Next.js sites' },
  { id: 'mobile', label: 'Mobile', content: 'React Native apps', disabled: true },
  { id: 'design', label: 'Design', content: 'Design systems' },
  { id: 'apis', label: 'APIs', content: 'REST integrations' },
];

describe('Tabs', () => {
  it('wires tabs and panels together with ARIA', () => {
    render(<Tabs label="Services" items={items} />);
    expect(screen.getByRole('tablist', { name: 'Services' })).toBeInTheDocument();
    const web = screen.getByRole('tab', { name: 'Web' });
    expect(web).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel', { name: 'Web' });
    expect(web).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveTextContent('Next.js sites');
  });

  it('uses a roving tabindex: only the selected tab is in the Tab order', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Services" items={items} />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Web' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('moves with arrow keys, wraps around and skips disabled tabs', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Services" items={items} />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Design' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Design systems');
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Web' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'APIs' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Web' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'APIs' })).toHaveFocus();
  });

  it('in manual mode, arrows move focus but Enter selects', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs label="Services" items={items} activation="manual" onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Design' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Next.js sites');
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('design');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Design systems');
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs label="Services" items={items} value="apis" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('tab', { name: 'Web' }));
    expect(onValueChange).toHaveBeenCalledWith('web');
    // Parent did not update value, so selection stays.
    expect(screen.getByRole('tab', { name: 'APIs' })).toHaveAttribute('aria-selected', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Tabs label="Services" items={items} />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
