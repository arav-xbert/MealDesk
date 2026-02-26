import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { Logo } from '../../design-system/components/Logo';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Checkbox } from '../../design-system/components/Checkbox';
import { Link } from '../../design-system/components/Link';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../lib/http';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(employeeId, password);
      navigate(user.role === 'HR' ? '/dashboard' : '/lunch-selection');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.body?.error ?? 'Invalid credentials');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Logo size={72} />
        <h1 className={styles.appName}>MealDesk</h1>
        <p className={styles.tagline}>Corporate Meal Management</p>
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Welcome back</h2>

        <div className={styles.field}>
          <label className={styles.label}>Employee ID</label>
          <Input
            placeholder="Enter your Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <label className={styles.label}>Password</label>
            <Link href="#">Forgot?</Link>
          </div>
          <Input
            variant="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Checkbox label="Keep me signed in" />

        {error && <p className={styles.error}>{error}</p>}

        <Button variant="primary" icon type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className={styles.support}>
          <span>Having trouble logging in?</span>
          <span>🔧 <strong>Contact System Admin</strong></span>
        </div>
      </form>

      <footer className={styles.footer}>
        © 2024 MealDesk Corporate Portal. All rights reserved.
      </footer>
    </div>
  );
}
