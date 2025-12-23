import { useState, useTransition } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

import Button from '@/components/Controls/Buttons/button';
import Input from '@/components/Controls/Input';

import { createUser } from '@/action/createUser';
import { useOnboardingAnswers } from '@/hooks/useOnboardingAnswers';

import styles from './login.module.scss';

export default function NewUser() {
  const [showed, setShowed] = useState(false);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const { getAnswer } = useOnboardingAnswers();

  const email = getAnswer('email');

  const onRegisterEmail = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    startTransition(async () => {
      const { data, status, message } = await createUser({
        email,
        password,
      });

      if (status === 'success') {
        const id = data?.user_id;
        const token = data?.access_token;
        const chatId = data?.chat_id;
        await signIn('credentials', {
          email,
          token,
          id,
          chatId,
          redirect: true,
          callbackUrl: '/onboarding/about',
        });
      } else {
        setError(message || 'Something went wrong');
      }
    });
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter' && password?.length >= 8) {
      onRegisterEmail(e);
    }
  };

  return (
    <>
      <div className={styles.content}>
        <form className={styles.form}>
          <label htmlFor="s2">
            <div className={styles.password} style={{ margin: '0' }}>
              <Input
                type={!showed ? 'password' : 'text'}
                id="s2"
                placeholder="Create password*"
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
          <div className={styles.note}>
            *Your password must be at least 8 characters long and include
            numbers, uppercase letters, and lowercase letters.
          </div>
          {error && (
            <div className={styles.error} style={{ paddingTop: '8px' }}>
              {error}
            </div>
          )}
        </form>
      </div>
      <Button
        url="/onboarding/about"
        onClick={(e) => onRegisterEmail(e)}
        tabIndex={!password || password?.length < 8 ? '-1' : '0'}
        loading={isPending}
        disable={!password || password?.length < 8}
      >
        Continue
      </Button>
    </>
  );
}
