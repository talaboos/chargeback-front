import Image from 'next/image';

import Button from '@/components/Controls/Buttons/button';

import styles from './step.module.scss';

export default function OnboardingStep({ step, totalSteps, title, subtitle, next }) {
  return (
    <>
      <div className={styles.progress}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i + 1 === step ? styles.active : ''} ${i + 1 < step ? styles.done : ''}`}
          />
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.imagePlaceholder}>
          <Image
            src={`/onboard${step}.png`}
            width={300}
            height={300}
            alt={title}
            priority
          />
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
      <div className={styles.bottom}>
        <Button url={next}>Continue</Button>
      </div>
    </>
  );
}
