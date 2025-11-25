'use client';

import styles from './input.module.scss';

export default function Input({ placeholder, onChange = () => {}, ...rest }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={styles.input}
      autoComplete="off"
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}
