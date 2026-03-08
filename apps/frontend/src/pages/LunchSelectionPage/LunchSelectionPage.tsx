import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../design-system/components/NavBar';
import { Logo } from '../../design-system/components/Logo';
import { MealScheduleCard } from '../../design-system/components/MealScheduleCard';
import { MealCard } from '../../design-system/components/MealCard';
import { Button } from '../../design-system/components/Button';
import styles from './LunchSelectionPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { API_ORIGIN } from '../../config';
import { listingsService } from '../../services/listings.service';
import { selectionsService } from '../../services/selections.service';
import { ApiError } from '../../lib/http';
import type { ActiveListing, LatestSelection } from '../../types/api';

export function LunchSelectionPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState<ActiveListing | null>(null);
  const [existingSelection, setExistingSelection] = useState<LatestSelection | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [noListing, setNoListing] = useState(false);

  useEffect(() => {
    Promise.all([
      listingsService.getActive().catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNoListing(true);
        else if (err instanceof ApiError && err.status === 401) logout().then(() => navigate('/'));
        else setError('Could not load today\'s menu. Please try again.');
        return null;
      }),
      selectionsService.getMyLatest().catch(() => null),
    ]).then(([activeListing, latest]) => {
      if (activeListing) {
        setListing(activeListing);
        // Check if the latest selection belongs to the active listing
        if (latest && latest.listing.id === activeListing.id) {
          setExistingSelection(latest);
          setSelectedOptionId(latest.menuOption.id);
        }
      }
    }).finally(() => setIsLoading(false));
  }, [logout, navigate]);

  const isAlreadySubmitted = !!existingSelection && !isEditing;

  async function handleSubmit() {
    if (!listing || !selectedOptionId) return;
    setIsSubmitting(true);
    setError('');
    try {
      if (existingSelection) {
        // Update existing selection
        await selectionsService.updateCurrent(selectedOptionId);
      } else {
        await selectionsService.submit(listing.id, selectedOptionId);
      }
      const option = listing.menuOptions.find((o) => o.id === selectedOptionId)!;
      navigate('/submitted', {
        state: {
          meal: { name: option.name, tags: option.category ? [option.category] : [], imageUrl: option.imageUrl },
          session: listing.title,
          date: new Date(listing.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          }),
        },
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout().then(() => navigate('/'));
      } else {
        setError('Submission failed. Please try again.');
      }
      setIsSubmitting(false);
    }
  }

  function handleStartEdit() {
    setIsEditing(true);
    setSelectedOptionId(existingSelection?.menuOption.id ?? null);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setSelectedOptionId(existingSelection?.menuOption.id ?? null);
    setError('');
  }

  function formatDeadline(endTime: string) {
    const parts = endTime.split('T')[1]?.split(':') ?? endTime.split(':');
    const h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `Select before ${h12}:${m} ${ampm}`;
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
            <span className={styles.navUser}>{user?.name ?? ''}</span>
            <a
              href="#"
              className={styles.navLogout}
              onClick={(e) => { e.preventDefault(); logout().then(() => navigate('/')); }}
            >
              Logout
            </a>
          </div>
        }
      />

      <main className={styles.content}>
        {isLoading && <p className={styles.hint}>Loading today's menu...</p>}

        {!isLoading && noListing && (
          <p className={styles.hint}>No active meal listing for today.</p>
        )}

        {!isLoading && !noListing && listing && (
          <>
            <MealScheduleCard
              mealName={listing.title}
              date={new Date(listing.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
              deadline={formatDeadline(listing.endTime)}
              status="open"
            />

            {/* ── Submitted state: show only the chosen card + change button ── */}
            {isAlreadySubmitted && (() => {
              const chosen = listing.menuOptions.find((o) => o.id === existingSelection.menuOption.id);
              return (
                <>
                  <div className={styles.submittedBanner}>
                    <div className={styles.submittedBannerText}>
                      <span className={styles.submittedBannerTitle}>Selection submitted</span>
                      <span className={styles.submittedBannerMeal}>{existingSelection.menuOption.name}</span>
                    </div>
                    <button className={styles.editSelectionBtn} onClick={handleStartEdit}>
                      Change
                    </button>
                  </div>

                  <p className={styles.sectionLabel}>Your selection</p>

                  {chosen && (
                    <div className={styles.mealList}>
                      <MealCard
                        name={chosen.name}
                        description={chosen.description ?? undefined}
                        tags={chosen.category ? [chosen.category] : []}
                        image={chosen.imageUrl ? `${API_ORIGIN}${chosen.imageUrl}` : undefined}
                        selected
                      />
                    </div>
                  )}
                </>
              );
            })()}

            {/* ── Edit / first-time state: show full selectable list ── */}
            {!isAlreadySubmitted && (
              <>
                <p className={styles.sectionLabel}>
                  {isEditing ? 'Choose a different meal' : 'Available Menus'}
                </p>

                <div className={styles.mealList}>
                  {listing.menuOptions.map((option) => (
                    <MealCard
                      key={option.id}
                      name={option.name}
                      description={option.description ?? undefined}
                      tags={option.category ? [option.category] : []}
                      image={option.imageUrl ? `${API_ORIGIN}${option.imageUrl}` : undefined}
                      selected={selectedOptionId === option.id}
                      onSelect={() => setSelectedOptionId(option.id)}
                    />
                  ))}
                </div>

                {error && <p className={styles.hint} style={{ color: 'var(--color-danger-500)' }}>{error}</p>}

                <div className={styles.footer}>
                  <Button
                    variant="primary"
                    disabled={!selectedOptionId || isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting
                      ? (isEditing ? 'Updating...' : 'Submitting...')
                      : (isEditing ? 'Update Selection' : 'Submit Selection')}
                  </Button>
                  {isEditing && (
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                  {!selectedOptionId && !isEditing && (
                    <p className={styles.hint}>Please select a meal above to enable submission</p>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {!isLoading && error && !listing && (
          <p className={styles.hint} style={{ color: 'var(--color-danger-500)' }}>{error}</p>
        )}
      </main>
    </div>
  );
}
