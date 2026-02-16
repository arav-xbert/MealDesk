import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './RadioButton.module.css';

interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className={`${styles.wrapper} ${className ?? ''}`}>
        <input ref={ref} type="radio" className={styles.input} {...props} />
        <span className={styles.radio} />
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

RadioButton.displayName = 'RadioButton';
