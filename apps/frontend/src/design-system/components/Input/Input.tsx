import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'text' | 'password';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'text', className, ...props }, ref) => {
    return (
      <div className={`${styles.wrapper} ${className ?? ''}`}>
        <div className={styles.icon} />
        <input
          ref={ref}
          type={variant === 'password' ? 'password' : 'text'}
          className={styles.input}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
