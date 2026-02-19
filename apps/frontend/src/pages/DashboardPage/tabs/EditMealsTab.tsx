import { useState } from 'react';
import { Input } from '../../../design-system/components/Input';
import { ImageUpload } from '../../../design-system/components/ImageUpload';
import { Button } from '../../../design-system/components/Button';
import { Tag } from '../../../design-system/components/Tag';
import styles from './EditMealsTab.module.css';

interface Meal {
  id: string;
  name: string;
  description: string;
  tag: string;
}

const INITIAL_MEALS: Meal[] = [
  {
    id: 'grilled-chicken-salad',
    name: 'Grilled Chicken Salad',
    description: 'Tender grilled chicken breast served over a bed of fresh mixed greens, cherry tomatoes, and honey mustard dressing.',
    tag: 'HIGH PROTEIN',
  },
  {
    id: 'vegetarian-pasta',
    name: 'Vegetarian Pasta',
    description: 'Penne pasta tossed with seasonal roasted vegetables, extra virgin olive oil, and a sprinkle of parmesan.',
    tag: 'VEG',
  },
  {
    id: 'beef-stir-fry',
    name: 'Beef Stir Fry',
    description: 'Savory beef strips with broccoli, bell peppers, and snap peas in a light ginger-soy sauce served over brown rice.',
    tag: 'CLASSIC',
  },
];

export function EditMealsTab() {
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');

  function handleAddMeal() {
    if (!name.trim()) return;
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      tag: tag.trim().toUpperCase(),
    };
    setMeals((prev) => [...prev, newMeal]);
    setName('');
    setDescription('');
    setTag('');
  }

  function handleRemove(id: string) {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <main className={styles.content}>

      {/* Add new meal form */}
      <p className={styles.sectionLabel}>Add New Meal</p>
      <div className={styles.formCard}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Meal Name</label>
          <Input
            placeholder="e.g. Grilled Chicken Salad"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Description</label>
          <Input
            placeholder="Brief meal description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Category Tag</label>
          <Input
            placeholder="e.g. High Protein, Veg, Classic"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Meal Image</label>
          <ImageUpload />
        </div>

        <Button variant="primary" onClick={handleAddMeal} disabled={!name.trim()}>
          Add Meal
        </Button>
      </div>

      {/* Existing meals */}
      <p className={styles.sectionLabel}>Existing Meals</p>
      <div className={styles.mealList}>
        {meals.map((meal) => (
          <div key={meal.id} className={styles.mealCard}>
            <div className={styles.mealRow}>
              <div className={styles.mealImage} />
              <div className={styles.mealInfo}>
                <span className={styles.mealName}>{meal.name}</span>
                {meal.description && (
                  <p className={styles.mealDescription}>{meal.description}</p>
                )}
                {meal.tag && (
                  <div className={styles.mealTag}>
                    <Tag>{meal.tag}</Tag>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.mealActions}>
              <button className={styles.editBtn}>✏️ Edit</button>
              <button className={styles.removeBtn} onClick={() => handleRemove(meal.id)}>
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
