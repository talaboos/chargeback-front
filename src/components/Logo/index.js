'use client';

import { useRouter } from 'next/navigation';

import styles from './logo.module.scss';

export default function Logo({ back = false }) {
  const router = useRouter();
  const onBack = () => router.push('/settings');

  return (
    <div
      className={styles.logo}
      style={back ? { cursor: 'pointer' } : {}}
      onClick={back ? onBack : undefined}
    >
      Smart subscription tracking
    </div>
  );
}
