import type { ReactNode } from 'react';
import styles from './NavBar.module.css';

interface NavBarProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function NavBar({ title, left, right, className }: NavBarProps) {
  return (
    <nav className={`${styles.navbar} ${className ?? ''}`}>
      <div className={styles.left}>{left}</div>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.right}>{right}</div>
    </nav>
  );
}
