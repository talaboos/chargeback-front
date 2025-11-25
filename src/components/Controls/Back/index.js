'use client';

import { useRouter } from 'next/navigation';

import styles from './back.module.scss';

export default function Back({ click = false, onClick = () => {}, ...rest }) {
  const router = useRouter();
  const onBack = () => router.back();

  return (
    <button
      type="button"
      aria-label="Back"
      onClick={click ? onClick : onBack}
      className={styles.back}
      {...rest}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="12"
        viewBox="0 0 13 12"
        fill="none"
      >
        <path
          d="M6 2L2 6M6 10L2 6M2 6H12"
          stroke="#1A1A2E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
