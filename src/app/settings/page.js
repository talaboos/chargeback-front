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
              <a
                href="https://reclaim.tools/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://reclaim.tools/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </a>
            </li>
            <li>
              <a
                href="https://reclaim.tools/subscription-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Subscription Policy
              </a>
            </li>
            <li>
              <a
                href="https://reclaim.tools/cookie-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
        <TapBar current="settings" />
      </main>
    </div>
  );
}
