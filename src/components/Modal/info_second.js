import { useAtom } from 'jotai/index';
import Image from 'next/image';

import Common from '@/components/Controls/Buttons/common';

import { sessionAtom } from '@/state/atoms/sessionAtom';

import styles from './modal.module.scss';

export default function InfoSecondModal() {
  const [, setPopup] = useAtom(sessionAtom);

  return (
    <div className={styles.info}>
      <div>Talk and Unlock</div>
      <span>
        Stay engaged and keep chatting to see special video content. Tap the
        character&apos;s image when the indicator appears to watch.
      </span>
      <Image
        src="/info-second.png"
        width={262}
        height={92}
        sizes="100vw"
        priority
        style={{ width: '100%', height: 'auto' }}
        alt="Info"
      />
      <Common
        style={{
          background: '#6361F3',
          marginTop: '16px',
          height: '54px',
          width: '100%',
          fontSize: '16px',
          color: '#fff',
          fontWeight: '500',
        }}
        onClick={() => {
          setPopup(false);
        }}
      >
        Got It
      </Common>
    </div>
  );
}
