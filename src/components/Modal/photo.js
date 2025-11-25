import Image from 'next/image';

import styles from './modal.module.scss';

export default function PhotoModal() {
  return (
    <div className={styles.info}>
      <Image
        src="/info.png"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        alt="Info"
      />
    </div>
  );
}
