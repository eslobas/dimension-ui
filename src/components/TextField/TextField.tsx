import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../../utils/cx';
import './TextField.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label. Always required: placeholders are not labels. */
  label: ReactNode;
  hint?: ReactNode;
  /** Error message. When set, the input is marked aria-invalid and the message is announced. */
  error?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({ label, hint, error, id, required, className, ref, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? `dui-tf-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId, rest['aria-describedby']].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('dui-field', error && 'dui-field--invalid', className)}>
      <label className="dui-field__label" htmlFor={inputId}>
        {label}
        {required && (
          <span className="dui-field__required" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="dui-field__hint">
          {hint}
        </p>
      )}
      <input
        ref={ref}
        id={inputId}
        className="dui-field__input dui-focusable"
        required={required}
        aria-invalid={error ? true : undefined}
        {...rest}
        aria-describedby={describedBy}
      />
      {error && (
        <p id={errorId} className="dui-field__error" role="alert">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
