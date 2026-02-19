import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: boolean;
}

export function Button({ children, variant = 'primary', icon = false, className, ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.root} ${styles[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
      {icon && <span className={styles.arrow}>&rarr;</span>}
    </button>
  );
}
