import {Tag} from '../Tag';
import {RadioButton} from '../RadioButton';
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

export function MealCard({
  name,
  description,
  tags = [],
  image,
  selected,
  onSelect,
  className,
}: MealCardProps) {
  return (
    <div
      onClick={() => {
        onSelect?.();
      }}
      className={`${styles.card} ${className ?? ''}`}
    >
      <div className={styles.imageWrapper}>
        {image && <img src={image} alt={name} className={styles.image} />}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
      {onSelect !== undefined && (
        <div className={styles.radioArea}>
          <RadioButton
            name='meal'
            checked={!!selected}
            onChange={() => onSelect?.()}
          />
        </div>
      )}
    </div>
  );
}
