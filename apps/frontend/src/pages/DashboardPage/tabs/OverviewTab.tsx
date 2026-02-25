import { Badge } from '../../../design-system/components/Badge';
import { MealCard } from '../../../design-system/components/MealCard';
import styles from './OverviewTab.module.css';

const STATS = [
  { value: 24, label: 'Total Users', color: 'var(--color-primary-500)' },
  { value: 18, label: 'Submitted',   color: 'var(--color-success-500)' },
  { value: 6,  label: 'Pending',     color: 'var(--color-warning-500)' },
];

const SUBMISSIONS = [
  { name: 'Jane Doe',    selection: 'Grilled Chicken Salad', status: 'open'    as const },
  { name: 'John Smith',  selection: 'Vegetarian Pasta',      status: 'open'    as const },
  { name: 'Sarah Lee',   selection: 'Beef Stir Fry',         status: 'open'    as const },
  { name: 'Mike Chen',   selection: '—',                     status: 'pending' as const },
  { name: 'Emily Davis', selection: '—',                     status: 'pending' as const },
];

const MEALS = [
  {
    id: 'grilled-chicken-salad',
    name: 'Grilled Chicken Salad',
    description: 'Tender grilled chicken breast served over a bed of fresh mixed greens, cherry tomatoes, and honey mustard dressing.',
    tags: ['HIGH PROTEIN'],
  },
  {
    id: 'vegetarian-pasta',
    name: 'Vegetarian Pasta',
    description: 'Penne pasta tossed with seasonal roasted vegetables, extra virgin olive oil, and a sprinkle of parmesan.',
    tags: ['VEG'],
  },
  {
    id: 'beef-stir-fry',
    name: 'Beef Stir Fry',
    description: 'Savory beef strips with broccoli, bell peppers, and snap peas in a light ginger-soy sauce served over brown rice.',
    tags: ['CLASSIC'],
  },
];

const STATUS_LABEL: Record<'open' | 'pending', string> = {
  open: 'SUBMITTED',
  pending: 'PENDING',
};

export function OverviewTab() {
  return (
    <main className={styles.content}>

      {/* Stats */}
      <p className={styles.sectionLabel}>Submissions Overview</p>
      <div className={styles.statsCard}>
        {STATS.map((stat, i) => (
          <div key={stat.label} className={styles.statCell}>
            <span className={styles.statValue} style={{ color: stat.color }}>
              {stat.value}
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
            {i < STATS.length - 1 && <div className={styles.statDivider} />}
          </div>
        ))}
      </div>

      {/* Submissions table */}
      <p className={styles.sectionLabel}>Recent Submissions</p>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span>Employee</span>
          <span>Selection</span>
          <span>Status</span>
        </div>
        {SUBMISSIONS.map((row, i) => (
          <div key={i} className={styles.tableRow}>
            <span className={styles.rowName}>{row.name}</span>
            <span className={styles.rowSelection}>{row.selection}</span>
            <Badge variant={row.status}>{STATUS_LABEL[row.status]}</Badge>
          </div>
        ))}
      </div>

      {/* Current meals */}
      <p className={styles.sectionLabel}>Current Meals</p>
      <div className={styles.mealList}>
        {MEALS.map((meal) => (
          <MealCard
            key={meal.id}
            name={meal.name}
            description={meal.description}
            tags={meal.tags}
          />
        ))}
      </div>

    </main>
  );
}
