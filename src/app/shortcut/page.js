import Image from 'next/image';
import iosPic from 'public/ios-shortcut.png';
import androidPic from 'public/android-shortcut.png';

import { serverDeviceType } from '@/utils/serverDeviceType';

import styles from './page.module.scss';

export default async function Home() {
  const device = await serverDeviceType();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          Add Application to Your Home Screen
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.chat}>
            <Image
              src="/ai-avatar.png"
              width={52}
              priority
              height={52}
              alt="AI assistant"
            />
            <div>
              Hi, I&apos;m your AI assistant — always here, just one tap away 😊
            </div>
          </div>
          <div className={styles.instructions}>
            <div>
              Here’s how to keep me close on your
              <br /> home screen:
            </div>
            <Image
              src={device === 'ios' ? iosPic : androidPic}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', maxWidth: '410px', height: 'auto' }}
              priority
              alt="Here’s how to keep me close on your home screen"
            />
          </div>
        </div>
        {/*<Button url="/settings">*/}
        {/*  Got it!*/}
        {/*</Button>*/}
      </main>
    </div>
  );
}
