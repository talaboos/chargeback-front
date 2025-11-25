import { useState, useTransition } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

import Button from '@/components/Controls/Buttons/button';
import Input from '@/components/Controls/Input';

//import { loginAuth } from '@/action/loginAuth';
import { useOnboardingAnswers } from '@/hooks/useOnboardingAnswers';

import styles from './login.module.scss';

export default function ExistingUser() {
  const [showed, setShowed] = useState(false);
  const [password, setPassword] = useState(null);
  const { getAnswer } = useOnboardingAnswers();
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const email = getAnswer('email');

  if (password && error) {
    setError(false);
  }

  const onLoginEmail = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    startTransition(async () => {
      // const { data, status, message } = await loginAuth({
      //   email,
      //   password,
      // });
      const status = 'success';
      const message = 'test message error';

      if (status === 'success') {
        const token = 'testTOKEN';
        await signIn('credentials', {
          email,
          token,
          redirect: true,
          callbackUrl: '/home',
        });
      } else {
        setError(message || 'Check that the data entered is correct');
      }
    });
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter' && password?.length >= 8) {
      onLoginEmail(e);
    }
  };

  const style = {
    background: 'url("/email-icob.svg") 16px 50% no-repeat, #fff',
    paddingLeft: '48px',
  };

  return (
    <>
      <div className={styles.content}>
        <form className={styles.form}>
          <label htmlFor="s1">
            <Input
              id="s1"
              placeholder="Email"
              value={email}
              style={style}
              disabled
            />
          </label>
          <label htmlFor="s2">
            <div className={styles.password}>
              <Input
                type={!showed ? 'password' : 'text'}
                id="s2"
                placeholder="Password"
                onChange={(v) => setPassword(v)}
                onKeyPress={onKeyPress}
              />
              <span onClick={() => setShowed((v) => !v)}>
                <Image
                  src={!showed ? '/eye-ico.svg' : '/eye-icoc.svg'}
                  width={24}
                  height={24}
                  alt=""
                />
              </span>
            </div>
          </label>
          {error && <span className={styles.error}>{error}</span>}
        </form>
      </div>
      <Button
        url="/home"
        onClick={onLoginEmail}
        loading={isPending}
        tabIndex={!password || password?.length < 8 ? '-1' : '0'}
        disable={!password || password?.length < 8}
      >
        Log In
      </Button>
    </>
  );
}
