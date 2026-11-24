import { useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Card.css';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /** Small label above the title, e.g. a category. */
  eyebrow?: ReactNode;
  /** Makes the whole card a link while keeping a single, meaningful link in the a11y tree. */
  href?: string;
  /** Pointer-following highlight from the Dimension site. Skipped for reduced motion and touch. */
  spotlight?: boolean;
  footer?: ReactNode;
  headingLevel?: 2 | 3 | 4;
}

export function Card({
  title,
  eyebrow,
  href,
  spotlight = false,
  footer,
  headingLevel = 3,
  className,
  children,
  ...rest
}: CardProps) {
  const ref = useRef<HTMLElement>(null);
  const Heading = `h${headingLevel}` as const;

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!spotlight || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--dui-mx', `${event.clientX - rect.left}px`);
    ref.current.style.setProperty('--dui-my', `${event.clientY - rect.top}px`);
  };

  return (
    <article
      ref={ref}
      className={cx('dui-card', spotlight && 'dui-card--spotlight', href && 'dui-card--interactive', className)}
      onPointerMove={handlePointerMove}
      {...rest}
    >
      {eyebrow && <p className="dui-card__eyebrow">{eyebrow}</p>}
      <Heading className="dui-card__title">
        {href ? (
          // The ::after of this link stretches over the card, so the whole surface is clickable
          // without nesting interactive content inside a giant <a>.
          <a className="dui-card__link dui-focusable" href={href}>
            {title}
          </a>
        ) : (
          title
        )}
      </Heading>
      {children && <div className="dui-card__body">{children}</div>}
      {footer && <div className="dui-card__footer">{footer}</div>}
    </article>
  );
}
