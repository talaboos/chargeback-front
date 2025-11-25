import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import emailPic from 'public/email-ico.svg';
import emailPicHover from 'public/email-icob.svg';

import Button from '@/components/Controls/Buttons/button';
import Input from '@/components/Controls/Input';

//import { checkAuth } from '@/action/checkAuth';
import { useOnboardingAnswers } from '@/hooks/useOnboardingAnswers';
import { isValidEmail } from '@/utils/isValidEmail';
import { useImagePreloader } from '@/hooks/useImagePreloader';

import styles from './login.module.scss';

export default function Email() {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const { setAnswer } = useOnboardingAnswers();
  useImagePreloader({
    width: 24,
    height: 24,
    quality: 90,
    src: emailPic.src,
  });

  let style = {};
  if (email) {
    style = {
      background: `url("${emailPic.src}") 16px 50% no-repeat, #fff`,
      paddingLeft: '48px',
    };
  }
  if (!email) {
    style = {
      background: `url("${emailPicHover.src}") 16px 50% no-repeat, #fff`,
      paddingLeft: '48px',
    };
  }

  const onCheckEmail = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setError(null);
    startTransition(async () => {
      //const { data, status } = await checkAuth(email);
      const status = 'success';
      const data = {};
      data.status = 'completed';

      if (status === 'success') {
        setAnswer('email', email);
        if (data.status === 'completed') {
          router.push('/login/signin');
        } else if (data.status === 'password_required') {
          router.push('/login/signup');
        } else if (data.status === 'absent') {
          setError('No subscription');
        } else {
          setError('Your subscription is not active.');
        }
      } else {
        setError('Something went wrong');
      }
    });
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter' && isValidEmail(email)) {
      onCheckEmail(e);
    }
  };

  return (
    <>
      <div className={styles.content}>
        <form className={styles.form}>
          <label htmlFor="s1">
            <Input
              id="s1"
              placeholder="Your email"
              autoCapitalize="none"
              onKeyPress={onKeyPress}
              onChange={(v) => setEmail(v)}
              style={style}
            />
          </label>
          {error && (
            <div className={styles.error} style={{ paddingTop: '8px' }}>
              {error}
            </div>
          )}
        </form>
      </div>
      <Button
        url="/login/signin"
        onClick={onCheckEmail}
        loading={isPending}
        tabIndex={!isValidEmail(email) ? '-1' : '0'}
        disable={!isValidEmail(email)}
      >
        Continue
      </Button>
    </>
  );
}
