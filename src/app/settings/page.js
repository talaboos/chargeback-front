'use client';

import Link from 'next/link';
import { useAtom } from 'jotai/index';

import TapBar from '@/components/TapBar';
import ShortcutModal from '@/components/Modal/shortcut';

import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './page.module.scss';

export default function Home() {
  const [, setModal] = useAtom(modalAtom);
  const onShortcut = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModal({
      type: 'window',
      open: true,
      content: <ShortcutModal />,
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.top}>Settings</div>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <ul className={styles.menu}>
            <li>
              <Link href="/shortcut" onClick={onShortcut}>
                Add Reclaim AI shortcut
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-of-service">Terms of Use</Link>
            </li>
          </ul>
        </div>
        <TapBar current="settings" />
      </main>
    </div>
  );
}
