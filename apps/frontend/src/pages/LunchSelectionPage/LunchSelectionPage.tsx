import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../design-system/components/NavBar';
import { Logo } from '../../design-system/components/Logo';
import { MealScheduleCard } from '../../design-system/components/MealScheduleCard';
import { MealCard } from '../../design-system/components/MealCard';
import { Button } from '../../design-system/components/Button';
import styles from './LunchSelectionPage.module.css';

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

export function LunchSelectionPage() {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleSubmit() {
    const meal = MEALS.find((m) => m.id === selectedMeal);
    if (!meal) return;
    navigate('/submitted', {
      state: { meal, session: 'Thursday Lunch', date: 'Feb 12, 2025' },
    });
  }

  return (
    <div className={styles.page}>
      <NavBar
        left={
          <>
            <Logo size={32} />
            <span className={styles.navTitle}>MealDesk</span>
          </>
        }
        right={
          <div className={styles.navRight}>
            <span className={styles.navUser}>Jane Doe</span>
            <a href="#" className={styles.navLogout}>Logout</a>
          </div>
        }
      />

      <main className={styles.content}>
        <MealScheduleCard
          mealName="Thursday Lunch"
          date="Feb 12, 2025"
          deadline="Select before 9:00 AM"
          status="open"
        />

        <p className={styles.sectionLabel}>Available Menus</p>

        <div className={styles.mealList}>
          {MEALS.map((meal) => (
            <MealCard
              key={meal.id}
              name={meal.name}
              description={meal.description}
              tags={meal.tags}
              selected={selectedMeal === meal.id}
              onSelect={() => setSelectedMeal(meal.id)}
            />
          ))}
        </div>

        <div className={styles.footer}>
          <Button variant="primary" disabled={!selectedMeal} onClick={handleSubmit}>
            Submit Selection
          </Button>
          {!selectedMeal && (
            <p className={styles.hint}>Please select a meal above to enable submission</p>
          )}
        </div>
      </main>
    </div>
  );
}
