'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai/index';

import BackgroundImage from '@/components/BackgroundImage';
import Button from '@/components/Controls/Buttons/button';
import ShortcutModal from '@/components/Modal/shortcut';

import { shortcutAtom } from '@/state/atoms/shortcutAtom';
import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './page.module.scss';

export default function Home() {
  const [popup] = useAtom(shortcutAtom);
  const [, setModal] = useAtom(modalAtom);

  useEffect(() => {
    setModal({
      type: 'window',
      open: popup,
      content: <ShortcutModal />,
    });
  }, [popup]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <BackgroundImage objectFit="contain" src="/home-ai.png" priority />
        <div className={styles.app}>Reclaim AI</div>
      </main>
      <div className={styles.bottom}>
        <Button url="/login/start">Let’s start</Button>
      </div>
    </div>
  );
}
