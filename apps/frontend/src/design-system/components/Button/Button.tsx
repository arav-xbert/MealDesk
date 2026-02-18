import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ButtonPrimary({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.root} ${styles.primary} ${className ?? ''}`}
      {...props}
    >
      {children}
      <span className={styles.arrow}>&rarr;</span>
    </button>
  );
}

export function ButtonSecondary({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.root} ${styles.secondary} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
