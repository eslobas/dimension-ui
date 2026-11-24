import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Dialog.css';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Action buttons, rendered in the footer. */
  footer?: ReactNode;
  /** Close when the backdrop is clicked. Defaults to true. */
  dismissOnBackdrop?: boolean;
  className?: string;
}

/**
 * Modal dialog built on the native <dialog> element: showModal() gives us the focus trap,
 * inert background and Escape handling for free. We add labelling, focus return and backdrop close.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  dismissOnBackdrop = true,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Return focus to whatever opened the dialog (WCAG 2.4.3 focus order).
  useEffect(() => {
    if (!open && returnFocusTo.current) {
      returnFocusTo.current.focus();
      returnFocusTo.current = null;
    }
  }, [open]);

  return (
    // Backdrop click is a pointer shortcut only; keyboard users close with Escape or the close button.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      className={cx('dui-dialog', className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Escape fires "cancel"; keep React state as the source of truth.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (dismissOnBackdrop && event.target === ref.current) onClose();
      }}
    >
      <div className="dui-dialog__content">
        <header className="dui-dialog__header">
          <h2 id={titleId} className="dui-dialog__title">
            {title}
          </h2>
          <button type="button" className="dui-dialog__close dui-focusable" aria-label="Close dialog" onClick={onClose}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        {description && (
          <p id={descriptionId} className="dui-dialog__description">
            {description}
          </p>
        )}
        {children && <div className="dui-dialog__body">{children}</div>}
        {footer && <footer className="dui-dialog__footer">{footer}</footer>}
      </div>
    </dialog>
  );
}
