import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { NavBar } from '../../design-system/components/NavBar';
import { Logo } from '../../design-system/components/Logo';
import { Tag } from '../../design-system/components/Tag';
import { Button } from '../../design-system/components/Button';
import styles from './SubmittedPage.module.css';
import { useAuth } from '../../context/AuthContext';

interface LocationState {
  meal: {
    name: string;
    tags: string[];
  };
  session: string;
  date: string;
}

export function SubmittedPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  if (!state?.meal) {
    return <Navigate to="/lunch-selection" replace />;
  }

  const { meal, session, date } = state;

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
        <div className={styles.successIcon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 16L13 23L26 9"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className={styles.heading}>
          <h1 className={styles.title}>Selection Submitted!</h1>
          <p className={styles.subtitle}>
            Your lunch choice has been confirmed.<br />Enjoy your meal!
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.imagePlaceholder} />
          <h2 className={styles.mealName}>{meal?.name ?? 'Your Meal'}</h2>
          <p className={styles.meta}>
            {session ?? 'Thursday Lunch'} · {date ?? 'Feb 12, 2025'}
          </p>
          {meal?.tags?.length > 0 && (
            <div className={styles.tags}>
              {meal.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </div>

        <Button variant="secondary" style={{ width: '100%' }} onClick={() => navigate('/lunch-selection')}>
          Return Home
        </Button>
      </main>
    </div>
  );
}
