import { Badge } from '../Badge';
import styles from './MealScheduleCard.module.css';

interface MealScheduleCardProps {
  mealName: string;
  date: string;
  deadline: string;
  status?: string;
  className?: string;
}

export function MealScheduleCard({ mealName, date, deadline, status, className }: MealScheduleCardProps) {
  return (
    <div className={`${styles.card} ${className ?? ''}`}>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={styles.mealName}>{mealName}</span>
          {status && <Badge variant="status">{status}</Badge>}
        </div>
        <span className={styles.date}>{date}</span>
        <div className={styles.deadlineRow}>
          <span className={styles.dot} />
          <span className={styles.deadline}>{deadline}</span>
        </div>
      </div>
    </div>
  );
}
