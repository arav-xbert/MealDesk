import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavBar } from '../../design-system/components/NavBar';
import { Logo } from '../../design-system/components/Logo';
import { TabBar, TabItem } from '../../design-system/components/Tab';
import styles from './DashboardPage.module.css';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { label: 'Overview', path: '/dashboard/overview' },
  { label: 'Edit Meals', path: '/dashboard/edit-meals' },
];

export function DashboardPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

      <div className={styles.tabsBar}>
        <TabBar>
          {TABS.map((tab) => (
            <TabItem
              key={tab.path}
              active={location.pathname === tab.path}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </TabItem>
          ))}
        </TabBar>
      </div>

      <Outlet />
    </div>
  );
}
