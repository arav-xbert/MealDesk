import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.root} ${styles[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
      <span className={styles.arrow}>&rarr;</span>
    </button>
  );
}
