import { Badge } from '../Badge';
import styles from './MealScheduleCard.module.css';

interface MealScheduleCardProps {
  day: string;
  date: string;
  mealName: string;
  status?: 'OPEN' | 'CLOSED' | 'PENDING';
  className?: string;
}

export function MealScheduleCard({ day, date, mealName, status, className }: MealScheduleCardProps) {
  return (
    <div className={`${styles.card} ${className ?? ''}`}>
      <div className={styles.dateSection}>
        <span className={styles.day}>{day}</span>
        <span className={styles.date}>{date}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.mealName}>{mealName}</span>
        {status && <Badge variant="status">{status}</Badge>}
      </div>
    </div>
  );
}
