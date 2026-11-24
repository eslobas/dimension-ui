import { useEffect, useRef, useState } from 'react';
import { Button, type ButtonProps } from '../Button/Button';

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  /** Text written to the clipboard. */
  value: string;
  label?: string;
  copiedLabel?: string;
  /** How long the "copied" state stays, in ms. */
  resetAfter?: number;
  /** Called after the value was written to the clipboard. */
  onCopied?: (value: string) => void;
}

type Status = 'idle' | 'copied' | 'error';

/** Copies a value and announces the result through a polite live region. */
export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  resetAfter = 2000,
  onCopied,
  variant = 'secondary',
  ...rest
}: CopyButtonProps) {
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus('copied');
      onCopied?.(value);
    } catch {
      setStatus('error');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), resetAfter);
  };

  return (
    <>
      <Button variant={variant} onClick={copy} {...rest}>
        {status === 'copied' ? copiedLabel : label}
      </Button>
      <span className="dui-visually-hidden" role="status" aria-live="polite">
        {status === 'copied' ? `${copiedLabel} to clipboard` : status === 'error' ? 'Could not copy. Select the text and copy it manually.' : ''}
      </span>
    </>
  );
}
