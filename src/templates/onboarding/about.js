import Image from 'next/image';

import Button from '@/components/Controls/Buttons/button';

//import { useOnboardingAnswers } from '@/hooks/useOnboardingAnswers';

import styles from './onboarding.module.scss';

export default function About() {
  //const { getAnswer, setAnswer } = useOnboardingAnswers();

  return (
    <>
      <div className={styles.content}>
        <Image
          src="/card.png"
          width="390"
          height="309"
          style={{
            width: '100%',
            maxWidth: '390px',
            height: 'auto',
            margin: '0 auto',
          }}
          alt=""
        />
        <div className={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a sapien
          egestas, pulvinar lectus et, fermentum eros. Duis vel est.
        </div>
      </div>
      <div className={styles.bottom}>
        <Button url="/home">Continue</Button>
      </div>
    </>
  );
}
