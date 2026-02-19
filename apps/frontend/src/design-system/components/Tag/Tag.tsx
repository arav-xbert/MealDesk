import styles from './Tag.module.css';

interface TagProps {
  children: string;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span className={`${styles.tag} ${className ?? ''}`}>
      {children}
    </span>
  );
}
