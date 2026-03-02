import { useState, useEffect } from 'react';
import { Input } from '../../../design-system/components/Input';
import { ImageUpload } from '../../../design-system/components/ImageUpload';
import { Button } from '../../../design-system/components/Button';
import { Tag } from '../../../design-system/components/Tag';
import styles from './EditMealsTab.module.css';
import { API_ORIGIN } from '../../../config';
import { mealsService } from '../../../services/meals.service';
import { listingsService } from '../../../services/listings.service';
import { ApiError } from '../../../lib/http';
import type { Meal } from '../../../types/api';

export function EditMealsTab() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    listingsService.getActive()
      .then((listing) =>
        setMeals(
          listing.menuOptions.map((o) => ({
            id: o.id,
            name: o.name,
            description: o.description,
            imageUrl: o.imageUrl,
            category: o.category,
            active: true,
          }))
        )
      )
      .catch(() => setMeals([]));
  }, []);

  async function handleAddMeal() {
    if (!name.trim()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const newMeal = await mealsService.create({
        name: name.trim(),
        description: description.trim() || undefined,
        category: tag.trim().toUpperCase() || undefined,
        image: imageFile ?? undefined,
      });
      setMeals((prev) => [...prev, newMeal]);
      setName('');
      setDescription('');
      setTag('');
      setImageFile(null);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.body.error : 'Failed to add meal');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await mealsService.delete(id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // silently ignore — meal may have been soft-deleted
    }
  }

  function startEdit(meal: Meal) {
    setEditingId(meal.id);
    setEditName(meal.name);
    setEditDescription(meal.description ?? '');
    setEditTag(meal.category ?? '');
    setEditImageFile(null);
  }

  async function handleSaveEdit(id: string) {
    setIsSaving(true);
    try {
      const updated = await mealsService.update(id, {
        name: editName.trim() || undefined,
        description: editDescription.trim() || undefined,
        category: editTag.trim().toUpperCase() || undefined,
        image: editImageFile ?? undefined,
      });
      setMeals((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setEditingId(null);
    } catch {
      // keep editing state open on failure
    } finally {
      setIsSaving(false);
    }
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
          <ImageUpload onFileSelect={(file) => setImageFile(file)} />
          {imageFile && (
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-success-500)', fontFamily: 'var(--font-secondary)' }}>
              ✓ {imageFile.name}
            </p>
          )}
        </div>

        {submitError && (
          <p style={{ color: 'var(--color-danger-500)', fontSize: '13px', margin: 0 }}>{submitError}</p>
        )}

        <Button variant="primary" onClick={handleAddMeal} disabled={!name.trim() || isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Meal'}
        </Button>
      </div>

      {/* Existing meals */}
      <p className={styles.sectionLabel}>Existing Meals</p>
      <div className={styles.mealList}>
        {meals.map((meal) => (
          <div key={meal.id} className={styles.mealCard}>
            {editingId === meal.id ? (
              <div className={styles.mealRow} style={{ flexDirection: 'column', gap: '8px', flex: 1 }}>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Meal name" />
                <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
                <Input value={editTag} onChange={(e) => setEditTag(e.target.value)} placeholder="Category tag" />
                <ImageUpload onFileSelect={(file) => setEditImageFile(file)} />
                {editImageFile && (
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-success-500)', fontFamily: 'var(--font-secondary)' }}>
                    ✓ {editImageFile.name}
                  </p>
                )}
                <div className={styles.mealActions}>
                  <Button variant="primary" onClick={() => handleSaveEdit(meal.id)} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <button className={styles.editBtn} onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.mealRow}>
                  <div className={styles.mealImage}>
                    {meal.imageUrl && (
                      <img src={`${API_ORIGIN}${meal.imageUrl}`} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                    )}
                  </div>
                  <div className={styles.mealInfo}>
                    <span className={styles.mealName}>{meal.name}</span>
                    {meal.description && (
                      <p className={styles.mealDescription}>{meal.description}</p>
                    )}
                    {meal.category && (
                      <div className={styles.mealTag}>
                        <Tag>{meal.category}</Tag>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.mealActions}>
                  <button className={styles.editBtn} onClick={() => startEdit(meal)}>✏️ Edit</button>
                  <button className={styles.removeBtn} onClick={() => handleRemove(meal.id)}>
                    🗑️ Remove
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

    </main>
  );
}
