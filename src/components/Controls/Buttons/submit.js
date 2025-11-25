'use client';

import { useFormStatus } from 'react-dom';

import styles from './button.module.scss';

export default function Submit({ disable = false, children, ...rest }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`${styles.button} ${disable && styles.disable} ${pending && styles.loading}`}
      {...rest}
    >
      {!pending && children}
    </button>
  );
}
