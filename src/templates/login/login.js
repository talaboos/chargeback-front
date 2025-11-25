import Button from '@/components/Controls/Buttons/button';

import styles from './login.module.scss';

export default function Login() {
  return (
    <>
      <div className={styles.content} />
      <Button url="/login/verification">Log In</Button>
      <Button
        target="_blank"
        url="/"
        style={{ background: '#F4F4F4', color: '#000', marginTop: '8px' }}
      >
        I’m New
      </Button>
    </>
  );
}
