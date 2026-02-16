import { useRef } from 'react';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUpload({
  onFileSelect,
  accept = 'image/png,image/jpeg',
  maxSizeMB = 5,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      return;
    }

    onFileSelect?.(file);
    e.target.value = '';
  }

  return (
    <div
      className={`${styles.zone} ${className ?? ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className={styles.input}
      />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
      >
        <path
          d="M12 16V4M12 4L8 8M12 4L16 8"
          stroke="var(--color-neutral-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17"
          stroke="var(--color-neutral-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.label}>Click to upload image</span>
      <span className={styles.hint}>PNG, JPG up to {maxSizeMB}MB</span>
    </div>
  );
}
