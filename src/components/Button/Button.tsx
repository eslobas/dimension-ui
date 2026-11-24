import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../../utils/cx';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, sets aria-busy and blocks clicks while keeping the button focusable. */
  loading?: boolean;
  /** Decorative icon before the label. Hidden from assistive tech. */
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconStart,
  iconEnd,
  fullWidth = false,
  disabled,
  className,
  children,
  type = 'button',
  onClick,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'dui-button',
        'dui-focusable',
        `dui-button--${variant}`,
        `dui-button--${size}`,
        fullWidth && 'dui-button--full',
        loading && 'dui-button--loading',
        className,
      )}
      disabled={disabled}
      aria-busy={loading || undefined}
      // aria-disabled instead of disabled while loading, so focus is not lost mid-action.
      aria-disabled={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {loading ? <span className="dui-button__spinner" aria-hidden="true" /> : iconStart && <span className="dui-button__icon" aria-hidden="true">{iconStart}</span>}
      <span className="dui-button__label">{children}</span>
      {iconEnd && !loading && <span className="dui-button__icon" aria-hidden="true">{iconEnd}</span>}
    </button>
  );
}
