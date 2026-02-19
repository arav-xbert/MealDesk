import styles from './LoginPage.module.css';
import { Logo } from '../../design-system/components/Logo';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Checkbox } from '../../design-system/components/Checkbox';
import { Link } from '../../design-system/components/Link';

export function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Logo size={72} />
        <h1 className={styles.appName}>MealDesk</h1>
        <p className={styles.tagline}>Corporate Meal Management</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Welcome back</h2>

        <div className={styles.field}>
          <label className={styles.label}>Employee ID</label>
          <Input placeholder="Enter your Employee ID" />
        </div>

        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <label className={styles.label}>Password</label>
            <Link href="#">Forgot?</Link>
          </div>
          <Input variant="password" placeholder="Enter your password" />
        </div>

        <Checkbox label="Keep me signed in" />

        <Button variant="primary" icon>Sign In</Button>

        <div className={styles.support}>
          <span>Having trouble logging in?</span>
          <span>🔧 <strong>Contact System Admin</strong></span>
        </div>
      </div>

      <footer className={styles.footer}>
        © 2024 MealDesk Corporate Portal. All rights reserved.
      </footer>
    </div>
  );
}
