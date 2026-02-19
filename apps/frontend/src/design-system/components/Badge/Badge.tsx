import styles from './Badge.module.css';

export type BadgeVariant = 'open' | 'pending' | 'closed';

interface BadgeProps {
  variant?: BadgeVariant;
  children: string;
  className?: string;
}

export function Badge({ variant = 'open', children, className }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className ?? ''}`}>
      {children}
    </span>
  );
}
