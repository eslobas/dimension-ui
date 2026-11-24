import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Accessible name for the tab list. */
  label: string;
  /** Controlled selected tab id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /**
   * 'automatic' selects on arrow-key focus (good for light panels);
   * 'manual' waits for Enter/Space (good when panels are expensive to render).
   */
  activation?: 'automatic' | 'manual';
  className?: string;
}

/** WAI-ARIA APG Tabs pattern: roving tabindex, arrow keys, Home/End, disabled tabs skipped. */
export function Tabs({
  items,
  label,
  value,
  defaultValue,
  onValueChange,
  activation = 'automatic',
  className,
}: TabsProps) {
  const baseId = useId();
  const firstEnabled = items.find((t) => !t.disabled)?.id;
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? internal;
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };

  const enabled = items.filter((t) => !t.disabled);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentId: string) => {
    const index = enabled.findIndex((t) => t.id === currentId);
    let next: TabItem | undefined;
    switch (event.key) {
      case 'ArrowRight':
        next = enabled[(index + 1) % enabled.length];
        break;
      case 'ArrowLeft':
        next = enabled[(index - 1 + enabled.length) % enabled.length];
        break;
      case 'Home':
        next = enabled[0];
        break;
      case 'End':
        next = enabled[enabled.length - 1];
        break;
      default:
        return;
    }
    if (!next) return;
    event.preventDefault();
    tabRefs.current.get(next.id)?.focus();
    if (activation === 'automatic') select(next.id);
  };

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  return (
    <div className={cx('dui-tabs', className)}>
      <div role="tablist" aria-label={label} className="dui-tabs__list">
        {items.map((tab) => {
          const isSelected = tab.id === selected;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={isSelected}
              aria-controls={panelId(tab.id)}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.disabled}
              className="dui-tabs__tab dui-focusable"
              onClick={() => select(tab.id)}
              onKeyDown={(e) => onKeyDown(e, tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {items.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelId(tab.id)}
          aria-labelledby={tabId(tab.id)}
          hidden={tab.id !== selected}
          // APG: panels without focusable content must be reachable by Tab.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          className="dui-tabs__panel dui-focusable"
        >
          {tab.id === selected && tab.content}
        </div>
      ))}
    </div>
  );
}
