import type { AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './Link.module.css';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  className?: string;
}

export function Link({ children, className, ...rest }: LinkProps) {
  return (
    <a className={`${styles.link} ${className ?? ''}`} {...rest}>
      {children}
    </a>
  );
}
