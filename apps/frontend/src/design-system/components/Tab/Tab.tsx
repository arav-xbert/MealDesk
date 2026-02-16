import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Tab.module.css';

interface TabItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: string;
}

export function TabItem({ active = false, children, className, ...props }: TabItemProps) {
  return (
    <button
      className={`${styles.tab} ${active ? styles.active : ''} ${className ?? ''}`}
      role="tab"
      aria-selected={active}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabBarProps {
  children: ReactNode;
  className?: string;
}

export function TabBar({ children, className }: TabBarProps) {
  return (
    <div className={`${styles.tabBar} ${className ?? ''}`} role="tablist">
      {children}
    </div>
  );
}
