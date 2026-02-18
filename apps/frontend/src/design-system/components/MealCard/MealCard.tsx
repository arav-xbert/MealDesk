import { Badge } from '../Badge';
import { RadioButton } from '../RadioButton';
import styles from './MealCard.module.css';

interface MealCardProps {
  name: string;
  description?: string;
  tags?: string[];
  image?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function MealCard({ name, description, tags = [], image, selected, onSelect, className }: MealCardProps) {
  return (
    <div className={`${styles.card} ${className ?? ''}`}>
      <div className={styles.radioArea}>
        <RadioButton name="meal" checked={!!selected} onChange={() => onSelect?.()} />
      </div>
      {image && (
        <div className={styles.imageWrapper}>
          <img src={image} alt={name} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <Badge key={tag} variant="tag">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
