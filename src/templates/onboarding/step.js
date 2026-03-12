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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect width="24" height="24" rx="4" fill="#F3F4F7" />
            <path
              d="M4 16L8.586 11.414C8.961 11.039 9.469 10.828 10 10.828C10.531 10.828 11.039 11.039 11.414 11.414L16 16M14 14L15.586 12.414C15.961 12.039 16.469 11.828 17 11.828C17.531 11.828 18.039 12.039 18.414 12.414L20 14M14 8H14.01M6 20H18C18.53 20 19.039 19.789 19.414 19.414C19.789 19.039 20 18.53 20 18V6C20 5.47 19.789 4.961 19.414 4.586C19.039 4.211 18.53 4 18 4H6C5.47 4 4.961 4.211 4.586 4.586C4.211 4.961 4 5.47 4 6V18C4 18.53 4.211 19.039 4.586 19.414C4.961 19.789 5.47 20 6 20Z"
              stroke="#C4C4CC"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
