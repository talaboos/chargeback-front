import { useAtom } from 'jotai/index';
import Image from 'next/image';
import { isIOS } from 'react-device-detect';

import iosPic from 'public/ios-shortcut.png';
import androidPic from 'public/android-shortcut.png';
import Button from '@/components/Controls/Buttons/button';

import { shortcutAtom } from '@/state/atoms/shortcutAtom';
import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './modal.module.scss';

export default function ShortcutModal() {
  const [, setModal] = useAtom(modalAtom);
  const [, setPopup] = useAtom(shortcutAtom);

  const onClose = (e) => {
    e.preventDefault();
    setPopup(false);
    setModal({
      open: false,
    });
  };

  return (
    <div className={styles.shortcut}>
      <div className={styles.heading}>Add Application to Your Home Screen</div>
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
              src={isIOS ? iosPic : androidPic}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', maxWidth: '410px', height: 'auto' }}
              priority
              alt="Here’s how to keep me close on your home screen"
            />
          </div>
        </div>
        <Button url="/" onClick={onClose}>
          Got it!
        </Button>
      </main>
    </div>
  );
}
