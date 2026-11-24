import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Tag.css';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'success' | 'danger';
  /** When set, renders a remove button labelled "Remove <children>". */
  onRemove?: () => void;
  /** Accessible label for the remove button. Defaults to "Remove {text}". */
  removeLabel?: string;
}

export function Tag({ tone = 'neutral', onRemove, removeLabel, className, children, ...rest }: TagProps) {
  const text = typeof children === 'string' ? children : undefined;
  return (
    <span className={cx('dui-tag', `dui-tag--${tone}`, className)} {...rest}>
      {children}
      {onRemove && (
        <button
          type="button"
          className="dui-tag__remove dui-focusable"
          aria-label={removeLabel ?? (text ? `Remove ${text}` : 'Remove')}
          onClick={onRemove}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
