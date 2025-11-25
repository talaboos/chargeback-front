import { useAtom } from 'jotai/index';
import Image from 'next/image';

import Common from '@/components/Controls/Buttons/common';
import InfoSecondModal from '@/components/Modal/info_second';

import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './modal.module.scss';

export default function InfoModal() {
  const [, setModal] = useAtom(modalAtom);

  return (
    <div className={styles.info}>
      <div>Talk and Unlock</div>
      <span>
        Tap the button to request a photo, then keep chatting to reveal more.
        The more you interact, the more pictures you&apos;ll unlock.
      </span>
      <Image
        src="/info.png"
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
          setModal({
            type: 'info',
            open: true,
            content: <InfoSecondModal />,
          });
        }}
      >
        Next
      </Common>
    </div>
  );
}
