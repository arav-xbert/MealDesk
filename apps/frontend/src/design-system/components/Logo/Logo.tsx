import styles from './Logo.module.css';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 56, className }: LogoProps) {
  return (
    <div
      className={`${styles.logo} ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.57}
        height={size * 0.57}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Meal tray icon */}
        <path
          d="M4 22H28"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 22C6 22 6 14 16 14C26 14 26 22 26 22"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 14V10"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 14V10"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 10H20"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 26H28"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
