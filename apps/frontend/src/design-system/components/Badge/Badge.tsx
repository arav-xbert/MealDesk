import styles from './Badge.module.css';

interface BadgeProps {
  variant?: 'status' | 'tag';
  children: string;
  className?: string;
}

export function Badge({ variant = 'status', children, className }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className ?? ''}`}>
      {children}
    </span>
  );
}
