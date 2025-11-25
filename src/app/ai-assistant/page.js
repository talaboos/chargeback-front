'use client';

import TapBar from '@/components/TapBar';

import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.top}>AI Assistant</div>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>chats</div>
        <TapBar current="assistant" />
      </main>
    </div>
  );
}
