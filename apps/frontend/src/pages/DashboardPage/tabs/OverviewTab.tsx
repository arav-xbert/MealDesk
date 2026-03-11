import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../design-system/components/Badge';
import { MealCard } from '../../../design-system/components/MealCard';
import styles from './OverviewTab.module.css';
import { useAuth } from '../../../context/AuthContext';
import { API_ORIGIN } from '../../../config';
import { dashboardService } from '../../../services/dashboard.service';
import { ApiError } from '../../../lib/http';
import type { DashboardStats, RecentSubmission, MealCount } from '../../../types/api';

const STAT_COLORS = [
  'var(--color-primary-500)',
  'var(--color-success-500)',
  'var(--color-warning-500)',
];

export function OverviewTab() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [submissions, setSubmissions] = useState<RecentSubmission[]>([]);
  const [mealCounts, setMealCounts] = useState<MealCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentSubmissions(),
      dashboardService.getMealCounts(),
    ])
      .then(([s, sub, mc]) => {
        setStats(s);
        setSubmissions(sub);
        setMealCounts(mc);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout().then(() => navigate('/'));
        } else {
          setError('Could not load dashboard data.');
        }
      })
      .finally(() => setIsLoading(false));
  }, [logout, navigate]);

  if (isLoading) {
    return <main className={styles.content}><p className={styles.sectionLabel}>Loading...</p></main>;
  }

  if (error) {
    return <main className={styles.content}><p className={styles.sectionLabel} style={{ color: 'var(--color-danger-500)' }}>{error}</p></main>;
  }

  const statRows = stats
    ? [
        { value: stats.totalUsers, label: 'Total Users', color: STAT_COLORS[0] },
        { value: stats.submitted,  label: 'Submitted',   color: STAT_COLORS[1] },
        { value: stats.pending,    label: 'Pending',     color: STAT_COLORS[2] },
      ]
    : [];

  return (
    <main className={styles.content}>

      {/* Stats */}
      <p className={styles.sectionLabel}>Submissions Overview</p>
      <div className={styles.statsCard}>
        {statRows.map((stat, i) => (
          <div key={stat.label} className={styles.statCell}>
            <span className={styles.statValue} style={{ color: stat.color }}>
              {stat.value}
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
            {i < statRows.length - 1 && <div className={styles.statDivider} />}
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
        {submissions.length === 0 && (
          <div className={styles.tableRow}>
            <span className={styles.rowName} style={{ opacity: 0.5 }}>No submissions yet</span>
          </div>
        )}
        {submissions.map((row) => (
          <div key={row.id} className={styles.tableRow}>
            <span className={styles.rowName}>{row.user.name}</span>
            <span className={styles.rowSelection}>{row.menuOption.name}</span>
            <Badge variant="open">SUBMITTED</Badge>
          </div>
        ))}
      </div>

      {/* Current meals */}
      <p className={styles.sectionLabel}>Current Meals</p>
      <div className={styles.mealList}>
        {mealCounts.length === 0 && (
          <p className={styles.sectionLabel} style={{ opacity: 0.5, fontSize: '14px' }}>No meals selected yet</p>
        )}
        {mealCounts.map((mc) => (
          <MealCard
            key={mc.menuOptionId}
            name={mc.name}
            image={mc.imageUrl ? `${API_ORIGIN}${mc.imageUrl}` : undefined}
            tags={[`${mc.count} selected`]}
          />
        ))}
      </div>

    </main>
  );
}
